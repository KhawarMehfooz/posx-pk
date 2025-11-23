const { autoUpdater } = require("electron-updater");
const { dialog, BrowserWindow } = require("electron");
const path = require("path");
const log = require("electron-log");
const { ipcMain } = require("electron");

log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.autoDownload = false; // never download silently

let progressWindow = null;
let isDownloadCancelled = false;
let isInitialCheck = true; // Track if this is the initial automatic check
let hasShownUpToDateMessage = false; // Prevent duplicate "up to date" messages


function createProgressWindow(parentWin) {
    progressWindow = new BrowserWindow({
        width: 400,
        height: 220,
        parent: parentWin,
        modal: true,
        frame: false,
        resizable: false,
        movable: false,
        show: false, // hide until ready
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    progressWindow.loadFile(path.join(__dirname, "../renderer/update-progress.html"));
    progressWindow.setMenu(null);

    progressWindow.once("ready-to-show", () => {
        progressWindow.show();
    });

    // Handle window close event
    progressWindow.on("closed", () => {
        progressWindow = null;
        isDownloadCancelled = true;
    });
}

function setupAutoUpdater(win) {
    // Automatically check for updates on app start (silently)
    isInitialCheck = true;
    autoUpdater.checkForUpdates().catch((err) => {
        // Silently handle errors during initial check
        log.error("Initial update check failed:", err);
        isInitialCheck = false;
    });

    // Update not available (already on latest version)
    autoUpdater.on("update-not-available", (info) => {
        log.info("Update not available event fired", { isInitialCheck });
        const wasInitialCheck = isInitialCheck;
        isInitialCheck = false; // Reset flag since check succeeded
        hasShownUpToDateMessage = true; // Mark that we've shown the message
        // Only show message for manual checks, not initial automatic checks
        if (!wasInitialCheck) {
            dialog.showMessageBoxSync(win, {
                type: "info",
                title: "App is Up to Date",
                message: "App is up to date",
                detail: "You are already using the latest version of the application.",
                buttons: ["OK"]
            });
        }
    });

    // Update available
    autoUpdater.on("update-available", (info) => {
        isInitialCheck = false; // Reset flag since check succeeded
        const choice = dialog.showMessageBoxSync(win, {
            type: "info",
            title: "Update Found",
            message: `A new version (${info.version}) is available. Download it now?`,
            buttons: ["Download", "Later"]
        });

        if (choice === 0) {
            isDownloadCancelled = false;
            createProgressWindow(win);

            // Wait for the window to be fully loaded and ready before starting download
            progressWindow.webContents.once("did-finish-load", () => {
                // Small delay to ensure window is fully ready to receive IPC messages
                setTimeout(() => {
                    if (!isDownloadCancelled) {
                        autoUpdater.downloadUpdate();
                    }
                }, 100);
            });
        }
    });

    // Download progress
    autoUpdater.on("download-progress", (p) => {
        if (isDownloadCancelled) {
            return; // Don't send progress updates if download was cancelled
        }
        
        if (progressWindow && !progressWindow.isDestroyed()) {
            try {
                progressWindow.webContents.send("update-progress", {
                    percent: p.percent.toFixed(0),
                    transferred: (p.transferred / 1024 / 1024).toFixed(2),
                    total: (p.total / 1024 / 1024).toFixed(2),
                    bytesPerSecond: (p.bytesPerSecond / 1024 / 1024).toFixed(2)
                });
            } catch (err) {
                log.error("Error sending progress update:", err);
            }
        }
    });

    // Download completed
    autoUpdater.on("update-downloaded", () => {
        if (isDownloadCancelled) {
            return; // Don't show completion dialog if download was cancelled
        }

        if (progressWindow) {
            progressWindow.close();
            progressWindow = null;
        }

        const res = dialog.showMessageBoxSync(win, {
            type: "question",
            buttons: ["Restart Now", "Later"],
            message: "Update downloaded successfully."
        });

        if (res === 0) {
            autoUpdater.quitAndInstall();
        }
    });

    // Handle cancel download request from renderer
    ipcMain.on("cancel-download", () => {
        isDownloadCancelled = true;
        
        if (progressWindow && !progressWindow.isDestroyed()) {
            progressWindow.close();
            progressWindow = null;
        }

        log.info("Download cancelled by user");
    });

    autoUpdater.on("error", (err) => {
        log.error("Updater error:", err);
        
        // Don't show error dialogs for initial automatic checks
        if (isInitialCheck) {
            isInitialCheck = false;
            return;
        }

        // Check if it's a network-related error
        const errorMessage = err ? (err.message || err.toString()) : "unknown";
        const errorCode = err ? (err.code || "") : "";

        // Common network error indicators
        const isNetworkError = 
            errorCode === "ENOTFOUND" ||
            errorCode === "ECONNREFUSED" ||
            errorCode === "ETIMEDOUT" ||
            errorCode === "ENETUNREACH" ||
            errorCode === "ECONNRESET" ||
            errorMessage.toLowerCase().includes("network") ||
            errorMessage.toLowerCase().includes("connection") ||
            errorMessage.toLowerCase().includes("internet") ||
            errorMessage.toLowerCase().includes("dns") ||
            errorMessage.toLowerCase().includes("timeout") ||
            errorMessage.toLowerCase().includes("getaddrinfo");

        if (isNetworkError) {
            // Show user-friendly network error message
            dialog.showMessageBoxSync(win, {
                type: "info",
                title: "Update Check Failed",
                message: "Unable to check for updates",
                detail: "Your device is not connected to the internet, so we can't check for updates. Please check your internet connection and try again.",
                buttons: ["OK"]
            });
        } else {
            // For other errors, show a more generic but still user-friendly message
            dialog.showMessageBoxSync(win, {
                type: "warning",
                title: "Update Check Failed",
                message: "Unable to check for updates",
                detail: "An error occurred while checking for updates. Please try again later.",
                buttons: ["OK"]
            });
        }
    });
}

// Function to set initial check flag (for manual checks)
function setIsInitialCheck(value) {
    isInitialCheck = value;
}

// Function to reset the up-to-date message flag (for new manual checks)
function resetUpToDateFlag() {
    hasShownUpToDateMessage = false;
}

// Function to handle manual check result (fallback if event doesn't fire)
function handleManualCheckResult(win) {
    // Only show if it's not an initial check and we haven't already shown the message
    if (!isInitialCheck && !hasShownUpToDateMessage) {
        hasShownUpToDateMessage = true;
        dialog.showMessageBoxSync(win, {
            type: "info",
            title: "App is Up to Date",
            message: "App is up to date",
            detail: "You are already using the latest version of the application.",
            buttons: ["OK"]
        });
    }
}

module.exports = { setupAutoUpdater, autoUpdater, setIsInitialCheck, handleManualCheckResult, resetUpToDateFlag };
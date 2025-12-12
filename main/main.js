const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require("child_process");
const { createLogger } = require('./logger');
const { setupAutoUpdater } = require("./updater");

let logger = null;

app.whenReady().then(() => {
    logger = createLogger();
});

const isDev = process.env.NODE_ENV === 'development'

let backendProcess = null;

// setup electron store
let store;
const loadStore = async () => {
    const { default: Store } = await import("electron-store")
    store = new Store()
}

function saveUserData(userData) {
    if (store) {
        store.set("userData", JSON.stringify(userData));
    } else {
        console.error("Store is not initialized");
    }
}

function getUserData() {
    const userData = store.get("userData");
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

function deleteUserData() {
    store.delete("userData");
}

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    if (logger) {
        logger.error('Uncaught Exception:', error);
    } else {
        console.error('Uncaught Exception (before logger init):', error);
    }
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    if (logger) {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    } else {
        console.error('Unhandled Rejection (before logger init):', reason);
    }
});

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    })
}

function createAppMenu(win) {
    const template = [
        {
            label: "Help",
            submenu: [
                {
                    label: "Check for Updates...",
                    click: () => {
                        const { autoUpdater, setIsInitialCheck, handleManualCheckResult, resetUpToDateFlag } = require("./updater");
                        // Mark as manual check so errors and messages will be shown to user
                        setIsInitialCheck(false);
                        resetUpToDateFlag(); // Reset flag for this manual check
                        autoUpdater.checkForUpdates()
                            .then((updateInfo) => {
                                // If checkForUpdates resolves with null, no update is available
                                // Handle this as a fallback if the event doesn't fire
                                // Use setTimeout to give the event a chance to fire first
                                setTimeout(() => {
                                    if (!updateInfo && handleManualCheckResult) {
                                        handleManualCheckResult(win);
                                    }
                                }, 500);
                            })
                            .catch((err) => {
                                // Error will be handled by the error event handler
                                console.error("Manual update check failed:", err);
                            });
                    }
                }
            ]
        },
        {
            label: "Toggle Developer Tools",
            accelerator: process.platform === "darwin" ? "Cmd+Alt+I" : "Ctrl+Shift+I",
            click: () => {
                if (win.webContents) {
                    win.webContents.toggleDevTools();
                }
            },
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function startServer() {
    return new Promise((resolve, reject) => {
        logger.info('Starting backend server...');
        const backendPath = path.join(__dirname, "..", "backend", "dist", "src", "main.js");

        logger.info(`Backend path: ${backendPath}`);
        logger.info(`Is development: ${isDev}`);

        if (isDev) {
            // In development, use npm run start:dev
            const isWindows = process.platform === "win32";
            const npmCmd = isWindows ? "npm.cmd" : "npm";
            const backendDir = path.join(__dirname, "..", "backend");

            logger.info(`Spawning development backend: ${npmCmd} run start:dev`);
            logger.info(`Backend directory: ${backendDir}`);

            backendProcess = spawn(npmCmd, ["run", "start:dev"], {
                cwd: backendDir,
                env: { ...process.env, PORT: "3000" },
                stdio: "inherit",
                shell: true
            });

            backendProcess.on("error", (error) => {
                logger.error("Failed to start backend process:", error);
                reject(error);
            });

            backendProcess.on("exit", (code, signal) => {
                if (code !== null) {
                    logger.warn(`Backend process exited with code: ${code}`);
                }
                if (signal !== null) {
                    logger.warn(`Backend process killed with signal: ${signal}`);
                }
            });
        } else {
            // In production, run the backend directly in the same process
            logger.info(`Checking if backend build exists: ${backendPath}`);

            if (!fs.existsSync(backendPath)) {
                const error = new Error(`Backend build not found at: ${backendPath}`);
                logger.error(error.message);
                reject(error);
                return;
            }

            logger.info(`Starting production backend directly in Electron process`);

            try {
                // Set environment variable for backend
                process.env.PORT = "3000";

                // Add backend node_modules to the module search path
                const backendNodeModules = path.join(__dirname, "..", "backend", "node_modules");
                if (fs.existsSync(backendNodeModules)) {
                    module.paths.push(backendNodeModules);
                    logger.info(`Added backend node_modules to path: ${backendNodeModules}`);
                }

                // Require and run the backend directly
                require(backendPath);

                logger.info("Backend loaded successfully");
            } catch (error) {
                logger.error("Failed to load backend:", error);
                reject(error);
                return;
            }
        }

        // Wait a bit for the server to start
        logger.info('Waiting 3 seconds for backend to start...');
        setTimeout(() => {
            // Check if backend is responding
            logger.info('Checking if backend is responding at http://localhost:3000/');
            const http = require("http");
            const req = http.get("http://localhost:3000/", (res) => {
                logger.info(`Backend responded with status code: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    logger.info("Backend server started successfully");
                    resolve();
                } else {
                    const error = new Error(`Backend returned status code: ${res.statusCode}`);
                    logger.error(error.message);
                    reject(error);
                }
            });

            req.on("error", (err) => {
                logger.warn('First connection attempt failed:', err);
                logger.info('Retrying backend connection in 2 seconds...');
                // Retry after a bit more time
                setTimeout(() => {
                    const retryReq = http.get("http://localhost:3000/api/hello", (retryRes) => {
                        logger.info(`Backend responded (retry) with status code: ${retryRes.statusCode}`);
                        if (retryRes.statusCode === 200) {
                            logger.info("Backend server started successfully (retry)");
                            resolve();
                        } else {
                            const error = new Error(`Backend returned status code: ${retryRes.statusCode}`);
                            logger.error(error.message);
                            reject(error);
                        }
                    });
                    retryReq.on("error", (retryErr) => {
                        logger.error('Backend connection retry failed:', retryErr);
                        reject(retryErr);
                    });
                }, 2000);
            });
        }, 3000);
    });
}


function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "..", "renderer/preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        const frontendPath = path.join(__dirname, "..", "frontend", "dist", "index.html")
        if (fs.existsSync(frontendPath)) {
            console.log("Loading frontend from:", frontendPath)
            win.loadFile(frontendPath)
        } else {
            console.error("Frontend build not found. Please run: npm run build:frontend")
            logger.error("Frontend build not found. Please run: npm run build:frontend")
            win.loadURL("data:text/html,<h1>Frontend not built</h1><p>Please run: npm run build:frontend</p>")
        }
    }

    // Log console messages from renderer process
    win.webContents.on('console-message', (event) => {
        const lineInfo = event.line !== undefined ? `line ${event.line}` : ''
        console.log(`Renderer console [${event.level}]:`, event.message, `at ${event.sourceId}`, lineInfo)
    })

    win.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
        logger.error("Failed to load:", validatedURL, errorCode, errorDescription)
        console.error("Failed to load:", validatedURL, errorCode, errorDescription)
        win.webContents.loadURL(`data:text/html,<h1>Failed to load</h1><p>Error: ${errorDescription}</p><p>URL: ${validatedURL}</p>`)
    })

    win.webContents.on('did-finish-load', () => {
        console.log('Page finished loading')
    })

    setupAutoUpdater(win);

    createAppMenu(win);
}

function cleanup() {
    if (backendProcess) {
        console.log("Stopping backend server...");
        backendProcess.kill();
        backendProcess = null;
    }
}

app.whenReady().then(async () => {
    try {
        await loadStore();
        await startServer()
        createWindow();
    } catch (error) {
        console.error("Failed to start application: ", error)
        logger.error("Failed to start application: ", error)
        app.quit()
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        cleanup();
        app.quit();
    }
});

app.on("before-quit", () => {
    cleanup();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle("save-user-data", (_, userData) => {
    saveUserData(userData);
});

ipcMain.handle("get-user-data", () => {
    return getUserData();
});

ipcMain.handle("delete-user-data", () => {
    deleteUserData();
});
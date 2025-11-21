const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require("child_process");

const isDev = process.env.NODE_ENV === 'development'

let backendProcess = null;

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    })
}

function startServer() {
    return new Promise((resolve, reject) => {
        const backendPath = path.join(__dirname, "..", "backend", "dist", "main.js");

        if (isDev) {
            // In development, use npm run start:dev
            const isWindows = process.platform === "win32";
            const npmCmd = isWindows ? "npm.cmd" : "npm";
            backendProcess = spawn(npmCmd, ["run", "start:dev"], {
                cwd: path.join(__dirname, "..", "backend"),
                env: { ...process.env, PORT: "3000" },
                stdio: "inherit",
                shell: true
            });
        } else {
            // In production, run the compiled JavaScript
            backendProcess = spawn("node", [backendPath], {
                cwd: path.join(__dirname, "..", "backend"),
                env: { ...process.env, PORT: "3000" },
                stdio: "inherit"
            });
        }

        backendProcess.on("error", (error) => {
            console.error("Failed to start backend:", error);
            reject(error);
        });

        // Wait a bit for the server to start
        setTimeout(() => {
            // Check if backend is responding
            const http = require("http");
            const req = http.get("http://localhost:3000/api/hello", (res) => {
                if (res.statusCode === 200) {
                    console.log("Backend server started successfully");
                    resolve();
                } else {
                    reject(new Error(`Backend returned status code: ${res.statusCode}`));
                }
            });

            req.on("error", (err) => {
                // Retry after a bit more time
                setTimeout(() => {
                    const retryReq = http.get("http://localhost:3000/api/hello", (retryRes) => {
                        if (retryRes.statusCode === 200) {
                            console.log("Backend server started successfully (retry)");
                            resolve();
                        } else {
                            reject(new Error(`Backend returned status code: ${retryRes.statusCode}`));
                        }
                    });
                    retryReq.on("error", reject);
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
            win.loadFile(frontendPath)
        } else {
            console.error("Frontend build not found. Please run: npm run build:frontend")
            win.loadURL("data:text/html,<h1>Frontend not built</h1><p>Please run: npm run build:frontend</p>")
        }
    }

    win.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
        console.error("Failed to load:", validatedURL, errorCode, errorDescription)
        win.webContents.loadURL(`data:text/html,<h1>Failed to load</h1><p>Error: ${errorDescription}</p><p>URL: ${validatedURL}</p>`)
    })
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
        await startServer()
        createWindow();
    } catch (error) {
        console.error("Failed to start application: ", error)
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
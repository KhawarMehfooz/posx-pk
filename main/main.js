const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

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

     // Load frontend
    const frontendPath = path.join(__dirname, "..", "frontend", "dist", "index.html")

    if (fs.existsSync(frontendPath)) {
        win.loadFile(frontendPath);
    } else {
        console.error("Frontend build not found. Please run: npm run build:frontend");
        win.loadURL("data:text/html,<h1>Frontend not built</h1><p>Please run: npm run build:frontend</p>");
    }

    // Handle loading errors
    win.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
        console.error("Failed to load:", validatedURL, errorCode, errorDescription);
        win.webContents.loadURL(`data:text/html,<h1>Failed to load</h1><p>Error: ${errorDescription}</p><p>URL: ${validatedURL}</p>`);
    });
}

app.whenReady().then(() => {
    createWindow();
})
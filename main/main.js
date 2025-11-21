const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow(){
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

    win.loadFile(path.join(__dirname, "..", "index.html"))
}

app.whenReady().then(()=>{
    createWindow();
})
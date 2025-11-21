const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onUpdateProgress: (callback) => ipcRenderer.on("update-progress", callback),
    manualCheckUpdate: () => ipcRenderer.send("manual-check-update")
});
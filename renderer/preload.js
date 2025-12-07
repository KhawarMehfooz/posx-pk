const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onUpdateProgress: (callback) => ipcRenderer.on("update-progress", callback),
    manualCheckUpdate: () => ipcRenderer.send("manual-check-update"),

    saveUserData: (userData) => ipcRenderer.invoke("save-user-data", userData),
    getUserData: () => ipcRenderer.invoke("get-user-data"),
    deleteUserData: () => ipcRenderer.invoke("delete-user-data"),
});
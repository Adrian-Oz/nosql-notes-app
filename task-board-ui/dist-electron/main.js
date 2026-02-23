"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//electron main
const { app, BrowserWindow } = require("electron");
const path = require("path");
require("./ipc-handlers.js");
const { initDatabase } = require("./database/database.js");
const isDev = !app.isPackaged;
function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1500,
        minHeight: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (isDev) {
        win.loadURL("http://localhost:5173");
    }
    else {
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }
}
app.whenReady().then(() => {
    initDatabase();
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

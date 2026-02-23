"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Preload
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
    loadBoard: () => ipcRenderer.invoke("board:load"),
    saveBoard: (board) => ipcRenderer.invoke("board:save", board),
});

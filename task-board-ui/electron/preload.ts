//Preload
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loadBoard: () => ipcRenderer.invoke("board:load"),
  saveBoard: (board: unknown) => ipcRenderer.invoke("board:save", board),
});

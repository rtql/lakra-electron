const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scrapper', {
  start: storageName => ipcRenderer.send('start', storageName)
});

contextBridge.exposeInMainWorld('count', {
  on: counter => ipcRenderer.on('update-counter', counter)
});

contextBridge.exposeInMainWorld('total', {
  on: value => ipcRenderer.on('total-counter', value)
});

contextBridge.exposeInMainWorld('end', {
  on: end => ipcRenderer.on('end', end)
});

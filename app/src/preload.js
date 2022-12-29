const { contextBridge, ipcRenderer } = require('electron');
const { scrapper } = require('./scrapper');

// contextBridge.exposeInMainWorld('electronAPI', {
//   launchScrapper: (storageName) => scrapper(storageName)
// })

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
})

contextBridge.exposeInMainWorld('count', {
  on: counter => ipcRenderer.on('update-counter', counter)
})    

contextBridge.exposeInMainWorld('total', {
  on: value => ipcRenderer.on('total-counter', value)
})   
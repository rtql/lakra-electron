const { contextBridge } = require('electron');
const scrapper = require('./scrapper');

contextBridge.exposeInMainWorld('scrapper', {
  start: () => scrapper()
})
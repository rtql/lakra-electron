const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const scrapper = require('./scrapper');
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
pie.initialize(app);
app.whenReady().then(() => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  
  const menu = Menu.buildFromTemplate([
    {
      label: 'Выгрузки',
      click() {
        dialog.showOpenDialog(mainWindow, {
          defaultPath: __dirname.replace('src', 'exports'), //wrong dir
          properties: ['openFile']
        }).then(result => {
          if (result.canceled) {
            console.log('Dialog was canceled')
          } else {
            const file = result.filePaths[0]
            shell.openPath(file);
            // console.log(file)
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  ])
  Menu.setApplicationMenu(menu);

  ipcMain.on('start', async (event, storageName) => {
    const browser = await pie.connect(app, puppeteer);
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: true,
      }
    });
    await window.webContents.session.clearStorageData()
    const url = "http://client.lakra.ru/index.php";
    await window.loadURL(url);
    const page = await pie.getPage(browser, window);
    await scrapper(page, mainWindow, storageName);
  });
  
  

});

// const main = async () => {
//   // await pie.initialize(app);
//   const browser = await pie.connect(app, puppeteer);
 
//   const window = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       nodeIntegration: true,
//       contextIsolation: true,
//     }
//   });
//   const url = "https://example.com/";
//   await window.loadURL(url);
 
//   const page = await pie.getPage(browser, window);
//   console.log(page.url());
//   // window.destroy();
// };

// ipcMain.on('start', async (event, storageName) => await main())



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



const parser = require('node-html-parser');
const userData = require('./config.json');
const fs = require('fs');
const path = require('path');
const {BrowserWindow, app} = require("electron");
const puppeteer = require("puppeteer-core");

const scrapper = async (page, mainWindow, storageName) => {
  let counter = 0
  const filePath = path.join(__dirname.replace('src', 'exports'), `Экспорт склада ${storageName}.csv`)
  const storages = {
    'Октябрьский': 'div.modal-body.listContainer > table > tbody > tr.ListFormRow.RefItem.active.success',
    'Обухово': 'div.modal-body.listContainer > table > tbody > tr:nth-child(2)'
  };
  let stucked = 0
  
  const lastStack = () => {
    // последнее значение в стеке
    const last = Array.from(stack)[stack.size - 1]
    return last
  }

  const jump = async () => {

    if (stucked > 1) {
      Promise.all([
        page.mouse.wheel({deltaY: -300}),
        page.click(selectFirstGroup)])
        .then(stucked = 0);
    }
    console.log('IN -----> ', stack, checkbox)
    // проход по ветвям
    for (let index = 0; index < curRows; index++) {
      const select = index === 0? selectFirstGroup : `tbody > tr:nth-child(${index + 1})`
      // возвращает артикул
      const doc = await page.$eval(select, el => {
        const expanded = el.getAttribute('expanded');
        const group = el.getAttribute('isgroup');
        return [el.innerText.split('\t')[1], expanded, group];
      });
      // console.log('try', doc[0])
      // если артикул совпадает с последним стеке, то переходит в ветку
      if (doc[0] == lastStack()) {
        await page.click(select);
        stucked = 0
        console.log('clicked', doc[0]);
        // если ветка закрывалась, то удаляет из стека и добавляет в checkbox
        if (doc[1] === 'true') {
          counter += 1
          checkbox.push(lastStack());
          stack.delete(lastStack());
          mainWindow.webContents.send('update-counter', counter)
        } 
      console.log(stack, checkbox, 'OUT ----->');
      }
    }
  }

  const updateStack = async () => {
    await page.waitForTimeout(1200) // для обновления данных на странице
    // добавляет артикулы в стэк, обновляет значение curRows(кол-во групп в ветви)
    const artsOfBranch = await page.$$eval(selectGroup, trs => {
      const arts = []
      for (const tr of trs.slice(0, trs.length-1)) {
        arts.unshift(tr.innerText.split('\t')[1]);
      }
      return arts
    });
    for (art of artsOfBranch) {
      if (!checkbox.includes(art))
        stack.add(art);
      }
    curRows = artsOfBranch.length
  }

  const checkContent = async () => {
    console.log('stucked ====', stucked);
    await page.waitForTimeout(1600);
    page.addListener('response', async (response) => {
      if (response.url() === 'http://client.lakra.ru/ajax/req1c.php') {
        page.removeAllListeners('response');
        console.log(await response.timing().receiveHeadersEnd);
        }
      })
    try {
      const check = await page.$(selectContent, rows => rows);
      if (check != null) {
        console.log('Забрал', check);
        const content = parser.parse(await page.content());
        const table = content.querySelectorAll(selectContent);
        for (row of table) {

          const data = row.innerText.replace(/\n/gi, '').trim().split('\t'); // работает, выдает список товаров
          const txt =  `${data[3]}\\${data[6]}\\${data[12]}\n`
          fs.appendFileSync(filePath, txt, {encoding: 'utf8'});
        }
      }
      stucked += 1
    } catch (error) {
      console.log(error.message);
    }
  }

  const result = async () => {
    await page.waitForTimeout(500);
    console.log('READY', checkbox.length);
  }

  const stack = new Set();
  let curRows
  const checkbox = [ // test box values(big groups)
  //   'Лк-00004557',
    // '90005243962',
    // '90005243839',
    // '90005243852',
    // '90005243972',
    // 'Лк-00000949',
    // '90005243965',
  // 'ЛА-00000906', 'ЛА-00000907', 'ЛА-00000905', 'ЛА-00000904',
  // 'Лк-00004557', '90005243963', 'Лк-00000095', '90005243962',
  // '90005243856', '90005243857', '90005243919', 'Лк-00000014',
  // 'Лк-00000018', '90005243840', '90005243861', '90005243862',
  // '90005243863', '90005243841', '90005243864', '90005243866',
  // '90005243867', '90005243868', '90005243869', '90005243870',
  // '90005243842', '90005243871', '90005243928', '90005243939',
  // '90005243843', '90005243877', '90005243879', '90005243880',
  // '90005243881', '90005243882', '90005243884', '90005243886',
  // '90005243887', '90005243844', '90005243889', '90005243890',
  // '90005243845', '90005243892', '90005243895', '90005243896',
  // '90005243897', '90005243898', '90005243899', '90005243901',
  // '90005243846', '90005243904', '90005243905', '90005243906',
  // '90005243907', '90005243908', '90005243909', '90005243910',
  // '90005243912', '90005243847', '90005243848', '90005243915',
  // '90005243916', '90005243917', '90005243918', '90005243926',
  // '90005243849', 'Лк-00013470', '90005243954', '90005243924',
  // '90005243977', '90005243976', '90005243975', '90005243945',
  // '90005243947', '90005243948', '90005243949', 
  // '90005243916', '90005243917', '90005243918', '90005243926',
  // '90005243849', 'Лк-00013470', '90005243954', '90005243924',
  // '90005243977', '90005243976', '90005243975', '90005243945',
  // '90005243947', '90005243948', '90005243949', '90005243955',
  // '90005243850', 'Лк-00000003', '90005243929', '90005243930',
  // '90005243851', '90005243983', 'Лк-00000013', '90005243950',


    ] 
  // const checkbox = []
  const selectGroup = 'tbody > tr.RefGroup'
  const selectFirstGroup = 'tbody > tr.ListFormRow.RefGroup.active.success'
  const selectContent = 'tr.RefItem'

  // const browser = await pie.connect(app, puppeteer);
 
  // const window = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //     nodeIntegration: true,
  //     contextIsolation: true,
  //   }
  // });

  // const url = "http://client.lakra.ru/index.php";
  // await window.loadURL(url);
  // const page = await pie.getPage(browser, window);


  // const browser = await puppeteer.launch({headless: false});
  // const page = await browser.newPage();
  // await page.goto('http://client.lakra.ru/index.php', {waitUntil: 'networkidle2'});
  await page.waitForSelector('#auth > div > p:nth-child(3) > input');
  await page.type('#vcan_login', userData.login);
  await page.type('#vcan_password', userData.password);
  await page.click('#auth > div > p:nth-child(3) > input');
  
  await page.waitForSelector('#mpTab_Goods > a');
  await page.click('#mpTab_Goods > a');
  await page.waitForTimeout(1000);
  await page.click('#userData_Storage > span.input-group-addon > input');
  await page.waitForTimeout(1000);
  await page.click(storages[storageName]); // здесь и ниже уазание склада
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await mainWindow.webContents.send('total-counter', userData[storageName]);
  // основной цикл
  await updateStack(); // для начального значений в стеке
  fs.writeFileSync(filePath, "артикул\\ наименование\\ остаток\n", {encoding: 'utf8'})
  while (stack.size != 0) { 
    await jump();
    await checkContent();
    await updateStack();
  }
  await result(); // oktyabrskiy - 137 folders
  await mainWindow.webContents.send('end', 'end')

  window.destroy();
  // await browser.close();
}
// scrapper()

// const scrapper = async (app) => {
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

module.exports = scrapper
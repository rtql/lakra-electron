let storageName = 'Выберите склад'
const storage = document.getElementById('select-storage');
storage.addEventListener('change', el => {
  storageName = storage[storage.selectedIndex].text
  console.log(storageName);
});

document.getElementById('submit')
.addEventListener('click', event => {
  if (storageName !== 'Выберите склад') {
    scrapper.start(storageName);
    document.getElementById('timeprogress').innerText = `Начинается загрузка ...`
  } 
  else {
    alert('Выберите склад');
  }
});

let startTimer
let max
total.on((event, value) => {
  max = value
  document.getElementById('progress').max = max
  startTimer = Date.now();
});
const bar = document.getElementById('progress')
const gif = document.getElementById('gif')
let leave = 1
//start
count.on((event, counter) => {
  bar.style.display = 'flex'
  if (leave === 1) {
    gif.style.display = 'flex'
  }
  const max = bar.max
  let progress = 100 * counter / max
  let estimatedTime = (Date.now() - startTimer) * (max - counter) / 1000 / progress
  bar.value = counter
  document.getElementById('%progress').innerText = `Обработано ${Math.floor(progress)}%`
  document.getElementById('timeprogress').innerText = 'Рассчитываю оставшееся время...'
  if (counter > 3) {
    document.getElementById('timeprogress').innerText = `Осталось примерно ${parseInt(estimatedTime / 60)} мин.` // ${Math.ceil(estimatedTime % 60)} сек.`
  }
  });
//end
end.on((event, end) => {
  bar.style.display = 'none'
  gif.style.display = 'none'
  document.getElementById('%progress').innerText = ''
  document.getElementById('timeprogress').innerText = `Склад ${storageName} готов`
});

// document.getElementById('leave')
// .addEventListener('click', event => {
//   leave = 0
//   gif.style.display = 'none'
// });
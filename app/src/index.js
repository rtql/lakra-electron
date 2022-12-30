const storage = document.getElementById('select-storage')
storage.addEventListener('change', el => {
  storageName = storage[storage.selectedIndex].text
  console.log(storageName)
})

let storageName = 'Выберите склад'
document.getElementById('submit')
.addEventListener('click', event => {
  if (storageName !== 'Выберите склад') {
    electronAPI.send('launch', storageName)
    document.getElementById('timeprogress').innerText = `Начинается загрузка ...`
  } 
  else {
    alert('Выберите склад')
  }
})

let startTimer
let max
total.on((event, value) => {
  max = value
  document.getElementById('progress').max = max
  startTimer = Date.now()
})

count.on((event, counter) => {
  
  const max = document.getElementById('progress').max
  let progress = 100 * counter / max
  let estimatedTime = (Date.now() - startTimer) * (max - counter) / 1000 / progress
  document.getElementById('progress').value = counter
  document.getElementById('%progress').innerText = `Обработано ${Math.floor(progress)}%`
  document.getElementById('timeprogress').innerText = 'Рассчитываю оставшееся время...'
  if (counter > 3) {
    document.getElementById('timeprogress').innerText = `Осталось примерно ${parseInt(estimatedTime / 60)} мин.` // ${Math.ceil(estimatedTime % 60)} сек.`
  }
  })

end.on((event, end) => {
  document.getElementById('%progress').innerText = ''
  document.getElementById('timeprogress').innerText = `Склад ${storageName} готов`
})




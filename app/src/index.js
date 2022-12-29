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
  } 
  else {
    alert('Выберите склад')
  }
})
let max = document.getElementById('progress').max
total.on((event, value) => {
  max = value
})
let current = document.getElementById('progress').value
count.on((event, counter) => {
  current = counter
  document.getElementById('div-progress').innerText = `Обработано ${Math.floor(current / max * 100)}%`
})



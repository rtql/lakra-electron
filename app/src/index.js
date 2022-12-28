const submit = document.getElementById('submit')
submit.addEventListener('click', async event => {
    await scrapper.start()
  })
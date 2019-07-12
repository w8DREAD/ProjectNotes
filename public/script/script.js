const xhr = new XMLHttpRequest()

xhr.open('delete', '/notes', false)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

addEventListener('click', function (e) { // Вешаем обработчик клика на UL, не LI
  if (e.target.parentNode.className == 'close button') {
    let data = 'id=' + e.target.id
    xhr.send(data)
    if (xhr.readyState != 4) {
      return
    }
  }

  if (xhr.status === 200) {
    console.log('result', xhr.responseText)
  } else {
    console.log('err', xhr.responseText)
  }
})

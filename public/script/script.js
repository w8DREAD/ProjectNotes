
window.addEventListener('click', async function (e) {
  const xhr = new XMLHttpRequest()

  xhr.open('delete', '/notes', false)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

  if (e.target.parentNode.className == 'close button') {
    let data = 'id=' + e.target.id
    xhr.send(data)
  }

  if (xhr.status === 200) {
    console.log('result', xhr.responseText)
  } else {
    console.log('err', xhr.responseText)
  }
})

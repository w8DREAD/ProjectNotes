window.addEventListener('click', function (e) {
  return new Promise((resolve, reject) => {
    if (e.target.parentNode.className == 'close button') {
      const xhr = new XMLHttpRequest()
      let data = e.target.id
      xhr.open('delete', 'notes/' + data, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      let main = document.querySelector('div.content')
      let post = document.getElementById(`post-${data}`)
      main.removeChild(post)
      xhr.send()
    }
    if (e.target.parentNode.className == 'input-group-text') {
      console.log('123')
    }
  })
})

window.addEventListener('click', function (e) {
  return new Promise((resolve, reject) => {
    if (e.target.parentNode.className == 'like edit button') {
      const xhr = new XMLHttpRequest()
      let data = e.target.id
      const text = document.getElementById('note-' + data)
      text.insertAdjacentHTML('afterbegin', `<div contenteditable="true"> = "${text.children[0].innerText}"> </div>`)
      // text.removeChild(text.children[0])
      const editMode = text.classList.contains('editMode')
      if (editMode) {

      }
      xhr.open('put', 'notes/' + data, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.send()
    }
    if (e.target.parentNode.className == 'input-group-text') {
      console.log('123')
    }
  })
})

// if (xhr.status === 200) {
//   console.log('result', xhr.responseText)
// } else {
//   console.log('err', xhr.responseText)
// }

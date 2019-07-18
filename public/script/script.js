window.addEventListener('click', function (e) {
  return new Promise((resolve, reject) => {
    if (e.target.parentNode.className == 'close button') {
      const xhr = new XMLHttpRequest()
      let data = e.target.id
      console.log(e)
      xhr.open('delete', 'notes/' + data, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      let main = document.querySelector('div.content')
      let post = e.path.find(cur => {
        if (cur.attributes.class) {
          if (cur.attributes.class.value == 'articles-news') {
            return cur
          }
        }
      })
      // main.removeChild(post)
      // xhr.send()
    }
    // if (e.target.parentNode.className == 'input-group-text') {
    //   console.log('123')
    // }
  })
})

window.addEventListener('click', function (e) {
  return new Promise((resolve, reject) => {
    if (e.target.parentNode.className == 'like edit button') {
      const xhr = new XMLHttpRequest()
      let data = e.target.id
      const text = document.getElementById('note-' + data)
      text.setAttribute('contenteditable', 'true')
    //   if (contenteditable) {
    //
    //   }
    //   xhr.open('put', 'notes/' + data, true)
    //   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    //   xhr.send()
    }
    console.log('123')
  })
})

// window.addEventListener('click', e => {
//   if (e.target.patentNode.className == 'input-group-text') {
// let comment = document.getElementById()
//   }
// })

// if (xhr.status === 200) {
//   console.log('result', xhr.responseText)
// } else {
//   console.log('err', xhr.responseText)
// }

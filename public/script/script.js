const xhr = new XMLHttpRequest()
const deleteNote = document.getElementById('1')
const id = 1
const getData = 'POST' + id

xhr.open('delete', '/notes', true)
xhr.setRequestHeader('Content-Type', 'application/x-www-urlencoded')

deleteNote.addEventListener('click', () => {
  xhr.send(getData)

  if (xhr.status != 200) {
    // обработать ошибку
    alert(xhr.status + ': ' + xhr.statusText) // пример вывода: 404: Not Found
  } else {
    // вывести результат
    alert(xhr.responseText)
  }
  // 2. Конфигурируем его: GET-запрос на URL 'phones.json'

  // 3. Отсылаем запрос

  // 4. Если код ответа сервера не 200, то это ошибка
})

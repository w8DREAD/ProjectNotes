// let form = document.getElementsByClassName('content')
// let add = document.getElementById('button-addon1')
//
// function createNews (text, ...tags) {
//   let divNews = document.createElement('div')
//   let button = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//                 </button>`
//
//   let tag = `<p><tag class="tags"><a href="">${tags}</a></tag></p>`
//
//   divNews.className = 'articles-news'
//   divNews.innerHTML = `${text}`
//   divNews.insertAdjacentHTML('beforeend', button)
//   divNews.insertAdjacentHTML('beforeend', tag)
//   return divNews
// }
//
// add.addEventListener('click', () => {
//   let input = document.getElementsByClassName('form-control')
//   let arrArticle = input[0].value.split(' ')
//   let tags = arrArticle.filter(str => str[0] == '#')
//   let news = arrArticle.filter(str => str[0] != '#')
//   form[0].insertAdjacentElement('beforeend', createNews(news, tags))
// })

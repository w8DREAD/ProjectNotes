const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const db = require('../db/database')
const control = require('../mvc/control')
const view = require('../mvc/view')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let arrayPosts = []
// db('get')
//   .then(resolve => { arrayPosts = resolve })
//   .catch(reject => { console.log(reject) })

router.get('/', (req, res, next) => {
  // db('get')
  //   .then(result => { arrayPosts = result })
  //   .then(res.render('news', {
  //     news: 'Тут будут новости',
  //     addClassNews: 'active',
  //     articles: arrayPosts.reverse()
  //   }))
  //   .catch(reject => { console.log(reject.message) })
  res.render('news', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    articles: arrayPosts
  })
})

router.post('/', async (req, res, next) => {
  await arrayPosts.push(control.GetPost.forRender(req.body.articles.split(' ')))
  // let arrArticle = req.body.articles.split(' ')
  // let tags = JSON.stringify(arrArticle.filter(str => str[0] == '#'))
  // let post = arrArticle.filter(str => str[0] != '#').join(' ')
  //
  // if (req.body.articles) {
  //   db('post', post, tags)
  //     .then(resolve => { arrayPosts = resolve })
  //     .catch(reject => { console.log(reject.message) })
  // }

  res.redirect('/news')
})

module.exports = router

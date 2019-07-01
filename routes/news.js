const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

let news = []

router.get('/', function (req, res, next) {
  res.render('news', {
    news: 'Тут будут новости',
    style_news: '#FF0000',
    articles: news
  })
})

router.post('/', (req, res, next) => {
  news.unshift(req.body.articles)
  res.redirect('/news')
})

module.exports = router

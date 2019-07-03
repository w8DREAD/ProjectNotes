const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res, next) {
  res.render('news', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    articles: []
  })
})

router.post('/', (req, res, next) => {

  res.redirect('/news')
})

module.exports = router

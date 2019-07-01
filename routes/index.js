const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()

const urlEncodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Заметки', style_main: '#FF0000' })
})

router.get('/features', function (req, res, next) {
  res.render('features', { features: 'Тут будут фичи', style_features: '#FF0000' })
})

router.get('/news', function (req, res, next) {
  res.render('news', { news: 'Тут будут новости', style_news: '#FF0000' })
})

module.exports = router

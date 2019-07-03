const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Заметки',
    addClassMain: 'active' })
})

module.exports = router

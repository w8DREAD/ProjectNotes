const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()

router.get('/', function (req, res, next) {
  res.render('features', {
    features: 'Тут будут фичи',
    style_features: '#FF0000'
  })
})

module.exports = router

const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const control = require('../mvc/control')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.get('/', (req, res, next) => {
  res.render('notes', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: control.GetNote.forRendering()
  })
})

router.put('/', (req, res, next) => {

})

router.delete('/', (req, res, next) => {

})

module.exports = router

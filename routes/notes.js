const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const control = require('../mvc/control')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.get('/', async (req, res, next) => {
  let data = await control.GetNote.forRendering() || []
  res.render('notes', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: data.reverse()
  })
})
router.post('/', (req, res, next) => {
  let data = req.body
  let id = Object.keys(data)[0]
  let text = req.body[id]
  control.Comment.sendCommentInDb(id, text)
  res.redirect('/notes')
})

router.put('/', (req, res, next) => {

})

router.delete('/', (req, res, next) => {
console.log(req.body)
  res.redirect('/notes')
})

module.exports = router

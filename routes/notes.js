const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const control = require('../mvc/control')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.get('/', async (req, res, next) => {
  let data = await control.GetNote.forRendering() || []
  data.forEach((obj) => {
    obj.comments = [{ comment: '123123', author: 'bob' }, { comment: '12eqweqw3123', author: 'tim' }, { comment: 'bhnhhnh', author: 'kaly' }, { comment: 'vbgbgbg', author: 'ment' }, { comment: '78o778i', author: 'max' }]
  })
  res.render('notes', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: data.reverse()
  })
})
router.post('/', (req, res, next) => {
  const comment = req.body
  console.log(comment)
  res.redirect('/notes')
})

router.put('/', (req, res, next) => {

})

router.delete('/', (req, res, next) => {

})

module.exports = router

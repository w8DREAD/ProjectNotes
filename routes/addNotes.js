const express = require('express')
const router = express.Router()
const app = express()
const control = require('../mvc/control')

router.get('/', (req, res, next) => {
  res.render('addNotes')
})

router.post('/', (req, res, next) => {
  const { tagsText, notesText } = req.body
  control.sendNoteInDb({ tagsText, notesText })
  res.redirect('/notes')
})

module.exports = router

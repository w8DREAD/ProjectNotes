const express = require('express')
const router = express.Router()
const control = require('../mvc/control')

router.get('/', (req, res, next) => {
  res.render('addNotes')
})

router.post('/', async (req, res, next) => {
  const { tagsText, notesText } = req.body
  await control.Note.create({ tagsText, notesText })
  res.redirect('/api/v1/notes')
})

module.exports = router

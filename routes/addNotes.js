const express = require('express')
const router = express.Router()
const app = express()
const control = require('../mvc/control')

router.get('/', (req, res, next) => {
  res.render('addNotes')
})

router.post('/', async (req, res, next) => {
  const { tagsText, notesText } = req.body
  await control.GetNote.sendNoteInDb({ tagsText, notesText })
  res.redirect('/notes')
})

module.exports = router

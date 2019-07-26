const express = require('express');
const middleware = require('../auth/middleware');
const router = express.Router();
const control = require('../mvc/control');

router.get('/', middleware(), (req, res, next) => {

  res.render('addNotes', {
    login: true,
    username: req.user.username,
  });
});

router.post('/', async (req, res, next) => {
  const tagsText = req.body.tagsText;
  const notesText = req.body.notesText;
  const userId = req.session.passport.user.id;
  const author = req.session.passport.user.username;
  await control.Note.create(tagsText, notesText, author, userId);
  res.redirect('/api/v1/notes');
});

module.exports = router;

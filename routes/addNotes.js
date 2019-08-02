const express = require('express');

const router = express.Router();
const control = require('../mvc/control');
const schemes = require('../schemes');
const middleware = require('../auth/middleware');

router.get('/', middleware(), async (req, res, next) => {
  res.render('addNotes', {
    login: true,
    like: await control.User.countLikes(req.user.id),
    username: req.user.username,
  });
});

router.post('/', middleware(), async (req, res, next) => {
  const note = {
    tagText: req.body.tagText,
    noteText: req.body.noteText,
    userId: req.user.id,
    author: req.user.username,
  };
  const valid = schemes.validator(schemes.notes, note);
  if (valid) {
    return res.status(400).json(valid);
  }
  await control.Note.create(note);
  res.redirect('/api/v1/notes');
});


module.exports = router;

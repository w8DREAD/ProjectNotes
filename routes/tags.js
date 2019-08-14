const express = require('express');

const router = express.Router();
const control = require('../mvc/control');
const schemes = require('../schemes');
const middleware = require('../auth/middleware');

router.post('/', middleware(), async (req, res, next) => {
  const tag = {
    text: req.body.tag,
    noteId: +req.body.noteId,
  };
  await control.Tag.create(tag);
  res.status(201).json('ok');
});

router.delete('/:id', middleware(), async (req, res, next) => {
  const {id} = req.params;
  const noteId = Number(req.body.noteId);
  const userId = req.user.id;
  if (await control.Note.checkUser(noteId, userId)) {
    await control.Tag.delete(id);
    console.log('loading page');
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

module.exports = router;

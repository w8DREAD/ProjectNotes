const express = require('express');

const router = express.Router();
const control = require('../mvc/control');
const schemes = require('../schemes');
const middleware = require('../auth');

router.post('/', middleware.auth(), middleware.async(async (req, res, next) => {
  const tag = {
    text: req.body.tag,
    noteId: +req.body.noteId,
  };
  await control.Tag.create(tag);
  res.status(201).json('ok');
}));

router.delete('/:id', middleware.auth(), middleware.rightsNoteTags(), middleware.async(async (req, res, next) => {
  const {id} = req.params;
  await control.Tag.delete(id);
  console.log('loading page');
  res.sendStatus(200);
}));

module.exports = router;

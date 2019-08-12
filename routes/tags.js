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


module.exports = router;

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const schemes = require('../schemes');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/', middleware(), async (req, res, next) => {
  const note = {
    text: req.body.text,
    userId: req.user.id,
  };
  const invalid = schemes.validator(schemes.notes, note);
  if (invalid) {
    return res.status(400).json(invalid);
  }
  await control.Note.create(note);
  res.redirect('/pageNotes');
});

router.post('/like', middleware(), async (req, res, next) => {
  const {noteId} = req.body;
  const userId = req.user.id;
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({
      status: true,
      likesCount: await control.Like.takeRedis('myLike'),
    });
  } else {
    res.status(200).json({
      status: false,
      likesCount: await control.Like.takeRedis('myLike'),
    });
  }
  await control.User.refreshLikeInDb(userId);
});

router.put('/:id', middleware(), async (req, res, next) => {
  const text = req.body;
  const {id} = req.params;
  const valid = schemes.validator(schemes.editNote, text);
  if (valid) {
    return res.status(400).json(valid);
  }
  await control.Note.edit(text, id);
  res.status(200);
});

router.delete('/:id', middleware(), async (req, res, next) => {
  const {id} = req.params;
  await control.Note.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;

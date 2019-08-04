const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const schemes = require('../schemes');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', async (req, res, next) => {
  let userId;
  let name;
  let log = false;
  let likes = 0;

  if (req.user) {
    userId = req.user.id;
    log = true;
    name = req.user.username;
    likes = await control.User.countLikes(userId);
  }
  const notes = await control.Note.render(userId) || [];
  res.render('notes', {
    username: name,
    login: log,
    like: likes,
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
});

router.post('/like', middleware(), async (req, res, next) => {
  const noteId = req.body;
  const userId = req.user.id;
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({
      status: true,
      likesCount: await control.User.countLikes(userId),
    });
  } else {
    res.status(200).json({
      status: false,
      likesCount: await control.User.countLikes(userId),
    });
  }
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

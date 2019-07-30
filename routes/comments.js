const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/create', async (req, res, next) => {
  const comment = {
    text: req.body.text,
    id: req.body.id,
    author: req.user.username,
    userId: req.user.id,
  };
  const commentId = await control.Comment.create(comment);
  res.status(200).json({author: comment.author, id: commentId[0].id});
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  await control.Comment.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;

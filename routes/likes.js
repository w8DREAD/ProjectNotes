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
  const noteId = Number(req.body.noteId);
  const userId = req.user.id;
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({
      status: true,
      likesCount: await control.Like.takeRedis(`${userId}`),
    });
  } else {
    res.status(200).json({
      status: false,
      likesCount: await control.Like.takeRedis(`${userId}`),
    });
  }
});

module.exports = router;

const express = require('express');
const middleware = require('../auth/middleware');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const model = require('../mvc/model');

router.get('/', middleware(), (req, res, next) => {
  res.render('features', {
    username: req.user.username,
    login: true,
    features: 'Тут будут фичи',
    addClassFeatures: 'active',
  });
});

module.exports = router;

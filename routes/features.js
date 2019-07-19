const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const model = require('../mvc/model');

router.get('/', (req, res, next) => {
  res.render('features', {
    features: 'Тут будут фичи',
    addClassFeatures: 'active',
  });
});

module.exports = router;

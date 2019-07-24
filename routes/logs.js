const express = require('express');

const router = express.Router();
const control = require('../mvc/control');

router.get('/', (req, res, next) => {
  res.render('features', {
    features: 'Тут будут фичи',
    addClassFeatures: 'active',
  });
});

module.exports = router;

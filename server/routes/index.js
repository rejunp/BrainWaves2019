var express = require('express');
var router = express.Router();

const batch_mon = require('../controllers/batch.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

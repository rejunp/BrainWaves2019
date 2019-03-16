var express = require('express');
var router = express.Router();

const batch_mon = require('../controllers/batch.controller');
const swift_msg = require('../controllers/swiftMsg.controller');

router.get('/api/getexcatmatch',swift_msg.swiftFindExcatMatch);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

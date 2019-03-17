var express = require('express');
var router = express.Router();

const batch_mon = require('../controllers/batch.controller');
const swift_msg = require('../controllers/swiftMsg.controller');

router.get('/api/v1/getexcatmatch', swift_msg.swiftFindExcatMatch);
router.get('/api/v2/getexcatplusclosefit', swift_msg.swiftFindCloseMatch);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;

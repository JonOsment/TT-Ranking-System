var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quicken Loans Table Tennis Ranking System' });
});

module.exports = router;

/* notes */

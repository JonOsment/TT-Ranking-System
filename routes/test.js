var express = require('express');
var users = require('../Controllers/UserController.js');
var router = express.Router();
var mongoose = require('mongoose');
var TeamMember = mongoose.model('TeamMembers');
var util = require('util')

/* GET users listing. */
router.post('/', function(req, res) { console.log(util.inspect(req.body, false, null)) });

module.exports = router;
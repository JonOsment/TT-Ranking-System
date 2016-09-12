var express = require('express');
var users = require('../Controllers/UserController.js');
var router = express.Router();
var mongoose = require('mongoose');
var TeamMember = mongoose.model('TeamMembers');

/* GET users listing. */
router.get('/', function(req, res) { console.log(req.body); });

module.exports = router;
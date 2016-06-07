var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TeamMember = mongoose.model('TeamMembers');
router.get('/', function(req, res) {
  TeamMember.find({}).limit(20).sort({Points: -1}).exec(function(err, teamMembers){
    if(err){ return err; }

    res.json(teamMembers);
  });
});

module.exports = router;
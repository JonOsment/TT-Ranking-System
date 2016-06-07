var express = require('express');
var users = require('../Controllers/UserController.js');
var router = express.Router();
var mongoose = require('mongoose');
var TeamMember = mongoose.model('TeamMembers');

/* GET users listing. */
router.get('/:userId', function(req, res) {
  //res.send("UserId: " + req.params.userId + " Not Found.");
  TeamMember.find({Badge: req.params.userId},function(err, teamMembers){

    if(err){ return next(err); }

    TeamMember.Count({Points: $gt: teamMembers.Points}, function(err, count){
		teamMembers["Ranking"] = count;
    	res.json(teamMembers);
    });
    
  });

});

module.exports = router;
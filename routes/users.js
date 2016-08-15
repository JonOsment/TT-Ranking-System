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

    TeamMember.count({Points: {$gt: teamMembers[0].Points}}, function(err, count){
    teamMembers[0].set("Ranking", count, {strict : false});
      res.json(teamMembers);
    });

  });

});

router.post('/', function(req, res){

  var bulk = TeamMember.collection.initializeUnorderedBulkOp();
  var listOfTeamMembers = req.body;
  
  for (i = 0; i < listOfTeamMembers.length; i++) 
  {
      var user = listOfTeamMembers[i];
      bulk.find({Email: user.Email}).upsert().update( {$set : {FirstName: user.FirstName, LastName: user.LastName, Badge: user.Badge} });
  }

  bulk.execute(function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
  });

});

module.exports = router;
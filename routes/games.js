var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Games');
var TeamMember = mongoose.model('TeamMembers')

/* GET users listing. */
router.post('/', function(req, res) {
  var game = new Game(req.body);
  var teamMemberIds = [];
  for (var i = 0; i < game.Players.length; i++) 
  {
	teamMemberIds.push(game.Players[i].TeamMemberId);
  };

  var teamMembers = TeamMember.find( { _id: { $in: teamMemberIds } }, function (err, teamMembersFromDb) 
  {
	  if (err) { 
	  	res.status(500);
	  	res.send(err);
	  };

	  try{
	  	AssignPoints(teamMembersFromDb, game);
		}
		catch(err){
			res.status(500);
	  		res.send(err);
	  		return;
		}
	  game.save(function(err, game){
	    if(err){ 
	    	res.status(500);
	  		res.send(err);
	    }
	  });
	  for (user in teamMembersFromDb){
	  	TeamMember.update({_id: teamMembersFromDb[user]._id}, 
	  		{ $set: { Points: teamMembersFromDb[user].Points } },
	  		 {},function(err){ if(err){ 	    	
	  		res.status(500);
	  		res.send(err);
	  		 } });
	  }

	  res.json({teamMembers : teamMembersFromDb, gameData : game });
  });
});


function CreateELOPlayerObject(teamMember, playerGame)
{
	return { TotalPoints : teamMember.Points, Win : playerGame.Win, teamMemberId : teamMember._id };
}

function AssignPoints(usersInGame, game){
	var userPlayers = [];

	if(usersInGame.length != 2 && usersInGame.length != 4){
		throw "Not the correct amount of users in the session. Need 4 or 3 users.";
	}



	for (user in usersInGame)
	{

		var userGamePlayer;
		for (gamePlayer in game.Players)
		{
			if(game.Players[gamePlayer].TeamMemberId.equals(usersInGame[user]._id))
			{
				userGamePlayer = game.Players[gamePlayer];
				break;
			}
		}

		userPlayers.push(CreateELOPlayerObject(usersInGame[user], userGamePlayer));
	}


	DeterminePointsForUsers(userPlayers);

	for (x in userPlayers)
	{
		for (g in game.Players){
			if(game.Players[g].TeamMemberId.equals(userPlayers[x].teamMemberId)){
				game.Players[g].PointsAwarded = userPlayers[x].pointChange;
			}
		}

		for (u in usersInGame){
			if(userPlayers[x].teamMemberId.equals(usersInGame[u]._id)){
				usersInGame[u].Points = userPlayers[x].newPointTotal;
			}
		}
	}
}

function DeterminePointsForUsers(userPlayers)//Player1, Player2)
{
	if(userPlayers.length == 4){
		var winningTeam = { Win : true, TotalPoints : 0 } ;
		var losingTeam = { Win : false, TotalPoints : 0 } ;
		var winningTeamPoints;
		var losingTeamPoints;
		var numberOfWinners = 0;
		for (user in userPlayers)
		{
			if(userPlayers[user].Win)
			{
				winningTeam.TotalPoints += userPlayers[user].TotalPoints;
				numberOfWinners++;
			}else{
				losingTeam.TotalPoints += userPlayers[user].TotalPoints;
			}
		}

		if(numberOfWinners != 2){
			throw "Number of winners selected:"+ numberOfWinners +" A 4 person game should have 2 winners.";
		}

		var pointChangeForWinningTeam = Math.round(ELOPoints(winningTeam, losingTeam)) - Math.round(winningTeam.TotalPoints);
		var pointChangeForLosingTeam = Math.round(ELOPoints(losingTeam, winningTeam))  - Math.round(losingTeam.TotalPoints);

		for(user in userPlayers)
		{
			if(userPlayers[user].Win){
				userPlayers[user].pointChange = pointChangeForWinningTeam;
				userPlayers[user].newPointTotal = pointChangeForWinningTeam + Math.round(userPlayers[user].TotalPoints);
			}else{
				userPlayers[user].pointChange = pointChangeForLosingTeam;
				userPlayers[user].newPointTotal = pointChangeForLosingTeam + Math.round(userPlayers[user].TotalPoints);
			}
		}

	}
	else if (userPlayers.length == 2)
	{
		var numberOfWinners = 0;
		for(user in userPlayers){
			if(userPlayers[user].Win){
				numberOfWinners++;
			}
		}

		if(numberOfWinners != 1)
		{
			throw "Number of winners selected:"+ numberOfWinners +"A 2 person game should have 1 winner."
		}

		var newPointsForPlayer1 = Math.round(ELOPoints(userPlayers[0], userPlayers[1]));
		var newPointsForPlayer2 = Math.round(ELOPoints(userPlayers[1], userPlayers[0]));
		userPlayers[0].newPointTotal = newPointsForPlayer1;
		userPlayers[0].pointChange = newPointsForPlayer1 - Math.round(userPlayers[0].TotalPoints);
		userPlayers[1].newPointTotal = newPointsForPlayer2;
		userPlayers[1].pointChange = newPointsForPlayer2 - Math.round(userPlayers[1].TotalPoints);
	}
}

//Ra(new) = Ra(old) + K(W - Ea)
//Ea = 1/(1 + (10 ^ ((Rb - Ra)/400)))
//K = 800/Ne
//Ne = 16
//W = 1 if the players wins 0 if loses.
var Ne = 16;
var K = 800/Ne;

function W (winner) {
	return winner? 1 : 0;
}

function Evalue(playerRatingPoints, playerOpponentPoints){

	var exponent = (playerOpponentPoints - playerRatingPoints)/400;
	var baseToTheExponent = Math.pow(10, exponent);
	return 1/(1 + baseToTheExponent);
}

function ELOPoints(PlayerRating, PlayerOpponent)
{
	//Ra(new) = Ra(old) + K(W - Ea)
	return PlayerRating.TotalPoints + K*(W(PlayerRating.Win) 
		- Evalue(PlayerRating.TotalPoints, PlayerOpponent.TotalPoints));
}


module.exports = router;
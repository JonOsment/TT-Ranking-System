var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	TeamMemberId: {type: mongoose.Schema.Types.ObjectId, ref: 'TeamMembers'}, 
	Win : Boolean, 
	PointsAwarded: Number});

var GamesSchema = new mongoose.Schema({
  Players : [PlayerSchema],
  StartTime : Date,
  EndTime : {type: Date, default: Date.now}
});

mongoose.model('Games', GamesSchema, 'Games');
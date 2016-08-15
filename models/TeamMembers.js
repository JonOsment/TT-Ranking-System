var mongoose = require('mongoose');

var TeamMemberSchema = new mongoose.Schema({
  Badge: Number,
  LastName: String,
  FirstName: String,
  Email: String,
  GamesPlayed: Number,
  Points: {type:Number , default: 1500}
});

mongoose.model('TeamMembers', TeamMemberSchema, 'TeamMembers');
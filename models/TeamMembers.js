var mongoose = require('mongoose');

var TeamMemberSchema = new mongoose.Schema({
  Badge: Number,
  LastName: String,
  FirstName: String,
  JobTitle: String,
  CommonId: Number,
  Email: String,
  Team: String,
  Extension: Number,
  Points: {type:Number , default: 1500}
});

mongoose.model('TeamMembers', TeamMemberSchema, 'TeamMembers');
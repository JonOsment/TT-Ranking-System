//GetUserProfile
module.exports = {
	GetUserProfile : function(userBadgeId){
		return GetUserByBadgeId(userBadgeId);
	}
}

function GetUserByBadgeId(badgeId){
	return "This is a user: " + badgeId;
}
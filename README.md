# QLTT-Ranking-System
This is a ranking system for QL Table Tennis players.

Technology being used: M.E.A.N Stack

* M --> MongoDB(NoSql)
* E --> Express.js
* A --> Angular.js
* N --> Node.js

Follow Tutorial: https://thinkster.io/mean-stack-tutorial#introduction

Ranking System: http://elorankings.com/

Install for data access: https://robomongo.org/

To import data into team members collection use: mongoimport --db QLTTDB --collection TeamMembers --type csv --headerline --file "CompleteFilePathName"

For Debugging

Install:  npm install -g node-inspector

Run : node-debug app.js

To reset points: db.TeamMembers.update({Points:{$ne:1500}},{ $set:{Points:1500}}, {multi:true})

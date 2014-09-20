var PlugAPI = require('plugapi');
var DJ = require('./dj');
var Song = require('./song');
var User = require('./user');
var settings = require("./settings.json");


var bot = new PlugAPI({
	"email": settings.bot.email,
	"password": settings.bot.password
});
bot.connect(settings.bot.room); 

var connection = dbcon();


var start = Date.now();
var users = {}; 

bot.on('chat', function(chat){
	if(chat.message == ".help"){
		bot.sendChat("MC-SG.BOT - Coming Soon");
	}
});


bot.on('roomJoin', function(room) {
	console.log("Joined " + room);
	bot.sendChat("MC-SG.BOT connected...");
	users = plugUserToBotUsers();
});

bot.on('advance', function(data) {
	console.log("New Song");

	var last = data.lastPlay;
	if(last.dj != null){
		var dj = new DJ(last.dj.id, last.dj.username, last.score.positive, last.score.grabs, last.score.negative, last.score.skipped,last.score.listeners);
		dj.save(connection);
		
		var song = new Song(last.dj.id, last.dj.username, last.score.listeners, last.media.format, last.media.cid, last.media.title, last.media.author, last.score.positive, last.score.grabs, last.score.negative, start, last.media.length, last.score.skipped);
		song.save(connection);

		for (var i = 0; i < users.length; i++) {
			var user = users[i];
			if(!user.is(dj.name)){
				user.save(connection);
			}
		};

	}
	start = Date.now();
	users = bot.getUsers();
});

bot.on('vote', function(vote) {
	users[vote.i].vote(vote.v);
});

bot.on('grab', function(grab) {
	users[vote].grab();
});

function plugUserToBotUsers(){
	var plugs = bot.getUsers();
	var bots = {};
	for (var i = plugs.length - 1; i >= 0; i--) {
		var user = plugs[i];
		bots[user.id] = new User(user.id, User.username);
	};
 //	console.log(JSON.stringify(plugs));
 //	console.log(JSON.stringify(bots));
	return bots;
}


function dbcon(){
	var mysql      = require('mysql');
	var connection = mysql.createConnection(settings.mysql);
	return connection;
}



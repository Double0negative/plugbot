var PlugAPI = require('plugapi');
var DJ = require('./dj');
var Song = require('./song');
var User = require('./user');
var skipMan = require("./skipmanager");
var commands = require("./commands");
var settings = require("./settings.json");
var score = require("./score");

var bot = new PlugAPI({
	"email": settings.bot.email,
	"password": settings.bot.password
});
bot.connect(settings.bot.room); 
bot.multiLine = true;
bot.multiLineLimit = 10;
bot.prototype.skipMan = skipMan;

var connection = dbcon();

var start = Date.now();
var users = {}; 

bot.on('chat', function(chat){
	console.log(JSON.stringify(chat));
	if(chat.message.charAt(0) == "."){
		console.log("command: ["+chat.message+"]")
		var str = chat.message.substring(1).trim();
		var split = str.split(" ");
		var command = split[0];
		var input = str.substring(command.length).trim();

		console.log(command);
		console.log(commands[command].usage);
		if(commands[command] != null){
			commands[command].command(chat.un, command, input, split, bot);
		}
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
		var dj = new DJ(last.dj.id, last.dj.username, last.score.positive, last.score.grabs, 
		                last.score.negative, last.score.skipped,last.score.listeners);
		dj.save(connection);
		
		var song = new Song(last.dj.id, last.dj.username, last.score.listeners, last.media.format, 
		                    last.media.cid, last.media.title, last.media.author, last.score.positive, 
		                    last.score.grabs, last.score.negative, start, last.media.duration, last.score.skipped);
		song.save(connection);
		for (var key in users) {
			var user = users[key];
			if(user.getName() != last.dj.username){
				user.save(connection);
			}
		};

	}
	start = Date.now();
	users = plugUserToBotUsers();
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
		bots[user.id] = new User(user.id, user.username);
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

bot.prototype.skip_type = {
	"LINK_ID": {"msg": "Skip a specific video", "str": "LINK_ID"},
	"MATCH_NAME": {"msg": "Match the name of the song", "str" : "MATCH_NAME"}
}

bot.prototype.skip_reason = {
	"OVERPLAYED": {"reason" : "Overplayed", "msg": "This song is overplayed"},
	"DISLIKED" : { "reason" : "To many dislikes", "msg" : "This song is overly disliked by the community"},
	"TOO_LONG" : { "reason" : "Too Long", "msg" : "This song is too long"},
	"INAPPROPRIATE" : {"reason" : "Inapprpriate", "msg" : "This song is inappropriate"},
	"AUTO_DISLIKE" : {"reason" : "Disliked", "msg" : "To many dislikes were recived"},
	"OTHER" : {"reason" : "Other", "msg": "other"}
}

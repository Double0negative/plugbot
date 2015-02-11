var PlugAPI = require('plugapi');
var DJ = require('./dj');
var Song = require('./song');
var User = require('./user');
var skip = require("./skipmanager");
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
PlugAPI.prototype.skip = new skip();
var connection = dbcon();
PlugAPI.prototype.db = connection;
PlugAPI.prototype.currentSong = null;
PlugAPI.prototype.currentDJ = null;

var start = Date.now();
var users = {}; 

bot.on('chat', function(chat){
//	console.log(JSON.stringify(chat));
if(chat.message.charAt(0) == settings.bot.prefix){
	var str = chat.message.substring(settings.bot.prefix.length).trim();
	var split = str.split(" ");
	var command = split[0];
	var input = str.substring(command.length).trim();
	split.splice(0,1);

	console.log("["+chat.raw.un+"] ran command: "+command + JSON.stringify(split));
	if(commands[command] != null){
		commands[command].command(chat.raw.un, command, input, split, bot);
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
	console.log(JSON.stringify(data));

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

	if(data.currentDJ != undefined && data.currentDJ != null) {
		bot.currentSong = new Song(data.currentDJ.id, data.currentDJ.username, 0, data.media.format, data.media.cid, data.media.title, data.media.author,0, 0, 0, start, data.media.duration, 0);
		bot.currentDJ  = new DJ(data.currentDJ.id, data.currentDJ.username, 0, 0, 0, 0, 0);
		bot.skip.shouldSkip(bot, bot.currentSong);
	}
});

bot.on('vote', function(vote) {
	if(users[vote.i] == undefined){
		users[vote.i] = createUser(vote.i);
	}
	users[vote.i].vote(vote.v);

	var score = getRoomScore();
	if((-((users.length / 2) - 1)) > score) { 
		bot.skip.skip(bot, bot.skip_reason.AUTO_DISLIKE, "bot", "Bot auto Skip");
	}
	
});

bot.on('grab', function(grab) {
	if(users[grab] == undefined){
		users[grab] = createUser(grab);
	}
	users[grab].grab();
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

function createUser(id) {
	return new User(id, bot.getUser(id).username);
}

function getRoomScore(){
	var score = 0;
	for (var i = 0; i < users.length; i++) {
		score += users[i].getScore();
	};
}

function dbcon(){
	var mysql      = require('mysql');
	var connection = mysql.createConnection(settings.mysql);
	var del = connection._protocol._delegateError;
	connection._protocol._delegateError = function(err, sequence){
		if (err.fatal) {
			console.trace('fatal error: ' + err.message);
		}
		return del.call(this, err, sequence);
	};


	return connection;
}

PlugAPI.prototype.skip_type = {
	LINK_ID: {"msg": "Skip a specific video", "str": "LINK_ID"},
	MATCH_NAME: {"msg": "Match the name of the song", "str" : "MATCH_NAME"}
}

PlugAPI.prototype.skip_reason = {
	OVERPLAYED: {"str":"OVERPLAYED", "reason" : "Overplayed", "msg": "This song is overplayed"},
	DISLIKED : {"str" : "DISLIKED" ,"reason" : "To many dislikes", "msg" : "This song is overly disliked by the community"},
	TO_LONG : {"str" : "TO_LONG", "reason" : "Too Long", "msg" : "This song is too long"},
	INAPPROPRIATE : {"str" : "INAPPROPRIATE", "reason" : "Inappropriate", "msg" : "This song is inappropriate"},
	AUTO_DISLIKE : {"str" : "AUTO_DISLIKE", "reason" : "Disliked", "msg" : "Too many dislikes were recived"},
	OTHER : {"str" : "OTHER" ,"reason" : "Other", "msg": "Other"},
	NONE : {"str": "NONE" , "reason" : "None", "msg" : "Skipped by a moderator"}
}

var commands = {

	"help" :{ 
		"command" : function(user, command, input, args, bot){
			bot.sendChat("@"+user);
			bot.sendChat("---MC-SG.BOT HELP---");
			bot.sendChat("No help yet, coming soon!");
		}, 
		"usage" : ".help",
		"desc" : "Print command help"
	}









}
module.exports = commands;
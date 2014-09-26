var commands = {

	"help" :{ 
		"command" : function(user, command, input, args, bot){
			bot.sendChat("@"+user);
			bot.sendChat("---MC-SG.BOT HELP---");
			bot.sendChat("No help yet, coming soon!");
		}, 
		"usage" : ".help",
		"desc" : "Print command help",
		"rank" : ""
	},

	"skip" :{
		"command" : function(user, command, input, args, bot){
			var skip_type = bot.skip_type.MATCH_NAME;
			var skip_reason = bot.skip_reason.OVERPLAYED;
			var skip_message = "";
			if(args.length > 0) {
				if(args[0] == "save"){
					if(args.length > 1)
						skip_type = bot.skip_type[args[1]];
					if(args.length > 2)
						skip_reason = bot.skip_reason[args[2]];
					if(args.length > 3)
						skip_message = args[3];

					bot.skip.add(bot, bot.currentSong, skip_type, skip_reason, user, skip_message);
				}
			} else {
				bot.skip.skip(bot, skip_reason, user, skip_message);
			}
		}
	}







}
module.exports = commands;
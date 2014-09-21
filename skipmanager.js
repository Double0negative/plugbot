var skip = function(){

	var skip = {}

	function sendSkipMessage(bot, reason){
		bot.sendChat("Song was skipped for \" "+ reason.msg +"\"");

	}


	this.load = function shouldSkip(bot, song){
		var query = db.query('SELECT * FROM skip WHERE title LIKE %?% OR link_id=?', [song.title, song.link_id], function(err, result){

			for (var i = 0; i < result.length; i++) {
				var res = result[i];

				var reason = bot.skip_reason[res.skip_reason];

				if(res.skip_type == bot.skip_type.LINK_ID.str){ //better way to do in javascript?
					if(res.link_id == song.link_id){
						bot.moderateForceSkip(function(){
							sendSkipMessage(bot, reason);
							return;
						});
					}
				} else if(res.skip_type == bot.skip_type.MATCH_NAME.str){
					if()
				}
			};

		}
	}



}
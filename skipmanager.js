var skip = function skip(){

	var skip = {}

	this.shouldSkip = function shouldSkip(bot, song){
		var query = bot.db.query('SELECT * FROM skip WHERE author LIKE ? OR link_id=?', ['%'+song.author.toLowerCase()+'%', song.link_id], function(err, result){
			console.log(err);
			if(result != undefined && result != null){
				for (var i = 0; i < result.length; i++) {
					var res = result[i];

					var reason = bot.skip_reason[res.skip_reason];

				if(res.skip_type == bot.skip_type.LINK_ID.str){ //better way to do in javascript?
					if(res.link_id == song.link_id){
						skip(bot, skip_reason, skip_type, msg);

					}
				} else if(res.skip_type == bot.skip_type.MATCH_NAME.str){
					console.log(res.title.replace(" ", "").toLowerCase() + "    -    "+song.plainName().replace(" ","").toLowerCase());
					if(res.title.replace(" ", "").toLowerCase() === song.plainName().replace(" ","").toLowerCase()){
						bot.skip.skip(bot, bot.skip_reason[res.skip_reason], bot.skip_type[res.skip_type], res.msg);
					}
				}
			}	
		}
	});
	}

	function sendSkipMessage(bot, reason){
		bot.sendChat("Song was skipped for \' "+ reason.msg +"\'");
	}

	this.skip = function skip(bot, skip_reason, skip_by, msg){
		bot.moderateForceSkip(function() {
			sendSkipMessage(bot, skip_reason);
		});
	}

	this.add = function add(bot, song, skip_type, skip_reason, skip_by, msg){
		var query = bot.db.format("INSERT INTO skip VALUES(NULL, ?,?,?,?,?,?,?)",
		                          [skip_type.str, skip_reason.str, song.link_id, song.author, song.plainName(), skip_by, msg]);
		console.log(query);
		bot.db.query(query);

		this.skip(bot, skip_reason, skip_by, msg);
	}
}
module.exports = skip;
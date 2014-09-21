var DJ = function DJ(uuid, name, positive, grab, negative, skipped, listeners){


	this.save = function save(db){
		var query = db.query('INSERT INTO users values(NULL,?,?,?,?,?,0,0,0,1,0,?,?) '+
		                              'ON DUPLICATE KEY UPDATE positive=positive+?, grabs=grabs+?, negative=negative+?, skipped=skipped+?, plays=plays+1, listeners=listeners+?',
		                               [uuid, name, positive, grab, negative, listeners, skipped, positive, grab, negative, skipped, listeners]);
	};
}
module.exports = DJ;
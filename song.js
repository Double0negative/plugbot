var song = function song(uuid, name, listeners, format, link_id, title, author, woot, grab, meh, timestamp, length, skipped){
	


	this.save = function save(db){
		var query = db.query('INSERT INTO songs values(NULL, ?,?,?,?,?,?,?,?,?,?,?,?,?)', 
		                             [uuid, name, listeners, link, link_id, title, author, woot, grab ,meh, timestamp, length, skipped]);
	};
	

}

module.exports = song;
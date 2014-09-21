var song = function song(uuid, name, listeners, format, link_id, title, author, woot, grab, meh, timestamp, length, skipped){
	var author = author.trim();
	var fulltitle = author + title;

		reparse();	

	

	function reparse(){
		var full = author + title;
		full = full.substring(full.indexOf("["), full.lastIndexOf("]"));

		var split = full.split("-");

		title = split[1];
		author = split[0];

	}


	this.save = function save(db){
		var query = db.query('INSERT INTO songs values(NULL, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
		                             [uuid, name, listeners, format, link_id, fulltitle, title, author, woot, grab ,meh, timestamp, length, skipped]);
	};
	

}

module.exports = song;
var Song = function Song(uuid, name, listeners, format, link_id, title, author, woot, grab, meh, timestamp, length, skipped){
	this.uuid = uuid;
	this.name = name;
	this.listeners = listeners;
	this.format = format;
	this.link_id = link_id;
	this.title = title;
	this.author = author;
	this.woot = woot;
	this.grab = grab;
	this.meh = meh;
	this.timestamp = timestamp;
	this.length = length;
	this.skipped = skipped;


	var fulltitle = author + "-" +title;

	reparse();	


	

	function reparse(){
		var full = noGen();
		var split = full.split("-");

		if(split.length > 1){
			title = split[1];
			author = split[0];
		} else {
			title = "";
			author = "";
		} 
	}

	function noGen(){
		return fulltitle.replace(/\[[^\]]*\]/g, "");
	}

	this.plainName = function plainName(){
		return title.replace(/(?:\[[^\]]*\])|(?:\([^\)]*\))/g, "");
	}


	this.save = function save(db){
		var query = db.query('INSERT INTO songs values(NULL, ?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
		                     [uuid, name, listeners, format, link_id, fulltitle, title, author, woot, grab ,meh, timestamp, length, skipped]);
	};
	

}

module.exports = Song;
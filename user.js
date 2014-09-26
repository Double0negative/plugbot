
var user = function user(uuid, name){
	var woot = 0;
	var meh = 0;
	var grab = 0;

	this.vote = function vote(vote){
		if(vote > 0){
			this.woot = 1;
			this.meh = 0;
		} else {
			this.meh = 1;
			this.woot = 0;
		}
	};

	this.grab = function grab(){
		this.grab = 1;
	};

	this.getScore = function getScore(){
		return woot - meh + grab ;
	}

	this.getName = function getName(){
		return this.name;
	};
	this.is = function is(test){
		return this.name == test; 
	};
	this.save = function save(db){
		var query = db.query('INSERT INTO users values(NULL,?,?,0,0,0,?,?,?,0,1,0,0) '+
		                     'ON DUPLICATE KEY UPDATE positive_given=positive_given+?, grabs_given=grabs_given+?, negative_given=negative_given+?, listens=listens+1',
		                     [uuid, name, woot, grab, meh, woot, grab, meh]);
	};
}

module.exports = user;
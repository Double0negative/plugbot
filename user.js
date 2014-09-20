
var user = function user(uuid, name){
	this.name = name;
	this.woot = false;
	this.meh = false;
	this.grab = false;

	this.vote = function vote(vote){
		if(vote > 0){
			this.woot = true;
			this.meh = false;
		} else {
			this.meh = true;
			this.woot = false;
		}
	};

	this.grab = function grab(){
		this.grab = true;
	};

	this.store = function save(db){

	};
	this.getname = function getName(){
		return this.name;
	};
	this.is = function is(test){
		return this.name == test; 
	};

}

module.exports = user;
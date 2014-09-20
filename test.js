var test = new test("hello");
test.maketest();







function test(test){

	this.maketest = function maketest(){
		console.log(test);
	}

}
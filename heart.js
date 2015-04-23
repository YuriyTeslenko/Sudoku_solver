window.onload = function() {
	var solved = Array(
		7,6,1,3,5,2,9,4,8,
		2,9,4,1,7,8,5,3,6,
		3,8,5,6,4,9,2,7,1,
		5,1,3,7,8,6,4,2,9,
		6,4,7,9,2,1,3,8,5,
		9,2,8,4,3,5,1,6,7,
		1,3,9,8,6,4,7,5,2,
		4,5,6,2,1,7,8,9,3,
		8,7,2,5,9,3,6,1,4
		);
	var input = Array(
		7,0,0,3,5,0,9,0,8,
		2,9,0,0,0,8,0,0,0,
		0,0,5,0,0,9,0,0,1,
		0,0,3,0,0,6,0,0,9,
		0,4,7,0,2,0,0,0,0,
		0,2,0,0,0,5,1,6,7,
		0,0,9,8,6,0,7,0,0,
		0,5,0,2,0,0,8,9,0,
		8,7,0,0,0,3,0,1,0
		);
	function Cell (number) {
		this.value = number;
		this.lockedNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	Cell.prototype.lock = function (number) {
		this.lockedNum[number]++;
	}
	Cell.prototype.unlock = function (number) {
		this.lockedNum[number]--;
	}
	Cell.prototype.set = function (number) {
		if (this.lockedNum[number]) {return false};
		this.value = number;
		return true;
	}
	Cell.prototype.get = function(){return this.value};

	function Field (data) {
		this.field = [];
		for (var i = 0; i < 9; i++){
			this.field[i] = [];
			for (var j = 0; j < 9; j++){
				this.field[i][j] = new Cell(0);
			}
		}
		var index = 0;
		for (var i = 0; i < 9; i++){
			for (var j = 0; j < 9; j++, index++){
				var value = data[index];
				value && this.lockRowColBox(i, j, value);
			}
		}
	}

	Field.prototype.lockRowColBox = function (y, x, value) {
		if (!this.field[y][x].set(value)) {return false};
		for (var i = 0; i<9; i++) { //column lock
			this.field[i][x].lock(value);
		}
		for (var j = 0; j<9; j++) { //row lock
			j!=x && this.field[y][j].lock(value);
		}
		var boxX = (x/3>>0)*3;
		var boxY = (y/3>>0)*3;
		for (var i = 0; i<3; i++) { //3x3block lock
			for (var j = 0; j<3; j++) {
				(boxY+i!=y || boxX+j!=x) && this.field[boxY+i][boxX+j].lock(value);
			};
		};
		return true;
	}
	Field.prototype.unlockRowColBox = function (y, x, value) {
		this.field[y][x].set(0);
		for (var i = 0; i<9; i++) { //column unlock
			this.field[i][x].unlock(value);
		}
		for (var j = 0; j<9; j++) { //row unlock
			j!=x && this.field[y][j].unlock(value);
		}
		var boxX = (x/3>>0)*3;
		var boxY = (y/3>>0)*3;
		for (var i = 0; i<3; i++) { //3x3block unlock
			for (var j = 0; j<3; j++) {
				(boxY+i!=y || boxX+j!=x) && this.field[boxY+i][boxX+j].unlock(value);
			};
		};
	}
	Field.prototype.getResult = function () {
		var result = [];
		var index = 0;
		for (var i = 0; i < 9; i++){
			for (var j = 0; j < 9; j++, index++){
				result[index] = this.field[i][j].get();
			}
		}
		return result;
	}
	Field.prototype.findAnswer = function(y ,x){
		if (x==9) {
			x=0;
			y++;
		}
		while ((y<9) && this.field[y][x].get()){
			x++;
			if (x==9) {
				x=0;
				y++;
			}
		}
		if (y==9) {return true};

		for (var num = 1; num<=9; num++) {
		 	if (this.lockRowColBox(y, x, num)) {
		 		if (this.findAnswer(y, x+1)) {return true};
		 		this.unlockRowColBox(y, x, num);
		 	}
		}
		return false;
	}

	var area = new Field(input);

	area.findAnswer(0, 0);

	console.log(area.getResult());

	if (solved.toString()==area.getResult().toString()){
		alert("Success!");
	}
	else{
		alert("Fail!");
	}
};


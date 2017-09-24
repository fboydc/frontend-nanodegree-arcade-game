

var Game = function() {
	this.lost = false;
	this.paused = false;
	this.allEnemies = new Array();
	this.player = new Player();
	this.growthFactor = 50;
	this.level = 1;
	this.enemyLane_1 = 126;
	this.enemyLane_2 = 209;
	this.enemyLane_3 = 290;
	this.collectibles = new Array();
	this.obstacles = new Array();
	this.victorySound = new Audio('sounds/water-splash.mp3');
	this.render();
	this.objectsLocations = [
								[0,60],[101,60],[202, 60],[303,60], [404,60],
								[0, 140], [101, 140], [202,140], [303,140],
								[404, 140], [0, 220], [101, 220], [202, 220],
								[303,220], [404, 220]
							  ];


}


Game.prototype.createEnemies = function(){
	var x = 0;
	this.allEnemies.push(new Enemy(x, this.enemyLane_1, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_2, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_3, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
}



Game.prototype.reset = function(){

	this.paused = false;

	this.player.reset();
	this.allEnemies = new Array();
	this.generateObstacles();
	this.generateCollectibles();
	this.createEnemies();
}

Game.prototype.restart = function(){
	game = new Game();
}

Game.prototype.win = function(){
	this.player.y = 50;
	this.victorySound.play();
	this.player.score += 10;
	this.increaseDifficulty();
	this.allEnemies = new Array();
	this.player.sprite = "images/animations/"+this.player.character+"-victory.png";
	this.paused = true;

}



Game.prototype.increaseDifficulty = function(){
	this.level += this.growthFactor;
	this.modifyEnemies();


}

Game.prototype.modifyEnemies = function(){
	var x = 0;
	var y = [60, 140, 220];
	this.allEnemies = new Array();
	for(var i=0; i<3;i++){
		this.allEnemies.push(new Enemy(x, y[i], Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	}
	console.log("Enemies size: "+this.allEnemies.length);

}

Game.prototype.render = function(){
	ctx.font = "30px Georgia";
	ctx.fillStyle="white";
	ctx.fillText("score: "+this.player.score, 20, 570);
	ctx.fillStyle="white";
	ctx.fillText("x "+this.player.lives, 450,570);

	//ctx.drawImage(Resources.get('images/Heart.png'), 0, 60);
	//ctx.drawImage(Resources.get('images/Heart.png'), 0, 60);
	//console.log(ctx);

}

/***********************************************

asdfasdfasdf
************************************************/

Game.prototype.generateCollectibles = function(){
	this.collectibles = new Array();
	var collectibles = new Array();

	collectibles.push(new Heart(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new Apple(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new Berry(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new Banana(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	if((Math.floor(Math.random()*2)+1)> 1){
		var weights = this.weightsCDF(collectibles);
		var collectible = collectibles[this.weightsBisection(collectibles, weights)];
		this.collectibles.push(collectible);

	}




}




Game.prototype.weightsCDF = function(collectibles) {
	var weightSum = new Array();

	for(var i=1; i<=collectibles.length; i++){
		var temp = 0;
		for(var j=0; j<i; j++){
			temp += collectibles[j].weight;
		}
		weightSum.push(temp);
	}

	return weightSum;

}

Game.prototype.weightsBisection = function(collectibles, weights){
	var rand = Math.floor(Math.random()*(weights[weights.length-1] - 0) + 0);
	console.log("rand: "+rand);
	if(rand < weights[0])
		return 0;
	for(var i=1; i<collectibles.length; i++){
		if(rand > collectibles[i].weight && rand < weights[i]){
			console.log("i = "+i);
			return i;
		}

	}

}

Game.prototype.renderCollectibles = function(){
	for(var i=0; i<this.collectibles.length; i++){
		this.collectibles[i].render();
	}
}







Game.prototype.generateObstacles = function(){

	this.obstacles = new Array();

	switch(true){
		case (this.level > 300):
				this.obstaclesGenerator(Math.random() *(4-1) + 1);
				break;
		case(this.level > 120):
				this.obstaclesGenerator(Math.random() *(2-1) + 1);
			break;

	}



}

Game.prototype.obstaclesGenerator = function(num){
	for(var i=0; i < num; i++){
			var loc = Math.floor(Math.random()*this.objectsLocations.length);
			this.obstacles.push(new Obstacle(this.objectsLocations[loc]));
		}
}


Game.prototype.renderObstacles = function(){
	for(var i =0; i < this.obstacles.length; i++){
		this.obstacles[i].render();
	}

}




var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    //this.sprite = 'images/enemy-bug.png';
    this.sprite = 'images/PixelCar.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.paused = false;
    this.frame = 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!this.paused) {



    	this.x += this.speed * dt;

    	if(this.x >= ctx.canvas.width){
    		this.x = -180;
    	}
    	//console.log(game);

	    var diffx = this.x - game.player.x;
    	var diffy = Math.abs(this.y - game.player.y);

    	if((diffy < 40 && diffy > 0)&&((diffx<0 && diffx >-155)|| (diffx>0 && diffx<40))){
    		game.player.die();
    	}

   		/*if(diffx < 200 && diffy < 20){

   		}*/


    }

};



Enemy.prototype.reset = function() {

	allEnemies.forEach(function(){
		this.paused = true;
	});

	this.createEnemies();

}



// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};










// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.xspeed = 101;
	this.yspeed = 83;
	this.lives = 2;
	this.score = 0;
	this.character = "boy";
	this.reset();
	this.move = false;
	this.deadSound = new Audio("sounds/splat.mp3");
}

Player.prototype.update = function(){

		if(this.y < 88){
			console.log(this.y);
			game.win();
		}


}

Player.prototype.render = function(){	
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.handleInput = function(code){
	this.move = true;
		switch(code) {
			case 'left':
				if(this.x > 0 && this.isBlocked('left')){
					this.move = true;
					this.changeDirection("left");
					this.x -= this.xspeed;

				}
				break;
			case 'up':
				this.logPosition();
				if(this.isBlocked('up')){
					this.move = true;
					this.changeDirection("up");
					this.y -= this.yspeed;

				}
				break;
			case 'right':
				if(this.x < 402 && this.isBlocked('right')){
					this.move = true;
					this.changeDirection("right");
					this.x += this.xspeed
				}
				break;
			case 'down':
				if(this.y < 380 && this.isBlocked('down')){
					this.move = true;
					this.changeDirection("down");
					this.y += this.yspeed;
				}
				break;

		}

	}


Player.prototype.changeDirection = function(direction){
	switch(direction){
		case "right":
				this.sprite = "images/animations/move-right/"+this.character+"-right.png";
				break;
		case "left":
				this.sprite = "images/animations/move-left/"+this.character+"-left.png";
				break;
		case "up":
				this.sprite = "images/animations/move-up/"+this.character+"-up.png";
				break;
		case "down":
				this.sprite ="images/animations/move-down/"+this.character+"-down.png";
				break;
	}
}



Player.prototype.logPosition = function(){
	console.log("player x: "+this.x);
	console.log("player y: "+this.y);

	for(var i=0; i < game.collectibles.length; i++){
		//console.log("enemy "+i+" x: "+game.allEnemies[i].x);
		console.log("diff collectibles "+i+" y: "+(this.y - game.collectibles[i].y));

	}


}


Player.prototype.isBlocked = function(direction){
	var move = true;
	switch(direction){
		case 'right':
			for(var i=0; i<game.obstacles.length; i++){
				if(game.obstacles[i].x - this.x === 101 && ( game.obstacles[i].y - this.y === -28 || game.obstacles[i].y - this.y === -31 || game.obstacles[i].y - this.y === -34)){
						move = false;
				}
			}
			break;
		case 'left':
			for(var i=0; i<game.obstacles.length; i++){
				if(this.x - game.obstacles[i].x === 101 && ( game.obstacles[i].y - this.y === -28 || game.obstacles[i].y - this.y === -31 || game.obstacles[i].y - this.y === -34)){
						console.log(game.obstacles[i].y - this.y);
						move = false;
				}
			}
			break;
		case 'up':
			for(var i=0; i<game.obstacles.length; i++){
				if(Math.abs(game.obstacles[i].x - this.x) === 0 &&(Math.abs(game.obstacles[i].y - this.y) === 111 || Math.abs(game.obstacles[i].y - this.y) === 114 || Math.abs(game.obstacles[i].y - this.y) === 117)){
					move = false;
				}
			}
			break;

		case 'down':
			for(var i=0; i<game.obstacles.length; i++){
				if(Math.abs(game.obstacles[i].x - this.x) === 0 && (Math.abs(game.obstacles[i].y - this.y) === 49 || Math.abs(game.obstacles[i].y - this.y) === 52)){
					move = false;
				}
			}
			break;
	}

	return move;

}

Player.prototype.reset = function(){
		this.sprite = "images/animations/move-up/"+this.character+"-up.png";
		this.x = 0;
		this.y = 420;
}



Player.prototype.die = function() {
	this.deadSound.play();
	this.sprite ="images/animations/"+this.character+"-dead.png";
	this.lives--;
	game.paused = true;

}





var Obstacle = function(coord){
	this.sprite = "images/Rock.png";
	this.x = coord[0];
	this.y = coord[1];
}

Obstacle.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}




var Collectible = function(x, y, sprite, type, value){
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.type = type;
	this.value = value;


}


Collectible.prototype.update = function(){

	if(this.x === game.player.x && (game.player.y - this.y === 28 || game.player.y - this.y === 31 || game.player.y - this.y === 34)){
		switch(this.type){
			case 'health':
				game.player.lives += this.value;
				this.audio.play();
				break;
			case 'scoreBoost':
				game.player.score += this.value;
				this.audio.play();
				break;

		}

		game.collectibles.splice(game.collectibles.indexOf(this), 1);

	}
}


Collectible.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}



var Heart = function(coord){
	//Collectible.call(this, coord[0], coord[1], 'images/Heart.png', "health", 1);
	Collectible.call(this, coord[0], coord[1], 'images/Heart.png', "health", 1);
	this.weight = 5;
	this.audio = new Audio('sounds/mushroom-effect.mp3');

}

Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Collectible;


var Apple = function(coord){
	//Collectible.call(this, coord[0], coord[1], 'images/Gem Blue.png', "scoreBoost", 45);
	Collectible.call(this, coord[0], coord[1], 'images/fruits/apple.png', "scoreBoost", 45);
	this.weight = 2;
	this.audio = new Audio('sounds/tasty.mp3');
}


Apple.prototype = Object.create(Collectible.prototype);
Apple.prototype.constructor = Collectible;

var Berry = function(coord){

	//Collectible.call(this, coord[0], coord[1], 'images/Gem Green.png', "scoreBoost", 90);
	Collectible.call(this, coord[0], coord[1], 'images/fruits/whortleberry.png', "scoreBoost", 90);
	this.weight = 2;
	this.audio = new Audio('sounds/divine.mp3');
}

Berry.prototype = Object.create(Collectible.prototype);
Berry.prototype.constructor = Collectible;

var Banana = function(coord){
	//Collectible.call(this, coord[0], coord[1], 'images/Gem Orange.png', "scoreBoost", 250);
	Collectible.call(this, coord[0], coord[1], 'images/fruits/banana.png', "scoreBoost", 250);
	this.weight = 1;
	this.audio = new Audio('sounds/delicious.mp3');
}


Banana.prototype = Object.create(Collectible.prototype);
Banana.prototype.constructor = Collectible;






// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var game = new Game();


//createEnemies();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});
















// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    //this.sprite = 'images/enemy-bug.png';
    this.sprite = 'images/enemy-bug.png';
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
    		this.x = -100;
    	}
    	//console.log(game);

	    var diffx = Math.abs(this.x - game.player.x);
    	var diffy = Math.abs(this.y - game.player.y);

   		if(diffx < 80 && diffy < 20){
   			game.player.die();
   		}


    }

};



Enemy.prototype.reset = function() {

	allEnemies.forEach(function(){
		this.paused = true;
	});

	allEnemies = new Array();
	createEnemies();

}



// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};














/*******************************************
subClass Name: Heart
******************************************/





var Game = function() {
	this.lost = false;
	this.paused = false;
	this.allEnemies = new Array();
	this.player = new Player();
	this.growthFactor = 50;
	this.level = 1;
	this.enemyLane_1 = 60;
	this.enemyLane_2 = 140;
	this.enemyLane_3 = 220;
	/*this.enemyLane_1 = 140;
	this.enemyLane_2 = 220;
	this.enemyLane_3 = 300;*/
	this.createEnemies();
	this.collectibles = new Array();
	this.obstacles = new Array();
	this.victorySound = new Audio('sounds/zelda-secret.mp3');
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

	this.generateObstacles();
	this.generateCollectibles();


	//this.createEnemies();
}

Game.prototype.restart = function(){
	game = new Game();
}

Game.prototype.win = function(){
	this.victorySound.play();
	this.player.score += 10;
	this.increaseDifficulty();
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


************************************************/

Game.prototype.generateCollectibles = function(){
	this.collectibles = new Array();
	var collectibles = new Array();

	collectibles.push(new Heart(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new BlueGem(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new GreenGem(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
	collectibles.push(new OrangeGem(this.objectsLocations[Math.floor(Math.random()*this.objectsLocations.length)]));
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
				this.obstaclesGenerator(Math.random() *(5-1) + 1);
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


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.reset();
	this.xspeed = 101;
	this.yspeed = 80;
	this.lives = 2;
	this.score = 0;
	this.character;
}

Player.prototype.update = function(){

	if(this.y < 0){
		console.log(this.y);
		game.win();
	}
}

Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.handleInput = function(code){
	//console.log(code);
		switch(code) {
			case 'left':
				if(this.x > 0 && this.isBlocked('left')){
					this.x -= this.xspeed;
				}
				break;
			case 'up':
				if(this.isBlocked('up')){
					this.y -= this.yspeed;
				}
				break;
			case 'right':
				if(this.x < 402 && this.isBlocked('right')){
					this.x += this.xspeed;
				}
				break;
			case 'down':
				if(this.y < 380 && this.isBlocked('down')){
					this.y += this.yspeed;
				}
				break;

		}
	}


Player.prototype.isBlocked = function(direction){
	var move = true;
	switch(direction){
		case 'right':
			for(var i=0; i<game.obstacles.length; i++){
				if(game.obstacles[i].x - this.x === 101 && game.obstacles[i].y - this.y === 0){
						move = false;
				}
			}
			break;
		case 'left':
			for(var i=0; i<game.obstacles.length; i++){
				if(this.x - game.obstacles[i].x === 101 && game.obstacles[i].y - this.y === 0){
						move = false;
				}
			}
			break;
		case 'up':
			for(var i=0; i<game.obstacles.length; i++){
				if(this.y - game.obstacles[i].y === 80 && game.obstacles[i].x - this.x === 0){
					move = false;
				}
			}
			break;
		case 'down':
			for(var i=0; i<game.obstacles.length; i++){
				if(game.obstacles[i].y - this.y  === 80 && game.obstacles[i].x - this.x === 0){
					move = false;
				}
			}
			break;
	}

	return move;

}

Player.prototype.reset = function(){
		this.sprite = 'images/char-boy.png';
		this.x = 0;
		this.y = 380;
}



Player.prototype.die = function() {
	this.sprite = "images/rip.png";
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
	if(this.x === game.player.x && this.y === game.player.y){
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
	Collectible.call(this, coord[0], coord[1], 'images/Heart.png', "health", 1);
	this.weight = 5;
	this.audio = new Audio('sounds/mushroom-effect.mp3');

}

Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Collectible;


var BlueGem = function(coord){
	Collectible.call(this, coord[0], coord[1], 'images/Gem Blue.png', "scoreBoost", 45);
	this.weight = 2;
	this.audio = new Audio('sounds/tasty.mp3');
}


BlueGem.prototype = Object.create(Collectible.prototype);
BlueGem.prototype.constructor = Collectible;

var GreenGem = function(coord){

	Collectible.call(this, coord[0], coord[1], 'images/Gem Green.png', "scoreBoost", 90);
	this.weight = 2;
	this.audio = new Audio('sounds/divine.mp3');
}

GreenGem.prototype = Object.create(Collectible.prototype);
GreenGem.prototype.constructor = Collectible;

var OrangeGem = function(coord){
	Collectible.call(this, coord[0], coord[1], 'images/Gem Orange.png', "scoreBoost", 250);
	this.weight = 1;
	this.audio = new Audio('sounds/delicious.mp3');
}


OrangeGem.prototype = Object.create(Collectible.prototype);
OrangeGem.prototype.constructor = Collectible;






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

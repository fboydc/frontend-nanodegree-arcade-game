



var Game = function() {
	this.score = 0;
	this.lost = false;
	this.paused = false;
	this.allEnemies = new Array();
	this.player = new Player();
	this.growthFactor = 50;
	this.level = 1;
	this.enemyLane_1 = 60;
	this.enemyLane_2 = 140;
	this.enemyLane_3 = 220;
	this.createEnemies();


}

Game.prototype.createEnemies = function(){

	var x = 0;
	var y = [60, 140, 220];
	this.allEnemies.push(new Enemy(x, this.enemyLane_1, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_2, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_3, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));

}



Game.prototype.reset = function(){
	this.paused = false;
	this.allEnemies = new Array();
	this.player.reset();
	this.createEnemies();
}

Game.prototype.win = function(){
	this.increaseDifficulty();
	this.paused = true;

}

Game.prototype.increaseDifficulty = function(){
	this.level += this.growthFactor;

	switch(true){
		case(this.level >= 151):
			this.addEnemies(3);
			break;


	}

}

Game.prototype.addEnemies = function(num){
	var x = 0;
	var y = [60, 140, 220];
	for(var i=0; i<num;i++){
		this.allEnemies.push(new Enemy(x, y[i], Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	}
	console.log("Enemies size: "+this.allEnemies.length);
	//this.allEnemies.push(new Enemy(x, y[i], Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70)));
}

//Game.prototype.changeMonster = f





// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

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

    	/*if(this.frame < 10){
    		this.sprite = "images/zombie/walk-"+this.frame+".png";
    		this.frame++;
    	}else{
    		this.sprite = "images/zombie/walk-"+this.frame+".png";
    		this.frame = 1;
    	}*/

    	this.x += this.speed * dt;

    	if(this.x >= ctx.canvas.width){
    		this.x = -100;
    	}
    	//console.log(game);

	    var diffx = Math.abs(this.x - game.player.x);
    	var diffy = Math.abs(this.y - game.player.y);

   		if(diffx < 70 && diffy < 20){
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






// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.reset();
	this.xspeed = 101;
	this.yspeed = 82.50;
	this.lives = 0;
}

Player.prototype.update = function(){
	if(this.y < 0){
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
				if(this.x > 0)
					this.x -= this.xspeed;
				break;
			case 'up':
				this.y -= this.yspeed;
				break;
			case 'right':
				if(this.x < 402)
					this.x += this.xspeed;
				break;
			case 'down':
				if(this.y < 401)
					this.y += this.yspeed;
				break;

	}
}

Player.prototype.reset = function(){
		this.x = 200;
		this.y = 401;
}

Player.prototype.die = function() {
	game.paused = true;

}





var game = new Game();


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player







/*
var allEnemies = new Array();
var player = new Player();
var game = new Game(allEnemies, player);
game.createEnemies();*/


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

/**********************************************************************************
*AUTHOR: FELIPE BOYD
*DESCRIPTION: This file contains all the resources used by engine.js to run
*my frogger implementation, originally provided by udacity.com. If there are
*any improvements you might have, feel free to let me know. Share the knowledge!!
*
*
***********************************************************************************/





/***********************************************************************************
										CLASS: Game
------------------------------------------------------------------------------------
DESCRIPTION:
A game encapsulates a player instance along with a collection of enemies,
collectibles, and obstacles. It represents the lifetime of a player object
until it's lives property reaches 0, which in turn creates a new instance
of game along with it's freshly new correspoding encapsulated properties.
------------------------------------------------------------------------------------
PROPERTIES:
1.lost - type: Boolean
	     description: This property is used to indicate the main function,
	                when to restart the game once 'player.lives' reaches a value
	                of 0.

2.paused - type: Boolean
	       description: A flag used for temporarily exiting the
	                  requestAnimationFrame loop, creating a short pause between
	                  the win/loose phase of the game.

3.allEnemies - type: array <Enemy>
			   description: Represents a collection
			   of enemy objects. It is used to encapsulate enemies within a
			   game object.

4.player - type: Player
           description: A representation a player instance within a game.
           please see the Player class for more information.

5.growthFactor - type: number (can be integer or decimal).
			     description: a multiplier; increments the speed at which
			     the enemies (cars) travel through the stone tiles.

6.level - type: number (can be integer or decimal).
		  description: Sets the bottom boundary of how fast an enemy object
		               will travel across the canvas. The higher the level,
		               the faster the enemy. It can be as fast as level, or
		               faster.

7.enemy_lane_1 - type: number (integer).
                 description: set the initial position along the Y-axis
                 of the canvas, of the first enemy in the allEnemies
                 collection.

8.enemy_lane_2 - type: number (integer).
                 description: set the initial position along the Y-axis
                 of the canvas, of the second enemy in the allEnemies
                 collection.

9.enemy_lane_3 - type: number (integer).
                 description: set the initial position along the Y-axis
                 of the canvas, of the third enemy in the allEnemies
                 collection.

10. collectibles - type: array <collectible>.
				   description: Represents a collection of collectible
				   objects. It used to encapsulates all the collectibles
				   within a game.

11. obstacles - type: array <obstacle>.
                description: Represents a collection of obstacle
				   objects. It used to encapsulates all the obstacles
				   within a game.

12. victorySound - type: HTMLAudioElement. (see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
				   description: This object will be played whenever the player reaches
				   the water in the frogger game.

13. objectLocations - type: array <array<int>>.
					  description: objectLocations contains the possible locations where
					  all collectible and obstacle objects can spawn within the canvas.
---------------------------------------------------------------------------------------------
PARENT CLASS: NONE
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/
/*************************************
CONSTRUCTOR
Parameters: NONE

************************************/

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

/*********************************************************************************************
											METHODS
/*******************************************************************************************/


/****************************************************
NAME: createEnemies
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: populates the allEnemies property
             of the Game instance with three
             Enemy objects. A variable of 0
             is used as an argument for each
             enemy constructor. This is done so
             that the enemy will appear at the x-coord
             of 0, in the canvas.
****************************************************/


Game.prototype.createEnemies = function(){
	var x = 0;
	this.allEnemies.push(new Enemy(x, this.enemyLane_1, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_2, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
	this.allEnemies.push(new Enemy(x, this.enemyLane_3, Math.random()*(this.level+100 - this.level*0.70) + this.level*0.70));
}

/*******************************************************
NAME: reset
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: this will resume the game, after the flag
             paused would be set to true. paused will
             be resetted to false, the player object
             will be respawn at it's initial position,
             new enemies, collectibles, and obstacles
			 will be created. This is used by engine.js
			 to handle the stop/start state of the game.
**********************************************************/

Game.prototype.reset = function(){

	this.paused = false;

	this.player.reset();
	this.allEnemies = new Array();
	this.generateObstacles();
	this.generateCollectibles();
	this.createEnemies();
}

/*******************************************************
NAME: restart
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: re-initalizes the game instance. used
             when the game is lost (player.lives < 0);
**********************************************************/

Game.prototype.restart = function(){
	game = new Game();
}


/*******************************************************
NAME: win
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: this function will change the player sprite,
             move it upwards to compensate for the difference
             in size of the sprites, increase the player score
             by 10, repopulate the allEnemies array, and increase
             the speed of the enemies. Also, it will set the pause
             flag to true, and play a "water splash" sound.
**********************************************************/

Game.prototype.win = function(){
	this.player.y = 50;
	this.victorySound.play();
	this.player.score += 10;
	this.increaseDifficulty();
	this.allEnemies = new Array();
	this.player.sprite = "images/animations/"+this.player.character+"-victory.png";
	this.paused = true;

}


/*******************************************************
NAME: increaseDifficulty
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: used when player.win is called. It increases
			 the level property, making the enemies travel
			 faster along the canvas. It will also create
			 a new instance of the allEnemies collection
			 and repopulate with three new enemies.
**********************************************************/

Game.prototype.increaseDifficulty = function(){
	this.level += this.growthFactor;
	this.allEnemies = new Array();
	this.createEnemies();


}

/**********************************************************
NAME: render
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: Only used to show the lives
			 and score of the player in a game.
**********************************************************/
Game.prototype.render = function(){
	ctx.font = "30px Georgia";
	ctx.fillStyle="white";
	ctx.fillText("score: "+this.player.score, 20, 570);
	ctx.fillStyle="white";
	ctx.fillText("x "+this.player.lives, 450,570);

}

/*******************************************************
NAME: generateCollectibles
PARAMETERS: NONE.
RETURNS: NOTHING.
DESCRIPTION: Creates new instances of collectibles and
			 populates the collectibles property. It will
			 set the location of these collectibles by
			 randomly choosing one of the locations specified
			 in the objectsLocation poperty. IMPORTANT - PLEASE
			 SEE OBSERVATION

OBSERVATION: This method utilizes a searching algorithm to
			 select which collectibles to show in the canvas.
			 it will always create 4 collectible objects,
			 however only one will be pushed into the
			 collectibles property. The way it works
			 is by using a cumulative density function which will
			 store the cumulative sum of all collectible weights
			  in the array, then perform a binary search algorithm
			  to search for an item's weight closest to a
			  generated random number.

			  ALSO, PLEASE NOTE that there is a 50% chance
			  of a collectible appearing in the game (
			  set by a random number between 1 and 2)

**********************************************************/

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

/***********************************************************
NAME: weightsCDF
PARAMETERS: array <Collectible>.
RETURNS: array <numbers>
DESCRIPTION: Used in conjuction with generateCollectibles.
			 it creates a new array consisting of the cumulative
			 sum of the collectibles weights.

************************************************************/


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

/****************************************************************
NAME: weightsBisection
PARAMETERS: array <Collectible>, array<numbers>
RETURNS: number (integer);
DESCRIPTION: Used in conjuction with generateCollectibles.
			 It creates a random number between 0 and the value
			 of the last element inside it's second argument (weights).
			 then, it returns the index which hold values (in
			 collectibles.weight and weights) that "sandwich" the value
			 in rand.
******************************************************************/
Game.prototype.weightsBisection = function(collectibles, weights){
	var rand = Math.floor(Math.random()*(weights[weights.length-1] - 0) + 0);
	if(rand < weights[0])
		return 0;
	for(var i=1; i<collectibles.length; i++){
		if(rand > collectibles[i].weight && rand < weights[i]){
			return i;
		}

	}

}


/***********************************************************
NAME: renderCollectibles
PARAMETERS: NONE
RETURNS: NOTHING
DESCRIPTION: renders every collectibles stored in the collectibles
			 property

************************************************************/
Game.prototype.renderCollectibles = function(){
	for(var i=0; i<this.collectibles.length; i++){
		this.collectibles[i].render();
	}
}






/***********************************************************
NAME: generateObstacles
PARAMETERS: NONE
RETURNS: NOTHING.
DESCRIPTION: This will populate the obstacles property
             of the game. When the level property is
             greater than 120, up to 2 obstacles will
             be generated, and up to 4 when it's above
             300.


************************************************************/
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

/***********************************************************
NAME: obstaclesGenerator
PARAMETERS: Number (integer)
RETURNS: NOTHING.
DESCRIPTION: used in conjuction with the generateObstacles method.
			 Actual populating work is done here, creating the
			 number of obstacles specified in the generateObstacles
			 method. A random location is also selected form the
			 objectsLoctaion property for each obstacle.


************************************************************/
Game.prototype.obstaclesGenerator = function(num){
	for(var i=0; i < num; i++){
			var loc = Math.floor(Math.random()*this.objectsLocations.length);
			this.obstacles.push(new Obstacle(this.objectsLocations[loc]));
		}
}


/***********************************************************
NAME: renderObstacles
PARAMETERS: NONE
RETURNS: NOTHING.
DESCRIPTION: Renders every obstacle contained within
			 the obstacles property.


************************************************************/
Game.prototype.renderObstacles = function(){
	for(var i =0; i < this.obstacles.length; i++){
		this.obstacles[i].render();
	}

}


/***********************************************************************************
										CLASS: Enemy
------------------------------------------------------------------------------------
DESCRIPTION:
An enemy represents a moving obstacle in the game. These enemies will show up as
cars, moving at varying speeds. Said speed increments by a random  magnitude as the
player reaches the water.
------------------------------------------------------------------------------------

PROPERTIES:
1.sprite - type: String
	       description: represents the path to the image, used to represent the enemy in
	       the canvas.

2. x - 	type: Number
		description: the x coordinate of the enemy in the canvas

3. y - type: Number
	   description: the y coordinate of the enemy in the canvas

4. speed - type: Number
		   description: the rate at which the enemy will move throughout
		   the canvas.



---------------------------------------------------------------------------------------------
PARENT CLASS: NONE
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/

/*******************************************************
CONSTRUCTOR
Parameters: x and y coordinates, speed of the new enemy.

*******************************************************/

var Enemy = function(x, y, speed) {

    this.sprite = 'images/PixelCar.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};


/*********************************************************************************************
											METHODS
/*******************************************************************************************/

/***************************************************************************
NAME: update
PARAMETERS: timeDelta (number)
RETURNS: NOTHING.
DESCRIPTION: Updates the enemy location in the canvas. If the enemy
             moves out of the canvas, it will reset it's position.
             If the enemy encounters the player, it kills the player (>:-}).

OBSERVATION: The difference between each respective x and y coordinate was the only
			 metric used when implementing the collision between player/vehicle.
			 Although it works in this case, a more robust and scalable implementation
			 should be used for this situation, allowing different sized
			 sprites. Perhaps another canvas element? bounding boxes?
****************************************************************************/
Enemy.prototype.update = function(dt) {

    	this.x += this.speed * dt;

    	if(this.x >= ctx.canvas.width){
    		this.x = -180;
    	}

	    var diffx = this.x - game.player.x;
    	var diffy = Math.abs(this.y - game.player.y);

    	if((diffy < 40 && diffy > 0)&&((diffx<0 && diffx >-155)|| (diffx>0 && diffx<40))){
    		game.player.die();
    	}



};

/***************************************************************************
NAME: render
PARAMETERS: NONE
RETURNS: NOTHING.
DESCRIPTION: Draws the enemy object in the canvas.
****************************************************************************/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



/***********************************************************************************
										CLASS: Player
------------------------------------------------------------------------------------
DESCRIPTION:
A player represents user in the game, whose purpose is to reach the upper row of
the canvas.
------------------------------------------------------------------------------------

PROPERTIES:
1- xspeed: type: Number
		   description: the rate at which the player moves through the x axis

2. yspeed: type: Number
		   description:  the rate at which the player moves through the y axis

3. lives: type: Number
		  description: the number of tries a user has left before being before
		  restarting the game

4. score: type: Number
		  description: the score a player has achieved throughout the game instance.
		  It is restarted everytime player loses. It is affected not only by the player
		  reaching the uppermost tile, but also by the amount and type of collectibles
		  he gets.

5. character: type: String
			  description: the character the player has selected as his avatar.
			  Positional and animated images will change as well.

6. deadSound: type: HTMLAudioElement. (see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
			  description: Plays when the player is hit by an enemy.

7. grassSound: type: HTMLAudioElement. (see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
 			   description: Plays when the player makes a move.

---------------------------------------------------------------------------------------------
PARENT CLASS: NONE
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/

/*******************************************************
CONSTRUCTOR
Parameters: NONE.

*******************************************************/
var Player = function() {
	this.xspeed = 101;
	this.yspeed = 83;
	this.lives = 2;
	this.score = 0;
	this.character = "boy";
	this.reset();
	this.deadSound = new Audio("sounds/splat.mp3");
	this.grassStep = new Audio("sounds/footstep-grass.wav");
}


/*********************************************************************************************
											METHODS
/*******************************************************************************************/

/***************************************************************************
NAME: update
PARAMETERS: NONE
RETURNS: NOTHING.
DESCRIPTION: Checks if the player has reached the upper row of tiles.
			 If so, then it increases the game difficulty.
****************************************************************************/

Player.prototype.update = function(){

		if(this.y < 88){
			console.log(this.y);
			game.win();
		}


}

/***************************************************************************
NAME: render
PARAMETERS: NONE
RETURNS: NOTHING.
DESCRIPTION: draws the player in the canvas element.
****************************************************************************/

Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/***************************************************************************
NAME: handleInput
PARAMETERS: number (integer)
RETURNS: NOTHING.
DESCRIPTION: takes the key input by the user and moves the character
			 accordingly (right, left, up, and down). Also, changes
			 the character sprite according to the direction where
			 it is moving. A character will only move if the isBlocked
			 method returns true.
****************************************************************************/

Player.prototype.handleInput = function(code){
	this.grassStep.play();
		switch(code) {
			case 'left':
				if(this.x > 0 && this.isBlocked('left')){
					this.changeDirection("left");
					this.x -= this.xspeed;

				}
				break;
			case 'up':
				if(this.isBlocked('up')){
					this.changeDirection("up");
					this.y -= this.yspeed;

				}
				break;
			case 'right':
				if(this.x < 402 && this.isBlocked('right')){
					this.changeDirection("right");
					this.x += this.xspeed
				}
				break;
			case 'down':
				if(this.y < 380 && this.isBlocked('down')){
					this.changeDirection("down");
					this.y += this.yspeed;
				}
				break;

		}

	}
/***************************************************************************
NAME: changeDirection
PARAMETERS: String
RETURNS: NOTHING.
DESCRIPTION: Changes the character sprite according to the direction specified.
****************************************************************************/

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

/***************************************************************************
NAME: isBlocked
PARAMETERS: String
RETURNS: Boolean.
DESCRIPTION: Checks if the player has an immediate obstacle next to him.
			 If the direction specified encounters an obstacle within the specified
			 x and y range, it will return false; true until proven false.
****************************************************************************/


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

/***************************************************************************
NAME: reset
PARAMETERS: NOTHING
RETURNS: NONE.
DESCRIPTION: Resets the character sprite, and spawns the player at position 0,420
			 in the canvas.
****************************************************************************/


Player.prototype.reset = function(){
		this.sprite = "images/animations/move-up/"+this.character+"-up.png";
		this.x = 0;
		this.y = 420;
}


/***************************************************************************
NAME: die
PARAMETERS: NOTHING
RETURNS: NONE.
DESCRIPTION: Temporarily changes the character sprite, reduces the player lives
			 and sets the paused flag to true. This flag is used by engine.js
			 to create a delay between each round played in the game.
****************************************************************************/


Player.prototype.die = function() {
	this.deadSound.play();
	this.sprite ="images/animations/"+this.character+"-dead.png";
	this.lives--;
	game.paused = true;

}

/***********************************************************************************
										CLASS: Obstacle
------------------------------------------------------------------------------------
DESCRIPTION:
An Obstacle is a static obstacle that will keep the player moving to a certain location
in the canvas. Obstacle may appear randomly within the game, between 1 and 4 at a time.
------------------------------------------------------------------------------------

PROPERTIES:
1. sprite - type: String
			description: the path to the used image.

2. x - type: number
	   description: location of the obstacle along the x-axis of the canvas

3. y - type: number
	   description: location of the obstacle along the y-axis of the canvas


---------------------------------------------------------------------------------------------
PARENT CLASS: NONE
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/

/*******************************************************
CONSTRUCTOR
Parameters: array<numbers>.

*******************************************************/


var Obstacle = function(coord){
	this.sprite = "images/Rock.png";
	this.x = coord[0];
	this.y = coord[1];
}


/*********************************************************************************************
											METHODS
/*******************************************************************************************/

/***************************************************************************
NAME: render
PARAMETERS: NOTHING
RETURNS: NONE.
DESCRIPTION: draws the obstacle in the canvas
****************************************************************************/

Obstacle.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

}

/*******************************************************************************************
										CLASS: Collectible
------------------------------------------------------------------------------------
DESCRIPTION:
Any object which changes the player score, or lives is a collectible.
------------------------------------------------------------------------------------

PROPERTIES:
 1. x - type: number
 	    description: the location of the collectible along the x-axis of the canvas

 2. y - type: number
 	    description: the location of the collectible along the y-axis of the canvas

 3. sprite - the path to the image used by the collectible

 4. type - the type of the collectible. Currently, there are only two types: health and scoreboost.
           A health collectible affects the player lives, while the scoreboost increases the player
           score.

 5. value - the numeric value by which the collectible affects the player, depending on its type.

---------------------------------------------------------------------------------------------
PARENT CLASS: NONE
---------------------------------------------------------------------------------------------
SUBCLASSES: Heart, Apple, Berry, Banana.
---------------------------------------------------------------------------------------------
OBSERVATIONS:
All collectibles have weights. The higher the weight, the higher the chance of a collectible
appearing in the game. Most valuable collectibles have a lower weight, meaning they won't appear
as often. However, encountering them and grabbing them will increase your score making the game
more interesting :).
*********************************************************************************************/

/*******************************************************
CONSTRUCTOR
Parameters: number, number, string, string, number

*******************************************************/

var Collectible = function(x, y, sprite, type, value){
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.type = type;
	this.value = value;


}

/*********************************************************************************************
											METHODS
/*******************************************************************************************/


/***************************************************************************
NAME: update
PARAMETERS: NOTHING
RETURNS: NONE.
DESCRIPTION: Checks if the player has reached it's tile (within a defined range),
			 and changes the player attributes accordingly (by its type).

OBSERVATION:  Same observation as with vehicles, a more robust collision method
			  is required.
****************************************************************************/

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


/***************************************************************************
NAME: render
PARAMETERS: NOTHING
RETURNS: NONE.
DESCRIPTION: Draws the collectible in the canvas
****************************************************************************/

Collectible.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*******************************************************************************************
										CLASS: Heart
------------------------------------------------------------------------------------
DESCRIPTION:
Increases the player lives by 1.
------------------------------------------------------------------------------------

PROPERTIES:
1. weight: represents the probability of this collectible appearing in the game.
		   With a current weight of 5, it is the item to appear the most.
---------------------------------------------------------------------------------------------
PARENT CLASS: Collectible
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/


/*******************************************************
CONSTRUCTOR
Parameters: array <number>

*******************************************************/

var Heart = function(coord){
	//Collectible.call(this, coord[0], coord[1], 'images/Heart.png', "health", 1);
	Collectible.call(this, coord[0], coord[1], 'images/Heart.png', "health", 1);
	this.weight = 5;
	this.audio = new Audio('sounds/mushroom-effect.mp3');

}

Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Collectible;

/*******************************************************************************************
										CLASS: Apple
------------------------------------------------------------------------------------
DESCRIPTION:
Increases the player score by 45 points.
------------------------------------------------------------------------------------

PROPERTIES:
1. weight: represents the probability of this collectible appearing in the game.
		   With a current weight of 2, it appears less times than a Heart, equal
		   amount of times as a Berry, but more often than a Banana.
---------------------------------------------------------------------------------------------
PARENT CLASS: Collectible
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/

/*******************************************************
CONSTRUCTOR
Parameters: array <number>

*******************************************************/

var Apple = function(coord){
	//Collectible.call(this, coord[0], coord[1], 'images/Gem Blue.png', "scoreBoost", 45);
	Collectible.call(this, coord[0], coord[1], 'images/fruits/apple.png', "scoreBoost", 45);
	this.weight = 2;
	this.audio = new Audio('sounds/tasty.mp3');
}


Apple.prototype = Object.create(Collectible.prototype);
Apple.prototype.constructor = Collectible;


/*******************************************************************************************
										CLASS: Berry
------------------------------------------------------------------------------------
DESCRIPTION:
Increases the player score by 90 points.
------------------------------------------------------------------------------------

PROPERTIES:
1. weight: represents the probability of this collectible appearing in the game.
		   With a current weight of 2, it appears less times than a Heart, equal
		   amount of times as an Apple, but more often than a Banana.
---------------------------------------------------------------------------------------------
PARENT CLASS: Collectible
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/


/*******************************************************
CONSTRUCTOR
Parameters: array <number>

*******************************************************/

var Berry = function(coord){

	//Collectible.call(this, coord[0], coord[1], 'images/Gem Green.png', "scoreBoost", 90);
	Collectible.call(this, coord[0], coord[1], 'images/fruits/whortleberry.png', "scoreBoost", 90);
	this.weight = 2;
	this.audio = new Audio('sounds/divine.mp3');
}

Berry.prototype = Object.create(Collectible.prototype);
Berry.prototype.constructor = Collectible;


/*******************************************************************************************
										CLASS: Banana
------------------------------------------------------------------------------------
DESCRIPTION:
Increases the player score by 250 points.
------------------------------------------------------------------------------------

PROPERTIES:
1. weight: represents the probability of this collectible appearing in the game.
		   With a current weight of 1, it is the item which is less likely to appear
		   in the game. However if you catch it, it will help you get a sick score.
---------------------------------------------------------------------------------------------
PARENT CLASS: Collectible
---------------------------------------------------------------------------------------------
SUBCLASSES: NONE
---------------------------------------------------------------------------------------------
*********************************************************************************************/


/*******************************************************
CONSTRUCTOR
Parameters: array <number>

*******************************************************/

var Banana = function(coord){
	Collectible.call(this, coord[0], coord[1], 'images/fruits/banana.png', "scoreBoost", 250);
	this.weight = 1;
	this.audio = new Audio('sounds/delicious.mp3');
}


Banana.prototype = Object.create(Collectible.prototype);
Banana.prototype.constructor = Collectible;





// Let the fun begin :)

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



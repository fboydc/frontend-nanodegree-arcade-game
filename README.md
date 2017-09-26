
# FROGGER ARCADE GAME
================================================================================

Frogger is an arcade game, originally developed by the Japanese company Konami. This is an implementation of the game itself,
using humans instead of frogs.

-------------------------------------------------------------------------------
## PLAYING INSTRUCTIONS
-------------------------------------------------------------------------------
The objective is simple, the player has to reach the uppermost tile row without being hit by the crossing vehicles. However, the game doesn't end there, as the game will reset with faster traveling vehicles everytime a player reaches the uppermost tile row. If the player is hit by a vehicle, he will lose a life. If the player is hit and has 0 lives, it's game over :(. It's all about your score, the more times you are able to reach the top, the more points you will add to your score. Some other interesting items
will appear in your game:

1. **Obstacle** - He will make your life impossible, You Shall Not Pass!

2. **Heart** - This item will grant you a new life. A lifesaver!

3. **Apple** - This item will increase your score by 45 points.

4. **Berry** - This item will increase your score by 90 points.

5. **Banana** - This is the jackpot! +250 points if you get this one.
			However, it's not easy to encounter. *DELICIOUS!!* (Sounds familiar?)


**Max Score** -  There is no max score set in the game, you can play infinitely. However,
			 crossing the stoned tiles will be a daunting task at those high speeds.


### WHAT HAPPENS IF I LOSE?
Your score is set to 0, lives to 2, and enemies will start moving slow again.


### WHY DON'T YOU SAVE MY SCORE?
unfortunately, there isn't any database set for this project. However I promise that in the future I will implement some serverside code to show who gets the higher score, once I upload it to my website. Maybe I will add more interesting animations? make the character walk? make some nicer sprites, add new characters? All of this is possible.

------------------------------------------------------------------------------
## HOW DO I RUN IT?
------------------------------------------------------------------------------

If you download the source code, it's simple: just double click on index.html and you are all set: your browser will open this file and start the game for you.

### Demo
Go [here](https://fboydc.github.io/frontend-nanodegree-arcade-game/) and check it out.




------------------------------------------------------------------------------
## BROWSER AND SYSTEM REQUIREMENTS
------------------------------------------------------------------------------
If your computer can run any of the following browsers, you should be fine:

1. Internet Explorer: Minimum Version: 9.0 or above.
2. Google Chrome.
3. Firefox.
4. Safari.
5. Opera.


--------------------------------------------------------------------------------
## TABLE OF CONTENTS
--------------------------------------------------------------------------------

### File Structure

root
	|
    |\css
    |	\
    |	 style.css
    |
    |\images
    |	\ ...
	|
 index.html
 	|
 	|\js
 	|	\
	|	app.js
	|	engine.js
	|	off-canvas-events.js
	|	resources.js
	|
 Readme.md
 	|
 	|\
 	| sounds
	|	\ ...



### Files Worth Mentioning


**images** - One of the only two files which contain all the resources. All images
		 	 and sprites used for the game are stored in this directory. Be very careful when changing file names and adding new ones, as the code is very specific with the way files are named.

**app.js** - This file contains all the class definitions and methods used in the game.
			 changes to entities in the game are to be done in this file.

**engine.js** - The magic happens here: requestAnimation loop is called in this file,
				along with all game updates and rendering.

**off-canvas-events.js** - The only reason for this file to exists, is to separate off-							  canvas code. All activity happening outside of the canvas
                           should be contained in this file.

**resources.js** - Since this is game relies heavily in image loading, this file helps
				   our browser cache images.

/**************************************************
AUTHOR: Felipe Boyd
DESCRIPTION:  The purpose of this file is to handle all off-canvas
			   events. So far there is only one.
***********************************************/

// Handles the player character selection, at the bottom of the application.
var images = document.getElementById("selector").childNodes;
images.forEach(function(value, index, array){
	console.log(images[index].nodeType);
	if(images[index].nodeType == 1){
		images[index].onclick = function(event){
			game.player.character= images[index].id;
			game.player.reset();
		}
	}
});
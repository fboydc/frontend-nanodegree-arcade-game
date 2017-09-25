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
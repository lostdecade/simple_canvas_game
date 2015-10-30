//key Codes
var upKey = 38;
var downKey = 40;
var leftKey = 37;
var rightKey = 39;

//length of game in seconds
//seconds to play the game
var gameTime = 20;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {

	//Move up unless they've reached the top of the canvas
	if (keysDown[upKey] && hero.y >= 0) {
		hero.y -= hero.speed * modifier;
	}

	//Move down unless they've reached the bottom of the canvas
	if (keysDown[downKey] && hero.y <= (canvas.height - 32)){ 
		hero.y += hero.speed * modifier;
	}

	//Move left unless they've reached the left edge of the canvas
	if (keysDown[leftKey] && hero.x >= 0 ) { 
		hero.x -= hero.speed * modifier;
	}

	//Move right unless they've reached the right edge of the canvas
	if (keysDown[rightKey] && hero.x <= (canvas.width - 32)) { 
		hero.x += hero.speed * modifier;
	}
	
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + monstersCaught, 32, 32);

	ctx.textAlign = "right";
	ctx.fillText(getTime(), canvas.width - 32, 32);
};


var getTime = function(){
	
	var thisTime = gameTime - ((Date.now() - startTime)/1000);
	
	if(thisTime < 0)
		thisTime = 0;

	return thisTime.toFixed(2);
}


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	if(now < endTime)
	{
		// Request to do this again ASAP
		requestAnimationFrame(main);
	}
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
var startTime = then;
var endTime = then + (gameTime * 1000);

reset();
main();

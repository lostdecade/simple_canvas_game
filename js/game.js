// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.id = "game-block";
document.getElementById('game-wrapper').appendChild(canvas);

// Time elapsed from start
var currentTime = new Date().getTime();
var elapsed, minutes, seconds;

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
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener(
	"keydown",
	function (e) {
		keysDown[e.keyCode] = true;
	},
	false
);

addEventListener(
	"keyup",
	function (e) {
		delete keysDown[e.keyCode];
	},
	false
);

// Reset the game when the player catches a monster
var reset = function () {
	// Place the monster somewhere on the screen randomly
	monster.x = Math.random() * (canvas.width - 80) + 32;
	monster.y = Math.random() * (canvas.height - 80) + 32;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && hero.y >= 32) {
		// Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y <= canvas.height - 65) {
		// Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x >= 32) {
		// Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x <= canvas.width - 65) {
		// Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= monster.x + 32 &&
		monster.x <= hero.x + 32 &&
		hero.y <= monster.y + 32 &&
		monster.y <= hero.y + 32
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
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "12px Arial";
	ctx.textAlign = "right";
	//ctx.fillText(minutes + "m " + seconds + "s ", canvas.width - 16, 16);
	//ctx.fillText("Goblins caught: " + monstersCaught, canvas.width - 16, canvas.height - 16);
	document.getElementById("score").innerHTML = monstersCaught + " Goblins";
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	// Find the elapsed time between now and start timestamp
	elapsed = now - currentTime;

	// Time calculations for minutes and seconds
	minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
	seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
	//var playedtime = ;
	document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
	w.requestAnimationFrame ||
	w.webkitRequestAnimationFrame ||
	w.msRequestAnimationFrame ||
	w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
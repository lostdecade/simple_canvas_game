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
	xspeed: 0, // movement in pixels per second
	yspeed:0,
	acc: 200,
	fric:800
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
	var f=0;
	hero.x+=hero.xspeed * modifier;
	hero.y+=hero.yspeed * modifier;
	if (38 in keysDown) { // Player holding up
		hero.yspeed -= hero.acc * modifier;
		f=1;
	}
	if (40 in keysDown) { // Player holding down
		hero.yspeed += hero.acc * modifier;
		f=1;
	}
	if (37 in keysDown) { // Player holding left
		hero.xspeed -= hero.acc * modifier;
		f=1;
	}
	if (39 in keysDown) { // Player holding right
		hero.xspeed += hero.acc * modifier;
		f=1;
	}
	if (f==0)
	{
		if (hero.xspeed>0)
			{
				if (hero.xspeed<hero.fric * modifier)
					hero.xspeed=0;
				else
					hero.xspeed-=hero.fric * modifier;
			}
		if (hero.yspeed>0)
		{
			if (hero.yspeed<hero.fric * modifier)
				hero.yspeed=0;
			else
			hero.yspeed-=hero.fric * modifier;
		}
		if (hero.xspeed<0)
		{
			if (hero.xspeed>-1*hero.fric * modifier)
				hero.xspeed=0;
			else
				hero.xspeed+=hero.fric * modifier;
		}	
		if (hero.yspeed<0)
		{
			if (hero.yspeed>-1*hero.fric * modifier)
				hero.yspeed=0;
			else
				hero.yspeed+=hero.fric * modifier;
		}	
	}
	if (hero.x<0)
	{
		hero.x=3;
		hero.xspeed=20;
	}

	if (hero.x>472)
	{
		hero.x=470;
		hero.xspeed=-20;
	}
	if (hero.y<0)
	{
		hero.y=3;
		hero.yspeed=-20;
	}
	if (hero.y>445)
	{
		hero.y=440;
		hero.yspeed=20;
	}
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		hero.xspeed=0;
		hero.yspeed=0;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y,40,40);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
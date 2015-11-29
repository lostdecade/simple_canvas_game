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

// Squirrel image
var squirrelReady = false;
var squirrelImage = new Image();
squirrelImage.onload = function () {
	squirrelReady = true;
};
squirrelImage.src = "images/squirrel.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var squirrel = {};

var monstersCaught = 0;
var monstersNum = 1;
var monster = [
    {'monsterName': 'monster1',
    'x' : 50,
    'y': 100
    }
];

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

    for (var i = 1; i <= monstersNum; i++) {
        console.log ("monster number = " + monstersNum)
        // Push monster x, y to array
        console.log ("i= " + i)
        monster.push([
            monster.x = 32 + (Math.random() * (canvas.width - 64)),
            monster.y = 32 + (Math.random() * (canvas.height - 64))
        ]);
        console.log("print array:  " + monster)
        console.log("print specific monster x coords:" + monster[i][1])
    }
monstersNum=monstersNum*2;
    
};


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
    for (var i = 0, len = monster.length; i < len; i++) {
        if (monsterReady) {
		ctx.drawImage(monsterImage, monster[i][0], monster[i][1]);
	   }
    }

	if (squirrelReady) {
		ctx.drawImage(squirrelImage, squirrel.x, squirrel.y);
	}

// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32)
    ctx.fillText("Goblins total: " + monstersNum, 32, 62);
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

// Are they touching?
    for (var i = 0, len = monster.length; i < len; i++) {
	if (
		hero.x <= (monster[i][0] + 32)
		&& monster[i][0] <= (hero.x + 32)
		&& hero.y <= (monster[i][1] + 32)
		&& monster[i][1] <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
    }
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

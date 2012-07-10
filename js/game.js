var Game, Hero, Monster;

//====================================================================================
//	GAME CLASS
//====================================================================================
Game = (function(win, doc){

	function Game() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 512;
		this.canvas.height = 480;
		this.monstersCaught = 0;
		this.keysDown = [];

		document.body.appendChild(this.canvas);

		return this;
	}

	function handleKeyDown(e) {
		this.keysDown[e.keyCode] = true;
	}

	function handleKeyUp(e) {
		delete this.keysDown[e.keyCode];
	}

	Game.prototype = {
		'init': function() {
			this.assetsReady = {
				'bgReady': false,
				'heroReady': false,
				'monsterReady': false
			};

			this.hero = new Hero();
			this.monster = new Monster()

			this.attachEvents();

			return this;
		},

		'attachEvents': function() {
			var that = this;

			addEventListener('keydown', function(e){ handleKeyDown.call(that, e); }, false);
			addEventListener('keyup', function(e){ handleKeyUp.call(that, e); }, false);
		},

		'loadAssets': function() {
			var that = this;

			this.bgImage = new Image();
				this.bgImage.onload = function() {
					that.assetsReady.bgReady = true;
				};

			this.heroImage = new Image();
				this.heroImage.onload = function() {
					that.assetsReady.heroReady = true;
				};

			this.monsterImage = new Image();
				this.monsterImage.onload = function() {
					that.assetsReady.monsterReady = true;
				};

			this.bgImage.src = 'images/background.png';
			this.heroImage.src = 'images/hero.png';
			this.monsterImage.src = 'images/monster.png';

			return this;
		},

		'reset': function() {
			this.hero.x = this.canvas.width / 2;
			this.hero.y = this.canvas.height / 2;

			// Throw the monster somewhere on the screen randomly
			this.monster.x = 32 + (Math.random() * (this.canvas.width - 64));
			this.monster.y = 32 + (Math.random() * (this.canvas.height - 64));

			return this;
		},

		'render': function() {
			if(this.assetsReady.bgReady) {
				this.ctx.drawImage(this.bgImage, 0, 0);
			}

			if(this.assetsReady.heroReady) {
				this.ctx.drawImage(this.heroImage, this.hero.x, this.hero.y);
			}

			if(this.assetsReady.monsterReady) {
				this.ctx.drawImage(this.monsterImage, this.monster.x, this.monster.y);
			}

			//Score
			this.ctx.fillStyle = 'rgb(250, 250, 250)';
			this.ctx.font = '24px Helvetica';
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.fillText('Goblins Caught: ' + this.monstersCaught, 32, 32);

			return this;
		},

		'update': function(modifier) {
			//Player is holding up
			if(38 in this.keysDown) {
				this.hero.y -= this.hero.speed * modifier;
			}

			//Player is holding down
			if(40 in this.keysDown) {
				this.hero.y += this.hero.speed * modifier;
			}

			//Player is holding left
			if(37 in this.keysDown) {
				this.hero.x -= this.hero.speed * modifier;
			}

			if(39 in this.keysDown) {
				this.hero.x += this.hero.speed * modifier;
			}

			//if the hero hit the left side
			if(this.hero.x/2 < 0) {
				this.hero.x = 0;
			}

			//if the hero hit the right side
			if(this.hero.x >= this.canvas.width - 32) {
				this.hero.x = this.canvas.width - 32;
			}

			//if hero hit the top
			if(this.hero.y <= 0) {
				this.hero.y = 0;
			}

			//if hero hit the bottom
			if(this.hero.y >= this.canvas.height - 32) {
				this.hero.y = this.canvas.height - 32;
			}

			//Are the hero and monsters touching?
			if (this.hero.x < (this.monster.x + 32) && this.monster.x < (this.hero.x + 32) && this.hero.y <= (this.monster.y + 32) && this.monster.y <= (this.hero.y + 32)) {
				++this.monstersCaught;
				this.reset();
			}

			return this;
		},

		'run': function() {
			var now = Date.now(), delta = now - this.then;

			this.update(delta / 1000);
			this.render();

			this.then = now;

			return this;
		}
	};

	return Game;

}(window, document));
//====================================================================================

//====================================================================================
//	HERO CLASS
//====================================================================================
Hero = (function(win, doc) {

	function Hero() {
		this.speed = 256;
		this.x = 0;
		this.y = 0;
	}

	Hero.prototype = {

	};

	return Hero;

}(window, document));
//====================================================================================

//====================================================================================
//	MONSTER CLASS
//====================================================================================
Monster = (function(win, doc) {

	function Monster() {
		this.x = 0;
		this.y = 0;
	}

	Monster.prototype = {

	};

	return Monster;

}(window, document));
//====================================================================================

var game = new Game().init().loadAssets().reset();
	game.then = Date.now();
setInterval(function() { game.run(); }, 1);
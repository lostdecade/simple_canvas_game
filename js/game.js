//====================================================================================
//	GAME CLASS
//====================================================================================
Game = (function(win, doc){

	/**
		@constructor
	*/
	function Game() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 512;
		this.canvas.height = 480;
		this.monstersCaught = 0;
		this.keysDown = [];
		this.images = {};
		this.assetsReady = {
			'bgImageReady': false,
			'heroImageReady': false,
			'monsterImageReady': false
		};


		document.body.appendChild(this.canvas);

		return this;
	}

	//-----------------------------------------------------------------------------------------------------
	//	PRIVATE METHODS
	//-----------------------------------------------------------------------------------------------------
	/**
		@function
		@description
	*/
	function handleKeyDown(e) {
		this.keysDown[e.keyCode] = true;
	}

	/**
		@function
		@description
	*/
	function handleKeyUp(e) {
		delete this.keysDown[e.keyCode];
	}
	//-----------------------------------------------------------------------------------------------------

	//-----------------------------------------------------------------------------------------------------
	//	EVENT HANDLERS
	//-----------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------


	//-----------------------------------------------------------------------------------------------------
	//	PUBLIC METHODS
	//-----------------------------------------------------------------------------------------------------
	Game.prototype = {
		/**
			@function
			@description
			@returns {Game}
		*/
		'init': function() {
			this.hero = new win.Game.Hero();
			this.monster = new win.Game.Monster();

			this.
				attachEvents().
				loadAssets({
					'bgImage': 'images/background.png',
					'heroImage': 'images/hero.png',
					'monsterImage': 'images/monster.png'
				}).
				reset();

			this.then = Date.now();

			return this;
		},

		/**
			@function
			@description
			@returns {Game}
		*/
		'attachEvents': function() {
			var that = this;

			addEventListener('keydown', function(e){ handleKeyDown.call(that, e); }, false);
			addEventListener('keyup', function(e){ handleKeyUp.call(that, e); }, false);

			return this;
		},

		/**
			@function
			@description
			@returns {Game}
		*/
		'loadAssets': function(assets) {
			var that = this;

			for(var asset in assets) {
				if(assets.hasOwnProperty(asset)) {
					(function(){
						var imageName = asset;
						that.images[asset] = new Image();
						that.images[asset].onload = function() { that.assetsReady[imageName + 'Ready'] = true; } ;
						that.images[asset].src = assets[asset];
					}());
				};
			}

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

		/**
			@function
			@description
			@returns {Game}
		*/
		'render': function() {
			if(this.assetsReady.bgImageReady) {
				this.ctx.drawImage(this.images.bgImage, 0, 0);
			}

			if(this.assetsReady.heroImageReady) {
				this.ctx.drawImage(this.images.heroImage, this.hero.x, this.hero.y);
			}

			if(this.assetsReady.monsterImageReady) {
				this.ctx.drawImage(this.images.monsterImage, this.monster.x, this.monster.y);
			}

			//Score
			this.ctx.fillStyle = 'rgb(250, 250, 250)';
			this.ctx.font = '24px Helvetica';
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.fillText('Goblins Caught: ' + this.monstersCaught, 32, 32);

			return this;
		},

		/**
			@function
			@description
			@returns {Game}
		*/
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

		/**
			@function
			@description
			@returns {Game}
		*/
		'run': function() {
			var now = Date.now(), delta = now - this.then;

			this.update(delta / 1000);
			this.render();

			this.then = now;

			return this;
		}
	};
	//-----------------------------------------------------------------------------------------------------

	return new Game();

}(window, document));
//====================================================================================
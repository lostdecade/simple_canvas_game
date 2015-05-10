"use strict";

class Game {
  constructor(){
    this.Canvas = document.createElement('canvas');
    this.Context = this.Canvas.getContext("2d");

    this.IMG = {
      Hero: new Image(),
      Monster: new Image(),
      BG: new Image()
    };

    this.IMG.Hero.src = "images/hero.png";
    this.IMG.Monster.src = "images/monster.png";
    this.IMG.BG.src = "images/background.png";

    this.Canvas.width = 512;
    this.Canvas.height = 480;

    this.Count = 0;
    this.Hero = {speed: 256, x:0, y:0};
    this.Monster = {x: 0, y:0};

    this.KeysDown = {};
    this.Diff = null;

    document.body.appendChild(this.Canvas);
  }
  Listen(){
    let KeysDown = this.KeysDown;
    document.addEventListener('keydown', function(e){
      KeysDown[e.keyCode] = true;
    });
    document.addEventListener('keyup', function(e){
      delete KeysDown[e.which];
    });
  }
  Reset(){
    this.Hero.x = this.Canvas.width / 2;
    this.Hero.y = this.Canvas.height / 2;

    // Spawn the Monster at a random place
    this.Monster.x = Math.floor(Math.random() * this.Canvas.width / 2) + 1;
    this.Monster.y = Math.floor(Math.random() * this.Canvas.height / 2) + 1;
  }
  Update(TimeDiff){
    if (38 in this.KeysDown) { // Player holding up
      this.Hero.y -= this.Hero.speed * TimeDiff;
    }
    if (40 in this.KeysDown) { // Player holding down
      this.Hero.y += this.Hero.speed * TimeDiff;
    }
    if (37 in this.KeysDown) { // Player holding left
      this.Hero.x -= this.Hero.speed * TimeDiff;
    }
    if (39 in this.KeysDown) { // Player holding right
      this.Hero.x += this.Hero.speed * TimeDiff;
    }
    if(this.Hero.y < 1){ // Disallow going too Up
      this.Hero.y = 1;
    }
    if(this.Hero.x < 1){ // Disallow going too Left
      this.Hero.x = 1;
    }
    if(this.Hero.x > this.Canvas.width - 36){ // Disallow going too Right
      this.Hero.x = this.Canvas.width - 36;
    }
    if(this.Hero.y > this.Canvas.height - 36){ // Disallow going too Down
      this.Hero.y = this.Canvas.height - 36;
    }

    // Check if they both are on the same square
    if (
      this.Hero.x <= (this.Monster.x + 32)
      && this.Monster.x <= (this.Hero.x + 32)
      && this.Hero.y <= (this.Monster.y + 32)
      && this.Monster.y <= (this.Hero.y + 32)
    ) {
      ++this.Count;
      this.Reset();
    }
  }
  Render(){
    this.Context.drawImage(this.IMG.BG, 0, 0);
    this.Context.drawImage(this.IMG.Hero, this.Hero.x, this.Hero.y);
    this.Context.drawImage(this.IMG.Monster, this.Monster.x, this.Monster.y);
    this.Context.fillStyle = "rgb(250, 250, 250)";
    this.Context.font = "20px Helvetica";
    this.Context.textAlign = "left";
    this.Context.textBaseline = "top";
    this.Context.fillText("Score: " + this.Count, 32, 32);
  }
  Start(){
    var Now = Date.now();
    this.Update( (Now - this.Diff) / 1000);
    this.Render();
    this.Diff = Now;
    requestAnimationFrame(this.Start.bind(this));
  }
}

let TheGame = new Game();
TheGame.Listen();
TheGame.Start();
"use strict";

class Game extends EventEmitter{
  constructor(){
    this.Canvas = document.createElement('canvas');
    this.I = {
      Hero: document.createElement('img'),
      Monster: document.createElement('img'),
      BG: document.createElement('img')
    };
    this.I.Hero.src = "images/hero.png";
    this.I.Monster.src = "images/monster.png";
    this.I.BG.src = "images/background.png";

    this.Canvas.width = 512;
    this.Canvas.height = 480;
  }
}
//create a canvas
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d");
canvas.width=512;
canvas.height=480;
document.body.appendChild(canvas);

//background image
var bgReady=false;
var bgImg=new Image();
bgImg.onload=function(){
	bgReady=true;
}
bgImg.src="images/background.png";

//hero image
var heroReady=false;
var heroImg=new Image();
heroImg.onload=function(){
	heroReady=true;
}
heroImg.src="images/hero.png";

//monster image
var monsterReady=false;
var monsterImg=new Image();
monsterImg.onload=function(){
	monsterReady=true;
}
monsterImg.src="images/monster.png";

//game object
var hero={
	speed:256
}
var monster={};
var monstersCatch=0;
var keydown={};

addEventListener("keydown",function(e){
    keydown[e.keyCode]=true;
},false);

addEventListener("keyup",function(e){
    delete keydown[e.keyCode];
},false);

//这块有所改变使英雄重置后位置不变
hero.x=canvas.width/2;
hero.y=canvas.height/2;
var reset=function(){
	hero.x=hero.x;
	hero.y= hero.y;
	monster.x=32+(Math.random()*(canvas.width-64));
	monster.y=32+(Math.random()*(canvas.height-64));

}
//update函数增加了限制，使hero保持的游戏图案里
var update=function(modifier){
	if(38 in keydown){
		hero.y -=hero.speed*modifier;
	}
	if (hero.y<32) {
		hero.y=32;
	};
	if(40 in keydown) {
		hero.y +=hero.speed*modifier;
	};
	if(hero.y>canvas.height-64){
       hero.y=canvas.height-64;
	}
	if(37 in keydown) {
		hero.x  -=hero.speed*modifier;
	}
	if(hero.x<32){
         hero.x=32;
    }
	if(39 in keydown){
		hero.x +=hero.speed*modifier;
	}
	if (hero.x>canvas.width-64) {
		hero.x=canvas.width-64;
	};

	//are you touch
	if (
		hero.x<=(monster.x+32)
		&&monster.x<=(hero.x+32)
		&&hero.y<=(monster.y+32)
		&&monster.y<=(hero.y+32)
		) {
		
	    ++monstersCatch;
	    reset();
	};

}

var render=function(){
	if (bgReady) {
		ctx.drawImage(bgImg,0,0)
	}
	if (heroReady){
		ctx.drawImage(heroImg,hero.x,hero.y);
	}
	if (monster) {
		ctx.drawImage(monsterImg,monster.x,monster.y);
	}
	//score
	ctx.fillstyle="rgb(250,250,250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign="left";
	ctx.textBaseline="top";
	ctx.fillText("Goblins caught:"+monstersCatch,32,32);
}

var main=function(){
    var now=Date.now();
    var delta=now-then;
    update(delta/1000);
    render();
    then=now;
    requestAnimationFrame(main);	
}

//requestAnimationFrame
var w=window;
requestAnimationFrame=w.requestAnimationFrame||w.webkitRequestAnimationFrame||w.msRequestAnimationFrame||w.mozRequestAnimationFrame;
var then=Date.now();
reset();
main();













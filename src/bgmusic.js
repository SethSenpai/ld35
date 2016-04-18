/// <reference path="../third-party/phaser.d.ts"/>
var DEBUG = false;
var WIDTH = 62;
var HEIGHT = 52;


var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var mPause = false;
var buttonMenu;
var music;

function preload() { 
 
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.spritesheet('muteButton' , 'sprites/mute_button.png' , 62 , 52);
}

function create() {
  
  this.stage.disableVisibilityChange = true;
  buttonMenu = game.add.button(0, 0, "muteButton", musicMute, this, 0, 0, 0);
  
  // Add music
  music = game.add.audio('music',1.0,true,true);
  //music.volume = 1.0;
  music.play();
  //music.loop = true;

}

function update() {
	
 
  }
  
  function musicMute () {
    if(mPause == false)
	{
		music.volume = 0.0;
		mPause = true;
		buttonMenu.setFrames(1, 1, 1);
	}
	else
	{
		music.volume = 1.0;
		mPause = false;
		buttonMenu.setFrames(0, 0, 0);
	}
	
  }

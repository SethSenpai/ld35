/// <reference path="../third-party/phaser.d.ts"/>
var DEBUG = false;
var WIDTH = 0;
var HEIGHT = 0;


var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});



function preload() { 
 
  game.load.audio('music', 'sfx/bg_music.ogg');
 
}

function create() {
  
  this.stage.disableVisibilityChange = true;
  
  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();
  music.loop = true;
}

function update() {
	
 
  }

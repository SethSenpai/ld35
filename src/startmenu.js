/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;
var FONT = 'bebas';

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var stage;
var player;
var recepticle;
var target;
//var editor = Editor();
var membranes = [];
var startPosition;

var won = false;
var bounceCount = 0;
var timer;
var bar;
var scoreDrawn = false;
var scoreBoardTextLarge;
var scoreBoardText;
var styleBoard;
var styleBoardLarge;
var filter;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  
  game.load.shader('bac_background', 'shader/background.frag');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('finish', 'sfx/finish.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  
  game.load.spritesheet('playButton', 'sprites/play_button.png' , 230 , 86);
  game.load.spritesheet('replayButton' , 'sprites/replay_button.png' , 314 , 86);

}

function create() {
   
  //shader for background
  filter = new Phaser.Filter(game, 1000, game.cache.getShader('bac_background'));
  filter.addToWorld(0, 0, 1280, 720);

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  // Add main 'player' molecule
  /*player = stage.create(level.start.x, level.start.y, 'water');
  game.physics.p2.enableBody(player, DEBUG);
  player.body.clearShapes();
  player.body.loadPolygon('water-data', 'water_molecule_small');*/

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();
  
  // Make buttons
  var buttonNext = game.add.button(WIDTH/2-115,100 , "playButton" , playLevel , this, 1 , 0 , 2 );
}
 
function update() {
	
  //upate filter for background dynamics
   filter.update();
}

function playLevel(){
	location.replace("play.html");
}
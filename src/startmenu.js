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
var editor = Editor();
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
var sfx;
var thing

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  
  game.load.shader('bac_background', 'shader/background.frag');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('membrane-down', 'sfx/press_down.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  
  game.load.spritesheet('playButton', 'sprites/play_button.png' , 230 , 86);
  game.load.spritesheet('creditsButton' , 'sprites/credits_button.png' , 333 , 86);
  game.load.spritesheet('loadButton' , 'sprites/load_button.png' , 240 , 86);

}

function create() {
  
   
  //shader for background
  filter = new Phaser.Filter(game, 1000, game.cache.getShader('bac_background'));
  filter.addToWorld(0, 0, 1280, 720);
 
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;
  molecule = game.add.physicsGroup(Phaser.Physics.P2JS);
  thing = molecule.create(1000,350, 'water');
  thing.body.clearShapes();
  thing.body.loadPolygon('water-data', 'water_molecule_small');
  thing.body.damping = 0;
  thing.body.angle = Math.floor(Math.random()*360);
  thing.body.thrust(6000);
  
  
  
  //credits things
  bar = game.add.graphics();
  styleBoardLarge = {font: "86px bebas", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  styleBoard = {font: "34px bebaslight", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();
  
  sfx = game.add.audio('membrane-down');
  sfx.volume = 1.0;
  
  // Make buttons
  var buttonNext = game.add.button(WIDTH/2-500,100 , "playButton" , playLevel , this, 1 , 0 , 2 );
  buttonNext.onInputOver.add(overButton, this);
  var buttonCredits = game.add.button(WIDTH/2-500,300 , "creditsButton" , showCredits , this, 1 , 0 , 2 );
  buttonCredits.onInputOver.add(overButton, this);
  var buttonLoad = game.add.button(WIDTH/2-500,200 , "loadButton" , loadLevel , this, 1 , 0 , 2 );
  buttonLoad.onInputOver.add(overButton, this);
}
 
function update() {
	
  //upate filter for background dynamics
   filter.update();

}
function overButton(){
	sfx.play();
	
}

function playLevel(){
	location.replace("play.html");
}

function showCredits(){
	//code here
}

function loadLevel(){
	 var area;

      popup.innerHTML = '<textarea cols=80 rows=25></textarea><p style="font-size:24px">Paste your level-data and press ENTER!';
      popup.style.display = 'block';
      popup.onclick = function () {
      popup.style.display = 'none';
      };

      area = popup.childNodes[0];
      area.addEventListener('keyup', function (e) {
        if (e.keyCode == 13) {
          try {
            var json = JSON.parse(area.value);
            utils.store('level', json);
            location.replace("play.html");
          } catch (e) {
            alert('invalid json');
          }
        }
      });
      area.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      area.focus();
}
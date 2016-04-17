/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;
var FONT = 'Jockey One';

WebFontConfig = {
  // From http://phaser.io/examples/v2/text/google-webfonts :
  // 'active' means all requested fonts have finished loading
  // We set a 1 second delay before calling 'createText'.
  // For some reason if we don't the browser cannot render the text the first time it's created.
  /*
  active: function () {
    game.time.events.add(Phaser.Timer.SECOND, createText, this);
  },
  */

  // The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: [FONT]
  }
};

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
var membrane;

var won = false;
var bounceCount = 0;
var timer;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('recepticle', 'sprites/recepticle_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('finish', 'sfx/finish.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  game.load.physics('recepticle-data', 'sprites/recepticle_small.json');

  game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  
  Membrane.preload(game);
  editor.preload(game);
}

function create() {
  var level = LEVEL.ONE;
  var image = game.make.image(0, 0, 'background');
  var win = game.add.audio('finish');

  stage = game.add.group();

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  stage.add(image);

  membrane = Membrane.create(game, stage, level);
  
  //create timer
  timer = game.time.create(false);
  //start time. can be put somewhere else later when the level starts etc
  timer.start();
  
  //Text display
  var style = {font: "24px Arial", fill: "#fff"};
  scoreText = game.add.text(10,10, "Bounces: " + bounceCount , style);
  timeText = game.add.text(10,35, "Time: " + timer.duration, style);

  // Add main 'player' molecule
  player = stage.create(level.start.x, level.start.y, 'water');
  game.physics.p2.enableBody(player, DEBUG);
  player.body.clearShapes();
  player.body.loadPolygon('water-data', 'water_molecule_small');

  // Add recepticle
  recepticle = stage.create(level.end.x, level.end.y, 'recepticle');
  game.physics.p2.enableBody(recepticle, DEBUG);
  recepticle.body.clearShapes();
  recepticle.body.loadPolygon('recepticle-data', 'recepticle_small');
  recepticle.body.static = true;

  // Add final target
  target = game.add.graphics(level.end.x - 10, level.end.y);
  game.physics.p2.enableBody(target, DEBUG);
  target.body.addCircle(10);
  target.body.static = true;

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();

  // Handle special collisions
  game.physics.p2.setPostBroadphaseCallback(function (a, b) {
    if (utils.equalPairs(a, b, player.body, target.body)) {
      if (!won) {
        win.play();
        won = true;
      }
      return false;
    }
    return true;
  });

  editor.create(game, stage);
}

function update() {
	
  // Update scoreboard
  if(won != true){
  scoreText.text = "Bounces: " + bounceCount;
  timeText.text = "Time: " + (timer.ms/1000).toFixed(2);
  }
  else
  {
	  //display winning text and ui
  }
  
  // Accelerate player to recepticle
  var factor = 60;
  var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
  player.body.rotation = angle + game.math.degToRad(90);
  player.body.force.x = Math.cos(angle) * factor;
  player.body.force.y = Math.sin(angle) * factor;
}
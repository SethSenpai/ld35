/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var stage;
var player;
var recepticle;
var target;

var won = false;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('recepticle', 'sprites/recepticle_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('finish', 'sfx/finish.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  game.load.physics('recepticle-data', 'sprites/recepticle_small.json');
  
  Membrane.preload(game);
}

function create() {
  var level = LEVEL.ONE;
  var image = game.make.image(0, 0, 'background');
  var win = game.add.audio('finish');

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  stage = game.add.group();

  stage.add(image);

  Membrane.create(game, stage, level);

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
  game.physics.p2.setPostBroadphaseCallback(function (a, b) {
    if ((a == player.body && b == target.body) || (a == target.body && b == player.body)) {
      if (!won) {
        win.play();
        won = true;
      }
      return false;
    }
    return true;
  }, this);

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();
}

function update() {

  // Accelerate player to recepticle
  var factor = 60;
  var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
  player.body.rotation = angle + game.math.degToRad(90);
  player.body.force.x = Math.cos(angle) * factor;
  player.body.force.y = Math.sin(angle) * factor;
}
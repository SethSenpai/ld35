/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var player;
var recepticle;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('recepticle', 'sprites/recepticle_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  game.load.physics('recepticle-data', 'sprites/recepticle_small.json');
  
  Membrane.preload(game);
}

function create() {
  var level = LEVEL.ONE;

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;
  //game.physics.p2.gravity.y = 500;
  
  game.add.image(0, 0, 'background');
  
  Membrane.create(game, level);
  
  // Add main 'player' molecule
  player = game.add.sprite(level.start.x, level.start.y, 'water');
  game.physics.p2.enableBody(player, DEBUG);
  player.body.clearShapes();
  player.body.loadPolygon('water-data', 'water_molecule_small');

  // Add recepticle
  recepticle = game.add.sprite(level.end.x, level.end.y, 'recepticle');
  game.physics.p2.enableBody(recepticle, DEBUG);
  recepticle.body.clearShapes();
  recepticle.body.loadPolygon('recepticle-data', 'recepticle_small');
  recepticle.body.static = true;
}

function update() {

  // Accelerate player to recepticle
  var factor = 60;
  var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
  player.body.rotation = angle + game.math.degToRad(90);
  player.body.force.x = Math.cos(angle) * factor;
  player.body.force.y = Math.sin(angle) * factor;
}
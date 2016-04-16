/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  
  Membrane.preload(game);
}

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.9;
  game.physics.p2.gravity.y = 500;
  
  game.add.image(0, 0, 'background');
  
  Membrane.create(game, LEVEL.ONE);
  
  // Add demo molecules
  var balls = game.add.physicsGroup(Phaser.Physics.P2JS);
  for (var i = 0; i < 20; i++) {
    var ball = balls.create(Math.random() * WIDTH, Math.random() * HEIGHT, 'water');
    
    game.physics.p2.enableBody(ball, true);
    
    ball.body.clearShapes();
    ball.body.loadPolygon('water-data', 'water_molecule_small');
  }
}

function update() {
}
/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;

var game = new Phaser.Game(800, 600, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var vertices = [
  [-70, -50],
  [-50, 50],
  [50, 50],
  [50, -70]
];

var filter;

function preload() {
  game.load.image('smile', 'img/smile.png');
  game.load.shader('test', 'shader/GlowFilter.js');
  }

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  
  game.physics.p2.restitution = 0.9;
  
  game.physics.p2.gravity.y = 500;
  
  filter = new Phaser.Filter(game , null , game.cache.getShader('test'));
  
  
  var balls = game.add.physicsGroup(Phaser.Physics.P2JS);
  
  for (var i = 0; i < 20; i++) {
    var ball = balls.create(Math.random() * 800, Math.random() * 600, 'smile');
    ball.body.setCircle(16);
  }
  
  var poly = new Phaser.Polygon();
  poly.setTo(vertices.reduce(function(a, b) {
    return a.concat(b);
  }, []));
  
  var graphics = game.add.graphics(200, 500);
  
  graphics.beginFill(0xFFFFFF,0.5);  
  graphics.lineStyle(3 , 0xFFFFFF , 1)
  graphics.drawPolygon(poly.points);
 
  graphics.endFill();  
  
  
  game.physics.p2.enable(graphics, DEBUG);
  graphics.body.clearShapes();
  graphics.body.addPolygon({}, vertices);
  //graphics.body.data.shapes[0].sensor = true;
  //graphics.body.gravityScale = 0;
  graphics.body.static = true;
  
  
}

function update() {
	filter.update();
}
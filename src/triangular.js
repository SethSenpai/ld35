/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;
var LEVEL = {
  vertices: [
    { x: 10, y: HEIGHT / 3, fixed: true },
    { x: WIDTH / 2, y: HEIGHT / 3 - 20, fixed: false },
    { x: WIDTH - 10, y: HEIGHT / 3 + 20, fixed: true },
    { x: WIDTH * 2 / 3, y: HEIGHT * 2 / 3, fixed: false }
  ]
};

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var vertices;
var edges;

function updateEdge(e, v1, v2) {
  var middle = {
    x: v1.x + (v2.x - v1.x) / 2,
    y: v1.y + (v2.y - v1.y) / 2
  };
  var size = 5;
  var length = Math.sqrt(
    Math.pow(v1.x - v2.x, 2) +
    Math.pow(v1.y - v2.y, 2)
  );
  var rot = Math.atan((v2.y - v1.y) / (v2.x - v1.x));

  e.body.x = middle.x;
  e.body.y = middle.y;
  e.body.rotation = rot;
  e.body.clearShapes();
  e.body.setRectangle(length, size, 0, 0, 0);
      
  e.clear();
  e.beginFill(0xffffff);
  e.drawRect(
    - length / 2,
    - size / 2,
    length,
    size
  );
  e.endFill();
}

function preload() {
  game.load.image('vertex', 'sprites/connector.png');
  game.load.image('water', 'sprites/water_molecule.png');
  game.load.image('background', 'sprites/background.png');
}

function create() {
  var edgeGroup;
  
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.9;
  game.physics.p2.gravity.y = 500;
  
  game.add.image(0, 0, 'background');
  
  edgeGroup = game.add.group();
  vertices = game.add.group();
  edges = {};
  
  LEVEL.vertices.forEach(function(v, i) {
    var s = vertices.create(v.x, v.y, 'vertex');
    s.anchor.set(0.5);
    
    if (!v.fixed) {
      s.inputEnabled = true;
      s.input.enableDrag();
      s.events.onDragUpdate.add(function(sprite, pointer, dragX, dragY, snapPoint) {
        edges[i].forEach(function(link) {
          updateEdge(link[0], s, vertices.getAt(link[1]));
        });
      });
    }
  });
  
  ~function() {
    for (var i = 0; i < vertices.length; i++) {
      var j = (i + 1) % vertices.length;
      var first = vertices.getAt(i);
      var second = vertices.getAt(j);
      var e = game.make.graphics();
      
      edgeGroup.addChild(e);
      
      edges[i] = edges[i] || [];
      edges[i].push([e, j]);
      edges[j] = edges[j] || [];
      edges[j].push([e, i]);
      
      game.physics.p2.enable(e, DEBUG);
      e.body.static = true;
      updateEdge(e, first, second);
    }
  }();
  
  var balls = game.add.physicsGroup(Phaser.Physics.P2JS);
  for (var i = 0; i < 20; i++) {
    var ball = balls.create(Math.random() * WIDTH, Math.random() * HEIGHT, 'water');
    ball.body.setCircle(20);
  }
}

function update() {
}
/// <reference path="../third-party/phaser.d.ts"/>

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { 
  create: create,
  update: update, 
  render: render 
});

function preload(){
	game.load.image('point', 'sprites/black1.png')
	
}

var poly;
var graphics;
var p1s;
var p2s;
var p3s;
var p4s;

var vertices = [
  [200, 100],
  [350, 100],
  [375, 200],
  [225, 325],
  [150, 200]
];

function points(vertices) {
  return vertices.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}

function addVertex(v) {
  var sprite = game.add.sprite(v[0], v[1], 'point');
  
  function onDragUpdate(sprite, pointer, dragX, dragY, snapPoint) {
    v[0] = sprite.x;
    v[1] = sprite.y;
    poly = new Phaser.Polygon(points(vertices));
  }
  
  sprite.anchor.set(0.5);
  sprite.inputEnabled = true;
  sprite.input.enableDrag();
  sprite.events.onDragUpdate.add(onDragUpdate);
}

function create() {
  vertices.forEach(addVertex);
  
  poly = new Phaser.Polygon(points(vertices));

    graphics = game.add.graphics(0, 0);

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(poly.points);
    graphics.endFill();

}

function update() {

    graphics.clear();

    if (poly.contains(game.input.x, game.input.y))
    {
        graphics.beginFill(0xFF3300);
    }
    else
    {
        graphics.beginFill(0xFF33ff);
    }

    graphics.drawPolygon(poly.points);
    graphics.endFill();

}

function render() {

    game.debug.text(game.input.x + ' x ' + game.input.y, 32, 32);
	game.context.fillStyle = 'rgb(255,255,0)';
  vertices.forEach(function(v) {
    game.context.fillRect(v[0], v[1], 4, 4);
  });
}
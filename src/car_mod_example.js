var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update, render: render });

function preload(){
	game.load.image('point', 'sprites/black1.png')
	
}

var poly;
var graphics;
var p1s;
var p2s;
var p3s;
var p4s;

function create() {
    
	p1 = new Phaser.Point(200, 100);
	p2 = new Phaser.Point(350, 100);
	p3 = new Phaser.Point(375, 200);
	p4 = new Phaser.Point(150, 200);
	
	p1s = game.add.sprite(p1.x, p1.y, 'point');
	p1s.anchor.set(0.5);
	p2s = game.add.sprite(p2.x, p2.y, 'point');
	p2s.anchor.set(0.5);
	p3s = game.add.sprite(p3.x, p3.y, 'point');
	p3s.anchor.set(0.5);
	p4s = game.add.sprite(p4.x, p4.y, 'point');
	p4s.anchor.set(0.5);
	
	//  Input Enable the sprite
    p1s.inputEnabled = true;
    p2s.inputEnabled = true;
    p3s.inputEnabled = true;
    p4s.inputEnabled = true;

    //  Allow dragging
    p1s.input.enableDrag();
    p2s.input.enableDrag();
    p3s.input.enableDrag();
    p4s.input.enableDrag();
	
	p1s.events.onDragStart.add(dragStart);
    p1s.events.onDragUpdate.add(dragUpdate);
    p2s.events.onDragUpdate.add(dragUpdate);
    p3s.events.onDragUpdate.add(dragUpdate);
    p4s.events.onDragUpdate.add(dragUpdate);
    p1s.events.onDragStop.add(dragStop);
	
	poly = new Phaser.Polygon(p1,p2,p3,p4);

    graphics = game.add.graphics(0, 0);

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(poly.points);
    graphics.endFill();

}

function dragStart() {

   

}

function dragUpdate(sprite, pointer, dragX, dragY, snapPoint) {
	p1.x = p1s.x;
	p1.y = p1s.y;
	p2.x = p2s.x;
	p2.y = p2s.y;
	p3.x = p3s.x;
	p3.y = p3s.y;
	p4.x = p4s.x;
	p4.y = p4s.y;
	poly = new Phaser.Polygon(p1,p2,p3,p4);
}

function dragStop() {

   

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
    game.context.fillRect(p1.x, p1.y, 4, 4);
	game.context.fillStyle = 'rgb(255,255,0)';
    game.context.fillRect(p2.x, p2.y, 4, 4);
	game.context.fillStyle = 'rgb(255,255,0)';
    game.context.fillRect(p3.x, p3.y, 4, 4);
	game.context.fillStyle = 'rgb(255,255,0)';
    game.context.fillRect(p4.x, p4.y, 4, 4);

}
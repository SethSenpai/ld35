/// <reference path="third-party/phaser.d.ts"/>

var game = new Phaser.Game(800, 600, Phaser.WEBGL, '', {
  preload: preload, 
  create: create,
  update: update
});
  
function preload() {
  game.load.image('logo', 'phaser.png');
}

function create() {
  var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);
}

function update() {
}
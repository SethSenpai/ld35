/// <reference path="../third-party/phaser.d.ts"/>

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
var membraneGroup;
var forces;

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
var gameStarted = false;
var spaceKey;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('recepticle', 'sprites/recepticle_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.shader('bac_background', 'shader/background.frag');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('finish', 'sfx/finish.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  game.load.physics('recepticle-data', 'sprites/recepticle_small.json');
  
  game.load.spritesheet('nextButton', 'sprites/next_button.png', 230, 86);
  game.load.spritesheet('replayButton', 'sprites/replay_button.png', 314, 86);
  game.load.spritesheet('menuButton', 'sprites/menu_button.png', 255, 86);
  
  Membrane.preload(game);
  editor.preload(game);
  Forces.preload(game);
}

function create() {
  var level = loadCurrentLevel();
  var win = game.add.audio('finish');
  
  //create timer
  timer = game.time.create(false);
  
  //shader for background
  filter = new Phaser.Filter(game, 1000, game.cache.getShader('bac_background'));
  filter.addToWorld(0, 0, 1280, 720);

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  startPosition = level.start;

  utils.style('body { font-family: ' + FONT + '; }');

  stage = game.add.group();

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  membraneGroup = game.make.group();

  stage.addChild(membraneGroup);

  level.membranes.forEach(function (m, i) {
    membranes.push(Membrane.create(game, stage, level, i));
  });

  forces = Forces.create(game, stage, level);
  
  //score display
  bar = game.add.graphics();
  styleBoardLarge = {font: "36px bebas", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  styleBoard = {font: "24px bebas", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  
  //Text display
  var style = {font: "24px bebaslight", fill: "#fff"};
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
  //music.play();

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

  //set spacebar as startkey
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // R for reload
  game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function () {
    location.reload();
  });

  // M for menu
  game.input.keyboard.addKey(Phaser.Keyboard.M).onDown.add(function () {
    location.replace('menu.html');
  });
}

function update() {
	
  //upate filter for background dynamics
   filter.update();
   
  // Update scoreboard
  if(won != true){
  scoreText.text = "Bounces: " + bounceCount;
  timeText.text = "Time: " + (timer.ms/1000).toFixed(2);
  //var finishtime =  (timer.ms/1000).toFixed(2);
  }
  else
  {
	if(scoreDrawn == false){
	  bar.beginFill(0xdfdfdf, 0.55);
	  bar.drawRect(0,210,WIDTH,300);
	  bar.endFill();
	  scoreDrawn = true;
	  scoreBoardTextLarge = game.add.text(0,0, "FINISHED!" , styleBoardLarge);
	  scoreBoardTextLarge.setTextBounds(0,210,WIDTH,150);
	  var totalscore = ((bounceCount*20)+timer.ms/1000).toFixed(2);
	  scoreBoardText = game.add.text(0,0,"Score: " + totalscore + "\nBounces: " + bounceCount + " * 20 + Time: " + (timer.ms/1000).toFixed(2), styleBoard); // "\n Bounces: " + bounceCount + "* 20 + Time: " + finishtime
	  scoreBoardText.setTextBounds(0, 360, WIDTH, 150);
	  if (nextLevel()) {
	    var buttonNext = game.add.button(WIDTH - 240, 420, "nextButton", loadNextLevel, this, 1, 0, 2);
	  }
	  var buttonReplay = game.add.button(10, 420, "replayButton", reloadLevel, this, 1, 0, 2);
	  var buttonMenu = game.add.button(10, 220, "menuButton", loadMenu, this, 1, 0, 2);
	}
  }

  if(spaceKey.isDown){
    gameStarted = true;
    //start time. can be put somewhere else later when the level starts etc
    timer.start();
  }
  
  // Accelerate player to recepticle
  // check if player pressed space first to allow for thinking time
  var factor = RECEPTICLE_FORCE;
  if(gameStarted == true){
    var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
    player.body.rotation = angle + game.math.degToRad(90);
    player.body.force.x = Math.cos(angle) * factor;
    player.body.force.y = Math.sin(angle) * factor;

    forces.repellers().forEach(function (r) {
      var factor = REPELLER_FORCE;
      var angle = Math.atan2(r.y - player.y, r.x - player.x);
      //player.body.rotation -= angle + game.math.degToRad(90);
      player.body.force.x -= Math.cos(angle) * factor;
      player.body.force.y -= Math.sin(angle) * factor;
    });

    forces.attractors().forEach(function (r) {
      var factor = ATTRACTOR_FORCE;
      var angle = Math.atan2(r.y - player.y, r.x - player.x);
      //player.body.rotation += angle + game.math.degToRad(90);
      player.body.force.x += Math.cos(angle) * factor;
      player.body.force.y += Math.sin(angle) * factor;
    });
  }else{
	var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
    player.body.rotation = angle + game.math.degToRad(90);
  }
}

function nextLevel() {
  if (utils.retrieve('level')) return false;

  var current = utils.retrieve('bundled');
  var names = Object.keys(LEVEL);
  var index = names.indexOf(current);

  if (index < names.length - 1)
    return names[index + 1];
  else
    return false;
}

function loadNextLevel() {
  utils.store('bundled', nextLevel());
  location.reload();
}

function reloadLevel() {
  location.reload();
}

function loadMenu() {
  location.replace("menu.html");
}

function loadCurrentLevel() {
  var level = utils.retrieve('level');
  var bundled;

  if (!level) {
    bundled = utils.retrieve('bundled');

    if (!bundled) {
      bundled = Object.keys(LEVEL)[0];
      utils.store('bundled', bundled);
    }

    level = LEVEL[bundled];
  }

  return level;
}

function reset() {
  utils.store('level', null);
  utils.store('bundled', null);
  location.reload();
}
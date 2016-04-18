/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;
var FONT = 'bebas';

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
var sfx;
var thing;
var spaceKey;
var explainText;
var style

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  
  game.load.shader('bac_background', 'shader/background.frag');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('membrane-down', 'sfx/press_down.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  
  game.load.spritesheet('playButton', 'sprites/play_button.png' , 230 , 86);
  game.load.spritesheet('creditsButton' , 'sprites/credits_button.png' , 333 , 86);
  game.load.spritesheet('loadButton' , 'sprites/load_button.png' , 240 , 86);
  game.load.image('logo', 'sprites/via_morpha_logo.png')

}

function create() {
  
   
  //shader for background
  filter = new Phaser.Filter(game, 1000, game.cache.getShader('bac_background'));
  filter.addToWorld(0, 0, 1280, 720);
  
  //stuff for that one bloody bouncing molecule
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;
  molecule = game.add.physicsGroup(Phaser.Physics.P2JS);
  thing = molecule.create(1000,350, 'water');
  thing.body.clearShapes();
  thing.body.loadPolygon('water-data', 'water_molecule_small');
  thing.body.damping = 0;
  thing.body.angle = Math.floor(Math.random()*360);
  thing.body.thrust(6000);
  
  
  var logoImg = game.add.image(WIDTH/2-500, 30, 'logo');
  
  //credits things
  bar = game.add.graphics();
  styleBoardLarge = {font: "86px bebas", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  styleBoard = {font: "34px bebaslight", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  style = {font: "24px bebaslight", fill: "#fff"};
  
  //in menu tutorials
  explainText = game.add.text(0,0, "This game has several useful hotkeys: M -> Return to menu, R -> Reload level, E -> Edit Mode. \nWhen editing hold D to delete a node and Press F to fix a node. Clicking on a line adds an extra node.  ", style);
  explainText.setTextBounds(WIDTH/2-500,660,200,200);

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  //music.play();
  
  sfx = game.add.audio('membrane-down');
  sfx.volume = 1.0;
  
  // Make buttons
  var buttonNext = game.add.button(WIDTH/2-500,350 , "playButton" , playLevel , this, 1 , 0 , 2 );
  buttonNext.onInputOver.add(overButton, this);
  buttonNext.onInputOut.add(outButton, this);
  var buttonCredits = game.add.button(WIDTH/2-500,550 , "creditsButton" , showCredits , this, 1 , 0 , 2 );
  buttonCredits.onInputOver.add(overButton, this);
  buttonCredits.onInputOut.add(outButton, this);
  var buttonLoad = game.add.button(WIDTH/2-500,450 , "loadButton" , loadLevel , this, 1 , 0 , 2 );
  buttonLoad.onInputOver.add(overButton, this);
  buttonLoad.onInputOut.add(outButton, this);
  
}
 
function update() {
	
  //upate filter for background dynamics
   filter.update();

}
function overButton(switchValue){
	sfx.play();
	switch(switchValue.key)
	{
		case "playButton":
			console.log("trigger");
			explainText.text = "This button brings you back into the game, it always loads the level you last played. To load a different level use the load button below!";
		break;
		
		case "creditsButton":
			explainText.text = "Look at our pretty names! <3";
		break;
		
		case "loadButton":
			explainText.text = "With this button you can load in the premade levels or load in a level that you made yourself.";
		break;
	}
}

function outButton(){
	explainText.text = "This game has several useful hotkeys: M -> Return to menu,   R -> Reload level,   E -> Edit Mode. \nWhen editing hold D to delete a node and Press F to fix a node. Clicking on a line adds an extra node. ";
}

function playLevel(){
	location.replace("play.html");
}

function showCredits(){
	//code here
	popCredits.innerHTML = '<span class="title">Credits:</span><br><span style="font-size:24px;"><p>Sander "snedar" Dijkhuis</p><p>Pim "Seth-Senpai" Ostendorf</p><br><br><p>Online Tools used:</p><p>SFX: http://www.bfxr.net/</p><p> Shaders: http://glslsandbox.com/</p><p> Music: http://www.purple-planet.com</p><br><br><p>Created for Ludum Dare 35</p><p>18-04-2016';
	popCredits.style.display = 'block';
      popCredits.onclick = function () {
      popCredits.style.display = 'none';
      };

}

function loadLevel(){
	 var area;
	  
	 /* dropdown.innerHTML = '<select id="slvl"><option>Select a level</option></select>';
	  dropdown.style.display = 'block';
	  var select = document.getElementById("slvl");
	  var options = Object.keys(LEVEL);
	  for(var i = 0; i < options.length; i++) 
	  {
      var opt = options[i];
      var el = document.createElement("option");
      el.textContent = opt;
      dropdown.value = opt;
      select.appendChild(el);
      }*/
	  
	  
      popup.innerHTML = '<textarea cols=80 rows=25></textarea><p style="font-size:24px">Paste your level-data and press ENTER!<br> You can also select a premade level from the list: <select id="slvl"><option>> Select a level</option></select>';
	  
	  //load premade levels into a dropdown box
	  var select = document.getElementById("slvl");
	  var options = Object.keys(LEVEL);

	  select.addEventListener('click', function (e) {
	    e.stopPropagation();
	  });
	  select.addEventListener('change', function () {
	    if (options.indexOf(select.value) != -1) {
	      utils.store('level', null);
	      utils.store('bundled', select.value);
	      playLevel();
	    }
	  });

	  for(var i = 0; i < options.length; i++) 
	  {
      var opt = options[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
	  }
	  
      popup.style.display = 'block';
      popup.onclick = function () {
      popup.style.display = 'none';
      };

      area = popup.childNodes[0];
      area.addEventListener('keyup', function (e) {
        if (e.keyCode == 13) {
          try {
            var json = JSON.parse(area.value);
            utils.store('level', json);
            location.replace("play.html");
          } catch (e) {
            alert('invalid json');
          }
        }
      });
      area.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      area.focus();
}
function Editor(game, stage) {
  var BUTTON_WIDTH = 172;
  var BUTTON_HEIGHT = 52;
  var PADDING = 12;
  var SPACING = 6;
  var border;
  var state = {
    editing: false
  };

  function preload(game) {
    game.load.spritesheet('editor-button', 'sprites/editor_button.png', BUTTON_WIDTH, BUTTON_HEIGHT);
  }

  function create(game, stage) {
    var edit = game.input.keyboard.addKey(Phaser.Keyboard.E);
    var chrome = game.add.group();

    chrome.visible = false;

    // Add border for scaled mode
    border = game.make.graphics();
    border.lineStyle(4, 0xffffff, 1);
    border.drawRect(0, 0, WIDTH, HEIGHT);
    border.alpha = 0;
    stage.addChild(border);

    // Handle edit mode switches
    edit.onDown.add(function () {
      state.editing = !state.editing;
      if (state.editing) {
        start();
      } else {
        stop();
      }
    });

    (function () {
      var x = PADDING;
      var y = HEIGHT - BUTTON_HEIGHT - PADDING;
      button(x, y, 'Export Level…', showExportPopup);
      x += BUTTON_WIDTH + SPACING;
      button(x, y, 'Load Level…', load);
    })();

    // Create a button
    function button(x, y, label, action) {
      var g = game.make.group();
      var b = game.make.button(0, 0, 'editor-button', action, this, 2, 1, 0);
      var t = game.make.text(BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, label, {
        font: '18px ' + FONT,
        fill: '#ffffff',
        align: 'center'
      });

      t.anchor.set(0.5);

      g.x = x;
      g.y = y;
      g.addChild(b);
      g.addChild(t);

      chrome.addChild(g);
    }

    // Set the main stage scale
    function scale(s) {
      stage.scale.set(s);
      stage.position.set((1 - s) * WIDTH / 2, (1 - s) * HEIGHT / 2);
      if (s < 1) {
        border.alpha = 1;
      }
    }

    function start() {
      scale(0.75);
      chrome.visible = true;
    }

    function stop() {
      scale(1);
      chrome.visible = false;
    }

    function showExportPopup() {
      var level = {
        start: { x: player.x, y: player.y },
        end: { x: recepticle.x, y: recepticle.y },
        vertices: membrane.json()
      };
      var s = JSON.stringify(level);

      popup.innerHTML = '<textarea cols=80 rows=25 autofocus readonly>' + s + '</textarea>';
      popup.childNodes[0].select();
      popup.style.display = 'block';
      popup.onclick = function () {
        popup.style.display = 'none';
      };
    }

    function load() {
      console.log('not implemented yet');
    }
  }

  return {
    state: state,
    preload: preload,
    create: create
  };
}
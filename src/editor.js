function Editor(game, stage) {
  var BUTTON_WIDTH = 172;
  var BUTTON_HEIGHT = 52;
  var PADDING = 12;
  var SPACING = 6;

  // Border around display
  var border;

  // Level editor state, may be accessed from other files
  var state = {
    editing: false
  };

  var jsonifyImpl;

  function preload(game) {
    game.load.spritesheet('editor-button', 'sprites/editor_button.png', BUTTON_WIDTH, BUTTON_HEIGHT);
  }

  function jsonify() {
    return jsonifyImpl();
  }

  function create(game, stage) {
    var edit = game.input.keyboard.addKey(Phaser.Keyboard.E);

    // The chrome group contains all editor widgets
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

    // Add level management buttons
    (function () {
      var x = PADDING;
      var y = HEIGHT - BUTTON_HEIGHT - PADDING;
      button(x, y, 'Export Level…', showExportPopup);
      x += BUTTON_WIDTH + SPACING;
      button(x, y, 'Import Level…', showImportPopup);
      x += BUTTON_WIDTH + SPACING;
      button(x, y, 'Save Level', save);
      x += BUTTON_WIDTH + SPACING;
      button(x, y, 'Reset Level', clear);
      x += BUTTON_WIDTH + 4 * SPACING;
      button(x, y, 'Add Membrane', addMembrane);
    })();

    // Helper function to create a button
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

    // Called when editing is started
    function start() {
      scale(EDIT_SCALE);

      state.editing = true;

      chrome.visible = true;

      border.visible = true;

      player.body.static = true;
      player.body.reset(startPosition.x, startPosition.y, 0, 0);
      player.inputEnabled = true;
      player.input.enableDrag();
      player.events.onDragUpdate.add(function (sprite, pointer, dragX, dragY, snapPoint) {
        if (!window.event) return;

        var mx = event.clientX;
        var my = event.clientY;

        var x = mx / EDIT_SCALE - 0.5 * WIDTH * (1 - EDIT_SCALE) / EDIT_SCALE;
        var y = my / EDIT_SCALE - 0.5 * HEIGHT * (1 - EDIT_SCALE) / EDIT_SCALE;

        player.x = x;
        player.y = y;
        player.body.reset(x, y, 0, 0);

        startPosition = { x: x, y: y };
      });

      membranes.forEach(function (m) {
        m.toggleEdit(true);
      });
    }

    // Called when editing is stopped
    function stop() {
      scale(1);

      state.editing = false;

      chrome.visible = false;

      border.visible = false;

      player.body.static = false;
      player.inputEnabled = false;

      membranes.forEach(function (m) {
        m.toggleEdit(false);
      });
    }

    // Create a JSON object that represents the level
    jsonifyImpl = function () {
      var level = {
        start: { x: player.x, y: player.y },
        end: { x: recepticle.x, y: recepticle.y },
        membranes: membranes.map(function (m) {
          m.toggleEdit(false);
          var j = m.json();
          m.toggleEdit(true);
          return j;
        })
      };
      return level;
    }

    function showExportPopup() {
      var level = jsonify();
      var s = JSON.stringify(level);
      var area;

      popup.innerHTML = '<textarea cols=80 rows=25 readonly>' + s + '</textarea>' + '<p>ctrl-c';
      popup.style.display = 'block';
      popup.onclick = function () {
        popup.style.display = 'none';
      };

      area = popup.childNodes[0];
      area.focus();
      area.select();
    }

    function showImportPopup() {
      var area;

      popup.innerHTML = '<textarea cols=80 rows=25></textarea><p>ctrl-v enter';
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
            location.reload();
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

    function clear() {
      utils.store('level', null);
      location.reload();
    }

    function save() {
      utils.store('level', jsonify());
    }

    function addMembrane() {
      var newLevel = jsonify();

      newLevel.membranes.push({
        vertices: [
          { x: -100, y: 100 },
          { x: -100, y: 200 }
        ]
      });
      var nm = Membrane.create(game, stage, newLevel, newLevel.membranes.length - 1);
      nm.toggleEdit(true);
      membranes.push(nm);
    }
  }

  return {
    state: state,
    preload: preload,
    create: create,
    jsonify: jsonify
  };
}
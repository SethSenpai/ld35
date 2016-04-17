var Forces = (function () {
  function removeRepeller(i) {
    var newLevel = editor.jsonify();

    newLevel.repellers.splice(i, 1);

    forces.remove();
    forces = Forces.create(game, stage, newLevel);
    forces.edit();
  }

  function preload(game) {
    game.load.image('repeller', 'sprites/connector_orange.png');
  }

  function create(game, stage, level) {
    var rs = game.make.group();

    stage.addChild(rs);

    level.repellers.forEach(function (r, i) {
      var s = rs.create(r.x, r.y, 'repeller');

      s.alpha = FIXED_REPELLER_ALPHA;
      s.inputEnabled = true;
      s.events.onDragUpdate.add(function (sprite, pointer, dragX, dragY, snapPoint) {
        if (!window.event) return;

        var mx = event.clientX;
        var my = event.clientY;

        var x = mx / EDIT_SCALE - 0.5 * WIDTH * (1 - EDIT_SCALE) / EDIT_SCALE;
        var y = my / EDIT_SCALE - 0.5 * HEIGHT * (1 - EDIT_SCALE) / EDIT_SCALE;

        sprite.x = x;
        sprite.y = y;
      });
      s.events.onInputDown.add(function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
          removeRepeller(i);
        }
      });
    });

    function repellers() {
      var result = [];

      rs.forEach(function (r) {
        result.push({ x: r.x, y: r.y });
      });

      return result;
    }

    function remove() {
      stage.removeChild(rs);
      rs = [];
    }

    function edit() {
      rs.forEach(function (r) {
        r.input.enableDrag();
        r.alpha = 1;
      });
    }

    function unedit() {
      rs.forEach(function (r) {
        r.input.disableDrag();
        r.alpha = FIXED_REPELLER_ALPHA;
      });
    }

    return {
      repellers: repellers,
      remove: remove,
      edit: edit,
      unedit: unedit
    };
  }

  return {
    preload: preload,
    create: create
  };
})();
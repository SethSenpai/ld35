var Editor = function (game, stage) {
  var border;
  var state = {
    editing: false
  };

  function create() {
    var edit = game.input.keyboard.addKey(Phaser.Keyboard.E);

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
  }

  function stop() {
    scale(1);
  }

  return {
    state: state,
    create: create
  };
};
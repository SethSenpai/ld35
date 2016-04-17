var Membrane = (function() {
  
  // Update the geometry of edge e between vertices v1 and v2
  function updateEdge(e, v1, v2) {
    var m = middle(v1, v2);
    var size = 4;
    var length = Math.sqrt(
      Math.pow(v1.x - v2.x, 2) +
      Math.pow(v1.y - v2.y, 2)
    );
    var rot = Math.atan((v2.y - v1.y) / (v2.x - v1.x));

    e.body.x = m.x;
    e.body.y = m.y;
    e.body.rotation = rot;
    e.body.clearShapes();
    e.body.setRectangle(length, size, 0, 0, 0);
        
    e.clear();
    if (v1.input.draggable || v2.input.draggable) {
      e.beginFill(0xffffff);
    } else {
      e.beginFill(COLOR_PURPLE);
    }
    e.drawRect(- length / 2, - size / 2, length, size);
    e.endFill();
  }

  function middle(v1, v2) {
    return {
      x: v1.x + (v2.x - v1.x) / 2,
      y: v1.y + (v2.y - v1.y) / 2
    };
  }

  function addVertex(game, stage, level, membraneIndex, edge) {
    var membrane = membranes[membraneIndex];
    var m = middle(membrane.vertices.getAt(edge), membrane.vertices.getAt((edge + 1) % membrane.vertices.length));
    var newLevel = editor.jsonify();
    var newMembrane;

    newLevel.membranes[membraneIndex].vertices.splice(edge + 1, 0, { x: m.x, y: m.y, fixed: false });

    newMembrane = Membrane.create(game, stage, newLevel, membraneIndex);
    newMembrane.toggleEdit(true);
    
    membrane.remove();
    membranes.splice(membraneIndex, 1, newMembrane);
  }

  function removeVertex(game, stage, level, membraneIndex, vertex) {
    var membrane = membranes[membraneIndex];
    var newLevel;
    var newMembrane;

    if (membrane.vertices.length > 2) {
      newLevel = editor.jsonify();
      newLevel.membranes[membraneIndex].vertices.splice(vertex, 1);

      newMembrane = Membrane.create(game, stage, newLevel, membraneIndex);
      newMembrane.toggleEdit(true);

      removeMembrane(game, stage, level, membraneIndex);
      membranes.push(newMembrane);
    } else {
      removeMembrane(game, stage, level, membraneIndex);
    }
  }

  function removeMembrane(game, stage, level, membraneIndex) {
    var newLevel = editor.jsonify();

    newLevel.membranes.splice(membraneIndex, 1);

    membranes.forEach(function (m) {
      m.remove();
    });
    membranes.splice(0, membranes.length);

    newLevel.membranes.forEach(function (m, i) {
      var nm = Membrane.create(game, stage, newLevel, i);
      nm.toggleEdit(true);
      membranes.push(nm);
    });
  }

  function transformVertex(v) {
    if (!window.event) return;
    var mx = event.clientX;
    var my = event.clientY;

    v.x = mx / EDIT_SCALE - 0.5 * WIDTH * (1 - EDIT_SCALE) / EDIT_SCALE;
    v.y = my / EDIT_SCALE - 0.5 * HEIGHT * (1 - EDIT_SCALE) / EDIT_SCALE;
  }

  function toggleFixedDisplay(v, b) {
    if (b) {
      v.loadTexture('vertex-fixed', 0);
    } else {
      v.loadTexture('vertex', 0);
    }
  }
  
  return {
    preload: function(game) {
      game.load.image('vertex', 'sprites/connector_small.png');
      game.load.image('vertex-fixed', 'sprites/connector_purple.png');
      game.load.audio('membrane-down', 'sfx/press_down.wav');
      game.load.audio('membrane-up', 'sfx/press_up.wav');
      game.load.audio('bounce-hurt', 'sfx/bounce_hurt.wav');
    },
    create: function (game, stage, level, i) {
      var removed = false;
      var sfx = {
        down: game.add.audio('membrane-down'),
        up: game.add.audio('membrane-up'),
        bounce: game.add.audio('bounce-hurt')
      };

      sfx.bounce.volume = 0.2;
      
      // Phaser.Group instances with connectors and lines
      var edges = game.make.group();
      var vertices = game.make.group();

      membraneGroup.addChild(edges);
      membraneGroup.addChild(vertices);
      
      // Lookup table:
      // { 0: [[edge1, 1], ...],
      //   1: [[edge1, 0], ...] }
      // Numbers are vertex indices, edges are Phaser.Graphics
      var index = {};

      // Which edge had the last bounce?
      var lastBounce;
      
      // Create vertex sprites
      level.membranes[i].vertices.forEach(function(v, j) {
        var s = vertices.create(v.x, v.y, 'vertex');
        s.anchor.set(0.5);
        
        s.inputEnabled = true;
        s.events.onDragStart.add(function () {
          sfx.down.play();
        });
        s.events.onDragStop.add(function () {
          sfx.up.play();
        });
        s.events.onDragUpdate.add(function (sprite, pointer, dragX, dragY, snapPoint) {
          if (editor.state.editing) {
            transformVertex(s);
          }

          index[j].forEach(function (link) {
            updateEdge(link[0], s, vertices.getAt(link[1]));
          });
        });
        s.events.onInputDown.add(function () {
          if (editor.state.editing) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
              v.fixed = !v.fixed;
              if (v.fixed) {
                toggleFixedDisplay(s, true);
              } else {
                toggleFixedDisplay(s, false);
              }
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
              removeVertex(game, stage, level, i, j);
            }
          }
        });

        if (!v.fixed) {
          s.input.enableDrag();
        } else {
          toggleFixedDisplay(s, true);
        }
      });
      
      // Create edges and set up index
      utils.range(vertices.length).forEach(function (j) {
        var k = (j + 1) % vertices.length;
        var first = vertices.getAt(j);
        var second = vertices.getAt(k);
        var e = game.make.graphics();

        edges.addChild(e);

        game.physics.p2.enable(e, DEBUG);

        e.body.static = true;
        e.body.onBeginContact.add(function () {
          if (lastBounce != j) {
            lastBounce = j;
            sfx.bounce.play();
            bounceCount++;
          }
        });
        e.alpha = 0.5;
        e.inputEnabled = true;

        // Add new vertices if in editing mode
        e.events.onInputDown.addOnce(function () {
          if (editor.state.editing) {
            addVertex(game, stage, level, i, j);
          }
        });

        index[j] = index[j] || [];
        index[j].push([e, k]);
        index[k] = index[k] || [];
        index[k].push([e, j]);

        updateEdge(e, first, second);
      });

      function json() {
        var res = [];

        vertices.forEach(function (v) {
          res.push({
            x: v.x,
            y: v.y,
            fixed: !v.input.draggable
          });
        });

        return {
          vertices: res
        };
      }

      function toggleEdit(b) {
        var j = 0;
        vertices.forEach(function (v) {
          if (b || !level.membranes[i].vertices[j].fixed) {
            v.input.enableDrag();
          } else {
            v.input.disableDrag();
          }
          j++;
        });
      }

      function remove() {
        vertices.forEach(function (vertex) {
          vertex.inputEnabled = false;
        });
        edges.forEach(function (edge) {
          edge.body.clearShapes();
          edge.inputEnabled = false;
          game.physics.p2.removeBody(edge.body);
        });
        membraneGroup.removeChild(vertices);
        membraneGroup.removeChild(edges);
        removed = true;
      }

      return {
        json: json,
        toggleEdit: toggleEdit,
        remove: remove,
        index: index,
        vertices: vertices
      };
    }
  };
})();
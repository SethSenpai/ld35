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
    e.beginFill(0xffffff);
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
    
    membranes[membraneIndex].remove();
    membranes.splice(membraneIndex, 1, newMembrane);
  }
  
  return {
    preload: function(game) {
      game.load.image('vertex', 'sprites/connector_small.png');
      game.load.audio('membrane-down', 'sfx/press_down.wav');
      game.load.audio('membrane-up', 'sfx/press_up.wav');
      game.load.audio('bounce-hurt', 'sfx/bounce_hurt.wav');
    },
    create: function(game, stage, level, i) {
      var sfx = {
        down: game.add.audio('membrane-down'),
        up: game.add.audio('membrane-up'),
        bounce: game.add.audio('bounce-hurt')
      };

      sfx.bounce.volume = 0.2;
      
      // Phaser.Group instances with connectors and lines
      var edges = game.make.group();
      var vertices = game.make.group();

      stage.addChild(edges);
      stage.addChild(vertices);
      
      // Lookup table:
      // { 0: [[edge1, 1], ...],
      //   1: [[edge1, 0], ...] }
      // Numbers are vertex indices, edges are Phaser.Graphics
      var index = {};

      // Which edge had the last bounce?
      var lastBounce;
      
      // Create vertex sprites
      level.membranes[i].vertices.forEach(function(v, i) {
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
          index[i].forEach(function (link) {
            updateEdge(link[0], s, vertices.getAt(link[1]));
          });
        });

        if (!v.fixed) {
          s.input.enableDrag();
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
        e.events.onInputDown.add(function () {
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
        stage.removeChild(vertices);
        stage.removeChild(edges);
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
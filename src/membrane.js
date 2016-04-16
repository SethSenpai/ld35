var Membrane = (function() {
  
  // Update the geometry of edge e between vertices v1 and v2
  function updateEdge(e, v1, v2) {
    var middle = {
      x: v1.x + (v2.x - v1.x) / 2,
      y: v1.y + (v2.y - v1.y) / 2
    };
    var size = 5;
    var length = Math.sqrt(
      Math.pow(v1.x - v2.x, 2) +
      Math.pow(v1.y - v2.y, 2)
    );
    var rot = Math.atan((v2.y - v1.y) / (v2.x - v1.x));

    e.body.x = middle.x;
    e.body.y = middle.y;
    e.body.rotation = rot;
    e.body.clearShapes();
    e.body.setRectangle(length, size, 0, 0, 0);
        
    e.clear();
    e.beginFill(0xffffff);
    e.drawRect(- length / 2, - size / 2, length, size);
    e.endFill();
  }
  
  return {
    preload: function(game) {
      game.load.image('vertex', 'sprites/connector_small.png');
      game.load.audio('membrane-down', 'sfx/press_down.wav');
      game.load.audio('membrane-up', 'sfx/press_up.wav');
    },
    create: function(game, level) {
      
      var sfx = {
        down: game.add.audio('membrane-down'),
        up: game.add.audio('membrane-up')
      }
      
      // Phaser.Group instances with connectors and lines
      var vertices = game.add.group();
      var edges = game.add.group();
      
      // Lookup table:
      // { 0: [[edge1, 1], ...],
      //   1: [[edge1, 0], ...] }
      // Numbers are vertex indices, edges are Phaser.Graphics
      var index = {};
      
      // Create vertex sprites
      level.vertices.forEach(function(v, i) {
        var s = vertices.create(v.x, v.y, 'vertex');
        s.anchor.set(0.5);
        
        if (!v.fixed) {
          s.inputEnabled = true;
          s.input.enableDrag();
          s.events.onDragStart.add(function() {
            sfx.down.play();
          });
          s.events.onDragStop.add(function() {
            sfx.up.play();
          });
          s.events.onDragUpdate.add(function() {
            index[i].forEach(function(link) {
              updateEdge(link[0], s, vertices.getAt(link[1]));
            });
          });
        }
      });
      
      // Create edges and set up index
      for (var i = 0; i < vertices.length; i++) {
        var j = (i + 1) % vertices.length;
        var first = vertices.getAt(i);
        var second = vertices.getAt(j);
        var e = game.make.graphics();
        
        edges.addChild(e);
        game.physics.p2.enable(e, DEBUG);
        e.body.static = true;
        
        index[i] = index[i] || [];
        index[i].push([e, j]);
        index[j] = index[j] || [];
        index[j].push([e, i]);
        
        updateEdge(e, first, second);
      }
    }
  };
})();
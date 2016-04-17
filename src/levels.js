var LEVEL = {};

LEVEL.ONE = {
  start: { x: WIDTH / 8, y: HEIGHT / 2 },
  end: { x: WIDTH * 7 / 8, y: HEIGHT / 2 },
  membranes: [
    {
      vertices: [
        { x: -20, y: HEIGHT / 3, fixed: true },
        { x: WIDTH / 4, y: HEIGHT / 3, fixed: false },
        { x: WIDTH / 3, y: HEIGHT * 2 / 3, fixed: false },
        { x: WIDTH / 2, y: HEIGHT / 3 - 20, fixed: false },
        { x: WIDTH + 20, y: HEIGHT / 3 + 20, fixed: true },
        { x: WIDTH + 20, y: HEIGHT * 4 / 5, fixed: true },
        { x: WIDTH * 2 / 3, y: HEIGHT * 2 / 3, fixed: false },
        { x: WIDTH / 3, y: HEIGHT * 2 / 3 + 40, fixed: false },
        { x: -20, y: HEIGHT * 2 / 3, fixed: true }
      ]
    },
    {
      vertices: [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 10, y: 30 }
      ]
    }
  ]
};
var utils = {};

utils.equalPairs = function (a1, b1, a2, b2) {
  return (a1 == a2 && b1 == b2) || (a1 == b2 && b1 == a2);
};

utils.range = function (n) {
  var res = [];
  for (var i = 0; i < n; i++) {
    res.push(i);
  }
  return res;
};

utils.style = function (s) {
  var el = document.createElement('style');
  el.innerHTML = s;
  document.body.appendChild(el);
};

utils.store = function (key, json) {
  localStorage[key] = JSON.stringify(json);
};

utils.retrieve = function (key) {
  if (localStorage[key]) {
    return JSON.parse(localStorage[key]);
  } else {
    return null;
  }
};

utils.clone = function (v) {
  return JSON.parse(JSON.stringify(v));
};

utils.distance = function (v1, v2) {
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
};
const cool = require('cool-ascii-faces');
const control = require('../mvc/control');

function rnd() {
  return Math.round(Math.random() * cool.faces.length);
}

module.exports = function (io) {
  io.sockets.on('connection', (data) => {
    setInterval(() => {
      data.emit('send', cool.faces[rnd()]);
    }, 1000);
  });
};

const cool = require('cool-ascii-faces');

function rnd() {
  return Math.round(Math.random() * cool.faces.length);
}

module.exports = function (socket) {
  socket.sockets.on('connection', (data) => {
    setInterval(() => {
      data.emit('send', cool.faces[rnd()]);
    }, 1000);
  });
};
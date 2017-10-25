const axon = require('axon');

const sock = axon.socket('push');

function Worker(port) {
  this.port = port;
  sock.bind(this.port);
}

Worker.prototype.addCount = function (metry) {
  const msg = {
    cmd: 'addMonitor',
    type: 'count',
    metry
  };
  this.sendMsg(msg);
};

Worker.prototype.addTime = function (metry, time) {
  const msg = {
    cmd: 'addMonitor',
    type: 'time',
    metry,
    time
  };
  this.sendMsg(msg);
};

Worker.prototype.sendMsg = function (msg) {
  sock.send(msg);
};

module.exports = Worker;

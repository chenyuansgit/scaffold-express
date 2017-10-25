const os = require('os');
const graphite = require('graphite');
const axon = require('axon');

const sock = axon.socket('pull');
const metrics = {};
const timeCache = {};
const cycle = 10; // 秒
const hostname = (function () {
  const name = os.hostname();
  return name.replace('.qunar.com', '').replace(/\./g, '_');
}());


function Master(port) {
  const self = this;
  this.port = port;
  sock.connect(this.port);

  sock.on('message', (msg) => {
    console.log('master received msg:', JSON.stringify(msg));

    if (msg.cmd === 'addMonitor') {
      switch (msg.type) {
        case 'count':
          self.addCount(msg.metry);
          break;
        case 'time':
          self.addTime(msg.metry, msg.time);
          break;
        default:
          break;
      }
    }
  });

  this.send();
}

Master.prototype.initMonitor = function (host, port, prefix, loop) {
  this.carbonHost = host;
  this.carbonPort = port;
  this.barbonPrefix = `${prefix}.`;
  this.cycle = cycle * (loop || 1);

  this.send();
};

Master.prototype.addCount = function (metry) {
  metry = `${this.barbonPrefix + metry}_Count` + `_${hostname}`;

  if (!metrics[metry]) {
    metrics[metry] = 1;
  } else {
    metrics[metry]++;
  }
};

Master.prototype.addTime = function (metry, time) {
  metry = `${this.barbonPrefix + metry}_Time` + `_${hostname}`;

  if (!timeCache[metry]) {
    timeCache[metry] = {
      count: 1,
      time
    };
  } else {
    timeCache[metry].count++;
    timeCache[metry].time += time;
  }

  metrics[metry] = timeCache[metry].time / timeCache[metry].count;
};

Master.prototype.sendToWatcher = function () {
  const self = this;

  const url = ['plaintext://', this.carbonHost, ':', this.carbonPort, '/'].join('');
  const client = graphite.createClient(url);

  console.log('send metrics', metrics);
  client.write(metrics, (err) => {
    if (!err) {
      client.end();
      for (const metry in metrics) {
        if (metrics.hasOwnProperty(metry)) {
          metrics[metry] = 0;
        }
      }

      for (const metry in timeCache) {
        if (timeCache.hasOwnProperty(metry)) {
          timeCache[metry] = null;
        }
      }
    } else {
      console.error(err);
    }
  });

  console.log('发送汇总数据:', metrics, timeCache);
  self.send();
};

Master.prototype.send = function () {
  const self = this;
  setTimeout(() => {
    self.sendToWatcher();
  }, cycle * 1000);
};


module.exports = Master;


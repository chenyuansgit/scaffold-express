const Master = require('./lib/Master');
const Worker = require('./lib/Worker');

function Monitor() {
}

// 初始化通知端口
Monitor.prototype.initMonitor = function (bindport, options) {
  bindport = bindport || 3456;

  this.master = new Master(bindport);
  this.worker = new Worker(bindport);

  return this.master.initMonitor(options.host, options.port, options.prefix, options.loop);
};

// 给业务调用的添加监控方法
Monitor.prototype.addCount = function (metry) {
  return this.worker.addCount(metry);
};

Monitor.prototype.addTime = function (metry, time) {
  return this.worker.addTime(metry, time);
};

module.exports = new Monitor();

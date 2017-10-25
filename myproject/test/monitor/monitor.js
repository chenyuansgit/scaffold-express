let monitor = require("@qnpm/q-monitor");
var cluster = require('cluster');
var os      = require('os');

var numCPUs = os.cpus().length;

monitor.initMonitor('127.0.0.1', '8080');

if (cluster.isMaster) {
    console.log('[master] ' + "master started, pid:" + process.pid);

    cluster.on('fork', function (worker) {
        console.log('[master] ' + 'fork: worker' + worker.id);
    });

    for (var i = 0; i < 3; i++) {
        cluster.fork();
    }
    cluster.on("message", function(worker, message, handle){
        console.log("message:", message);
        monitor.messageHandler(message);
    });
} else if (cluster.isWorker) {
    monitor.addTime(789, 666);
}
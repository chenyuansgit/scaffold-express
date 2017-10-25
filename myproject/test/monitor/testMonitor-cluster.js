var cluster = require('cluster');
let monitor = require("@mine/q-monitor");
//require("./testChild");

if (cluster.isMaster) {
    console.log('[master] ' + "master started, pid:" + process.pid);

    cluster.on('fork', function (worker) {
        console.log('[master] ' + 'fork: worker' + worker.id);
    });

    for (var i = 0; i < 3; i++) {
        cluster.fork();
    }
} else if (cluster.isWorker) {
    monitor.initMonitor(3456, {
        host: "localhost",
        port: 8080,
        prefix: "",
        loop: ""
    });

    setInterval(function(){
        console.log("子进程发送数据", process.pid);
        monitor.addTime(process.pid, 456);
    }, 2000);
}
let monitor = require("@mine/q-monitor");

setInterval(function(){
    console.log("子进程发送数据", process.pid);
    monitor.addTime(process.pid, 456);
}, 2000);
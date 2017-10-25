let monitor = require("@mine/q-monitor");
//require("./testChild");

monitor.initMonitor(3456, {
    host: "qmon-hotel.corp.qunar.com",
    port: 2013,
    prefix: "s.hotel.ued.easy.smart-hotel",
    loop: ""
});

console.log("process.env.NODE_APP_INSTANCE:", process.env.NODE_APP_INSTANCE);

setInterval(function(){
    monitor.addTime("test", 20);
}, 2000);

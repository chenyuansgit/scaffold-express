// 1. 连接到socket.io服务器
var io = require('socket.io-client');

var socket = io.connect('http://localhost:3005');

socket.on('connect', function(){
    console.log('io client connect to server');
});

socket.on('connect_error', function(){
    console.log('io client connect error');
});

socket.on("disconnect", function () {
    console.log('io client disconnect');
});

socket.on("error", function (err) {
    console.log('io client error:', err);
});
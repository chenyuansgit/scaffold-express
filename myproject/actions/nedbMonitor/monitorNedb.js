// 监控db文件的变化:在当前进程外修改nedb数据库后需要重新加载nedb
var modeDb = require('../../Common/Database/nedb.js');
var nedbConfig = require('../../Config/nedbConfig.js');
var fs = require('fs');
var chokidar = require('chokidar');

var watcher = chokidar.watch(nedbConfig.dataFilePath, {
    persistent: true,
    alwaysStat: true,
    ignored: /[\/\\]\./
});

var temp_size = 0; // 保存文件名大小

watcher.on('add', function (path) {
        console.log(`File ${path} has been added`);
    })
    .on('change', function (path, stats) {
        console.log(`File ${path} has been changed`,temp_size, stats.size);
        if(temp_size != stats.size) {
            console.log('reload nesdb...');
            modeDb.loadDatabase();
            temp_size = stats.size;
        }
    })
    .on('unlink', function (path) {
        console.log(`File ${path} has been removed`);
    });


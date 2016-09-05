var fs = require('fs');
var path = require('path');

var uploadModule = require("./Module/uploadModule.js");
var uploadConfig = require('./Config/uploadConfig.js');
var util = require('../../Common/util/myutil.js');

var port = uploadConfig.port;


var destPath = path.join(__dirname, uploadConfig.rootPath, uploadConfig.destPath);
var tempPath = path.join(__dirname, uploadConfig.rootPath, uploadConfig.tempPath);


// 创建io服务器
var ioServer = require('socket.io')(port);
console.log('io server  Listening on  port', port);


// 监听到socket连接
ioServer.on('connection', function (socket) {
    console.log('new connection..');

    // 文件路径
    var tempFileFullPath = null;
    var filename = null;
    var destFileFullPath = null;

    // 1.获取缓存路径中的文件大小
    socket.on('get file size', function (message) {
        console.log('1.get file size:', message);
        filename = message.filename;
        // 获取文件缓存的完整路径
        tempFileFullPath = path.join(tempPath, filename);
        
        // 获取缓存文件的大小
        var size = uploadModule.getFileSize(tempFileFullPath);
        console.log('size:', size);
        socket.emit('file size', {size: size});
    });

    // 2.上传文件到临时路径
    socket.on('upload file', function (message) {
        //console.log('2.upload file:', message);
        console.log('2.upload file...', message.content.length);
        var dir = tempPath;
        uploadModule.appendFile(tempFileFullPath, dir, message.content, function (error, result) {
            if (error) {
                socket.emit('upload result', {
                    code: 1,
                    message: error
                });
                return;
            }
            socket.emit('upload result', {
                code: 0,
                message: 'save file successful'
            });
        });

    });

    // 3.校验文件md5, 保证文件完整传输
    socket.on('vef md5', function (message) {
        console.log('3.vef md5:', message);
        var msg_md5 = message.md5;
        util.getFileMd5(tempFileFullPath, function (err, result) {
            if (msg_md5 != result) {
                console.log(msg_md5, result);
                socket.emit('vef md5 result', {
                    code: 1,
                    message: '文件md5不匹配'
                });
                return;
            }
            socket.emit('vef md5 result', {
                code: 0,
                message: 'md5匹配成功'
            });

        });
    });

    // 4.移动文件到最终路径
    socket.on('set savePath', function (message) {
        console.log('4.set savePath:', message);

        // 将文件移动至最终目录
        var msg_path = message.path;

        var dir = path.join(destPath, msg_path);

        console.log(msg_path, dir, destPath, filename);
        destFileFullPath = path.join(destPath, msg_path, filename);

        uploadModule.moveFile(tempFileFullPath, dir, destFileFullPath, function (err) {
            var returnPath = path.join(uploadConfig.destPath, msg_path, filename);
            //console.log('返回的路径:', returnPath);
            if (err) {
                socket.emit('move result', {
                    code: 1,
                    message: err
                });
                return;
            }
            socket.emit('move result', {
                code: 0,
                message: returnPath
            });

        });
    });

    // socket断开连接
    socket.on('disconnect', function () {
        console.log('socket disconnect');
    });

    // 监听socket错误
    socket.on('error', function(error){
        console.log('socket catch error:', error);
    });
});




'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var gm = require('gm');


// 存储文件
class uploadModule {
    getFileSize(storePath) {
        var size = 0;
        if (fs.existsSync(storePath)) {
            var fileInfo = fs.statSync(storePath);
            size = fileInfo.size || 0;
        }
        return size;
    }

    appendFile(storePath, dir, content, callback) {
        // 创建临时文件夹
        mkdirp.sync(dir);

        if (storePath) {
            if (fs.existsSync(dir)) {
                fs.appendFile(storePath, content, callback);
            } else {
                callback('路径不存在:'+storePath);
            }

        } else {
            callback('没有需要保存的完整路径名');
        }
    }

    moveFile(source, dir, dest, callback) {

        // 创建目标文件夹
        mkdirp.sync(dir);

        // 旋转保存图片
        gm(source)
            .autoOrient()
            .write(dest, function (err) {
                if (err) {
                    // 图片旋转失败(可能是普通文件)则直接移动
                    fs.rename(source, dest, callback);
                } else {
                    // 成功后删除源文件
                    fs.unlinkSync(source);
                    //console.log('autoOrient img over');
                    callback(null);
                }
            });
    }
}

module.exports = new uploadModule();


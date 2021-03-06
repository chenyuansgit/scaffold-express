var crypto = require('crypto');
var fs = require('fs');
var SparkMD5 = require('../../Common/md5/spark-md5.js');
var util = require('util');

var myutil = {
    // 打印对象
    printObject: function (data) {
        console.log(util.inspect(data, {showHidden: false, depth: null}));
    },

    // 解析时间戳
    parseTimestamp: function (timestamp, isSec) { //默认为毫秒
        if (timestamp) {
            var time = parseInt(timestamp);
            if (time != timestamp) { // 时间格式
                return timestamp;
            }
            var date = new Date(time);
            if (isSec) { // 输入秒
                date = new Date(time * 1000);
            }
            return date.toLocaleString();
        }
        return '';

    },

    // 生成n位随机数
    getRand: function (digit) {
        var number = '';
        for (var i = 0; i < digit; i++) {
            number += Math.floor(Math.random() * 10);
        }
        //console.log('随机数:', number);
        return number;
    },

    // 在范围类的整数
    getRandNum: function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    },

    // 密码加密
    cipherPassword: function (password) { // 加密
        var sha1 = crypto.createHash('sha1');
        sha1.update(password);
        var password_cipher = sha1.digest('hex');
        return password_cipher;
    },

    // 获取文件的md5
    getFileMd5_normal: function (filePath, callback) {
        var md5sum = crypto.createHash('md5');
        var stream = fs.createReadStream(filePath);

        stream.on('data', function (chunk) {
            md5sum.update(chunk);
        });

        stream.on('end', function () {
            var md5 = md5sum.digest('hex').toUpperCase();
            callback(null, md5);
        });

    },

    // 获取文件的md5
    getFileMd5: function (filePath, callback) {
        var spark = new SparkMD5();

        var stream = fs.createReadStream(filePath, {encoding: 'binary'});

        stream.on('data', function (chunk) {
            spark.appendBinary(chunk);
        });

        stream.on('end', function () {
            var md5 = spark.end();
            callback(null, md5);
        });
    },

    
};


module.exports = myutil;
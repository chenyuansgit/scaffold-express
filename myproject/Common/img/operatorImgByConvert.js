// 用linux系统自带的convert命令操作图片
var exec = require("child_process").exec;

var operatorImgByConvert = {
    // 执行系统命令
    ExecCmd: function (Cmd, resolve, reject) {
        exec(Cmd, function (err, result) {
            if (err) {
                reject("执行命令发生错误:" + err.toString());
                return;
            }
            resolve(result);
        })

    },


    // 转换文件类型:ipg
    convertImgFormat: function (sourceUrl, destUrl) {
        var self = this;
        return new Promise(function (resovle, reject) {
            if (!sourceUrl || !destUrl) {
                reject('文件的路径未设置');
                return;
            }
            var cmd = "convert " + sourceUrl + " " + destUrl;
            self.ExecCmd(cmd, resovle, reject);
        });

    },

    // 获取jpg图片的色值
    getJpgColorspace: function(sourceUrl) {
        var self = this;
        return new Promise(function (resovle, reject) {
            if (!sourceUrl ) {
                reject('文件的路径未设置');
                return;
            }
            var cmd = "identify " + sourceUrl ;
            self.ExecCmd(cmd, resovle, reject);
        });
    },

    // 转换jpg的编码格式
    convertJpgColorspace: function (sourceUrl, destUrl) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!sourceUrl || !destUrl) {
                reject('文件的路径未设置');
                return;
            }
            var cmd = "convert -colorspace RGB " + sourceUrl + " " + destUrl;
            self.ExecCmd(cmd, resolve, reject);
        });
    }

};

module.exports = operatorImgByConvert;
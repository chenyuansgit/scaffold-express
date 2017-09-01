var logger = require('./logger.js');
var util = require('util');


class BlockLog {
    constructor(logFileName){
        this.msgs = [];
        this.aborted = false;
        this.fName = logFileName || 'default';
        if(!logger[this.fName]){
            logger[this.fName] = logger.createLogHandler(this.fName);
        }
    }

    _now_formate_date() {
        var D = new Date();

        var H = D.getHours(),
            M = D.getMinutes(),
            s = D.getSeconds(),
            S = D.getMilliseconds();
        var r = '' +
            (H < 10 ? '0' + H : H) +
            ':' +
            (M < 10 ? '0' + M : M) +
            ':' +
            (s < 10 ? '0' + s : s) +
            '.' +
            (S < 10 ? '00' + S : S < 100 ? '0' + S : S);
        return r;
    }

    // 传入要打印的日志，可以多个参数
    push() {
        if(this.aborted) return;
        var str = this._now_formate_date() + ' ' + util.format.apply(null, arguments);
        this.msgs && this.msgs.push(str);
    };

    // 结束时将队列中日志打印到控制台
    end() {
        if(this.aborted || this.msgs === null){
            return;
        }

        if(arguments.length) {
            this.push.apply(this, arguments);
        }

        logger[this.fName].log('writelog\n' + this.msgs.join('\n') + '\n');
        this.msgs = null;
    };


    // 终止打印日志
    abort() {
        this.aborted = true;
        this.msgs = null;
    }
}

module.exports = BlockLog;

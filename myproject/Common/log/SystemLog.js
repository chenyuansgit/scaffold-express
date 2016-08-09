/**
 * Created by jessa on 14-9-17.
 */
var colors = require('colors');
var PHP = require('phpjs');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});
var TerminalLog = {
    writeLog: function (log, outTime, themeKey) {
        var outPut = log+'';
        if (outTime == true) {
            outPut = outPut + ' ' + PHP.date("Y-m-d H:i:s");
        }
        if (themeKey && themeKey != "") {
            eval("console.log(outPut." + themeKey + ")")
        } else {
            console.log(outPut);
        }
    }
};
exports.TerminalLog = TerminalLog;


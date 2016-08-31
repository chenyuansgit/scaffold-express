var validator = require('validator');//在此基础上拓展一些函数


// 是否是身份证号
validator.isIdCard = function (str) {
    //return validator.matches(str, /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
    if (str == "") {
        console.log("输入身份证号码不能为空!");
        return false;
    }

    if (str.length != 15 && str.length != 18) {
        console.log("输入身份证号码格式不正确!");
        return false;
    }

    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    if (area[parseInt(str.substr(0, 2))] == null) {
        console.log("身份证号码不正确(地区非法)!");
        return false;
    }

    if (str.length == 15) {
        var pattern = /^\d{15}$/;
        if (pattern.exec(str) == null) {
            console.log("15位身份证号码必须为数字！");
            return false;
        }
        var birth = parseInt("19" + str.substr(6, 2));
        var month = str.substr(8, 2);
        var day = parseInt(str.substr(10, 2));
        switch (month) {
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
                if (day > 31) {
                    console.log('输入身份证号码不格式正确!');
                    return false;
                }
                break;
            case '04':
            case '06':
            case '09':
            case '11':
                if (day > 30) {
                    console.log('输入身份证号码不格式正确!');
                    return false;
                }
                break;
            case '02':
                if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                    if (day > 29) {
                        console.log('输入身份证号码不格式正确!');
                        return false;
                    }
                } else {
                    if (day > 28) {
                        console.log('输入身份证号码不格式正确!');
                        return false;
                    }
                }
                break;
            default:
                console.log('输入身份证号码不格式正确!');
                return false;
        }
        var nowYear = new Date().getYear();
        if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
            console.log('输入身份证号码不格式正确!');
            return false;
        }
        return (true);
    }

    var Wi = new Array(
        7, 9, 10, 5, 8, 4, 2, 1, 6,
        3, 7, 9, 10, 5, 8, 4, 2, 1
    );
    var lSum = 0;
    var nNum = 0;
    var nCheckSum = 0;

    for (var i = 0; i < 17; ++i) {


        if (str.charAt(i) < '0' || str.charAt(i) > '9') {
            console.log("输入身份证号码格式不正确!");
            return (false);
        }
        else {
            nNum = str.charAt(i) - '0';
        }
        lSum += nNum * Wi[i];
    }


    if (str.charAt(17) == 'X' || str.charAt(17) == 'x') {
        lSum += 10 * Wi[17];
    }
    else if (str.charAt(17) < '0' || str.charAt(17) > '9') {
        console.log("输入身份证号码格式不正确!");
        return (false);
    }
    else {
        lSum += ( str.charAt(17) - '0' ) * Wi[17];
    }


    if ((lSum % 11) == 1) {
        return true;
    }
    else {
        console.log("输入身份证号码格式不正确!");
        return false;
    }
};

// 是否是电话号码
validator.isMobilePhone = function (str) {
    var isLocal = validator.isMobilePhone(str, 'zh-CN');
    var isTw = validator.isMobilePhone(str, 'zh-TW');
    return isLocal || isTw;
};

// 是否是银行卡号
validator.isBankCard = function (str) {
    //return validator.isCreditCard(str);
    var bCard = validator.matches(str, /^\d{16,20}$/);
    return bCard;
};

// 是否是传真
validator.isFax = function(str) {
    var isLocal = validator.isMobilePhone(str, 'zh-CN');
    var isTw = validator.isMobilePhone(str, 'zh-TW');
    return isLocal || isTw;
};

module.exports = validator;
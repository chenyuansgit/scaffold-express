var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    /*res.write(JSON.stringify({
        "123": 123,
        "asdf": 43254,
        "bbb": {
            a: 'qq',
            b: 'ff'
        },
        "test":[1,2,3]
    }));
    res.end();
    return;*/
    res.render('camera');
});

module.exports = router;
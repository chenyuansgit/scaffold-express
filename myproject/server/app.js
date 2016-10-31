var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session'); // 添加session支持:内存

var middleware = require('../middleware/commMiddleware.js');

var index = require('../routes/index');
var users = require('../routes/users');
var camera = require('../routes/camera');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../',  'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//访问静态文件路径:https://localhost:3000/stylesheets/style.css
app.use(express.static(path.join(__dirname,'../', 'public')));
app.use(cookieSession({keys: ['artronSecret']}));


app.use('/', index);
app.use('/camera', camera);
app.use('*', middleware.checkNotLogin); //只有用户登录了,才能进行下面操作
app.use('/user', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

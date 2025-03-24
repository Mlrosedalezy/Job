var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
require('dotenv').config({ path: './project.env' });

// 验证请求头中的token
const { secret } = require('./until/token')
// 引入expressJWT，解析jwt
const { expressjwt: expressJWT } = require("express-jwt");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const manage = require('./routes/manage')
const login = require('./routes/login')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// 验证token中间件，除了登录接口，其他接口都需要验证token
app.use(
  expressJWT({ secret: secret, algorithms: ["HS256"] })
    // 验证白名单
    .unless({ path: ['/login/login', '/login/checktoken','/login/refresh_token', '/login/telcode', '/login/altelcode'] })
);
// 错误处理中间件
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // 处理 JWT 验证失败的情况
    res.send({
      status: 401,
      message: 'token验证失败',
    });
  } else {
    // 处理其他类型的错误
    next(err);
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manage',manage)
app.use('/login',login)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

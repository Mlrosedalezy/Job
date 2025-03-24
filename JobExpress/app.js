var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: './Smskey.env' });

const shortMessageRoutes = require("./routes/ShortMessage").router; // 引入 ShortMessage 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/Login'); // 引入 Login 路由
var PcLoginRouter = require('./routes/PcLoing');
var RoutingRouter = require('./routes/Routing.JS') // 确保文件名大小写一致
var QrCodeRouter = require('./routes/QrCode.JS');

var app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/ShortMessage", shortMessageRoutes); // 使用 ShortMessage 路由
app.use("/login", loginRouter); // 使用 Login 路由
app.use("/pcLogin", PcLoginRouter);
app.use("/routing", RoutingRouter); // 使用 Routing 路由
app.use('/qrCode', QrCodeRouter); // 使用 QrCode 路由



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
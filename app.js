var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const parser = require('body-parser');
const queryStr = require('querystring');
const { expressjwt: jwt } = require('express-jwt');
let session = require('express-session')
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');


var app = express();

app.use(cors());
app.use(session({
  secret: 'ghnodejs',
  resave: false,
  saveUninitialized: true
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use() 注册全局中间件
app.use(logger('dev'));
//内置中间件
app.use(express.json());
// app.use(parser.urlencoded({ extended: false}));
//express.urlencoded 基于body-parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwt({ secret: 'secret_key', algorithms: ["HS256"], credentialsRequired: false }));
// app.use(jwt({ secret: 'secret_key', algorithms: ["HS256"] }).unless({path: ['/login/login']}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/routes', express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));


const rt = function (req, res, next) {
  console.log('路由中间件 函数');
  next();
};

app.use(rt);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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

module.exports = app

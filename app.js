var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');//解析cookie，只要经过这个就可以通过req.cookie去访问cookie了
var logger = require('morgan');//记录access log，自动生成日志，还需要一点配置
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
//引用两个路由
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

//初始化app，生成一个实例
var app = express();

//视图引擎的设置，我们这里不管，前端的事
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  //开发环境/测试环境
  app.use(logger('dev'));
}else{
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}



app.use(express.json());//postdata，路由post数据后，监听，可以直接通过req.body来得到
app.use(express.urlencoded({ extended: false }));//适用于所有格式，而不仅仅是json
app.use(cookieParser());//解析cookie
//app.use(express.static(path.join(__dirname, 'public')));//对应public的静态文件

//之前没有store，我们就把session存到内存中了，现在有store，就存在redis中了
const redisClient = require('./db/redis')
const sessionStore= new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/', //默认配置
    // httpOnly: true, //默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

//注册路由
// app.use('/', indexRouter);//包括根的路由
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter); //转到blogRouter里面，会在/api/blog后面加上/list
app.use('/api/user', userRouter); 

//拼接路由好处：细节和父路由的分离，模块分离的比较明确，改起只需要改一小部分内容

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  //如果是开发环境，就报错，如果不是就返回空，不能泄漏漏洞
  res.locals.error = req.app.get('env') === 'dev' ? err : {};//本来是'development'但是我们在package.json中已经改了dev

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var credentials = require('./credentials')
const mongoose = require('mongoose');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var userRouter = require('./routes/Users/userRouter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const expressSession = require('express-session')
const flash = require('express-flash')
app.use(cookieParser('dnt0706'))
app.use(expressSession({ cookie: { maxAge: 60000 } }))
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.Promise = global.Promise
    // switch (app.get('env')) {
    //     case 'development':
mongoose.connect(credentials.mongo.development.connectionString, opts)
    .then(
        () => {
            console.log('Kết nối thành công');
        },
        err => {
            console.log(err);

        })

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/user', userRouter);
// catch 404 and forward to error handler

app.get('/', (req, res, next) => {
    res.json({ code: 0, message: 'REST API' })
})

app.use(function(req, res, next) {
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();

});
// error handler
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
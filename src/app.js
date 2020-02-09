const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('shop-sequelize:DB');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./models/User');
const connect = require('./utils/database');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const mongo = connect();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongo.connection,
      autoRemove: 'native',
    }),
    unset: 'destroy',
  }),
);

app.use(async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await User.findById(req.session.user._id);
      req.user = user;
      return next();
    } catch (error) {
      debug(error);
      return next(error);
    }
  }
  return next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/shop', shopRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

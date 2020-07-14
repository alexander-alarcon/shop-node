const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('shop-mongoose:DB');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/User');
const connect = require('./utils/database');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const { get404, get500 } = require('./controllers/Error');

const mongo = connect();
const app = express();
const csrfProtection = csrf();

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
app.use(csrfProtection);
app.use(async (req, res, next) => {
  if (req.session.user && !req.user) {
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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/shop', shopRouter);
app.use('/admin', adminRouter);

app.use(get404);

app.use(get500);

module.exports = app;

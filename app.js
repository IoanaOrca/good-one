'use strict';
// packages
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// npm install --save express-session connect-mongo

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// require routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');

const app = express();

// database Connection
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/goodOne', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// session Setup
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Midlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// note1: currentUser needs to match whatever you use in login/signup/logout routes
// note2: if using passport, req.user instead
app.use(function (req, res, next) {
  app.locals.user = req.session.currentUser;
  next();
});

// use Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/movies', moviesRouter);

// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;

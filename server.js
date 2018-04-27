'use strict';
require('dotenv').load();

// app
const express = require('express');
const app = express();
app.set('port', (process.env.PORT || 5000));

// views
app.set('views', './src/templates');
app.set('view engine','pug');

// assets
app.use('/assets',express.static('dist'));

// sessions
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore({ url: process.env.REDIS_URL, prefix: 'dh:' }),
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
}));

// body
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
const Routes = require('./src/server/routes');
Routes.init(app);

// do-it to-it
app.listen(app.get('port'),function(){
  console.log('Server up on',app.get('port'),'in',process.env.NODE_ENV);
});
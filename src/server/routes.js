'use strict';
const express = require('express');

const AppController = require('../controllers/app_controller');
const UsersController = require('../controllers/users_controller');

const Auth = require('./auth');

const reqAuth = (req,res,next) => { req.isAuthenticated() ? next() : res.status(402).json({error: "Not authorized"}); };
const returnToPage = (req,res) => { res.redirect(req.session.redirect_to || '/'); delete req.session.redirect_to; };

const Routes = {
  init: function(app){
    Auth.init(app);

    app.get('/',AppController.index);
    app.post('/logout',Auth.logoutHandler);
  
    const api = express.Router();
    api.post('/login',Auth.loginHandler);
    
    api.post('/users',UsersController.create);
    api.get('/user',reqAuth,UsersController.show);

    app.use('/api',api);
  }
};

module.exports = Routes;
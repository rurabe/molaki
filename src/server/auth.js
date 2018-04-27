'use strict';
const Passport = require('passport');
const LocalStrategy = require('passport-local');

const UsersQueries = require('../queries/users_queries');

const strategyOptions = {
  passReqToCallback: true,
  usernameField: 'email'
};

const Auth = {
  init: function(app){

    Passport.use(new LocalStrategy(strategyOptions,
      function(req,email,password,done) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return UsersQueries.authenticate(email,password,ip).then(user => {
          return done(null,user);
        }).catch(e => {
          return done(null,false,e);
        });
      }
    ));

    Passport.serializeUser(function(user, done) {
      return done(null, user.id);
    });

    Passport.deserializeUser(function(id, done) {
      return done(null,{id: id});
    });

    app.use(Passport.initialize());
    app.use(Passport.session());
  },
  loginHandler: function(req,res,next){
    return Passport.authenticate('local',(err,user,info) => {
      if(err)  { res.status(403).json({ error: err.message }) }
      if(!user){ res.status(403).json({ error: 'Not found' }) }
      if(user){
        req.logIn(user,function(err){
          res.json({user: user})
        });
      }
    })(req,res,next);
  },
  logoutHandler: function(req,res,next){
    req.logout(); // passport method
    res.redirect('/');
  }
};

module.exports = Auth;
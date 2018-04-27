'use strict';
const UsersQueries = require('../queries/users_queries');

const { strongParams } = require('../helpers/params_helpers');

const whitelist = {
  name: true,
  email: true,
  password: true,
};

const UsersController = {
  create: function(req,res){
    const params = req.body;
    if(params.name && params.email && params.password){
      UsersQueries.create(req.body).then(user => {
        req.logIn(user,function(err){
          res.json({user: user});
        });
      });
    } else {
      res.status(400)
    }
  },
  show: function(req,res){
    UsersQueries.find(req.user.id).then(user => {
      res.json({user: user});
    });
  }
};

module.exports = UsersController;
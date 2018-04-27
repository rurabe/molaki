'use strict';

const AppController = {
  index: function(req,res){
    res.render('index/index',{state: {user: req.user}});
  }
};

module.exports = AppController;
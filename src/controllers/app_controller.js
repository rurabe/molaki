'use strict';
const RatesQueries = require('../queries/rates_queries');

const AppController = {
  index: function(req,res){
    RatesQueries.latest().then( rates => {
      res.render('index/index',{state: {rates: rates, user: req.user}});
    })
  }
};

module.exports = AppController;
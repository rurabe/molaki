'use strict';
const Promise = require('bluebird');
const request  = require('superagent');
const cheerio = require('cheerio');

const _url = ((periods) =>  `https://www.fanniemae.com/content/datagrid/hist_net_yields/cur${periods}.html` );

const _getPeriodRates = (periods) => {
  return request(_url(periods)).then(response => {
    return cheerio.load(response.text);
  }).then( $ => {
    let r = {};
    $('.content-grid-table tr').each((i,row) => {
      const cells = $(row).children();
      const date = cells.eq(0).text();
      if(date.match(/\d+\/\d+\/\d+/)){
        r[date] = cells.eq(4).text();
      }
    });
    return r;
  });
};

const FannieMae = {
  getRates: function(){
    return Promise.props({
      'fifteen_year_fixed': _getPeriodRates(15),
      'thirty_year_fixed': _getPeriodRates(30)
    }).then(periods => {
      let obj = {};
      for(let period in periods){
        for(let date in periods[period]){
          if(!obj[date]){ obj[date] = {date: date}; }
          obj[date][period] = periods[period][date];
        }
      }
      return Object.values(obj);
    })
  }
}

module.exports = FannieMae;
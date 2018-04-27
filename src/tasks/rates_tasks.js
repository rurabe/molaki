const FannieMae = require('../external/fannie_mae');
const RatesQueries = require('../queries/rates_queries');

const RatesTasks = {
  import: function(){
    return FannieMae.getRates().then(RatesQueries.upsert);
  }
};

module.exports = RatesTasks
'use strict';
const DB = require('../server/db');

const RatesQueries = {
  latest: function(){
    return DB.one(`
      select to_char(date,'YYYY-MM-DD') as date,fifteen_year_rate::real,thirty_year_rate::real 
      from rates order by date desc limit 1;
    `);
  },
  upsert: function(data){
    return DB.any(`
      with update_json as (
        select * from json_to_recordset($1) as 
        (date date,fifteen_year_rate numeric(7,5),thirty_year_rate numeric(7,5))
      )
      insert into rates(date,fifteen_year_rate,thirty_year_rate)
      select date,fifteen_year_rate,thirty_year_rate from update_json
      on conflict (date) do update set 
        fifteen_year_rate=EXCLUDED.fifteen_year_rate,
        thirty_year_rate=EXCLUDED.thirty_year_rate;
    `,[JSON.stringify(data)])
  }
};

module.exports = RatesQueries;

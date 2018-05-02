'use strict';
const DB = require('../server/db');

const RatesQueries = {
  latest: function(){
    return DB.one(`
      select to_char(date,'YYYY-MM-DD') as date,fifteen_year_fixed::real,thirty_year_fixed::real 
      from rates order by date desc limit 1;
    `);
  },
  upsert: function(data){
    return DB.any(`
      with update_json as (
        select * from json_to_recordset($1) as 
        (date date,fifteen_year_fixed numeric(7,5),thirty_year_fixed numeric(7,5))
      )
      insert into rates(date,fifteen_year_fixed,thirty_year_fixed)
      select date,fifteen_year_fixed,thirty_year_fixed from update_json
      on conflict (date) do update set 
        fifteen_year_fixed=EXCLUDED.fifteen_year_fixed,
        thirty_year_fixed=EXCLUDED.thirty_year_fixed;
    `,[JSON.stringify(data)])
  }
};

module.exports = RatesQueries;

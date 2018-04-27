'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('rates',{
    date:               {type: 'date', primaryKey: true},
    fifteen_year_fixed: {type: 'decimal', length: '7,5'},
    thirty_year_fixed:  {type: 'decimal', length: '7,5'},
    created_at:         {type: 'timestamp'},
    updated_at:         {type: 'timestamp'}
  }).then(() => {
    return db.runSql(`
      create trigger timestamps_on_rates 
      before insert or update on rates 
      for each row execute procedure timestamp_on_change();
    `);
  });;
};

exports.down = function(db) {
  return db.dropTable('rates');
};

exports._meta = {
  "version": 1
};

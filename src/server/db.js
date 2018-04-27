'use strict';
require('dotenv').load();
const Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise
});

module.exports = pgp(process.env.DATABASE_URL);
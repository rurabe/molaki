'use strict';
const bcrypt = require('bcrypt');
const DB = require('../server/db');
const returnOne = DB.first;

// const UsersErrors = require('../errors/users_errors');

const UsersQueries = {
  create: function(params){
    return bcrypt.hash(params.password,10).then(encrypted_password => {
      return DB.query({
        text: `
          insert into users(email,encrypted_password,name) values ($1,$2,$3) 
          returning id,email,name,purchase_price;
        `,
        values: [params.email,encrypted_password,params.name],
      }).then(returnOne);
    });
  },
  authenticate: function(email,password,current_sign_in_ip){
    return DB.query({
      text: 'select * from users where email = $1 and encrypted_password is not null;',
      values: [email]
    }).then(returnOne).then(user => {
      if(!user){
        return Promise.reject(new UsersErrors.NotFound());
      } else {
        return bcrypt.compare(password,user.encrypted_password).then(isAuthorized => {
          if(isAuthorized){
            return _updateLoginInfo(user.id,current_sign_in_ip);
          } else {
            return Promise.reject(new UsersErrors.NotFound());
          }
        });
      }
    });
  },
  find: function(id){
    return DB.query({
      text: 'select id,email,name,purchase_price from users where id = $1',
      values: [id]
    }).then(returnOne);
  }
};

const _updateLoginInfo = function(id,current_sign_in_ip){
  return DB.query({
    text: `
      update users set
        sign_in_count = (sign_in_count + 1),
        last_sign_in_at = current_sign_in_at,
        current_sign_in_at = now(),
        last_sign_in_ip = current_sign_in_ip,
        current_sign_in_ip = $2
      where id = $1 returning *;`,
    values: [id,current_sign_in_ip],
  }).then(returnOne);
};

module.exports = UsersQueries;
'use strict';

const err = require('../util/error-handler.js');
const bcrypt = require('bcrypt');
const saltRounds = 3; // by increasing this value, the process is slowed.

module.exports = (User) => {
  User.observe('before save', function(ctx, next){
    if(ctx.instance){ 
      // single user update
      if(!ctx.instance.password){ 
        return next(err("Bad request: No password provided", 400));
      }
      bcrypt.hash(ctx.instance.password, saltRounds, (err, hash) => {
        if(err){ 
          return next(err("Server Error", 500));
        }
        ctx.instance.password = hash;
        next();
      });// end: bcrypt.hash
    }else{
      next(err("Bad request: Attempt to modify multiple users", 400));
    }
  })// end: User.observe
}// end: module.exports
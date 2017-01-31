'use strict';

let Rx = require('rx');
let bcrypt = require('bcrypt');

// returns true if match, false for all other queries
module.exports = () => {
  return {
    compare: (password, hash) => bcrypt.compare(password, hash)
  }// end: return
}// end: module.exports
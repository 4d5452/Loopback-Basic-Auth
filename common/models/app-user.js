'use strict';

const app = require('../../server/server');
const remoteTest = require('./app-user/remote-test.js');
const passwordHandler = require('./auth/password-handler.js');
const login = require('./auth/login.js');

module.exports = function(AppUser) {
  remoteTest(AppUser); 
  passwordHandler(AppUser); 
  login(AppUser);
};

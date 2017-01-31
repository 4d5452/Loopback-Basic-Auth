'use strict';

const Rx = require('rx');
const err = require('../util/error-handler.js');
const validate = require('./validate-password')();
module.exports = (User) => {
  /*Status Codes
    200 - successful login
    400 - bad request
    401 - failed login*/
  User.login = (credentials, options, cb) => {
    // get user from db
    let username = credentials.username;
    let password = credentials.password;
    let filter = {where: {"username": username}}
    let getUser = () => User.findOne(filter);
    let $user = Rx.Observable.fromPromise(getUser)// Observable || Stream
      .doOnError( // handle internal errors
        (error) => { // Should catch error from DB... need to find a test
          return Rx.Observable.throw(err("Server Error", 500)); 
        }
      ).flatMap((user) => { // Check for null user
        return Rx.Observable.if(
          () => {return !(user===null)},
          Rx.Observable.return(user), // user found: send down the chain
          Rx.Observable.throw(err("User does not exist", 401)) // User not found in db...
        );// end: if
      }).flatMap((user) => { // Check user password
        //Validate the user password
        let func = validate.compare(password, user.password);
        return Rx.Observable.fromPromise(func)
          .doOnError(
            (error) => {
              return Rx.Observable.throw(err("Server Error", 500));
            }
          ).flatMap((res) => {
            return Rx.Observable.if(
              () => { return res },
              Rx.Observable.return(user),
              Rx.Observable.throw(err("Password does not match"))
            );// end: if
          })
      }).map((user) => { // Generate
        // user password has been checked: get response here
        // This is the final phase: generate/store/send one access token back to 
        //  the client...  
        console.log(user);

      })

    let subscription = $user.subscribe(
      function(user) {
        //console.log('Next: \n', user);
        cb(null, 'TOKEN');
      },
      function(error) {
        console.log('Error: \n', error);
        cb(error);
      },
      function() {
        console.log('Completed');
      });

    // generate TOKEN 
    // store TOKEN with user
    // return token to user
    // callback with error if username:password don't match
  }// end: User.prototype.validPassword

  User.remoteMethod('login', {
    accepts: [
      {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ], 
    returns: {
      arg: 'accessToken', type: 'string'
    }, 
    http: {
      path: '/login', verb: 'post'
    }
  });// end: User.remoteMethod

  // RemoteMethod Hook used to sanitize input data from user
  User.beforeRemote('login', (ctx, unused, next) => {
    // search through credentials for username and password
    let $stream = Rx.Observable.pairs(ctx.args.credentials)
      .map((pair) => {
        return pair[0];// return keys from pairs
      }).filter((item) => {
        return item==="username" || item==="password";// find specific keys
      }).count()
      .flatMap((count) => {
        return Rx.Observable.if(
          () => {return count===2; },
          Rx.Observable.return(true),
          Rx.Observable.throw(err("Bad Request: username or password does not exist", 400))
        );//end: if
      });//end: stream1

    let subscription = $stream.subscribe(
      function(x){
        // Countinue to remote method
        next();
      },
      function(error){
        // Countinue to next error method
        next(error);
      },
      function(){
        // completed: Countinue to remote method
        //next();
      });
  });
}// end: module.exports

/* Junk
return Rx.Observable.if(
          () => {return validate(password, user.password);},
          Rx.Observable.return(user),
          Rx.Observable.throw(err("Password does not match", 401))
        );// end: if

return Rx.Observable.if(
          () => {return validate(User, user.id, password)}, // validate user password
          Rx.Observable.return(user), // password matches
          Rx.Observable.return(err("Password does not match"))
        );// end: if*/
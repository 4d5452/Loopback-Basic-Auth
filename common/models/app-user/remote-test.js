'use strict';

module.exports = (Model) => {
  
  Model.foo = (bar, cb) => {
    let out = "" + bar;
    cb(null, out);
  }

  Model.remoteMethod('foo', {
    accepts: [
      { arg: "bar", type: "string", required: true }
    ],
    returns: {
      arg: "out", type: "string"
    },
    http: {
      verb: "get",
      path: "/foobar"
    }
  });// end: Model.remoteMethod
}// end: module.exports
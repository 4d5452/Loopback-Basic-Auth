'use strict';

module.exports = (str, status) => {
  let err = new Error(str);
  err.status = status;
  return err;
}// end: module.exports
'use strict';

module.exports = function(Model, options){
  // Model is the model class
  // options is an object containing the config properties from model definition

  Model.defineProperty('created', {type: Date, default: '$now'});
  Model.defineProperty('modified', {type: Date, default: '$now'});

  Model.observe('before save', function(ctx, next){
    // Observing any insert/update event on Model
    if(ctx.instance){
      // insert
      ctx.instance.modified = Date.now();
    }else{
      // update
      ctx.data.modified = Date.now(); 
    }
    next();
  });
}
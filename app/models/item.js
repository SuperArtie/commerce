'use strict'; 
var _ = require('lodash');
var Mongo = require('mongodb');

function Item(o){
  this.name = o.name;
  this.dimensions = {};
  this.dimensions.l = o.dimensions.l * 1;
  this.dimensions.w = o.dimensions.w * 1;
  this.dimensions.h = o.dimensions.h * 1;
  this.weight       = o.weight * 1;
  this.color        = o.color;
  this.qty          = o.qty * 1;
  this.msrp         = o.msrp * 1;
  this.percentOff   = o.percentOff * 1;
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');
  }
});

Item.prototype.cost = function(){
  return this.msrp - ((this.percentOff/100)*this.msrp);
};

Item.prototype.save = function(cb){
  Item.collection.save(this, cb);
};

Item.all = function(cb){
  Item.collection.find().toArray(function(err, objects){
    var items = objects.map(function(o){
      return changePrototype(o);
    });
  cb(items);
  });
};

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  
  Item.collection.findOne({_id:_id}, function(err, obj){
    var item = changePrototype(obj);
    cb(item);
  });
};

Item.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Item.collection.findAndRemove({_id:_id}, cb);
};

function changePrototype(obj){
  var item = _.create(Item.prototype, obj);

  return item;
}

module.exports = Item;


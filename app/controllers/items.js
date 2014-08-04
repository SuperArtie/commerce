'use strict';

var Item = require('../models/item');

exports.init = function(req, res){
  res.render('items/init');
};

exports.create = function(req, res){
  var item = new Item(req.body);
  item.save(function(){
    res.redirect('/');
  });
  console.log(req.body);
};

exports.index = function(req, res){
  Item.all(function(items){
    res.render('items/index.jade', {items:items});
  });
};

exports.show = function(req, res){
  var id = req.params.id;
  Item.findById(id.toString(), function(item){
    res.render('items/show', {item:item});
  });
};

exports.destroy = function(req, res){
  var id = req.params.id;
  Item.deleteById(id.toString(), function(){
    res.redirect('/items');
  });
};

/* global describe, it, before, beforeEach */
/* jshint expr:true */
'use strict';
var expect = require('chai').expect;
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var Item = require('../../app/models/item.js');
var item1, item2, item3;
describe('Item', function(){
  before(function(done){
    dbConnect('commerce-test', function(){
      done();
    });
  });
  beforeEach(function(done){
    Item.collection.remove(function(){
      var o = {name:'iPod', dimensions:{l:'3', w:'5', h:'10'}, weight:'15.0', color:'teal', qty:'3', msrp:'200', percentOff:'20'};
      item1 = new Item(o);
      
      var o2 = {name:'iPhone', dimensions:{l:'4', w:'5', h:'8'}, weight:'15.0', color:'yellow', qty:'3', msrp:'200', percentOff:'20'};
      item2 = new Item(o2);
      
      var o3 = {name:'iPad', dimensions:{l:'5', w:'8', h:'9'}, weight:'15.0', color:'teal', qty:'3', msrp:'200', percentOff:'20'};
      item3 = new Item(o3);
      item1.save(function(){
        item2.save(function(){
          item3.save(function(){
            done();
          });
        });
      });
    });
  });
  describe('constructor', function(){
    it('should create an Item constructor', function(){
      expect(item1).to.be.instanceof(Item);
      expect(item1.name).to.equal('iPod');
      expect(item1).to.have.deep.property('dimensions.l', 3);
      expect(item1).to.have.deep.property('dimensions.w', 5);
      expect(item1).to.have.deep.property('dimensions.h', 10);
      expect(item1.weight).to.be.closeTo(15, 0.1);
      expect(item1.color).to.equal('teal');
      expect(item1.qty).to.equal(3);
      expect(item1.msrp).to.equal(200);
      expect(item1.percentOff).to.equal(20);
    });
  });
  describe('#cost', function (){
    it('should calculate the cost', function(){
      expect(item1.cost()).to.equal(160);
    });
  });
  describe('#save', function(done){
    it('should save item to mongodb', function(done){
      item1.save(function(){
        expect(item1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.all', function(){
    it('should get all items from the database', function(done){
      Item.all(function(items){
        expect(items).to.have.length(3);
        expect(items[0]).to.respondTo('cost'); 
        done();
      });
    }); 
  });

 describe('.findById', function(){
    it('should find an item', function(done){
      Item.findById(item2._id.toString(), function(err, item){
        expect(item2.name).to.equal('iPhone');
        expect(item2).to.respondTo('cost');
        expect(item2.color).to.equal('yellow');
        done();
      });
    });
  });

 describe('.deleteById', function(){
    it('should delete an item by its id', function(done){
      Item.deleteById(item3._id.toString(), function(){
        Item.all(function(items){
          expect(items).to.have.length(2);
          done();
        });
      });
    });
  });
});

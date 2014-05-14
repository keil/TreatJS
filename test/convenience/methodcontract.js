/*
 *  JavaScript Contracts
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * _Date: 2014-01-08 15:56:23 +0100 (Wed, 08 Jan 2014) _
 * _Rev: 23677 _
 */

var func = function(x,y,z) {return z;};
var obj = {p : "#"};

var context = new _.BaseContract(function(thisArg) {
  return (thisArg.p === "#");
}, "pIs#");

//var test = _.assert(
//                func,
//                _.SimpleMethodContract(true, true));
//test(3,4,5);

(function() {

  obj.test = _.assert(
    func,
    _.SimpleMethodContract(IsString, IsNumber, IsNumber, context));
  obj.test("3",4,5);
  //obj.test("3",4,true);

})();
(function() {

  obj.test = _.assert(
    func,
    _.SimpleMethodContract(IsNumber, IsBoolean, context));
  //obj.test(3,4,5);
  obj.test(3,4,true);
  obj.test(3,"",true);
  //obj.test("",4,true);

})();
(function() {

  obj.test = _.assert(
    func,
    _.SimpleMethodContract(IsNumber, IsNumber, IsBoolean, context));
  //obj.test(3,4,5);
  //obj.test("3","4",true);
  obj.test(3,7,true);
  //obj.test("",4,true);

})();
(function() {

  obj.test = _.assert(
    func,
    _.SimpleMethodContract(IsNumber, IsNumber, IsBoolean, context));
  //obj.test(3,4,5);
  obj.test(3,4,true);
  //obj.test(3,"",true);
  //obj.test("",4,true);

})();

(function() {

  obj.test = _.assert(
    func,
    _.AdvancedMethodContract({}, IsBoolean, context));
  //obj.test(3,4,5);
  obj.test(3,4,true);
  obj.test(3,"",true);
  obj.test("",4,true);

})(); 

(function() {

  obj.test = _.assert(
    func,
    _.AdvancedMethodContract({0:IsNumber, 3:IsString}, IsBoolean, context));
  //obj.test(3,4,5);
  //obj.test(3,4,true);
  obj.test(3,"",true);
  //obj.test("",4,true);

})();
(function() {

  obj.test = _.assert(
    func,
    _.AdvancedMethodContract([IsNumber, IsNumber], IsBoolean, context));
  //obj.test(3,4,5);
  obj.test(3,4,true);
  //obj.test(3,"",true);
  //obj.test("",4,true);

})();

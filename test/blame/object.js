/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

var objUnchecked = {x:4711, y:"4711", a:{x:4711, y:"4711"}, f:function(x) {return 4711;}, g:function(z) {return "4711";} };

var objChecked = _.assert(objUnchecked, _.AdvancedObjectContract({
  x:IsNumber,
    y:IsNumber,
    a:_.AdvancedObjectContract({x:IsNumber, y:IsNumber}),
    f:_.AdvancedFunctionContract([IsNumber], IsNumber),
    g:_.AdvancedFunctionContract([IsNumber], IsNumber),
}));


objChecked.x;
//objChecked.y;

//objChecked.y = 7;
//objChecked.y;

//objChecked.y = "2";
//objChecked.y;

objChecked.f(1);
//objChecked.f("a");
//objChecked.g(1);
//objChecked.g("1");

var p = objChecked.a;
//p.y="3";
//p.y;


objChecked.a.x;
//objChecked.a.y;
//objChecked.a.y = "2";
//objChecked.a.y;


objChecked.a = {x:4711, y:"4711"};
objChecked.a.x;
//objChecked.a.y;
//objChecked.a.y = "2";
//objChecked.a.y;

objChecked.g = function(z) {return "4711";}
//objChecked.g(1);

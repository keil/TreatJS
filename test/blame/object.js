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

var objUnchecked = {x:4711, y:"4711", a:{x:4711, y:"4711"}, f:function(x) {return 4711;}, g:function() {return "4711";} };

var objChecked = _.assert(objUnchecked, _.AdvancedObjectContract({
  x:IsNumber,
    y:IsNumber,
    a:_.AdvancedObjectContract({x:IsNumber, y:IsNumber}),
    f:_.AdvancedFunctionContract([IsNumber], IsNumber),
    g:_.AdvancedFunctionContract([IsNumber], IsNumber),
}));

/*
objChecked.x;
//objChecked.y;

objChecked.y = 7;
//objChecked.y = "2";
objChecked.y;
*/

a = objChecked.a;
a.y;




//objChecked[0];
//
//
//objChecked.g = function(x) {return "4711";};
//objChecked.g(2);

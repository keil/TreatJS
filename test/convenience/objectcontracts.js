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

var obj = {a:4711, b:4712, 0:4713}

// TODO
// * BUG: the array element foreach is used as contract!

// array
// object
// regmap
// stringmap
//

/*
 * BUG: the array element foreach is used as contract!
 var test = _.assert(
 obj,
 _.AdvancedObjectContract(_.Map.StringMap([IsNumber, IsBoolean])));

 test.a;
 test.b;
 test.c;
 test[0];
//test[1];
*/

/*
   var test = _.assert(
   obj,
   _.AdvancedObjectContract(_.Map.StringMap({a:IsNumber, c:IsNumber})));

   test.a;
   test.b;
//test.c;
test[0];
test[1];
*/

/*
   var test = _.assert(
   obj,
   _.AdvancedObjectContract(_.Map.RegExpMap([_.Map.Mapping(/a|b|c/, IsNumber), _.Map.Mapping(/0|1/, IsNumber)])));

   test.a;
   test.b;
//test.c;
test[0];
//test[1];
*/

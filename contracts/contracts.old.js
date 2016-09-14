/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function(TreatJS) {

  // List of predefine contracts
  var Contracts = [];


    
    var Zero = TreatJS.Contract.Base(function(arg) {
      return (arg === 0);
    },"Zero");



  /* Is-Contracts */

  var isPrimitiveValue = TreatJS.Contract.Base(function(arg) {
    return (target !== Object(target)) ? true : false; 
  },"isPrimitiveValue");

  var isNativeFunction = TreatJS.Contract.Base(function(arg) {
    return (Function.prototype.toString.apply(func).indexOf('[native code]') > -1); 
  },"isNativeFunction");

  /** **/ regeister("isPrimitiveValue", isPrimitiveValue, CLASS_is);
  /** **/ regeister("isNativeFunction", isNativeFunction, CLASS_is);



  /* Miscellaneous */




//  var Positive = Pos;

  /** **/ regeister("Zero", Zero, CLASS_Miscellaneous);
  /** **/ regeister("GtZero", GtZero, CLASS_Miscellaneous);

 
  /** **/ regeister("between", between, CLASS_Miscellaneous);
  /** **/ regeister("Between", Between, CLASS_Miscellaneous);

  var UpperCase = TreatJS.Contract.Base(function(arg) {
    return (/^[A-Z]+$/).test(arg);
  }, "UpperCase");

  var LowerCase = TreatJS.Contract.Base(function(arg) {
    return (/^[a-z]+$/).test(arg);
  }, "UpperCase");

  /** **/ regeister("UpperCase", UpperCase, CLASS_Miscellaneous);
  /** **/ regeister("LowerCase", LowerCase, CLASS_Miscellaneous);



  var LengthLt = TreatJS.Constructor.Constructor(function(length) {
    return Contract.Base(function(arg) {
      return (arg.length < length); 
    },"lengthLt")
  }, "LengthLt").ctor;

  var LengthGt = TreatJS.Constructor.Constructor(function(length) {
    return Contract.Base(function(arg) {
      return (arg.length > length); 
    },"lengthGt")
  }, "LengthGt").ctor;

  /** **/ regeister("LengthOf", LengthOf, CLASS_Miscellaneous); 
  /** **/ regeister("LengthLt", LengthLt, CLASS_Miscellaneous);
  /** **/ regeister("LengthGt", LengthGt, CLASS_Miscellaneous);

  var ArrayOf = TreatJS.Constructor.Constructor(function(target) {
    return Contract.Object(Contract.RegExpMap([
        Contract.Mapping(/^\d*$/,
          Contract.Base(function(arg) {
            return (arg instanceof target); 
          },"arrayOf"))])); 
  }, "ArrayOf").ctor;

  /** **/ regeister("ArrayOf", ArrayOf, CLASS_Miscellaneous);

  var True = TreatJS.Contract.Base(function(arg) {
    return true;
  },"true");

  var False = TreatJS.Contract.Base(function(arg) {
    return false;
  },"false");

  /** **/ regeister("True", True, CLASS_Miscellaneous);
  /** **/ regeister("False", False, CLASS_Miscellaneous);

})(TreatJS);

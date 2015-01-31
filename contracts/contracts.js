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
  
  var Contracts = [];
  //__define("Contracts", Contracts, _);

  function __regeister (name, contract, classid) {
    var id = (classid || "Miscellaneous");

    if (Contracts[id] == undefined) Contracts[id] = [];

    Contracts[id][name] = contract;
    __define(name, contract, this);
  }

  var toString = function () {
    var str = "";
    for (var cl in Contracts) {
      str += "* " + cl + "\n\n";

      for (var con in Contracts[cl]) {
        str += "** " + con + "\n";
      }

      str += "\n";
    }

    return str;
  }

  Object.defineProperty(Contracts, "toString", {
    get: function () { return toString; },
    enumerable: false
  });

  /**
   * Predefined Contarcts
   */

  var Any = TreatJS.Contract.Base(function(arg) {
    return true; 
  },"Any");

  __regeister("Any", Any, "Miscellaneous");

  /* TypeOf-Contracts */

  var typeOfNumber = TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "number");
  },"typeOfNumber");

  var typeOfString = TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "string");
  },"typeOfString");

  var typeOfBoolean = TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "boolean");
  },"typeOfBoolean");

  var typeOfObject =  TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "object");
  },"typeOfObject");

  var typeOfFunction = TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "function");
  },"typeOfFunction");

  var typeOfUndefined = TreatJS.Contract.Base(function(arg) {
    return ((typeof arg) === "undefined");
  },"typeOfUndefined");

  __regeister("typeOfNumber", typeOfNumber, "typeOf - Contracts");
  __regeister("typeOfString", typeOfString, "typeOf - Contracts");
  __regeister("typeOfBoolean", typeOfBoolean, "typeOf - Contracts");
  __regeister("typeOfObject", typeOfObject, "typeOf - Contracts");
  __regeister("typeOfFunction", typeOfFunction, "typeOf - Contracts");
  __regeister("typeOfUndefined", typeOfUndefined, "typeOf - Contracts");


  // typeOf Base Contract
  var typeOf = TreatJS.Contract.Base(function (arg) {
    return ((typeof arg) === type);
  }, "typeOf");

  var TypeOf = TreatJS.Constructor.Constructor( function ( type ) {
    return Contract.Base(function (arg) {
      return ((typeof arg) === type);
    }, "typeOf " + type);
  }).ctor;

  __regeister("typeOf", typeOf, "typeOf - Contracts");
  __regeister("TypeOf", TypeOf, "typeOf - Contracts");

  /* InstanceOf-Contracts */

  var instanceOf =  TreatJS.Contract.Base(function(arg) {
    return (arg instanceof target); 
  },"instanceOf");

  __regeister("instanceOf", instanceOf, "instanceOf - Contracts");



  var instanceOfObject =  TreatJS.Contract.With({Object:Object}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Object); 
  },"instanceOfObject"));

  var instanceOfFunction =  TreatJS.Contract.With({Function:Function}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Function); 
  },"instanceOfFunction"));

  var instanceOfArray = TreatJS.Contract.With({Array:Array}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Array);
  },"instanceOfArray"));

  var instanceOfBoolean = TreatJS.Contract.With({Boolean:Boolean}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Boolean);
  },"instanceOfBoolean"));

  var instanceOfDate = TreatJS.Contract.With({Date:Date}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Date);
  },"instanceOfDate"));

  var instanceOfIterator = TreatJS.Contract.With({Iterator:Iterator}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Iterator);
  },"instanceOfIterator"));

  var instanceOfNumber = TreatJS.Contract.With({Number:Number}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Number);
  },"instanceOfNumber"));

  var instanceOfString = TreatJS.Contract.With({String:String}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof String);
  },"instanceOfString"));

  var instanceOfRegExp = TreatJS.Contract.With({RegExp:RegExp}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof RegExp);
  },"instanceOfRegExp"));

  var instanceOfError = TreatJS.Contract.With({Error:Error}, TreatJS.Contract.Base(function(arg) {
    return (arg instanceof Error);
  },"instanceOfError"));

  __regeister("instanceOfObject", instanceOfObject, "instanceOf - Contracts");
  __regeister("instanceOfFunction", instanceOfFunction, "instanceOf - Contracts");
  __regeister("instanceOfArray", instanceOfArray, "instanceOf - Contracts");
  __regeister("instanceOfBoolean", instanceOfBoolean, "instanceOf - Contracts");
  __regeister("instanceOfDate", instanceOfDate, "instanceOf - Contracts");
  __regeister("instanceOfIterator", instanceOfIterator, "instanceOf - Contracts");
  __regeister("instanceOfNumber", instanceOfNumber, "instanceOf - Contracts");
  __regeister("instanceOfString", instanceOfString, "instanceOf - Contracts");
  __regeister("instanceOfRegExp", instanceOfRegExp, "instanceOf - Contracts");
  __regeister("instanceOfError", instanceOfError, "instanceOf - Contracts");

  var InstanceOf = TreatJS.Constructor.Constructor(function(target) {
    return Contract.Base(function(arg) {
      return (arg instanceof target); 
    },"instanceOf")
  }, "InstanceOf").ctor;

  __regeister("InstanceOf", InstanceOf, "instanceOf - Contracts");

  /* Is-Contracts */

  var isNaN= TreatJS.Contract.Base(function(arg) {
    return (arg === NaN);
  },"isNaN");

  var isUndefined = TreatJS.Contract.With({undefined:undefined}, TreatJS.Contract.Base(function(arg) {
    return (arg === undefined);
  },"isUndefined"));

  var isNull = TreatJS.Contract.Base(function(arg) {
    return (arg === null);
  },"isNull");

  var isTrue = TreatJS.Contract.Base(function(arg) {
    return (arg) ? true : false; 
  },"isTrue");

  var isFalse = TreatJS.Contract.Base(function(arg) {
    return (arg) ? false : true; 
  },"isFalse");

  __regeister("isNaN", isNaN, "is - Contracts");
  __regeister("isUndefined", isUndefined, "is - Contracts");
  __regeister("isNull", isNull, "is - Contracts");
  __regeister("isTrue", isTrue, "is - Contracts");
  __regeister("isFalse", isFalse, "is - Contracts");



  /* Is-Contracts */

  var isPrimitiveValue = TreatJS.Contract.Base(function(arg) {
    return (target !== Object(target)) ? true : false; 
  },"isPrimitiveValue");

  var isNativeFunction = TreatJS.Contract.Base(function(arg) {
    return (Function.prototype.toString.apply(func).indexOf('[native code]') > -1); 
  },"isNativeFunction");

  __regeister("isPrimitiveValue", isPrimitiveValue, "is - Contracts");
  __regeister("isNativeFunction", isNativeFunction, "is - Contracts");



  /* Miscellaneous */

  var Even = TreatJS.Contract.With({Math:Math}, TreatJS.Contract.Base(function(arg) {
    return (Math.abs(arg) % 2 === 0);
  },"Even"));

  var Odd = TreatJS.Contract.With({Math:Math}, TreatJS.Contract.Base(function(arg) {
    return (Math.abs(arg) % 2 === 1);
  },"Odd"));

  var Pos = TreatJS.Contract.Base(function(arg) {
    return (arg > 0);
  },"Pos");

  var Neg = TreatJS.Contract.Base(function(arg) {
    return (arg < 0);
  },"Neg");

  var Zero = TreatJS.Contract.Base(function(arg) {
    return (arg === 0);
  },"Zero");

  __regeister("Even", Even, "Miscellaneous");
  __regeister("Odd", Odd, "Miscellaneous");
  __regeister("Pos", Pos, "Miscellaneous");
  __regeister("Neg", Neg, "Miscellaneous");
  __regeister("Zero", Zero, "Miscellaneous");


  var between = TreatJS.Contract.Base(function(arg) {
    return (min < arg) && (arg < max);
  },"between");

  var Between = TreatJS.Constructor.Constructor( function (min, max) {
    return Contract.Base( function (arg) {
      return (min < arg) && (arg < max);
    }, "Between " + min + "-" + max);
  }).ctor;

  __regeister("between", between, "Miscellaneous");
  __regeister("Between", Between, "Miscellaneous");

  var UpperCase = TreatJS.Contract.Base(function(arg) {
    return (/^[A-Z]+$/).test(arg);
  }, "UpperCase");

  var LowerCase = TreatJS.Contract.Base(function(arg) {
    return (/^[a-z]+$/).test(arg);
  }, "UpperCase");

  __regeister("UpperCase", UpperCase, "Miscellaneous");
  __regeister("LowerCase", LowerCase, "Miscellaneous");

  var LengthOf = TreatJS.Constructor.Constructor(function(length) {
    return Contract.Base(function(arg) {
      return (arg.length === length); 
    },"lengthOf")
  }, "LengthOf").ctor;

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

  __regeister("LengthOf", LengthOf, "Miscellaneous"); 
  __regeister("LengthLt", LengthLt, "Miscellaneous");
  __regeister("LengthGt", LengthGt, "Miscellaneous");

  var ArrayOf = TreatJS.Constructor.Constructor(function(target) {
    return Contract.Object(Contract.RegExpMap([
        Contract.Mapping(/^\d*$/,
          Contract.Base(function(arg) {
            return (arg instanceof target); 
          },"arrayOf"))])); 
  }, "ArrayOf").ctor;

  __regeister("ArrayOf", ArrayOf, "Miscellaneous");

})(TreatJS);

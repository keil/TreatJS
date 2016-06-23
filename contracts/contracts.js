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

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Predefined", Contracts);

  var CLASS_Miscellaneous = "Miscellaneous";
  var CLASS_typeof = "TypeOf Contarcts";
  var CLASS_instanceof = "Instanceof Contracts";
  var CLASS_is = "Is Contracts";

  function regeister (name, contract, classid) {
    var id = (classid || CLASS_Miscellaneous);
    if (Contracts[id] == undefined) Contracts[id] = [];
    Contracts[id][name] = contract;   
    Object.defineProperty(this, name, {value:contract, enumerable:true});
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

  /** **/ regeister("Any", Any, CLASS_Miscellaneous);

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

  /** **/ regeister("typeOfNumber", typeOfNumber, CLASS_typeof);
  /** **/ regeister("typeOfString", typeOfString, CLASS_typeof);
  /** **/ regeister("typeOfBoolean", typeOfBoolean, CLASS_typeof);
  /** **/ regeister("typeOfObject", typeOfObject, CLASS_typeof);
  /** **/ regeister("typeOfFunction", typeOfFunction, CLASS_typeof);
  /** **/ regeister("typeOfUndefined", typeOfUndefined, CLASS_typeof);


  // typeOf Base Contract
  var typeOf = TreatJS.Contract.Base(function (arg) {
    return ((typeof arg) === type);
  }, "typeOf");

  var TypeOf = TreatJS.Constructor.Constructor( function ( type ) {
    return Contract.Base(function (arg) {
      return ((typeof arg) === type);
    }, "typeOf " + type);
  }).ctor;

  /** **/ regeister("typeOf", typeOf, CLASS_typeof);
  /** **/ regeister("TypeOf", TypeOf, CLASS_typeof);

  /* InstanceOf-Contracts */

  var instanceOf =  TreatJS.Contract.Base(function(arg) {
    return (arg instanceof target); 
  },"instanceOf");

  /** **/ regeister("instanceOf", instanceOf, CLASS_instanceof);



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

  /** **/ regeister("instanceOfObject", instanceOfObject, CLASS_instanceof);
  /** **/ regeister("instanceOfFunction", instanceOfFunction, CLASS_instanceof);
  /** **/ regeister("instanceOfArray", instanceOfArray, CLASS_instanceof);
  /** **/ regeister("instanceOfBoolean", instanceOfBoolean, CLASS_instanceof);
  /** **/ regeister("instanceOfDate", instanceOfDate, CLASS_instanceof);
  /** **/ regeister("instanceOfIterator", instanceOfIterator, CLASS_instanceof);
  /** **/ regeister("instanceOfNumber", instanceOfNumber, CLASS_instanceof);
  /** **/ regeister("instanceOfString", instanceOfString, CLASS_instanceof);
  /** **/ regeister("instanceOfRegExp", instanceOfRegExp, CLASS_instanceof);
  /** **/ regeister("instanceOfError", instanceOfError, CLASS_instanceof);

  var InstanceOf = TreatJS.Constructor.Constructor(function(target) {
    return Contract.Base(function(arg) {
      return (arg instanceof target); 
    },"instanceOf")
  }, "InstanceOf").ctor;

  /** **/ regeister("InstanceOf", InstanceOf, CLASS_instanceof);

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

  /** **/ regeister("isNaN", isNaN, CLASS_is);
  /** **/ regeister("isUndefined", isUndefined, CLASS_is);
  /** **/ regeister("isNull", isNull, CLASS_is);
  /** **/ regeister("isTrue", isTrue, CLASS_is);
  /** **/ regeister("isFalse", isFalse, CLASS_is);



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

  var Even = TreatJS.Contract.With({Math:Math}, TreatJS.Contract.Base(function(arg) {
    return (Math.abs(arg) % 2 === 0);
  },"Even"));

  var Odd = TreatJS.Contract.With({Math:Math}, TreatJS.Contract.Base(function(arg) {
    return (Math.abs(arg) % 2 === 1);
  },"Odd"));

  var Pos = TreatJS.Contract.Base(function(arg) {
    return (arg > 0);
  },"Pos");

  var Nat = TreatJS.Contract.Base(function(arg) {
    return (arg >= 0);
  },"Nat");

  var Neg = TreatJS.Contract.Base(function(arg) {
    return (arg < 0);
  },"Neg");

  var Zero = TreatJS.Contract.Base(function(arg) {
    return (arg === 0);
  },"Zero");

  var GtZero = TreatJS.Contract.Base(function(arg) {
    return (arg>0);
  }, "GreaterThanZero");


//  var Positive = Pos;

  /** **/ regeister("Positive", Pos, CLASS_Miscellaneous);
  /** **/ regeister("Natural", Nat, CLASS_Miscellaneous);



  /** **/ regeister("Even", Even, CLASS_Miscellaneous);
  /** **/ regeister("Odd", Odd, CLASS_Miscellaneous);
  /** **/ regeister("Pos", Pos, CLASS_Miscellaneous);
  /** **/ regeister("Nat", Nat, CLASS_Miscellaneous);
  /** **/ regeister("Neg", Neg, CLASS_Miscellaneous);
  /** **/ regeister("Zero", Zero, CLASS_Miscellaneous);
  /** **/ regeister("GtZero", GtZero, CLASS_Miscellaneous);

  var between = TreatJS.Contract.Base(function(arg) {
    return (min < arg) && (arg < max);
  },"between");

  var Between = TreatJS.Constructor.Constructor( function (min, max) {
    return Contract.Base( function (arg) {
      return (min < arg) && (arg < max);
    }, "Between " + min + "-" + max);
  }).ctor;

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

/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// _______             _       _  _____ 
//|__   __|           | |     | |/ ____|
//   | |_ __ ___  __ _| |_    | | (___  
//   | | '__/ _ \/ _` | __|   | |\___ \ 
//   | | | |  __/ (_| | || |__| |____) |
//   |_|_|  \___|\__,_|\__\____/|_____/ 

var TreatJS = TreatJS || (function() {

  /** The TreatJS wrapper object.
  */
  var TreatJS = {};

  //                _          
  //__ _____ _ _ __(_)___ _ _  
  //\ V / -_) '_(_-< / _ \ ' \ 
  // \_/\___|_| /__/_\___/_||_|

  Object.defineProperty(TreatJS, "version", {
    value: "TreatJS 2.0.0 (Alpha)"
  });

  // _       ___ _       _           
  //| |_ ___/ __| |_ _ _(_)_ _  __ _ 
  //|  _/ _ \__ \  _| '_| | ' \/ _` |
  // \__\___/___/\__|_| |_|_||_\__, |
  //                           |___/ 

  Object.defineProperty(TreatJS, "toString", {
    value: function() {
      return "[[TreatJS]]";
    }
  });

  // ___          _           _   _            ___                     _   _       
  //| __|_ ____ _| |_  _ __ _| |_(_)___ _ _   / __| ___ _ __  __ _ _ _| |_(_)__ ___
  //| _|\ V / _` | | || / _` |  _| / _ \ ' \  \__ \/ -_) '  \/ _` | ' \  _| / _(_-<
  //|___|\_/\__,_|_|\_,_\__,_|\__|_\___/_||_| |___/\___|_|_|_\__,_|_||_\__|_\__/__/

  Object.defineProperty(TreatJS, "LAX", {
    value: "LAX"
  });

  Object.defineProperty(TreatJS, "PICKY", {
    value: "PICKY"
  });

  Object.defineProperty(TreatJS, "INDY", {
    value: "INDY"
  });

  //  ___         _               _   
  // / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_\__|_| \__,_\__|\__|

  function Contract() { // TODO, arguments
    if(!(this instanceof Contract)) return new Contract(); // TODO, arguments



    // statistics
    // verbose ?
    // contract is not reconfigurable
  }

  Object.defineProperty(Contract, "toString", {
    value: function() {
      return "[[TreatJS/Contract]]";
    }
  });

  Object.defineProperty(Contract, "version", {
    value: TreatJS.version
  });




  
  Contract.prototype = {};

  Object.defineProperty(Contract.prototype, "constructor", {
    value: Contract
  });

  Object.defineProperty(Contract.prototype, "toString", {
    value: function() {
      return "[[TreatJS/Contract]]";
    }
  });

  Object.defineProperty(Contract.prototype, "version", {
    value: TreatJS.version
  });



  // 
  Object.defineProperty(TreatJS, "Contract", {
    value: Contract
  });













    // _         _ _    _ 
    //| |__ _  _(_) |__| |
    //| '_ \ || | | / _` |
    //|_.__/\_,_|_|_\__,_|

    Object.defineProperty(TreatJS, "build", {
      value: function() {

        // Todo, build instructions
        //
        //
        //

        // TODO, seal, prevent extension, freeze
        //return contract;
      } 
    });


    // TODO,
    TreatJS.Core = {};

  //                       _   
  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  Object.defineProperty(TreatJS, "export", {
    value: function(package) {
      for(let name in package) {
        Object.defineProperty(TreatJS.Core, name, {
          value: package[name], enumerable: true
        });
      }
    } 
  });











  // TODO, freace/prevt extension/ seal ?

  /** Return the TreatJS objects
  */
  return TreatJS 

})();

















/*


//                                
//  ___ _     _          _    ___  _     _        _   
// / __| |___| |__  __ _| |  / _ \| |__ (_)___ __| |_ 
//| (_ | / _ \ '_ \/ _` | | | (_) | '_ \| / -_) _|  _|
// \___|_\___/_.__/\__,_|_|  \___/|_.__// \___\__|\__|
//                                    |__/            
function TreatJS(configuration, verbose, out, dunit) {
if(!(this instanceof TreatJS)) return new TreatJS(configuration, verbose, out);

var version = "TreatJS 1.4.0 (PoC)";

Object.defineProperties(this, {
"version": { value: version }
});

Object.defineProperties(this, {
"configuration": { value: (configuration===undefined) ? {} : configuration }
});

Object.defineProperties(this, {
"verbose": { value: (verbose===undefined) ? {} : verbose }
});

Object.defineProperties(this, {
"output": { value: (out || new TreatJSOut()) }
});

Object.defineProperties(this, {
"debugger": { value: (dunit || new TreatJSDebugger()) }
});

// stores current Function.prototype.toString
this.extend("Base", {});
this.define(this.Base, "toString",  Function.prototype.toString);
}


TreatJS.prototype = {};
TreatJS.prototype.toString = (function() { return '[[TreatJS]]'; });

// TreatJS Evaluation Semantics
TreatJS.prototype.LAX   = TreatJS.LAX;
TreatJS.prototype.PICKY = TreatJS.PICKY;
TreatJS.prototype.INDY  = TreatJS.INDY;

// TreatJS Package Extend
TreatJS.prototype.extend = function(name, value) {
Object.defineProperty(this, name, {
value: value, enumerable: true
});
}

// TreatJS Package Define
TreatJS.prototype.define = function(target, name, value) {
Object.defineProperty(target, name, {
value: value, enumerable: true
});
}

*/

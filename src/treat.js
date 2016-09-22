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

  /** TreatJS version number.
  */
  const version = "TreatJS 2.0.0 (Alpha)";

  /** The TreatJS wrapper object.
  */
  const TreatJS = {};

  /** The Contract interface object.
  */
  const Contract = {};

  //                _          
  //__ _____ _ _ __(_)___ _ _  
  //\ V / -_) '_(_-< / _ \ ' \ 
  // \_/\___|_| /__/_\___/_||_|

  Object.defineProperty(TreatJS, "version", {
    value: version
  });

  Object.defineProperty(Contract, "version", {
    value: version
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

  Object.defineProperty(Contract, "toString", {
    value: function() {
      return "[[Contract]]";
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




  // TODO
    Object.defineProperty(TreatJS, "getContract", {
      value: function() {
        return Contract;
      }
    });



    // TODO STATISTIC
    Object.defineProperty(TreatJS, "getStatistic", {
      value: function() {
        return TreatJS.Statistic.dump();
      }
    });




  //               _                 
  // _ __  __ _ __| |____ _ __ _ ___ 
  //| '_ \/ _` / _| / / _` / _` / -_)
  //| .__/\__,_\__|_\_\__,_\__, \___|
  //|_|                    |___/     

  /** Manages TreatJS packages.
  */

    // TODO, freeze before return


  const packages = new Set();

  Object.defineProperty(TreatJS, "package", {
    value: function(name, closure) {
      if(!(closure instanceof Function)) throw new TypeError("Invalid Package")
      else packages.add({name:name, constructor:closure});
    }
  });

  // _      _ _   _      _ _        
  //(_)_ _ (_) |_(_)__ _| (_)______ 
  //| | ' \| |  _| / _` | | |_ / -_)
  //|_|_||_|_|\__|_\__,_|_|_/__\___|

  /** Initialize the [[TreastJS]] obejct.
  */

  function extend(target, package) {
    for(let name in package) {
      if(target[name]) throw new Error(`Property ${name} already exists.`);
      else target[name] = package[name];
    }
  }

  function resolve(target, path = []) {
    if(path.length==0){
      return target;
    } else {
      const name = path.pop();      
      if(!target[name]) target[name] = {};
      return resolve(target[name], path);
    }
  }

  function build({name, constructor}, configuration) {
    const target = resolve({TreatJS:TreatJS}, name.split(".").reverse());
    const package = constructor(TreatJS, Contract, configuration);
    extend(target, package);
  }


  /** Flag to indicate if the initialization is complete. 
  */
  let initialized = false;

  function initialize(configuration) {

    for(let package of packages) {
      build(package, configuration);
    }

    // Prevent the [[TreatJS]] and [[Contract]] object from further modifications.
    Object.freeze(TreatJS);
    Object.freeze(Contract);

    // Initialization done.
    var initialized = true;

    // Return the public interface.
    return Contract;
  }

  Object.defineProperty(TreatJS, "initialize", {
    value: function(configuration = {
    // TODO, Default configuration
    }) {
      if(!initialized) return initialize(configuration);
      else throw Error("TreatJS already initialized!");
    }
  });



  //                       _   
  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  /** Builds the public [[Contract]] interface.
  */

  Object.defineProperty(TreatJS, "export", {
    value: function(package) {
      extend(Contract, package);
    }
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  /** Return the [[TreatJS]] objects
  */
  return TreatJS; 

})();

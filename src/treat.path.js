/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Path", function (TreatJS, Contract, configuration) {

  // ___      _   _    
  //| _ \__ _| |_| |_  
  //|  _/ _` |  _| ' \ 
  //|_| \__,_|\__|_||_|

  function Path(callback) {
  }
  Path.prototype = Object.create(Path.prototype);
  Path.prototype.toString = function() {
    return "[[TreatJS/Path]]";
  };

  Path.prototype.Link = function(callback) {
    return new Link(this, callback);
  };

  Path.prototype.Split = function(callback) {
    return new Split(this, callback);
  };

  // ___          _   
  //| _ \___  ___| |_ 
  //|   / _ \/ _ \  _|
  //|_|_\___/\___/\__|

  function Root(callback) {
    this.callback = callback;
  }
  Root.prototype = Object.create(Path.prototype);

  // _    _      _   
  //| |  (_)_ _ | |__
  //| |__| | ' \| / /
  //|____|_|_||_|_\_\

  function Link(callback) {
    this.callback = callback;
  }
  Link.prototype = Object.create(Path.prototype);

  // ___      _ _ _   
  /// __|_ __| (_) |_ 
  //\__ \ '_ \ | |  _|
  //|___/ .__/_|_|\__|
  //    |_|           

  function Split(path, callback) {
    this.callback = callback;
  }
  Split.prototype = Object.create(Path.prototype);












  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
//    isCompatible : isCompatible,
//    Step         : Step,

    Root         : Root, 
    Link         : Link,
    Split        : Split
  };

});

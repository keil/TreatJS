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

  function Path() {
  }
  Path.prototype = {};
  Path.prototype.toString = function() {
    return "[[TreatJS/Path]]";
  };

  Path.prototype.Step = function(callback) {
    return new Step(this, callback);
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

  // ___ _            
  /// __| |_ ___ _ __ 
  //\__ \  _/ -_) '_ \
  //|___/\__\___| .__/
  //            |_|   

  function Step(path, callback) {
    this.path = path;
    this.callback = callback;
  }
  Step.prototype = Object.create(Path.prototype);

  // ___      _ _ _   
  /// __|_ __| (_) |_ 
  //\__ \ '_ \ | |  _|
  //|___/ .__/_|_|\__|
  //    |_|           

  function Split(path, callback) {
    this.path = path;
    this.callback = callback;
  }
  Split.prototype = Object.create(Path.prototype);

  // _                                
  //| |_ _ _ __ ___ _____ _ _ ___ ___ 
  //|  _| '_/ _` \ V / -_) '_(_-</ -_)
  // \__|_| \__,_|\_/\___|_| /__/\___|

  function traverse(path) {

    if(path instanceof Root) {
      const root = {step:path, root:null, next:null};
      return root.root = root;
    } else {
      const step = traverse(path.path);
      return step.next = {step:path, root:step.root, next:null};
    } 
  }

  // _     ___                      _   _ _    _     
  //(_)___/ __|___ _ __  _ __  __ _| |_(_) |__| |___ 
  //| (_-< (__/ _ \ '  \| '_ \/ _` |  _| | '_ \ / -_)
  //|_/__/\___\___/_|_|_| .__/\__,_|\__|_|_.__/_\___|
  //                    |_|                          

  function isCompatible (p, q) {
    return p===undefined || q===undefined || comp(traverse(p).root, traverse(q).root);
  }

  // __ ___ _ __  _ __ 
  /// _/ _ \ '  \| '_ \
  //\__\___/_|_|_| .__/
  //             |_|   

  function comp (p, q) {

    if(p.step instanceof Root && q.step instanceof Root) {

      if(p.step.callback!==q.step.callback) return true;
      else return comp (p.next, q.next);

    } else if(p.step instanceof Step && q.step instanceof Step) {

      if(p.step.callback!==q.step.callback) return true;
      else return comp (p.next, q.next);

    } else if(p.step instanceof Split && q.step instanceof Split) {

      if(p.step.callback!==q.step.callback) return false;
      else return comp (p.next, q.next);

    } else {
      return true;
    }

  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    isCompatible : isCompatible,
    Root         : Root, 
    Step         : Step,
    Split        : Split
  };

});

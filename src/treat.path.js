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

    // TODO
    this.id = getID(callback);
  }
  Root.prototype = Object.create(Path.prototype);

  Root.prototype.toString = function() {
    return "(Root " + this.id + ")";
  };

  // _    _      _   
  //| |  (_)_ _ | |__
  //| |__| | ' \| / /
  //|____|_|_||_|_\_\

  // TODO, change Link to step
  //
  function Link(path, callback) {
    this.path = path;
    this.callback = callback;

    // TODO
    this.id = getID(callback);
  }
  Link.prototype = Object.create(Path.prototype);

  Link.prototype.toString = function() {
    return this.path.toString() + " . (Link " + this.id + ")";
  };


  // ___      _ _ _   
  /// __|_ __| (_) |_ 
  //\__ \ '_ \ | |  _|
  //|___/ .__/_|_|\__|
  //    |_|           

  function Split(path, callback) {
    this.path = path;
    this.callback = callback;

    // TODO
    this.id = getID(callback);

  }
  Split.prototype = Object.create(Path.prototype);

  Split.prototype.toString = function() {
    return this.path.toString() + " . (Split " + this.id + ")";
  };




  // XXX
  //

  function Chain() {
  
  }




  function toChain (path) {
    if(path instanceof Root) {
      return path;
    } else {
      return traverse(path.path, path)
    }
  }

  function traverse (path, chain) {

    if(path instanceof Root) {
      return path
    
    } else if (path instanceof Link) {
      return traverse (path.path, new Chain(path, chain);
    
    } else if (path instanceof Split) {
      return traverse (path.path, new Chain(path, chain);
    
    }
  }

  function isCompatible(p, q) {
    return comp(toChain(p),toChain(q) )
  
  }


  function comp (p, q) {
    
    if(p.head instanceof Root && q.head instanceof Root) {
      if(p.head.callback!==q.head.callback) return true;
      else return comp (p.tail, q.tail);
    } else if(p.head instanceof Link && q.head instanceof Link) {
      if(p.head.callback!==q.head.callback) return true;
      else return comp (p.tail, q.tail);
    } else if(p.head instanceof Split && q.head instanceof Split) {
      if(p.head.callback!==q.head.callback) return false;
      else return comp (p.tail, q.tail);
    } else {
      return true;
    }

  }



  // TMP
  //

  let i = 0;
  let ids = new WeakMap();

  function getID(callback) {
    if(ids.has(callback)) {
      return "i"+ids.get(callback);
    } else {
      ids.set(callback, i++);
      return getID(callback);
    } 
  }








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

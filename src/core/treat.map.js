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
(function(_) {

  var error = _.error;
  var violation = _.violation;
  var blame = _.blame;

  // __  __           
  //|  \/  |__ _ _ __ 
  //| |\/| / _` | '_ \
  //|_|  |_\__,_| .__/
  //            |_|   

  function Map(strict) {
    if(!(this instanceof Map)) return new Map();

    var keys = [];
    var values = [];

    this.foreach = function(callback) {
      keys.foreach(function (index, key) {
        callback(key, values[index]);     
      });
    }

    this.set = function(key, value) {
      if(!(value instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

      if(keys.indexOf(key)==-1) keys.push(key);
      var index = keys.indexOf(key);
      values[index] = value;

      return keys.length;
    }

    this.strict = function() {
      return strict;
    } 

    this.get = function(key) {
      return values[keys.indexOf(key)];
    }

    this.has = function(key) {
      return (keys.indexOf(key)==-1) ? false : true;
    }

    this.slice = function(key) {
      return values[keys.indexOf(key)];                
    }

    this.toString = function() { 
      var mappings = "";
      this.foreach(function(key, contract) {
        mappings += " " + key + ":" + contract;
      });
      return "[" + mappings + "]";
    };
  }

  /*
     function StrictMap(strict) {
     if(!(this instanceof StrictMap)) return new StrictMap(strict);
     else Map.call(this);

     }
     StrictMap.prototype = new Map();


  // TODO rework this
  function WeakMap() {
  if(!(this instanceof WeakMap)) return new WeakMap();
  else Map.call(this);
  Object.defineProperties(this, {
  "strict": {
  get: function () { return false; }}
  });
  }
  WeakMap.prototype = new Map();
  */


  function StringMap(elements, strict) { 
    if(!(this instanceof StringMap)) return new StringMap(elements, strict);
    else Map.call(this, strict);

    var set = this.set;
    this.set = function(key, value) {
      if(!(typeof key === "string")) error("Wrong Type. String required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
      else set(key, value);
    }

    if(elements instanceof Array) {
      var base = this; 
      elements.foreach(function(key, value) {
        base.set(key.toString(), value);
      });
    } else if(elements instanceof Object) {
      for(var key in elements) {
        this.set(key, elements[key]);
      }
    } else {}
  }
  StringMap.prototype = new Map();


  function Mapping(regexp, contract) {
    if(!(this instanceof Mapping)) return new Mapping(regexp, contract);

    if(!(regexp instanceof RegExp)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "regexp": {
        get: function () { return regexp; } },
      "contract": {
        get: function () { return contract; } }
    });        
  }

  function RegExpMap(elements) {
    if(!(this instanceof RegExpMap)) return new RegExpMap(elements);
    else Map.call(this, false);

    var set = this.set;
    this.set = function(key, value) {
      if(!(key instanceof RegExp)) error("Wrong Type. RegExp required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
      else set(key, value);
    }

    this.has = function(key) {
      var has = false;
      this.foreach(function(index, contract) {
        has = (index.test(key)) ? true : key;
      });
      return has;
    }

    this.slice = function(key) {
      var contracts = [];
      this.foreach(function(index, contract) {
        if(index.test(key)) contracts.push(contract);
      });
      return contracts;
    }

    if(elements instanceof Array) {
      var base = this; 
      elements.foreach(function(key, mapping) {
        if(!(mapping instanceof Mapping)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
        base.set(mapping.regexp, mapping.contract);
      });
    }
  }
  RegExpMap.prototype = new Map();

  /**
   * Map
   */

  __define("Map", {}, _);

  __define("Map", Map, _.Map);
  __define("StringMap", StringMap, _.Map);
  __define("Mapping", Mapping, _.Map);
  __define("RegExpMap", RegExpMap, _.Map);

})(_);

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

  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var Contract = TreatJS.Core.Contract;

  // __  __           
  //|  \/  |__ _ _ __ 
  //| |\/| / _` | '_ \
  //|_|  |_\__,_| .__/
  //            |_|   

  function Map(strict) {
    if(!(this instanceof Map)) return new Map(strict);

    var keys = [];
    var values = [];

    Object.defineProperties(this, {
      "strict": { value: (strict===undefined) ? false : strict },
      "keys": { value: keys },
      "values": { value: values } 
    });
  }
  Map.prototype = {};

  Map.prototype.get = function(key) {
    return this.values[this.keys.indexOf(key)];
  }

  Map.prototype.set = function(key, value) {
    if(!(value instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(this.keys.indexOf(key)==-1) this.keys.push(key);
    var index = this.keys.indexOf(key);
    this.values[index] = value;

    return this.keys.length;
  }

  Map.prototype.has = function(key) {
    return (this.keys.indexOf(key)==-1) ? false : true;
  }

  Map.prototype.slice = function(key) {
    return this.values[this.keys.indexOf(key)];                
  }

  Map.prototype.toString = function() { 
    var mappings = "";
    this.foreach(function(key, contract) {
      mappings += " " + key + ":" + contract;
    });
    return "[" + mappings + "]";
  };

  Map.prototype.foreach = function(callback) {
    var values = this.values;
    this.keys.foreach(function (index, key) {
      callback(key, values[index]);     
    });
  }

  // ___ _       _           __  __           
  /// __| |_ _ _(_)_ _  __ _|  \/  |__ _ _ __ 
  //\__ \  _| '_| | ' \/ _` | |\/| / _` | '_ \
  //|___/\__|_| |_|_||_\__, |_|  |_\__,_| .__/
  //                   |___/            |_|   

  function StringMap(elements, strict) { 
    if(!(this instanceof StringMap)) return new StringMap(elements, strict);
    else Map.call(this, strict);

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
  StringMap.prototype = Object.create(Map.prototype);

  StringMap.prototype.set = function(key, value) {
    if(!(typeof key === "string")) error("Wrong Type. String required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
    else Map.prototype.set.call(this, key, value);
  }

  // __  __                _           
  //|  \/  |__ _ _ __ _ __(_)_ _  __ _ 
  //| |\/| / _` | '_ \ '_ \ | ' \/ _` |
  //|_|  |_\__,_| .__/ .__/_|_||_\__, |
  //            |_|  |_|         |___/ 

  function Mapping(regexp, contract) {
    if(!(this instanceof Mapping)) return new Mapping(regexp, contract);

    if(!(regexp instanceof RegExp)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "regexp": { value: regexp },
      "contract": { value: contract }
    });        
  }
  // ___          ___     __  __           
  //| _ \___ __ _| __|_ _|  \/  |__ _ _ __ 
  //|   / -_) _` | _|\ \ / |\/| / _` | '_ \
  //|_|_\___\__, |___/_\_\_|  |_\__,_| .__/
  //        |___/                    |_|   

  function RegExpMap(elements) {
    if(!(this instanceof RegExpMap)) return new RegExpMap(elements);
    else Map.call(this, false);

    if(elements instanceof Array) {
      var base = this; 
      elements.foreach(function(key, mapping) {
        if(!(mapping instanceof Mapping)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
        base.set(mapping.regexp, mapping.contract);
      });
    }
  }
  RegExpMap.prototype = Object.create(Map.prototype);

  RegExpMap.prototype.set = function(key, value) {
    if(!(key instanceof RegExp)) error("Wrong Type. RegExp required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
    else Map.prototype.set.call(this, key, value);
  }

  RegExpMap.prototype.has = function(key) {
    var has = false;
    this.foreach(function(index, contract) {
      has = (index.test(key)) ? true : key;
    });
    return has;
  }

  RegExpMap.prototype.slice = function(key) {
    var contracts = [];
    this.foreach(function(index, contract) {
      if(index.test(key)) contracts.push(contract);
    });
    return contracts;
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Map", {});

  TreatJS.define(TreatJS.Map, "Map", Map);
  TreatJS.define(TreatJS.Map, "StringMap", StringMap);
  TreatJS.define(TreatJS.Map, "Mapping", Mapping);
  TreatJS.define(TreatJS.Map, "RegExpMap", RegExpMap);

})(TreatJS);

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

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  // TreatJS Output
  var logoutput = TreatJS.output;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.internal) {
      logoutput.log(logoutput.INTERNAL, msg, target);
    }
  }

  // ___ ___  
  //|_ _|   \ 
  // | || |) |
  //|___|___/ 

  var i = 0;

  function freshID() {
    i = i+1;
    return i;
  }

  //  ___         _        
  // / __|__ _ __| |_  ___ 
  //| (__/ _` / _| ' \/ -_)
  // \___\__,_\__|_||_\___|

  var cache = [];

  function has(id) {
    return cache[id]!==undefined;
  }

  function push(id, symbol) {
    return cache.push(id, symbol);
  }

  function get(id) {
    return cache[id];
  }

  // ___            _         _ 
  /// __|_  _ _ __ | |__  ___| |
  //\__ \ || | '  \| '_ \/ _ \ |
  //|___/\_, |_|_|_|_.__/\___/_|
  //     |__/                   

  function Symbol(name) {
    if(has(name)) return get(name);
    else if(!(this instanceof Symbol)) return new Symbol(name);

    // defines symbol id
    var id = name ? name : freshID();
    Object.defineProperty(this, "id", {value: id});

    // adds the symbol to the cache
    push(id, this);
  }
  Symbol.prototype = {};
  Symbol.prototype.toString = function() {
    return "$"+this.id; 
  }

  // ___            _         _ _  _              _ _         
  /// __|_  _ _ __ | |__  ___| | || |__ _ _ _  __| | |___ _ _ 
  //\__ \ || | '  \| '_ \/ _ \ | __ / _` | ' \/ _` | / -_) '_|
  //|___/\_, |_|_|_|_.__/\___/_|_||_\__,_|_||_\__,_|_\___|_|  
  //     |__/                                                 

  function SymbolHandler() {
    if(!(this instanceof SymbolHandler)) return new SymbolHandler();

    var symbols = [];

    function getSymbol (name) {
      if(symbols[name]!==undefined) return symbols[name];
      else return symbols[name]=new Symbol();
    }

    this.has = function(target, name) {
      return true;
    }

    this.get = function(target, name, receiver) {
      return (name==="length") ? target.length : getSymbol(name);
    };
  }
  SymbolHandler.prototype = {};
  SymbolHandler.prototype.toString = function() {
    return "[[TreatJS/SymbolHandler]]";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Symbol", {});

  TreatJS.define(TreatJS.Symbol, "Symbol", Symbol);
  TreatJS.define(TreatJS.Symbol, "Handler", SymbolHandler);

})(TreatJS);

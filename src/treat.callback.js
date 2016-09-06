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

TreatJS.package("TreatJS.Callback", function (TreatJS, Contract, configuration) {


  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(callback) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(...arguments);
    else Callback.apply(this, arguments);

    var domain = true;
    var range = true;

    function update() {
      callback({
        context: (domain.subject && range.context)
        subject: (domain.context && (!domain.subjecty || range.subject))
      });
    }

    return {
    
      domain: function(handle) {
        domain = handle;
        update();
      },
    
      range: function(handle) {
        range = handle;
        update();
      }    
    }
  }


  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function IntersectionCallback(callback) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(...arguments);
    else Callback.apply(this, arguments);

    var left = true;
    var right = true;

    function update() {
      callback({
        context: (left.context && right.context)
        subject: (left.subject && right.subject)
      });
    }

    return {
    
      domain: function(handle) {
        domain = handle;
        update();
      },
    
      range: function(handle) {
        range = handle;
        update();
      }    
    }
  }







  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    decompile: decompile
  };

});

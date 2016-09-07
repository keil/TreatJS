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

  /*
   * TODO
   * - update only if handle changes
   */

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function newFunctionCallback(callback) {

    // internal values
    var domain = true;
    var range = true;

    // update constraint
    function update() {
      callback({
        context: (domain.subject && range.context)
        subject: (domain.context && (!domain.subjecty || range.subject))
      });
    }

    // return new callback handler
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

  function newIntersectionCallback(callback) {

    // internal values
    var left = true;
    var right = true;

    // update constraint
    function update() {
      callback({
        context: (left.context && right.context)
        subject: (left.subject && right.subject)
      });
    }

    // return new callback handler
    return {
      left: function(handle) {
        left = handle;
        update();
      },
      right: function(handle) {
        right = handle;
        update();
      }    
    }
  }


  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function newUnionCallback(callback) {

    // intrnal values
    var left = true;
    var right = true;

    // update constraint
    function update() {
      callback({
        context: (left.context && right.context)
        subject: (left.subject || right.subject)
      });
    }

    // return new callback handler
    return {
      left: function(handle) {
        left = handle;
        update();
      },
      right: function(handle) {
        right = handle;
        update();
      }    
    }
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    newFunctionCallback:      newFunctionCallback,
    newIntersectionCallback:  newIntersectionCallback
    newUnionCallback:         newUnionCallback
  };

});

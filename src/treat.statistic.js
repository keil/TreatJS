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

TreatJS.package("TreatJS.Statistic", function (TreatJS, Contract, configuration) {

  const Keys = Object.freeze({
    TOPASSERT   : "TOPASSERT",
    ASSERT      : "ASSERT",
    PREDICTAES  : "PREDICATES",
    MEMBRANE    : "MEMBRANE",
    DECOMPILE   : "DECOMPILE",
    CALLBACK    : "CALLBACK"
  });

  const Statistic = new Map();

  function initialize() {
    for(key in Keys) {
      Statistic.set(key, 0);
    }
  }

  function increment(key) {
    Statistic.set(key, (Statistic.get(key)+1));
  }

  function dump() {
    const output = {};

    for(key in Keys) {
      output[key] = Statistic.get(key);
    }

    return output;
  }

  initialize();

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Keys:      Keys,
    increment: increment,
    reset:     initialize,
    dump:      dump
  };

});

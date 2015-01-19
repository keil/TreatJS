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

  var printConfiguration = function () {
    __out(padding_right("TreatJS Configuration ", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank();
    }

    for(var conf in _.Config) {
      log("%" + conf + " = ", _.Config[conf]);
    }

    for(var conf in _.Verbose) {
      log("%" + conf + " = ", _.Verbose[conf]);
    }
  }

  var printStatistic = function () {
    __out(padding_right("TreatJS Statistics ", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank(); 
    }

    log("#" + _.Statistic.ASSERT + " = ", _.Statistic.get(_.Statistic.ASSERT));
    log("#" + _.Statistic.ASSERTWITH + " = ", _.Statistic.get(_.Statistic.ASSERTWITH));
    log("#" + _.Statistic.BASE + " = ", _.Statistic.get(_.Statistic.BASE));
    log("#" + _.Statistic.DECOMPILE + " = ", _.Statistic.get(_.Statistic.DECOMPILE));
    log("#" + _.Statistic.MEMBRANE + " = ", _.Statistic.get(_.Statistic.MEMBRANE));
    log("#" + _.Statistic.CALLBACK + " = ", _.Statistic.get(_.Statistic.CALLBACK));
  }

  Object.defineProperties(_.Config, {
    "print": {
      get: function () {
        return printConfiguration;
      }
    }});

  Object.defineProperties(_.Statistic, {
    "print": {
      get: function () {
        return printStatistic;
      }
    }});

})(TreatJS);

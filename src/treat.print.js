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

  var printVersion = function() {
    __out(padding_right("TreatJS Version ", ".", 30));
    __blank();
    __subout(padding_right(TreatJS.version + " ", ".", 30));
    __blank();
  }

  var printConfiguration = function () {

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank();
    }

    __out(padding_right("TreatJS Configuration ", ".", 30));
    __blank();

    for(var conf in _.Config) {
      log(":" + conf + " = ", _.Config[conf]);
    }

    __out(padding_right("TreatJS Verbose Mode ", ".", 30));
    __blank();

    for(var conf in _.Config.Verbose) {
      log(":" + conf + " = ", _.Config.Verbose[conf]);
    }
  }

  var printStatistic = function () {
    __out(padding_right("TreatJS Statistics ", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank(); 
    }

    for(var counter in _.Statistic) {
      log("#" + counter + " = ", _.Statistic.get(counter));
    }
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Version", {});

  Object.defineProperties(TreatJS.Version, {
    "print": { value: printVersion }
  });

  Object.defineProperties(TreatJS.Config, {
    "print": { value: printConfiguration }
  });

  Object.defineProperties(TreatJS.Statistic, {
    "print": { value: printStatistic }
  });

})(TreatJS);

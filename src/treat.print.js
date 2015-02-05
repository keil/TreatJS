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

  //          _     _    __   __          _          
  // _ __ _ _(_)_ _| |_  \ \ / /__ _ _ __(_)___ _ _  
  //| '_ \ '_| | ' \  _|  \ V / -_) '_(_-< / _ \ ' \ 
  //| .__/_| |_|_||_\__|   \_/\___|_| /__/_\___/_||_|
  //|_|                                              

  var printVersion = function() {
    __out(padding_right("TreatJS Version ", ".", 30));
    __blank();
    __subout(padding_right(TreatJS.version + " ", ".", 30));
    __blank();
  }

  //          _     _      ___           __ _                    _   _          
  // _ __ _ _(_)_ _| |_   / __|___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
  //| '_ \ '_| | ' \  _| | (__/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
  //| .__/_| |_|_||_\__|  \___\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
  //|_|                                      |___/                              

  var printConfiguration = function () {

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank();
    }

    __out(padding_right("TreatJS Configuration ", ".", 30));
    __blank();

    for(var conf in TreatJS.Config) {
      log(":" + conf + " = ", TreatJS.Config[conf]);
    }

    __out(padding_right("TreatJS Verbose Mode ", ".", 30));
    __blank();

    for(var conf in TreatJS.Config.Verbose) {
      log(":" + conf + " = ", TreatJS.Config.Verbose[conf]);
    }
  }

  //          _     _     ___ _        _   _    _   _    
  // _ __ _ _(_)_ _| |_  / __| |_ __ _| |_(_)__| |_(_)__ 
  //| '_ \ '_| | ' \  _| \__ \  _/ _` |  _| (_-<  _| / _|
  //| .__/_| |_|_||_\__| |___/\__\__,_|\__|_/__/\__|_\__|
  //|_|                                                  

  var printStatistic = function () {
    __out(padding_right("TreatJS Statistics ", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank(); 
    }

    for(var counter in TreatJS.Statistic) {
      log("#" + counter + " = ", TreatJS.Statistic.get(counter));
    }
  }

  //          _     _     _____             _      _ ___ 
  // _ __ _ _(_)_ _| |_  |_   _| _ ___ __ _| |_ _ | / __|
  //| '_ \ '_| | ' \  _|   | || '_/ -_) _` |  _| || \__ \
  //| .__/_| |_|_||_\__|   |_||_| \___\__,_|\__|\__/|___/
  //|_|                                                  

  var printPackage = function () {
    __out(padding_right("TreatJS Package", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank(); 
    }

    function printPackage(package, prefix) {
      for(var field in package) {
        log(prefix + " " + field, "");
        if(package[field] instanceof Object) printPackage(package[field], (prefix+"."));
      }
    }

    printPackage(TreatJS, "");
  }

  //          _     _     ___                   _   
  // _ __ _ _(_)_ _| |_  | __|_ ___ __  ___ _ _| |_ 
  //| '_ \ '_| | ' \  _| | _|\ \ / '_ \/ _ \ '_|  _|
  //| .__/_| |_|_||_\__| |___/_\_\ .__/\___/_|  \__|
  //|_|                          |_|                

  var printExport = function () {
    __out(padding_right("TreatJS Build ", ".", 30));
    __blank();

    function log(msg, value) {
      __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
      __blank(); 
    }

    function printPackage(package, prefix) {
      for(var field in package) {
        log(prefix + " " + field, "");
        if(package[field] instanceof Object) printPackage(package[field], (prefix+"."));
      }
    }

    printPackage(TreatJS.build(), "");
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

  TreatJS.extend("Package", {});
  Object.defineProperties(TreatJS.Package, {
    "print": { value: printPackage }
  });

  TreatJS.extend("Build", {});
  Object.defineProperties(TreatJS.Build, {
    "print": { value: printExport }
  });

})(TreatJS);

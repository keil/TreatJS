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

  // TreatJS Output
  var output = TreatJS.output;

  //          _     _    __   __          _          
  // _ __ _ _(_)_ _| |_  \ \ / /__ _ _ __(_)___ _ _  
  //| '_ \ '_| | ' \  _|  \ V / -_) '_(_-< / _ \ ' \ 
  //| .__/_| |_|_||_\__|   \_/\___|_| /__/_\___/_||_|
  //|_|                                              

  var printVersion = function() {
    output.println("TreatJS Version");
    output.printsubln(TreatJS.version, "");
  }

  //          _     _      ___           __ _                    _   _          
  // _ __ _ _(_)_ _| |_   / __|___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
  //| '_ \ '_| | ' \  _| | (__/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
  //| .__/_| |_|_||_\__|  \___\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
  //|_|                                      |___/                              

  var printConfiguration = function () {

    function log(msg, value) {
      output.printsubln(msg, value);
    }

    output.println("TreatJS Configuration");

    for(var conf in TreatJS.Config) {
      log(":" + conf + " = ", TreatJS.Config[conf]);
    }

    output.println("TreatJS Verbose Mode");

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
    output.println("TreatJS Statistics");

    function log(msg, value) {
      output.printsubln(msg, value);
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
    output.println("TreatJS Package");

    function log(msg, value) {
      output.printsubln(msg, value);;
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
    output.println("TreatJS Build");

    function log(msg, value) {
      output.printsubln(msg, value);
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

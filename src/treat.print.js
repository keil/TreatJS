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

TreatJS.package("TreatJS.Print", function (TreatJS, Contract, configuration) {

  //          _     _    __   __          _          
  // _ __ _ _(_)_ _| |_  \ \ / /__ _ _ __(_)___ _ _  
  //| '_ \ '_| | ' \  _|  \ V / -_) '_(_-< / _ \ ' \ 
  //| .__/_| |_|_||_\__|   \_/\___|_| /__/_\___/_||_|
  //|_|                                              

  var printVersion = function() {
    TreatJS.Log.line("TreatJS Version");
    TreatJS.Log.subline(TreatJS.version);
  }

  //          _     _      ___           __ _                    _   _          
  // _ __ _ _(_)_ _| |_   / __|___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
  //| '_ \ '_| | ' \  _| | (__/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
  //| .__/_| |_|_||_\__|  \___\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
  //|_|                                      |___/                              

  var printConfiguration = function () {
    TreatJS.Log.line("TreatJS Configuration");
    for(var entry in configuration) {
      TreatJS.Log.prompt(entry, configuration[entry]);
    }
  }

  //          _     _     ___ _        _   _    _   _    
  // _ __ _ _(_)_ _| |_  / __| |_ __ _| |_(_)__| |_(_)__ 
  //| '_ \ '_| | ' \  _| \__ \  _/ _` |  _| (_-<  _| / _|
  //| .__/_| |_|_||_\__| |___/\__\__,_|\__|_/__/\__|_\__|
  //|_|                                                  

  var printStatistic = function () {
    TreatJS.Log.line("TreatJS Statistic");
    const Statistic = TreatJS.Statistic.dump();
    for(let key in TreatJS.Statistic.Keys) {
      TreatJS.Log.prompt("#"+key, Statistic[key]);
    }
  }

  //          _     _     _____             _      _ ___ 
  // _ __ _ _(_)_ _| |_  |_   _| _ ___ __ _| |_ _ | / __|
  //| '_ \ '_| | ' \  _|   | || '_/ -_) _` |  _| || \__ \
  //| .__/_| |_|_||_\__|   |_||_| \___\__,_|\__|\__/|___/
  //|_|                                                  

  var printPackage = function () {
    TreatJS.Log.line("TreatJS Package");
    function dump(path, package) {
      if(typeof package === "object") for (var name in package) {
        TreatJS.Log.subline(`${path} . ${name}`);
        dump(`${path} . ${name}`, package[name]);
      }    
    }
    dump("TreatJS", TreatJS);
  }

  //            _     _      ___         _               _   
  // _ __ _ _(_)_ _| |_   / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| '_ \ '_| | ' \  _| | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //| .__/_| |_|_||_\__|  \___\___/_||_\__|_| \__,_\__|\__|
  //|_|                                                    

  var printContract = function () {
    TreatJS.Log.line("Contract Package");
    for (var name in Contract) {
      TreatJS.Log.subline(`Contarct . ${name}`);
    }
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    printVersion:       printVersion,
    printConfiguration: printConfiguration,
    printStatistic:     printStatistic,
    printPackage:       printPackage,
    printContract:      printContract
  };

});

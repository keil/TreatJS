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

  var Verbose = new Object();

  //             _                 
  //__ _____ _ _| |__  ___ ___ ___ 
  //\ V / -_) '_| '_ \/ _ (_-</ -_)
  // \_/\___|_| |_.__/\___/__/\___|

  // defult verbose mode for sandbox application
  var DEFAULT_SANDBOX   = false;
  // defult verbose mode for contract assertions
  var DEFAULT_ASSERT    = false;
  // defult verbose mode for TreatJS statistics
  var DEFAULT_STATISTIC = false;

  Object.defineProperties(Verbose, {
    "sandbox": {
      value: ((TreatJS.verbose.sandbox===undefined) ? 
              DEFAULT_SANDBOX : TreatJS.verbose.sandbox), 
        enumerable: true
    },
    "assert":  { 
      value: ((TreatJS.verbose.assert===undefined) ?
              DEFAULT_ASSERT : TreatJS.verbose.assert), 
      enumerable: true
    },
    "statistic": {
      value: ((TreatJS.verbose.statistic===undefined) ? 
              DEFAULT_STATISTIC : TreatJS.verbose.statistic), 
      enumerable: true
    }
  });

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Verbose", Verbose);

})(TreatJS);

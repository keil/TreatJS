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
(function(TreatJS) {


    // id --> proxy
  var proxies = new WeakMap();
  // proxy --> value;
  var values = new WeakMap();

  function wrap(id, value, proxy) { 
    proxies.set(id, proxy);
    values.set(proxy, value);
    return proxy;
  }

  function verify(id, proxy) {
    return (proxy == proxies.get(id));
  }


  function unwrap(proxy) {
    return values.get(proxy);
  }




  
  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Polymorphism", {});

  // has to be reduces to 
  // new frame
  // add/set
  // get


  TreatJS.define(TreatJS.Polymorphism, "wrap", wrap);
  TreatJS.define(TreatJS.Polymorphism, "verify", verify);
  TreatJS.define(TreatJS.Polymorphism, "unwrap", unwrap);

})(TreatJS);

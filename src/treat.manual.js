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

  var METHODS = "Methods";
  var CORE = "Core - Contracts";
  var CONVENIENCE = "Convenience - Contracts";
  var REFLECTION = "Reflection - Contracts";

  var MAPS = "Maps";
  var MISCELLANEOUS = "Miscellaneous";

  function makeManual() {
    var Manual = [];

    function add (name, classid) {
      var id = (classid || MISCELLANEOUS);
      if (Manual[id] == undefined) Manual[id] = [];
      Manual[id][name] = null;
    }

    var toString = function () {
      var str = "";
      for (var cl in Manual) {
        str += cl + ":\n\n";
        for (var en in Manual[cl]) {
          str += " - " + en + "\n";
        }
        str += "\n";
      }
      return str;
    }

    Object.defineProperty(Manual, "toString", {
      value: toString, enumerable: false
    });

    // methods
    add("assert", METHODS);
    add("construct", METHODS);

    // contract
    add("Base", CORE);

    add("Function", CORE);
    add("Method", CORE);
    add("Dependent", CORE);

    add("Object", CORE);

    add("With", CORE);

    add("Union", CORE);
    add("Intersection", CORE);
    add("Negation", CORE);

    add("And", CORE);
    add("Or", CORE);
    add("Not", CORE);

    add("Constructor", this.Constructor, "Constructors");

    // convinience
    add("AObject", CONVENIENCE);

    add("AFunction", CONVENIENCE);
    add("SFunction", CONVENIENCE);

    add("AMethod", CONVENIENCE);
    add("SMethod", CONVENIENCE);

    add("SDependent", CONVENIENCE);

    // refelction
    // TODO, add reflection API

    // util
    add("StringMap", MAPS);
    add("RegExpMap", MAPS);
    add("Mapping", MAPS);

    return Manual;
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Manual", makeManual());

})(TreatJS);

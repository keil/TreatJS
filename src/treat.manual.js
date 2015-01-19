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

  function makeManual() {
    var Manual = [];

    function __include (name, entry, classid) {
      var id = (classid || "Miscellaneous");
      if (Manual[id] == undefined) Manual[id] = [];
      Manual[id][name] = entry;
    }

    var toString = function () {
      var str = "";
      for (var cl in Manual) {
        str += "* " + cl + "\n\n";
        for (var en in Manual[cl]) {
          str += "** " + en + "\n";
        }
        str += "\n";
      }
      return str;
    }

    Object.defineProperty(Manual, "toString", {
      get: function () { return toString; },
      enumerable: false
    });

    // assert
    __include("assert", this.assert, "Methods");
    __include("construct", this.construct, "Methods");

    // contract
    __include("Base", this.BaseContract, "Core - Contrcts");

    __include("Function", this.FunctionContract, "Core - Contrcts");
    __include("Method", this.MethodContract, "Core - Contrcts");
    __include("Dependent", this.DependentContract, "Core - Contrcts");

    __include("Object", this.ObjectContract, "Core - Contrcts");

    __include("With", this.With, "Core - Contrcts");

    __include("Union", this.Union, "Core - Contrcts");
    __include("Intersection", this.Intersection, "Core - Contrcts");
    __include("Negation", this.Negation, "Core - Contrcts");

    __include("And", this.And, "Core - Contrcts");
    __include("Or", this.Or, "Core - Contrcts");
    __include("Not", this.Not, "Core - Contrcts");

    __include("Constructor", this.Constructor, "Contract Constructor");

    // convinience
    __include("AObject", this.AdvancedObjectContract, "Convenience - Contrcts");

    __include("AFunction", this.AdvancedFunctionContract, "Convenience - Contrcts");
    __include("SFunction", this.SimpleFunctionContract, "Convenience - Contrcts");

    __include("AMethod", this.AdvancedMethodContract, "Convenience - Contrcts");
    __include("SMethod", this.SimpleMethodContract, "Convenience - Contrcts");

    __include("SDependent", this.SimpleDependentContract, "Convenience - Contrcts");

    // util
    __include("StringMap", this.Map.StringMap, "Maps");
    __include("RegExpMap", this.Map.RegExpMap, "Maps");
    __include("Mapping", this.Map.Mapping, "Maps");

    return Manual;
  }

  _.Manual = makeManual();

})(TreatJS);

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

  function makeManual() {
    var Manual = [];

    function include (name, entry, classid) {
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
    include("assert", this.assert, "Methods");
    include("construct", this.construct, "Methods");

    // contract
    include("Base", this.BaseContract, "Core - Contrcts");

    include("Function", this.FunctionContract, "Core - Contrcts");
    include("Method", this.MethodContract, "Core - Contrcts");
    include("Dependent", this.DependentContract, "Core - Contrcts");

    include("Object", this.ObjectContract, "Core - Contrcts");

    include("With", this.With, "Core - Contrcts");

    include("Union", this.Union, "Core - Contrcts");
    include("Intersection", this.Intersection, "Core - Contrcts");
    include("Negation", this.Negation, "Core - Contrcts");

    include("And", this.And, "Core - Contrcts");
    include("Or", this.Or, "Core - Contrcts");
    include("Not", this.Not, "Core - Contrcts");

    include("Constructor", this.Constructor, "Constructors");

    // convinience
    include("AObject", this.AdvancedObjectContract, "Convenience - Contrcts");

    include("AFunction", this.AdvancedFunctionContract, "Convenience - Contrcts");
    include("SFunction", this.SimpleFunctionContract, "Convenience - Contrcts");

    include("AMethod", this.AdvancedMethodContract, "Convenience - Contrcts");
    include("SMethod", this.SimpleMethodContract, "Convenience - Contrcts");

    include("SDependent", this.SimpleDependentContract, "Convenience - Contrcts");

    // util
    include("StringMap", this.Map.StringMap, "Maps");
    include("RegExpMap", this.Map.RegExpMap, "Maps");
    include("Mapping", this.Map.Mapping, "Maps");

    return Manual;
  }

  _.Manual = makeManual();

})(TreatJS);

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
        ck
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
    include("Base", this.BaseContract, "Core - Contracts");

    include("Function", this.FunctionContract, "Core - Contracts");
    include("Method", this.MethodContract, "Core - Contracts");
    include("Dependent", this.DependentContract, "Core - Contracts");

    include("Object", this.ObjectContract, "Core - Contracts");

    include("With", this.With, "Core - Contracts");

    include("Union", this.Union, "Core - Contracts");
    include("Intersection", this.Intersection, "Core - Contracts");
    include("Negation", this.Negation, "Core - Contracts");

    include("And", this.And, "Core - Contracts");
    include("Or", this.Or, "Core - Contracts");
    include("Not", this.Not, "Core - Contracts");

    include("Constructor", this.Constructor, "Constructors");

    // convinience
    include("AObject", this.AdvancedObjectContract, "Convenience - Contracts");

    include("AFunction", this.AdvancedFunctionContract, "Convenience - Contracts");
    include("SFunction", this.SimpleFunctionContract, "Convenience - Contracts");

    include("AMethod", this.AdvancedMethodContract, "Convenience - Contracts");
    include("SMethod", this.SimpleMethodContract, "Convenience - Contracts");

    include("SDependent", this.SimpleDependentContract, "Convenience - Contracts");

    // util
    include("StringMap", this.Map.StringMap, "Maps");
    include("RegExpMap", this.Map.RegExpMap, "Maps");
    include("Mapping", this.Map.Mapping, "Maps");

    return Manual;
  }

  _.Manual = makeManual();

})(TreatJS);

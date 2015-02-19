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

  function make(target, name, value) {
    Object.defineProperty(target, name, {
      value: value, enumerable: true
    });
  }

  function build() {
    var Contract = {};

    // assert
    make(Contract, "construct", TreatJS.construct);
    make(Contract, "assert", TreatJS.assert);

    // contract
    make(Contract, "Base", TreatJS.Contract.Base);

    make(Contract, "Function", TreatJS.Contract.Function);
    make(Contract, "Method", TreatJS.Contract.Method);
    make(Contract, "Dependent", TreatJS.Contract.Dependent);

    make(Contract, "Object", TreatJS.Contract.Object);

    make(Contract, "With", TreatJS.Contract.With);

    make(Contract, "Union", TreatJS.Contract.Union);
    make(Contract, "Intersection", TreatJS.Contract.Intersection);
    make(Contract, "Negation", TreatJS.Contract.Negation);

    make(Contract, "And", TreatJS.Contract.And);
    make(Contract, "Or", TreatJS.Contract.Or);
    make(Contract, "Not", TreatJS.Contract.Not);

    make(Contract, "Reflection", TreatJS.Contract.Reflection);

    make(Contract, "In", TreatJS.Contract.In);
    make(Contract, "Out", TreatJS.Contract.Out);
    make(Contract, "Forall", TreatJS.Contract.Forall);

    make(Contract, "Constructor", TreatJS.Constructor.Constructor);

    // convinience
    make(Contract, "AObject", TreatJS.Convenience.AObject);

    make(Contract, "AFunction", TreatJS.Convenience.AFunction);
    make(Contract, "SFunction", TreatJS.Convenience.SFunction);

    make(Contract, "AMethod", TreatJS.Convenience.AMethod);
    make(Contract, "SMethod", TreatJS.Convenience.SMethod);

    make(Contract, "SDependent", TreatJS.Convenience.SDependent);

    make(Contract, "SForall", TreatJS.Convenience.SForall);

    // reflection     
    make(Contract, "Get", TreatJS.Reflection.Get);
    make(Contract, "Set", TreatJS.Reflection.Set);

    // util
    make(Contract, "StringMap", TreatJS.Map.StringMap);
    make(Contract, "Mapping", TreatJS.Map.Mapping);
    make(Contract, "RegExpMap", TreatJS.Map.RegExpMap);

    return Contract;
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("build", build);

})(TreatJS);

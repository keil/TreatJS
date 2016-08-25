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

(function(TreatJS) {

  //  ___         _               _   
  // / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_\__|_| \__,_\__|\__|

  function Contract() {
    if(!(this instanceof Contract)) return new Contract();
  };
  Contract.prototype = {};
  Contract.prototype.constructor = Contract;
  Contract.prototype.toString = function() {
    return '[[TreatJS/Contract]]'; 
  };

  // ___      _                  _    ___         _               _   
  //|   \ ___| |__ _ _  _ ___ __| |  / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) / _` | || / -_) _` | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___|_\__,_|\_, \___\__,_|  \___\___/_||_\__|_| \__,_\__|\__|
  //                 |__/                                             

  function Delayed() {
    if(!(this instanceof Delayed)) return new Delayed();
  }
  Delayed.prototype = Object.create(Contract.prototype);
  Delayed.prototype.constructor = Delayed;
  Delayed.prototype.toString = function() {
    return '[[TreatJS/Delayed]]';
  };

  // ___                    _ _      _          ___         _               _   
  //|_ _|_ __  _ __  ___ __| (_)__ _| |_ ___   / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || '  \| '  \/ -_) _` | / _` |  _/ -_) | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|  \___\___/_||_\__|_| \__,_\__|\__|

  function Immediate() {
    if(!(this instanceof Immediate)) return new Immediate();
  }
  Immediate.prototype = Object.create(Contract.prototype);
  Immediate.prototype.constructor = Immediate;
  Immediatet.prototype.toString = function() {
    return '[[TreatJS/Immediate]]';
  };

  //  ___           _    _           _              ___         _               _   
  // / __|___ _ __ | |__(_)_ _  __ _| |_ ___ _ _   / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ '  \| '_ \ | ' \/ _` |  _/ _ \ '_| | (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_|_|_|_.__/_|_||_\__,_|\__\___/_|    \___\___/_||_\__|_| \__,_\__|\__|

  function Combinator() {
    if(!(this instanceof Combinator)) return new Combinator();
  }
  Combinator.prototype = Object.create(Contract.prototype);
  Combinator.prototype.constructor = Combinator;
  Combinator.prototype.toString = function() {
    return '[[TreatJS/Combinator]]';
  };

  //__      __                              ___         _               _   
  //\ \    / / _ __ _ _ __ _ __  ___ _ _   / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ / '_/ _` | '_ \ '_ \/ -_) '_| | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/|_| \__,_| .__/ .__/\___|_|    \___\___/_||_\__|_| \__,_\__|\__|
  //                 |_|  |_|                                               

  function Wrapper() {
    if(!(this instanceof Wrapper)) return new Wrapper();
  }
  Wrapper.prototype = Object.create(Contract.prototype);
  Wrapper.prototype.constructor = Wrapper;
  Wrapper.prototype.toString = function() {
    return '[[TreatJS/Wrapper]]';
  };

  //  ___             _               _              ___         _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _   / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| | (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|    \___\___/_||_\__|_| \__,_\__|\__|

  function Constructor() {
    if(!(this instanceof Constructor)) return new Constructor();
  }
  Constructor.prototype = Object.create(DelayedContract.prototype); // TODO, why delayed ?
  Constructor.prototype.constructor = Constructor;
  Constructor.prototype.toString = function() {
    return '[[TreatJS/Constructor]]';
  };

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.export({
    "Contract",     Contract,
    "Immediate",    ImmediateContract,
    "Delayed",      DelayedContract,
    "Combinator",   CombinatorContract,
    "Wrapper",      WrapperContract,
    "Constructor",  Constructor
  });

})(TreatJS);

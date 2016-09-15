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

TreatJS.package("TreatJS.Error", function (TreatJS, Contract, configuration) {

  // ___ _                
  //| _ ) |__ _ _ __  ___ 
  //| _ \ / _` | '  \/ -_)
  //|___/_\__,_|_|_|_\___|

  function Blame() {
    if(!(this instanceof Blame)) return new Blame(...arguments);
    else Error.apply(this, arguments);

    this.name = "Blame";
    this.stack = (new Error()).stack;
  } 
  Blame.prototype = Object.create(Error.prototype);
  Blame.prototype.constructor = Blame;
  Blame.prototype.toString = function() {
    return '[[TreatJS/Blame]]';
  };

  function PositiveBlame(subject, contract) {
    if(!(this instanceof PositiveBlame)) return new PositiveBlame(...arguments);
    else Blame.apply(this);

    this.name = "PositiveBlame";
    this.message = "Subject" + " @ " + contract.toString();
    this.stack = (new Error()).stack;
  } 
  PositiveBlame.prototype = Object.create(Blame.prototype);
  PositiveBlame.prototype.constructor = PositiveBlame;
  PositiveBlame.prototype.toString = function() {
    return '[[TreatJS/PositiveBlame]]';
  };

  function NegativeBlame(context, contract) {
    if(!(this instanceof NegativeBlame)) return new NegativeBlame(...arguments);
    else Blame.apply(this);

    this.name = "NegativeBlame";
    this.message ="Context (" + context.id + ")" + " @ " + contract.toString();
    this.stack = (new Error()).stack;
  } 
  NegativeBlame.prototype = Object.create(Blame.prototype);
  NegativeBlame.prototype.constructor = NegativeBlame;
  NegativeBlame.prototype.toString = function() {
    return '[[TreatJS/NegativeBlame]]';
  };

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Blame: Blame,
    PositiveBlame, PositiveBlame,
    NegativeBlame: NegativeBlame
  };

});

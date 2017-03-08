/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Error", function (TreatJS, Contract, Configuration, Realm) {

  // _____             _      _ ___   ___                 
  //|_   _| _ ___ __ _| |_ _ | / __| | __|_ _ _ _ ___ _ _ 
  //  | || '_/ -_) _` |  _| || \__ \ | _|| '_| '_/ _ \ '_|
  //  |_||_| \___\__,_|\__|\__/|___/ |___|_| |_| \___/_|  

  function TreatJSError() {
    if(!(this instanceof TreatJSError)) return new TreatJSError();
    else Error.apply(this);

    this.name = "Blame";
    this.stack = (new Error()).stack;
  } 
  TreatJSError.prototype = Object.create(Error.prototype);
  TreatJSError.prototype.constructor = TreatJSError;
  TreatJSError.prototype.toString = function() {
    return '[[TreatJS/Error]]';
  };

  // ___ _                
  //| _ ) |__ _ _ __  ___ 
  //| _ \ / _` | '  \/ -_)
  //|___/_\__,_|_|_|_\___|

  function PositiveBlame(subject, contract) {
    if(!(this instanceof PositiveBlame)) return new PositiveBlame(subject, contract);
    else TreatJSError.apply(this);

    this.name = "PositiveBlame";
    this.message = "Subject" + " @ " + contract.toString();
    this.stack = (new Error()).stack;
  } 
  PositiveBlame.prototype = Object.create(TreatJSError.prototype);
  PositiveBlame.prototype.constructor = PositiveBlame;
  PositiveBlame.prototype.toString = function() {
    return '[[TreatJS/PositiveBlame]]';
  };

  function NegativeBlame(context, contract) {
    if(!(this instanceof NegativeBlame)) return new NegativeBlame(context, contract);
    else TreatJSError.apply(this);

    this.name = "NegativeBlame";
    this.message ="Context (" + context.id + ")" + " @ " + contract.toString();
    this.stack = (new Error()).stack;
  } 
  NegativeBlame.prototype = Object.create(TreatJSError.prototype);
  NegativeBlame.prototype.constructor = NegativeBlame;
  NegativeBlame.prototype.toString = function() {
    return '[[TreatJS/NegativeBlame]]';
  };

  //  ___                 
  // | __|_ _ _ _ ___ _ _ 
  // | _|| '_| '_/ _ \ '_|
  // |___|_| |_| \___/_|  

  function SandboxError (trapname="Undefiend trap.") {
    if(!(this instanceof SandboxError)) return new SandboxError(...arguments);
    else TreatJSError.apply(this);

    this.name = "Sandbox Error";
    this.message = "Sandbox function cannot cause observable effects or call functions. Trap: "+trapname+".";
    this.stack = (new Error()).stack;
  }
  SandboxError.prototype = Object.create(TreatJSError.prototype);
  SandboxError.prototype.constructor = SandboxError;
  SandboxError.prototype.toString = function() {
    return '[[TreatJS/SandboxError]]';
  };

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    TreatJSError:   TreatJSError,
    PositiveBlame,  PositiveBlame,
    NegativeBlame:  NegativeBlame,
    SandboxError:   SandboxError
  };

});

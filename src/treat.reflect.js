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

  var error = _.error;
  var violation = _.violation;
  var blame = _.blame;

  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  var ImmediateContract = _.Immediate;

  var Callback = _.Callback.Callback;
  var Handle = _.Callback.Handle;


  // TODO
  // var Reflect = _.Core.Reflect;
  // canonicalize
  // constructor for get, and object contracts
  // are reflection contract object contract
  // are they delayed or immediate
  //



  function ReflectionContract(trap, sub) {
    if(!(this instanceof ReflectionContract)) return new ReflectionContract(trap, sub);

    if((typeof trap)!=="string") error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber); 
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "trap": {
        get: function () { return trap; } },
      "sub": {
        get: function () { return sub; } }
    });

    this.toString = function() {
      return "" +  trap + " @ " + sub.toString();
    };
  }
  ReflectionContract.prototype = new ImmediateContract();




  function GetContract(contract) {
    if(!(this instanceof GetContract)) return new GetContract(contract);
    ReflectionContract.call(this, "get", contract);
  }
  GetContract.prototype = Object.create(ReflectionContract.prototype);


  function SetContract(contract) {
    if(!(this instanceof SetContract)) return new SetContract(contract);
    ReflectionContract.call(this, "set", contract);
  }
  SetContract.prototype = Object.create(ReflectionContract.prototype);









  /*

     function GetContract(target, name, receiver) {
     if(!(this instanceof GetContract)) return new GetContract(target, name, receiver);

     if(!(target instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
     if(!(name instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
     if(!(receiver instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

     Object.defineProperties(this, {
     "target": {
     get: function () { return target; } },
     "name": {
     get: function () { return name; } },
     "receiver": {
     get: function () { return receiver; } }
     });
     }
     GetContract.prototype = new ReflectionContract(); /// TODO

     function SetContract(target, name, value, receiver) {
     if(!(this instanceof SetContract)) return new SetContract(target, name, value, receiver);

     if(!(target instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
     if(!(name instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
     if(!(value instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
     if(!(receiver instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

     Object.defineProperties(this, {
     "target": {
     get: function () { return target; } },
     "name": {
     get: function () { return name; } },
     "value": {
     get: function () { return value; } },
     "receiver": {
     get: function () { return receiver; } }
     });
     }
     SetContract.prototype = new ReflectionContract(); /// TODO


*/




  function ReflectionHandler(contract, global, handler) {
    if(!(this instanceof ReflectionHandler)) return new ReflectionHandler(contract, global, handler);

    this.get = function(target, name, receiver) {
      
      if(name === contract.trap) {
        return _.assertWith(target[name], contract.sub, global, handler);
      } else {
        return target[name];
      }
    };
  }

  function NoOpHandler() {
    if(!(this instanceof NoOpHandler)) return new NoOpHandler();

    // default get trap
    this.get = function(target, name, receiver) {
      return target[name];
    };

    // default set trap
    this.set = function(target, name, value, receiver) {
      return target[name]=value;
    };
  }


  function assertWithRefelction(arg, contract, global, callbackHandler) {


    if(contract instanceof ReflectionContract) {
      if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      var reflect = new ReflectionHandler(contract, global, callbackHandler);
      var noop = new NoOpHandler();
      var proxy = new Proxy(arg, new Proxy(noop, reflect));
      return proxy;
    }

  }

  /*
     if(contract instanceof GetContract) {
     if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

     var handler = new GetHandler(contract, global, callbackHandler);
     var proxy = new Proxy(arg, handler);
     return proxy;
     }

     if(contract instanceof SetContract) {
     if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

     print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");


     var handler = new SetHandler(contract, global, callbackHandler);
     var proxy = new Proxy(arg, handler);
     return proxy;
     }


     if(contract instanceof ReflectionContract) {
     if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

     var handler = new GetHandler(contract, global, callbackHandler);
     var proxy = new Proxy(arg, handler);
     return proxy;
     }
     */







  /*
     function GetHandler(contract, global, handler) {
     if(!(this instanceof GetHandler)) return new GetHandler(contract, global, handler);

     var callback = GetCallback(handler, contract);

     this.get = function(target, name, receiver) {

     var targetC = _.assertWith(target, contract.target, global, callback.receiverHandler);
     var nameC = _.assertWith(name, contract.name, global, callback.nameHandler);
     var receiverC = _.assertWith(receiver, contract.receiver, global, callback.receiverHandler);

  // TODO, possible to contarct the return directly
  return targetC[nameC];
  };
  }

  function SetHandler(contract, global, handler) {
  if(!(this instanceof SetHandler)) return new SetHandler(contract, global, handler);

  var callback = SetCallback(handler, contract);

  this.set = function(target, name, value, receiver) {
  var targetC = _.assertWith(target, contract.target, global, callback.targetHandler);
  var nameC = _.assertWith(name, contract.name, global, callback.nameHandler);
  var valueC = _.assertWith(value, contract.value, global, callback.valueHandler);
  var receiverC = _.assertWith(receiver, contract.receiver, global, callback.receiverHandler);

  // TODO, possible to contarct the return directly
  return (targetC[nameC]=valueC);
  };
  }


  var and = _.Logic.and;

*/

  /*
     function GetCallback(handler, contract) {
     if(!(this instanceof GetCallback)) return new GetCallback(handler, contract);
     else Callback.apply(this, arguments);

     var target =  Handle.new();
     var name =  Handle.new();
     var receiver = Handle.new();

     __getter("caller", function() {
     return and(target.caller, and(name.caller, receiver.caller));
     }, this);

     __getter("callee", function() {
     return and(target.callee, and(name.callee, receiver.callee));
     }, this);

     __getter("contract", function() {
     return and(this.caller, this.callee);
     }, this);

     __define("blame", function() {
     return contract;
     }, this);

     __getter("targetHandler", function() {
     return (function(handle) {
     target = Handle.update(target, handle);
     handler(this);    
     }).bind(this);
     }, this);

     __getter("nameHandler", function() {
     return (function(handle) {
     name = Handle.update(name, handle);
     handler(this);
     }).bind(this);
     }, this);

     __getter("receiverHandler", function() {
     return (function(handle) {
     receiver = Handle.update(receiver, handle);
     handler(this);
     }).bind(this);
     }, this);

     }
     GetCallback.prototype = Callback.prototype;
     GetCallback.prototype.toString = function() {
     return "<GetCallback>";
     }



     function SetCallback(handler, contract) {
     if(!(this instanceof SetCallback)) return new SetCallback(handler, contract);
     else Callback.apply(this, arguments);

     var target =  Handle.new();
     var name =  Handle.new();
     var value =  Handle.new();
     var receiver = Handle.new();

     __getter("caller", function() {
     return and(and(target.caller, name.caller), and(value.caller, receiver.caller));
     }, this);

     __getter("callee", function() {
     return and(and(target.callee, name.callee), and(value.callee, receiver.callee));
     }, this);

__getter("contract", function() {
  return and(this.caller, this.callee);
}, this);

__define("blame", function() {
  return contract;
}, this);

__getter("targetHandler", function() {
  return (function(handle) {
    target = Handle.update(target, handle);
    handler(this);    
  }).bind(this);
}, this);

__getter("nameHandler", function() {
  return (function(handle) {
    name = Handle.update(name, handle);
    handler(this);
  }).bind(this);
}, this);

__getter("valueHandler", function() {
  return (function(handle) {
    value = Handle.update(value, handle);
    handler(this);
  }).bind(this);
}, this);

__getter("receiverHandler", function() {
  return (function(handle) {
    receiver = Handle.update(receiver, handle);
    handler(this);
  }).bind(this);
}, this);
}
SetCallback.prototype = Callback.prototype;
SetCallback.prototype.toString = function() {
  return "<SetCallback>";
}



*/



/*
   function ReflectionHandler(contract, global, handler) {
   if(!(this instanceof ReflectionHandler)) return new ReflectionHandler(contract, global, handler);

   var noopHandler = {
   get: function(target, name, receiver) {
   return target[name];
   },
   set: function(target, name, value, receiver) {
   return (target[name]=value);
   }
   };



   return new Proxy(noopHandler, this);
   }
   */










































// TODO

/**
 * Reflection Contracts
 */

__define("Reflection", ReflectionContract, _);

__define("GetContract", GetContract, _);
__define("SetContract", SetContract, _);

__define("assertReflection", assertWithRefelction, _);


})(TreatJS);

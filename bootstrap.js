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

/*
   function TestList() {

   this.first = undefined;
   this.last = this.first;

//this.length = 0;
Object.defineProperty(this, "length", {value:0});
//Object.defineProperty(this, "length", {get:function() {return 0;}});
}
TestList.prototype = {};
TestList.prototype.add = function(value) {
return undefined;
var element = {value:value, next:undefined};
if(this.last) {
this.last.next = element;
this.last = element;
//this.length++; // XXX
}
else {
this.first = element;
this.last = element;
//this.length++; // XXX
};
}





var list = new TestList();

var start = new Date().getTime();

for (var i=0; i<100000000; i++) {
if(list.length<10000000) list.add(i);
}

var end = new Date().getTime();

print("# " + (end-start) + " ms");

*/

/*
var x = 1;

function plusX(arg) {
  return (arg+x);
}


function wrap(fun) {

  function decompile(fun, globalArg) {
    var string = "(" + fun.toString() + ")"; 
    var sandbox = globalArg;
    var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");
    return secureFun;
  }

  function Handler (origin) {
    this.has = function(scope, name) {
     // return true;
      return origin.hasOwnProperty(name);
        //Object.prototype.hasOwnProperty(origin, name);
//        (name in origin);
      // return true; // TODO, required ?
    };

    this.get = function(target, name, receiver) {
      return origin[name];
    }

    this.set = function(target, name, value, receiver) {
      return origin[name] = value;
    }

    Object.defineProperty(this, "target", {
      set: function (target) {
        origin = target;
      },
      enumerable: true
    });
  }
  var handler = new Handler({xxx:4711});
  var global = new Proxy({}, handler);

  var g = decompile(fun, global);

  Object.defineProperty(g, "eval", {
      value: function (global, thisArg, args) {
        handler.target = global;
        return this.apply(thisArg, args);
      },
      enumerable: true
    });
    return g;
}

var plusX = wrap(plusX);

print(plusX(1));
//handler.target = {x:4711};
//print(plusX(1));
print(plusX.eval({x:4711}, this, [5]));

quit();
*/














// ___ ___ _  _ _ _ __ ___ 
//(_-</ _ \ || | '_/ _/ -_)
///__/\___/\_,_|_| \__\___|

// libraries
load("lib/lib_padding.js");

load("src/system.js"); // TODO

// base source files
// load("src/out.js"); // TODO
// load("src/debugger.js"); // TODO

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              




load("src/treat.js");

// TreatJS // TODO
var TreatJS = new TreatJS({// 
  /****/assertion: true,// as 
    /**/membrane: true, 
    /**/decompile: true, 
    /**/canonicalize: true
}, {
  /****/assert: true,
    /**/sandbox: true,
    /**/statistic: true
});

//         _               _             
// _____ _| |_ ___ _ _  __(_)___ _ _  ___
/// -_) \ /  _/ -_) ' \(_-< / _ \ ' \(_-<
//\___/_\_\\__\___|_||_/__/_\___/_||_/__/

load("src/treat.config.js");
load("src/treat.verbose.js");

load("src/treat.statistic.js");
load("src/treat.print.js"); // TODO, ass print package, print export, print manual

load("src/treat.export.js");// TODO, add new contract types
load("src/treat.manual.js");// TODO, add new contarct types


// core api
load("src/core/treat.base.js");// TODO, cleanup
load("src/core/treat.violation.js");// TODO, cleanup

//load("src/core/treat.sandbox.js");// TODO, cdecompile hache
load("src/core/treat.decompile.js");// TODO, cdecompile hache
load("src/core/treat.sandbox2.js");// TODO, cdecompile hache


load("src/core/treat.logic.js");// TODO, cleanup
//load("src/core/treat.callback.js");// TODO, cleanup, alternative to getter?
load("src/core/treat.callback2.js");

load("src/core/treat.map.js");// TODO, cleanup
// TODO, experimental code
// not a core API at the moment ?
// polymorphic api 
load("src/treat.polymorphic.js");// TODO

load("src/core/treat.contract.js");// TODO, cleanup, experimental code inside
load("src/core/treat.constructor.js");

//load("src/core/treat.handler.js");// TODO, cleanup, experimental code inside
load("src/core/treat.canonicalize.js");// TODO, add new contract types
//load("src/core/treat.construct.js"); // TODO
load("src/core/treat.assert.js");// TODO, cleanup, experimental code

// convenience api
load("src/treat.convenience.js");

// reflection api
load("src/treat.reflect.js");

// polymorphic api
//load("src/treat.polymorphic.js"); // TODO experimental code

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

var Contract = TreatJS.build();

load("contracts/contracts.js"); // TODO, renew
load("contracts/aliases.js"); // TODO, renew

/**

  var object = {};

  object.x = 0;
//object.length = 0;

object.doSth = function(x) {
//this.length=x;
this.x=x;
}

Object.defineProperty(object, 'length', {get:function() {
return object.x;
}});




var start = new Date().getTime();

for (var i=0; i<1000000000; i++) {
if(object.length>=0) {
object.doSth(i);
}
}

var end = new Date().getTime();
print("# " + (end-start) + " ms");


*/


quit();

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set configuration
/*TreatJS.configure({
  assertion: true,
  membrane: false,
  decompile: false,
  canonicalize: true 
  });

// set verbose
TreatJS.verbose({
assert: false,
sandbox: false,
statistic: true 
});*/

// set Contract
//TreatJS.export(this);
//TreatJS.integrate();

/*

   function __getterX(name, property, target) {
   Object.defineProperty(target, name, {
   get: function () { return property; },
   enumerable: true
   });
   }

   function __valueX(name, property, target) {
   Object.defineProperty(target, name, {
   value:property,
   enumerable: true
   });
   }



   var start = new Date().getTime();

   function f(x,y) {
   return (x+y);
   }

   var obj = {};
//obj.p=1;
//Object.defineProperty(obj, "p", {value:1});
//__valueX("p", 1, obj);
//Object.defineProperty(obj, "p", { get: function () { return 1; } });
__getterX("p", 1, obj);


for(var i=0; i<1000000000; i++) {

if(obj.p) {
f(1,2);
}
}

var end = new Date().getTime();
var time = end - start;
print('Execution time: ' + time);
*/



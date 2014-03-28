// every function with one oargument is a base contract
// give contract combinators

/* Todo:
         * * contract combinator and/ or
         * better errpr messages
         * binding of global objects/ values
         * parser to check contracts
         * ERROR, if a contract gets applied to a normal object/ value
         */




// The Contract 
$ = new Object();

(function(_) {
        
        // maybe switch to let-contract or something similar
        function BaseContract(scope, predicate) {
                this.scope = scope;
                this.predicate = predicate;
        }


        function FunctionContract(domain, range) {
                this.domain = domain;
                this.range = range;
        }

        function ObjectContract(properties) {
                this.properties = properties;
        }
        ObjectContract.prototype = new Array();



        function error(msg) {
                __sysout("Error: " + msg);
                quit();
        }

        function assign(arg, contract) {
                if(contract instanceof FunctionContract) {
                        var handler = new FunctionHandler(contract.domain, contract.range);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                } else if (contract instanceof ObjectContract) {
                        var handler = new ObjectHandler(contract.properties);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                } else if (contract instanceof BaseContract) {
                        __sysout("adfasd");
                        with(new Proxy(this, new ScopeHandler(contract.scope))) {
                                //   Math.abs(1); 
                                //contract.predicate(4);
                                if(!eval("(" + contract.predicate.toString() + ")(arg)"))
                                        error("Violated Contract: " + contract.toString());
                                else 
                                        return arg;

                                // //var valid = (contract instanceof Function) ? (contract(arg)==true) : false;
                                // if(!valid) error("Violated Contract: " + contract.toString());
                                // else return arg;

                                //return false;
                                return assign(arg, contract.predicate) 
                        }; 
                } else {
                        // TODO, bind args

                        var valid =  eval("(" + contract.toString() + ")(arg)");
                        //var valid = (contract instanceof Function) ? (contract(arg)==true) : false;
                        if(!valid) error("Violated Contract: " + contract.toString());
                        else return arg;
                }
        }

        // Note:
        // this code considers only functions with exactly one argument
        // an extension is possible, use ObjectContracts

        function FunctionHandler(domain, range) {
                this.apply = function(target, thisArg, args) {
                        domain.foreach(function(i, contract) {
                                args[i] = assign(args[i], contract);
                        });
                        var val = target.apply(thisArg, args);
                        return assign(val, range);
                };
                this.construct = function(target, args) {
                        return this.apply(target, this, args);
                };
        }

        // Note, check by get, check by set?
        function ObjectHandler(contract) {
                this.get = function(target, name, receiver) {
                        return (contract[name]!=undefined) ? assign(target[name], contract[name]) : target[name]; 
                };
                this.set = function(target, name, value, receiver) {
                        return (target[name] = (contract[name]!=undefined) ? assign(value, contract[name]) : value);
                };
        }

        function ScopeHandler(scope) {
                this.has = function(target, name) {
                        __sysout("HAS:" + name);
                        if (name == "assign" || name == "arg" || name == "contract" || name=="eval")
                                return false;
                        else if(name in scope)
                                return true;
                        else error("Unauthorized Access " + name);
                }
                this.get = function(target, name, receiver) {
                        __sysout("GET:" + name);
                        if (name == "assign")
                                return assign;
                        else if (name == "arg" || name == "contract")
                                return target[name];
                        else if(name in scope)
                                return scope[name];
                        else error("Unauthorized Access " + name);
                };
                this.set = function(target, name, value, receiver) {
                        __sysout("SET:" + name);
                        if(name in scope)
                                return (scope[name] = value);
                        else error("Unauthorized Access " + name);
                };
        }




        _.assign = assign;
        _.BaseContract = BaseContract;
        _.FunctionContract = FunctionContract;
        _.ObjectContract = ObjectContract;


})($);


// PREDICATES

GraterThanZero = function(arg) {
        return (arg>0);
}
IsNumber = function(arg) {
        return ((typeof arg) == "number");
}
IsString = function(arg) {
        return ((typeof arg) == "string");
}
Any = function(arg) {
        return true; 
}

ChachaIs4711 = function () {
        return (chacha==4711) ? true : false;
}

ContainsToString = function(obj) {
        return (obj.hasOwnProperty("toString")) ? true : false;
}

AbsLowerThan100 = function (val) {
        return (Math.abs(val) < 100)
}



//load("__new2__test.js");
load("__new3__test.js");


/*
   function clearScopeEvaluation(data){
   return eval(data);
   };


   var a = true;
   var b = 4711;

   var x = function() {return a;};

   a = "chacha"

   with({a:4711}) {
   print(x);
   print(eval("(" + x.toString() + ")()"));
   }


   with({}) {
   print(x);
   print(eval("with({}){(" + x.toString() + ")()}"));
   }

   print(clearScopeEvaluation("(" + x.toString() + ")()"));
   */

//__sysout(x);
//print(eval("(" + x.toString() + ")"));

//var y = "234";
//z = "adf";
//with({}) {
//var x="chacha";
//print(x + y + z);
//}

//eval ("x=5;", {});
//
//
//

//. check is access to global

/**

  function ScopeHandler(allowed) {
  this.get = function(target, name, receiver) {
  if(name in allowed)
  return allowed[name];
  else {
  __sysout("[GET:]" + name);
  return target[name];}

  };
  this.set = function(target, name, value, receiver) {
  __sysout("[SET:]" + name + "=" + value);
  return (target[name] = value);
  };
  }


  var a = "chacha";
  var b = 4711;
  c = a+b;

  var allowed = {a:a};

  with(new Proxy(this, new ScopeHandler(allowed))) {


  print("VAL:" + eval("(" + AbsLowerThan100.toString() + ")(2)"));


//print(a);
//Math.abs(-543);
//c= "12342134";
print (AbsLowerThan100(2));

//AbsLowerThan101 = function (val) {
//       return (Math.abs(val) < 100)
//};

//AbsLowerThan101(2);

}

 **/
/**


function BaseHandler() {
        this.apply = function(target, thisArg, args) {
                // wrap this
                if(thisArg==undefined) thisArg=this;
                protectedThis = new Proxy(this, new ScopeHandler())
                
                        with(new Proxy(this, new ScopeHandler())) {
                        var val = target.apply(protectedThis, args);
                        }
                
                return val;
        };
        this.construct = function(target, args) {
                return this.apply(target, this, args);
        };
}

function ScopeHandler() {
        this.hasOwn = function() {
                __sysout("XXXX");
        }

        this.has = function(target, name, receiver) {
                 __sysout("[[HAS]]" + name);
                return (name in target);
        };
        this.get = function(target, name, receiver) {
                __sysout("[[GET]]" + name);
                return (target[name]);
        };
        this.set = function(target, name, value, receiver) {
                __sysout("[[SET]]" + name);
                return (target[name] = value);
        };
}


var f = function(arg0) {  this.x=3; return Math.abs(arg0); };
var g = new Proxy(f, new BaseHandler());
print (g(4711));

**/

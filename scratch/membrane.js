(function() {


           function violation(msg, file, line) {
                __sysout("Violation: (" + file + ":" + line + "):\n" + msg);
                quit();
        }


        function createMembrane(target) {

                __sysout("@ NEW MEMBRANE");

                // IF target is primitive value, return target
                if (target !== Object(target)) {
                        return target;
                }

                var membraneHandler = new Membrabe(target);
                //var proxy = new Proxy(target, membraneHandler);
                var proxy = new Proxy(target, membraneHandler);
                return proxy;
        }

        function Membrabe(secureScope) {

                this.getOwnPropertyDescriptor = function(target, name) {
                        __sysout("[[getOwnPropertyDescriptor]]" + name);
                        var desc = Object.getOwnPropertyDescriptor(target, name);
                        if (desc !== undefined) desc.value = createMembrane(desc);
                        return desc;
                };
                this.getOwnPropertyNames = function(target) {
                        __sysout("[[getOwnPropertyNames]]" + name);
                        return Object.getOwnPropertyNames(target);
                };
                this.getPrototypeOf = function(target) {
                        __sysout("[[getPrototypeOf]]" + name);
                        return Object.getPrototypeOf(target)
                };
                this.defineProperty = function(target, name, desc) {
                        __sysout("[[defineProperty]]" + name);
                        return Object.defineProperty(target, name, desc);
                };
                this.deleteProperty = function(target, name) {
                        __sysout("[[deleteProperty]]" + name);
                        return delete target[name];
                };
                this.freeze = function(target) {
                        __sysout("[[freeze]]" + name);
                        return Object.freeze(target);
                };
                this.seal = function(target) {
                        __sysout("[[seal]]" + name);
                        return Object.seal(target);
                };
                this.preventExtensions = function(target) {
                        __sysout("[[preventExtensions]]" + name);
                        return Object.preventExtensions(target);
                };
                this.isFrozen = function(target) {
                        __sysout("[[isFrozen]]" + name);
                        return Object.isFrozen(target);
                };
                this.isSealed = function(target) {
                        __sysout("[[isSealed]]" + name);
                        return Object.isSealed(target);
                };
                this.isExtensible = function(target) {
                        __sysout("[[isExtensible]]" + name);
                        return Object.isExtensible(target);
                };
                this.has = function(target, name) {
                        __sysout("[[has]]" + name);

                       // __sysout("!!!!!!!!!!!" + (target));
                        if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

                        return (name in target);
                };
                this.hasOwn = function(target, name) {
                        __sysout("[[hasOwn]]" + name);

                        if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

                        return ({}).hasOwnProperty.call(target, name); 
                };
                this.get = function(target, name, receiver) {
                        __sysout("[[get]]" + name);
                        
                        if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
                        if(name=="eval") return target[name]; // TODO
                        if(name=="print") return target[name]; // TODO

                        return createMembrane(target[name]);
                };
                this.set = function(target, name, value, receiver) {
                        __sysout("[[set]]" + name);

                        // TODO no write
                        if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

                        return target[name] = value;
                };
                this.enumerate = function(target) {
                        __sysout("[[enumerate]]" + name);
                        var result = [];
                        for (var name in target) {
                                result.push(name);
                        };
                        return result;
                };
                this.keys = function(target) {
                        __sysout("[[keys]]");
                        return Object.keys(target);
                };
                this.apply = function(target, secureScope, thisArg, argsArray) {
                        __sysout("[[apply]]" /*+ target.toString()*/);

                        //__sysout(secureThis.chacha);
                       // args = createMembrane(args);
                       // thisArg = createMembrane(thisArg);
                        //
                        //thisArg=secureThis;
                        //return target.apply(thisArg, args);

                        //return target.apply(thisArg, argsArray);
                        return /*(target==eval) ? target.apply(thisArg, argsArray) :*/ evalInSandbox(target, thisArg, argsArray);

                };
                this.construct = function(target, args) {
                        __sysout("[[construct]]");
                        return target.apply(this, args);
                };
        };


        function evalInSandbox(fun, secureScope, thisArg, argsArray) {

                secureScope = (secureScope!=undefined) ? secureScope : new Object();
                thisArg = (thisArg!=undefined) ? thisArg : secureScope;
                argsArray = (argsArray!=undefined) ? argsArray : new Array();
               
                var closure = "(" + fun.toString() + ").apply(thisArg, argsArray);";
                var global = {eval:eval, closure:closure, thisArg:thisArg, argsArray:argsArray, print:print};


                for(key in global) {
                        secureScope[key]=global[key];
                }

                //var context = (secureScope!=undefined) ? secureScope.merge(global) : global;

                 for(key in secureScope) {
                        __sysout(";;" + key);       
                 }



                var sandbox = createMembrane(secureScope);

/*
                var o = createMembrane(global);
                print(";;;" + o.thisArg);

 (secureScope!=undefined) ? createMembrane(secureScope.merge(global)) : createMembrane(global);

                
                context.thisArg = (context.thisArg!=undefined) ? createMembrane(context.thisArg) :  createMembrane(context);
                argsArray = (argsArray!=undefined) ? createMembrane(argsArray) : createMembrane(new Array());

                
                
               // eval("(" + fun.toString() + ").apply(thisArg, argsArray);");

                //eval(closure);
               print("@@" +  secureScope.thisArg);
 */              
                with(sandbox) {
                        //thisArg.xsd;
                      //  print("@@@" +  thisArg);

                        return eval(closure);
                }

                
        
        }


        
      //`  function evalsc

// TODO: check if to string is native code
//print(eval("(" + Math.abs.toString() + ")()"));



        //var secureThis = createMembrane({chacha:"4711",g:g}, null);
        //var martha = "martha";


        var x = 1;
        this.y = 2;


        function f() {
                 //print("@@ " + (this.x===x));
                //print("@@ " + this.x);
                               //this.x;
               //this.y;
               //x;
               //print("MARTHA ...");
               Math.abs(234);
               g();
             return 4711;
        }

        function g(i) {
                print("@@ IS CALLED");
                 print("@@ " + x);

                //x;
                //this.x;
                //var f = 654;
                f;
                if(i!=true) g(true);
                x = Math.abs(654);
                
        }

        function h() {}

//        evalInSandbox(f, {g:g, Math:Math});

Math.abs = function() {return 4;};
Math.abs.toString = function() {return "function() {[native code]};"};

        print( this.Math.abs );
       
      //  evalcx("Math.abs(4);");
      //var data = newGlobal("share") ;
      //
      //


var sandbox = newGlobal("same-compartment", {x:234,g:g}, {x:65432,g:g});

for(key in sandbox) {
__sysout(";;; " + key);
}

//print(isProxy(new Proxy({},{})));


//sandbox.g=new Function(g)//createMembrane(g, {Math:sandbox.Math});
sandbox.x=654;
sandbox.x=5678;
sandbox.g=g;
function inSandbox(code) { 
        __sysout(";;; eval: " + code);
//        with(createMembrane({evalcx:evalcx, code:code, sandbox:sandbox})) {
        return evalcx(code, sandbox);
//        }
};

//inSandbox("g = (" + g.toString() + ");")

 print("!!@@ " + x);


print(inSandbox("(" + f.toString() + ")()"));

 print("!!@@ " + x);


//print(inSandbox("function six() { return 6; }"));
//print(inSandbox("evaluate('function qq() { return six(); }', {newContext: true});"));
//print(inSandbox("for (j = 0; j <2 ; ++j) { qq(0); }"));



        /*
        var h = createMembrane(f);
        //print(h.toString());
        var fun = h.toString();
        var thisArg = createMembrane(this);
        with(createMembrane({})) {
                //h();
                //f.apply(createMembrane(this));
                eval("(" + fun + ").apply(thisArg);");
        }
*/
        //h(); //.apply(createMembrane({globalvar:34567890}));//.apply(createMembrane(this));
        //var p = createMembrane({globalvar:"4711", globalthis:"4712"});



        // workflow
        // restriktiv, emntweder darf ich es zugreifen, dann muss aber das apply den evalcx verwenden
        //




        /*


           var globalvar = true;
           this.globalthis = true;

           function f() {
           print("@f: " + globalvar);
        //        print("@f: " + globalthis);
        print("@f: " + this.globalvar);
        //        print("@f: " + this.globalthis);

        //        print("@f: " + (globalvar=false));
        //        print("@f: " + (globalthis=false));
        //        print("@f: " + (this.globalvar=false));
        //        print("@f: " + (this.globalthis=false));

        g();
        }

        function g() {
        this.globalthis;
        this.xxx;
        print("@g: " + globalvar);
        print("@g: " + globalthis);
        print("@g: " + this.globalvar);
        print("@g: " + this.globalthis);

        print("@g: " + (globalvar=false));
        print("@g: " + (globalthis=false));
        print("@g: " + (this.globalvar=false));
        print("@g: " + (this.globalthis=false));

        }
        */

        //var h = createMembrane(f);
        //h(); //.apply(createMembrane({globalvar:34567890}));//.apply(createMembrane(this));


        /*

           var p = createMembrane({globalvar:"4711", globalthis:"4712"});


           var martha = "<3";

           with({martha:"{}", globalvar:2222222222}) {
           "use strict";
           function f() {
           print("@f: " + globalvar);
        //        print("@f: " + globalthis);
        print("@f: " + this.globalvar);
        //        print("@f: " + this.globalthis);

        //        print("@f: " + (globalvar=false));
        //        print("@f: " + (globalthis=false));
        //        print("@f: " + (this.globalvar=false));
        //        print("@f: " + (this.globalthis=false));

        g();
        }


        f.apply(p)
        print("########## " + martha);
        }
        */



})()


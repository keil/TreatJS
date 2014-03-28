        // TODO
        /*        function __OLD__evalInSandbox(fun, globalArg, thisArg, argsArray) {
                  if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

        // skip sandbox evaluation 
        // depending on a config flag
        if(!_.Config.evalInSandbox) {
        return fun.apply(thisArg, argsArray);
        }

        globalArg = (globalArg!=undefined) ? globalArg : new Object();
        thisArg = (thisArg!=undefined) ? thisArg : globalArg;
        argsArray = (argsArray!=undefined) ? argsArray : new Array();

        var string = "(" + fun.toString() + ").apply(thisArg, argsArray);"; 
        var global = {eval:eval, string:string, thisArg:thisArg, argsArray:argsArray};

        for(key in global) {
        globalArg[key]=global[key];
        }

        var sandbox = wrap(globalArg, globalArg);

        with(sandbox) {
        return eval(string);
        }        
        }
        */





        // TODO
        /*     function __OLD__evalNewInSandbox(func, globalArg, thisArg, argsArray) {
               if(!(func instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

               globalArg = (globalArg!=undefined) ? globalArg : new Object();
               thisArg = (thisArg!=undefined) ? thisArg : globalArg;
               argsArray = (argsArray!=undefined) ? argsArray : new Array();

        //var string = "new ((" + fun.toString() + ").apply(thisArg, argsArray));"; 
        var string = "new (" + func.toString() + ")(argsArray);";
        var global = {eval:eval, string:string, thisArg:thisArg, argsArray:argsArray};

        for(key in global) {
        globalArg[key]=global[key];
        }

        var sandbox = wrap(globalArg, globalArg);

        with(sandbox) {
        return eval(string);
        }        
        }
        */

        // TODO use a initial eval function, wrapping everyting, rest is done by the membrane

        /*
        function evalWithoutSandbox(fun, globalArg, thisArg, argsArray) {
                for(name in globalArg) print("@@@@ " + name);
                var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");
                with(globalArg) {
                        return fun.apply(thisArg, argsArray);
                }
        }*/



   /** evalInSandbox(fun[, globalArg, thisArg, argsArray])
         *
         * Evaluates the given function in a sandbox. 
         *
         * @param fun The function object.
         * @param globalArg The secure global object.
         * @param thisArg The function this-reference.
         * @param argArray The function arguments
         * @return The result of fun.apply(thisArg, argsArray);
         */
        function evalInSandbox(fun, globalArg, thisArg, argsArray) {
                if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

                //    globalArg = (globalArg!=undefined) ? globalArg : new Object();
                //     thisArg = (thisArg!=undefined) ? thisArg : globalArg;
                //     argsArray = (argsArray!=undefined) ? argsArray : new Array();


                // skip sandbox evaluation 
                //        if(!(_.Config.evalInSandbox)) {
                //              return fun.apply(thisArg, argsArray);
                //      }

                //globalArg.chacha;
                //thisArg.chacha;
                //argsArray.chacha;

                var string = "(" + fun.toString() + ")"; 
                //   var sandbox = wrap(globalArg, globalArg);
                var sandbox = globalArg;

                var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

                return secureFun.apply(thisArg, argsArray);
        }

        /** evalNewInSandbox(fun[, globalArg, thisArg, argsArray])
         *
         * Evaluates the given function in a sandbox. 
         *
         * @param fun The function object.
         * @param globalArg The secure global object.
         * @param thisArg The function this-reference.
         * @param argArray The function arguments
         * @return The result of fun.apply(thisArg, argsArray);
         */
        function evalNewInSandbox(fun, globalArg, thisArg, argsArray) {
                if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

                // skip sandbox evaluation 
                if(!(_.Config.evalInSandbox)) {
                        var newObj = Object.create(fun.prototype);
                        var val = fun.apply(thisArg, argsArray);
                        return (val instanceof Object) ? val : newObj;
                }

                globalArg = (globalArg!=undefined) ? globalArg : new Object();
                thisArg = (thisArg!=undefined) ? thisArg : globalArg;
                argsArray = (argsArray!=undefined) ? argsArray : new Array();

                var string = "(" + fun.toString() + ")"; 
                var sandbox = wrap(globalArg, globalArg);

                var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

                // TODO protect protottype
                // two function are nor eq  ual and of the same proto
                //
                // TODO
                // protext this arg, but, we can result in rewraped proxies ?
                // use weagmap ?

                // TODO
                var newObj = Object.create(secureFun.prototype);
                var val = secureFun.apply(newObj, argsArray);

                return (val instanceof Object) ? val : newObj;
        }


        
        function evalWithoutSandbox(fun, globalArg, thisArg, argsArray) {
                for(name in globalArg) print("@@@@ " + name);
                var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");
                with(globalArg) {
                        return fun.apply(thisArg, argsArray);
                }
        }





        function evalFunction(fun, globalArg, thisArg, argsArray) {
                if(!($.Config.evalInSandbox)) {
                        return evalInSandbox(fun, globalArg, thisArg, argsArray);
                } else {

                        globalArg = (globalArg!=undefined) ? globalArg : new Object();
                        thisArg = (thisArg!=undefined) ? thisArg : globalArg;
                        argsArray = (argsArray!=undefined) ? argsArray : new Array();


                        var sandboxGlobalArg = wrap(globalArg, globalArg);
                        var sandboxThisArg = wrap(thisArg, {});
                        var sandboxArgsArray = wrap(argsArray, {});

                        return evalInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgsArray);
                }
        }





        //       _.eval = evalInSandbox;
        _.eval = evalFunction;


        // _    _  _      _   _         ___             _   _          
        //(_)__| \| |__ _| |_(_)_ _____| __|  _ _ _  __| |_(_)___ _ _  
        //| (_-< .` / _` |  _| \ V / -_) _| || | ' \/ _|  _| / _ \ ' \ 
        //|_/__/_|\_\__,_|\__|_|\_/\___|_| \_,_|_||_\__|\__|_\___/_||_|

        /** isNativeFunction(func)
         * checks if the function is a native function
         *
         * @param func Function Object
         * @return true, if func is a native function, false otherwise
         */
        function isNativeFunction(func) {
                if(!(func instanceof Function)) return false;

                // get current toString
                var tmp = func.toString;

                // delete current toString
                delete func.toString;

                // set new toString function
                func.toString =  getToStringFunction();
                var string = func.toString();

                // reset
                func.toString = tmp;

                return (string.indexOf('[native code]') > -1)
        }

        /** getToStringFunction()
         * returns the native toString of Function.prototype
         * @return Function
         */
        function getToStringFunction() {
                if(_.Base.toString!=undefined) {
                        return _.Base.toString;
                } else if(_.Config.newGlobal) {
                        var g = newGlobal();
                        return (g.Function.prototype.toString);
                } else {
                        return undefined;
                }
        }

        _.isNativeFunction = isNativeFunction;


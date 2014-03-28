// NOTE: old handler types

// TODO`
// reicht nicht ein has ?
function XXXScopeHandler(scope) {
        //                // TODO, implement others
        this.xhas = function(target, name) {
                if(name in scope)
                        return true;
                else violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
        }
        //                this.get = function(target, name, receiver) {
        //                        if(name in scope)
        //                                return scope[name];
        //                        else violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
        //                };
        this.set = function(target, name, value, receiver) {
                __sysout("[[SET]]" + name)
                        if(name in scope)
                                return (scope[name] = value);
                        else violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
        };
} 



// TEST Implementation
function BaseHandler() {
        this.apply = function(target, thisArg, args) {
                if(true) {
                        __sysout("% target: " + target);
                        __sysout("% thisArg: " + thisArg);
                        __sysout("% args: " + args);
                }

                __sysout("THIS:" + thisArg);
                var protectedThis = new Proxy({}, new ScopeHandler());
                //var protectedScope = {target:target, args:args, protectedThis:protectedThis, violation:violation, Error:Error};


                //     with(new Proxy(protectedScope, new ScopeHandler(protectedScope))) {
                // sdfg;
                return target.apply(protectedThis, args);
                //   }


                //   return target.apply(thisArg, args);

        };
        this.construct = function(target, args) {
                return this.apply(target, this, args);
        };
}

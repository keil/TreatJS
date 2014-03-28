 //        return arg;
        return new Proxy(arg, {
                "get": function (target, key) {
                        __sysout(env + "[[get]]" + key);

                        return target[key] /*|| target.getItem(key)*/ || undefined;
                },
               "set": function (target, key, vValue) {
                       __sysout(env + "[[set]]" + key);

                       if (key in target) { return false; }
                       return (target[key] = vValue);
               },
               "delete": function (target, key) {
                       __sysout(env + "[[delete]]" + key);

                       if (key in target) { return false; }
                       return target.removeItem(key);
               },
               "enumerate": function (target, key) {
                       __sysout(env + "[[enumerate]]" + key);

                       return target.keys();
               },
               "iterate": function (target, key) {
                       __sysout(env + "[[SETiterate" + key);

                       return target.keys();
               },
               "keys": function (target, key) {
                       __sysout(env + "[[keys]]" + key);

                       return target.keys();
               },
               "has": function (target, key) {
                       __sysout(env + "[[has]]" + key);

                       return key in target /*|| target.hasItem(key)*/;
               },
               "hasOwn": function (target, key) {
                       __sysout(env + "[[hasOwn]]" + key);

                       return target.hasItem(key);
               },
               "defineProperty": function (target, key, oDesc) {
                       __sysout(env + "[[defineProperty]]" + key);

                       if (oDesc && "value" in oDesc) { target.setItem(key, oDesc.value); }
                       return target;
               },
               "getPropertyNames": function (target) {
                       __sysout(env + "[[getPropertyNames]]" + name);

                       return Object.getPropertyNames(target).concat(target.keys());
               },
               "getOwnPropertyNames": function (target) {
                       __sysout(env + "[[getOwnPropertyNames]]");

                       return Object.getOwnPropertyNames(target).concat(target.keys());
               },
               "getPropertyDescriptor": function (target, key) {
                       __sysout(env + "[[getPropertyDescriptor]]" + key);

                       var vValue = target[key] || target.getItem(key)
                               return vValue ? {
                                       "value": vValue,
                                               "writable": true,
                                               "enumerable": true,
                                               "configurable": false
                               } : undefined;
               },
               "getOwnPropertyDescriptor": function (target, key) {
                       __sysout(env + "[[getOwnPropertyDescriptor]]" + key);

                       var vValue = target.getItem(key);
                       return vValue ? {
                               "value": vValue,
                                       "writable": true,
                                       "enumerable": true,
                                       "configurable": false
                       } : undefined;
               },
               "fix":  function (target) {
                       __sysout(env + "[[FIX]]" );

                       return "not implemented yet!";
               },
        });



function Membrabe(context) {

                this.getOwnPropertyDescriptor = function(target, name) {
                        __sysout("[[getOwnPropertyDescriptor]]" + name);
                        var desc = Object.getOwnPropertyDescriptor(target, name);
                        if (desc !== undefined) desc.value = createMembrane(desc, context);
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
                        return (name in target);
                };
                this.hasOwn = function(target, name) {
                        __sysout("[[hasOwn]]" + name);
                        return ({}).hasOwnProperty.call(target, name); 
                };
                this.get = function(target, name, receiver) {
                        __sysout("[[get]]" + name);
                        return createMembrane(target[name], context);
                };
                this.set = function(target, name, value, receiver) {
                        __sysout("[[set]]" + name);
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
                this.apply = function(target, thisArg, args) {
                        __sysout("[[apply]]" /*+ target.toString()*/);

                        //__sysout(secureThis.chacha);
                        args = createMembrane(args);
                        thisArg = createMembrane(thisArg);
                        //
                        //thisArg=secureThis;
                        return target.apply(thisArg, args);


                        return evalInSandbox(target, context);

                };
                this.construct = function(target, args) {
                        __sysout("[[construct]]");
                        return target.apply(this, args);
                };
        };

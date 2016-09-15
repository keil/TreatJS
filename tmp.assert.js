    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Method) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new MethodHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }



    // ___               _ _              ___         _               _   
    /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof SandboxContract) {
      count(TreatJS.Statistic.BASE);

      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argsArray = [TreatJS.wrap(arg)];

      var callback = BaseCallback(callbackHandler, contract);

      /* Clone Operation
       * This steps copies values defined in the global object.
       *
       * The contract.global is the global object of the sandbox.
       * There is no fresh decompilation. For this reason, the only way to extend 
       * variables is to extend the sandbox global. But this step has to be rolled 
       * back after predicate evaluation.
       */
      function clone(obj) {
        var tmp = {};
        for(var property in obj) tmp[property] = obj[property];
        return tmp;
      }
      // clear object
      function clear(obj) {
        for(var property in obj) delete obj[property];
      }
      // copy objA[property] => objB[property]
      function copy(objA, objB) {
        for(var property in objA) objB[property]=objA[property];
      }

      var backupGlobal = clone(contract.global);
      copy(globalArg, contract.global);

      // push new context
      pushContext(contract);

      try {
        if(TreatJS.Config.predicate) {
          var result = translate(contract.predicate.apply(thisArg, argsArray));
        } else {
          var result = translate(true);
        }
      } catch (e) {
        if(e instanceof TreatJSError) {
          var result = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var result = e;
        }  else {
          var result = Conflict;
        }
      } finally {

        // push new context
        popContext();

        if(result instanceof Error) {
          throw result;
        } else {
          var handle = Handle(True, result);
          callback.predicateHandler(handle);
          clear(contract.global);
          copy(backupGlobal, contract.global);
          return arg;
        }
      }
    }


    //__      ___ _   _    ___         _               _   
    //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

    else if (contract instanceof TreatJS.Contract.With) {
      var newglobal = global.merge(contract.binding);
      return assertWith(arg, contract.sub, newglobal, callbackHandler);
    }
  //   _           _  ___         _               _   
    //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.And) {
      var callback = AndCallback(callbackHandler, contract);

      var first = assertWith(arg, contract.first, global, callback.leftHandler);
      var second = assertWith(first, contract.second, global,  callback.rightHandler);

      return second;
    }

    //  ___       ___         _               _   
    // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Or) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = OrCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return proxy;
      } 

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else {
        var callback = OrCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        return second;
      }    
    }

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Not) {

      // TODO, definition of Not

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = NotCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NotCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }



   // _  _               _   _          ___         _               _   
    //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
    //         |___/       

    else if (contract instanceof TreatJS.Contract.Negation) {

      // TODO, definition of negation

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = NegationCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NegationCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }

    // ___      __ _        _   _          
    //| _ \___ / _| |___ __| |_(_)___ _ _  
    //|   / -_)  _| / -_) _|  _| / _ \ ' \ 
    //|_|_\___|_| |_\___\__|\__|_\___/_||_|

    if(contract instanceof TreatJS.Contract.Reflection) {
      if(!(arg instanceof Object)) callbackHandler(Handle(True, False));

      var reflect = new ReflectionHandler(contract, global, callbackHandler);
      var noop = new NoOpHandler();
      var proxy = new Proxy(arg, new Proxy(noop, reflect));
      return proxy;
    }

    // ___             _ _ 
    //| __|__ _ _ __ _| | |
    //| _/ _ \ '_/ _` | | |
    //|_|\___/_| \__,_|_|_|

    else if(contract instanceof TreatJS.Contract.Forall) {
      // TODO
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new ForallHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // ___      
    //|_ _|_ _  
    // | || ' \ 
    //|___|_||_|

    else if(contract instanceof TreatJS.Contract.In) {

      function Primitive(value) {
        this.valueX = value;
      }

      var dummy = TreatJS.clone(arg); // TODO, bug, dummy can be an non null object

      if(dummy !== Object(dummy)) dummy = new Primitive(dummy);


      var proxy = new Proxy(dummy, new Proxy({}, new PolymorphicHandler(callbackHandler)));
      TreatJS.Polymorphism.conceal(contract.id, proxy, arg);
      return proxy; 
    }

    //  ___       _   
    // / _ \ _  _| |_ 
    //| (_) | || |  _|
    // \___/ \_,_|\__|

    else if(contract instanceof TreatJS.Contract.Out) {
      //print("@@@C? " + contracted(arg));
      //print("@@@C  " + contractOf(arg));
      //print("@@@A  " + arg);

      // TODO
      //var arg = unwrap(arg);


      //print(arg(1,2));
      //print("@@@" + contracted(arg));

      var result = translate(TreatJS.Polymorphism.verify(contract.id, arg)); // TODO
      var handle = new Handle(True, result);
      callbackHandler(handle);

      return TreatJS.Polymorphism.reveal(contract.id); // todo
    }

    // ___                    _          
    //| _ \___ __ _  _ _ _ __(_)___ _ _  
    //|   / -_) _| || | '_(_-< / _ \ ' \ 
    //|_|_\___\__|\_,_|_| /__/_\___/_||_|

    else if(contract instanceof TreatJS.Contract.Recursive) {
      var alpha = TreatJS.construct(contract.constructor, contract);
      return assertWith(arg, alpha, global, callbackHandler);
    }



    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX
    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX
    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

    // _  _                
    //| \| |__ _ _ __  ___ 
    //| .` / _` | '  \/ -_)
    //|_|\_\__,_|_|_|_\___|

    else if(contract instanceof TreatJS.Contract.Name) {   
      var contracted = assertWith(arg, contract.contract, global, callbackHandler);    

      var handler = new EffectHandler(contract.symbol);
      var observed = new Proxy(contracted, handler);

      // links name to subject
      TreatJS.Temporal.link(contract.symbol, contracted, observed, handler);

      return observed;
    }

    //__      ___                
    //\ \    / / |_  ___ _ _ ___ 
    // \ \/\/ /| ' \/ -_) '_/ -_)
    //  \_/\_/ |_||_\___|_| \___|

    else if(contract instanceof TreatJS.Contract.Where) {
      var callback = WhereCallback(callbackHandler, contract);
      var contracted = assertWith(arg, contract.behaviour, global, callback.behaviourHandler);
      return assertWith(contracted, contract.temporal, global, callback.temporalHandler);
    }

    //__   ___     _    _ 
    //\ \ / (_)___| |__| |
    // \ V /| / -_) / _` |
    //  |_| |_\___|_\__,_|

    else if(contract instanceof TreatJS.Contract.Yield) {
      var argumentsArg = new Proxy({length:TreatJS.Config.maxArgs}, new TreatJS.Symbol.Handler());
      var whitelist = new WeakSet();

      // whitelist arguments
      for(var i=0; i<argumentsArg.length; i++) {
        whitelist.add(argumentsArg[i]);
      }

      var newcontract = constructContract(contract.constructor, argumentsArg, global, whitelist);
      return assertWith(arg, newcontract, global, callbackHandler);
    }

    // _____                             _ 
    //|_   _|__ _ __  _ __  ___ _ _ __ _| |
    //  | |/ -_) '  \| '_ \/ _ \ '_/ _` | |
    //  |_|\___|_|_|_| .__/\___/_| \__,_|_|
    //               |_|                   

    else if(contract instanceof TreatJS.Contract.Temporal) {
      //var global = new Global({}); TODO
      var whitelist = new WeakSet();

      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argumentsArg = [];

      for(var i=0; i<contract.symbols.length; i++) {
        argumentsArg.push(contract.symbols[i]);
        //argsArray.push(new Proxy(contract.symbols[i], new TreatJS.Temporal.Handler())); // TODO
      }

      function make(target, name, value) {
        Object.defineProperty(target, name, {
          value: value, enumerable: true
        });
      }

      // collection of all temporal expresion
      var expressions = {};

      // literals
      make(expressions, "Get", TreatJS.Temporal.Get);
      make(expressions, "Set", TreatJS.Temporal.Set);
      make(expressions, "Call", TreatJS.Temporal.Call);
      make(expressions, "Return", TreatJS.Temporal.Return);
      make(expressions, "Construct", TreatJS.Temporal.Construct);
      make(expressions, "Exception", TreatJS.Temporal.Exception);
      make(expressions, "Any", TreatJS.Temporal.Any);

      // expressions
      make(expressions, "Null", TreatJS.Temporal.Null);
      make(expressions, "Empty", TreatJS.Temporal.Empty);
      make(expressions, "Cmp", TreatJS.Temporal.Cmp);
      make(expressions, "Star", TreatJS.Temporal.Star);
      make(expressions, "Or", TreatJS.Temporal.Or);
      make(expressions, "And", TreatJS.Temporal.And);
      make(expressions, "Neg", TreatJS.Temporal.Neg);
      make(expressions, "Dot", TreatJS.Temporal.Dot);

      // makes expressions avaliable inside of the sandboc
      for(var name in expressions) {
        globalArg[name] = expressions[name];
        whitelist.add(expressions[name]);
      }

      // whitelist arguments
      for(var i=0; i<argumentsArg.length; i++) {
        whitelist.add(argumentsArg[i]);
      }

      // push new context
      pushContext(contract);

      try {
        var temporal = (TreatJS.eval(contract.constructor, globalArg, thisArg, argumentsArg, whitelist))
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var temporal = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var temporal = e;
        } else {
          var temporal = undefined;
        }
      } finally {

        // pop context
        popContext(); 

        if(temporal instanceof Error) {
          throw temporal;
        } else {
          // convert arrays to sequences
          temporal = (temporal instanceof Array) ? TreatJS.Temporal.Dot.apply(undefined, temporal) : temporal;

          // tests for temporal expressions
          if(!(temporal instanceof TreatJS.Temporal.Expression)) 
            error("Invalid Temporal Expression", (new Error()).fileName, (new Error()).lineNumber);
        }

        // initializes closure
        function initialize(expression) {
          log("initialize temporal contract", expression);

          return function(effect) {
            log("check remporal contract", effect + " ? " + expression);

            if(!TreatJS.Temporal.valid(expression, effect)) callbackHandler(Handle(False, True));
            else expression = TreatJS.Temporal.derive(expression, effect); 

            log("new temporal expression", expression);
          }
        }

        // evaluator function
        var evaluate = initialize(temporal);

        // register evaluator function to handler
        for(var i=0; i<contract.symbols.length; i++) {
          TreatJS.Temporal.lookup(contract.symbols[i]).handler.register(evaluate);
        }
      }

      return arg;
    }

    // ___                  _          _   
    //|_ _|_ ___ ____ _ _ _(_)__ _ _ _| |_ 
    // | || ' \ V / _` | '_| / _` | ' \  _|
    //|___|_||_\_/\__,_|_| |_\__,_|_||_\__|

    else if(contract instanceof TreatJS.Contract.Invariant) {
      assertWith(arg, contract.contract, global, callbackHandler);

      var handler = new InvariantHandler(contract.contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    } 

    //  ___             _               _           
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    else if(contract instanceof TreatJS.Constructor.Constructor) {
      var handler = new AbstractionHandler(arg, contract, global, callbackHandler);
      var proxy = new Proxy(contract.constructor, handler);
      return proxy;
    }

    //  ___             _               _            ___         _               _   
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  \___\___/_||_\__|_| \__,_\__|\__|

    // TODO
    else if(contract instanceof TreatJS.Contract.Constructor) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new ConstructorHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }


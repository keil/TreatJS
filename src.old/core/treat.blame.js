/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function(TreatJS) {

  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var Contract = TreatJS.Core.Contract;

  // TODO
  function Trace(context, subject) {
    if(!(this instanceof Trace)) return new Trace(context, subject);

    if(!(context instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(subjeect instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "context": {value: context, enumerable: true},
      "subject": {value: subject, enumerable: true}  
    });
  }
  Trace.prototype = {};
  Trace.prototype.toString = function () {
    return "(" + this.context + " ~ " + this.subject + ")";
  }

  // TODO
  function Blame (trace, contract) {
    if(!(this instanceof Blame)) return new Blame(trace, contract);

    if(!(trace instanceof Trace)) error("Wrong Trace", (new Error()).fileName, (new Error()).lineNumber);
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  
    Object.defineProperties(this, {
      "trace": {value: trace, enumerable: true},
      "contract": {value: contract, enumerable: true}  
    });

  }
  Blame.prototype = {};
  Blame.prototype.toString = function () {
    // TODO
    // this is not correct, becaus I'llonly whot the violating part
    // either whitch here or make the seperation in treat.assert
    //
    //return "blame " + this.trace + " in " + this.contract;
    //or the prodced trace contains ont the failed parts
    //indicates that negation is simplified
    return this.trace + " in " + this.contract;
  }

  
  
  // TODO
  // protype for all contract messages
  // maybe possible top reuse there toStrign method
  function Message () {
  }
  Message.prototype = {};

 
  
  // TODO, speudo contracts
  // better to have a messages class that reqbuilds the core contracts
  function Blank() {
    if(!(this instanceof Blank)) return new Blank();
  }
  Blank.prototype = Object.create(Message.prototype);
  Blank.prototype.toString = function () {
    return ".";
  }

  function Undefined() {
    if(!(this instanceof Undefined)) return new Undefined();
  }
  Undefined.prototype = Object.create(Message.prototype);
  Undefined.prototype.toString = function () {
    return "?";
  }







  // XXX
  //  _____            _                  _       
  // / ____|          | |                | |      
  //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
  //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
  //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
  // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

  // ___                ___         _               _   
  //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseMessage(predicate, name) {
    if(!(this instanceof BaseMessage)) return new BaseMessage(predicate, name);

    if(!(predicate instanceof Function)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        value: predicate
      },
      "name": {
        value: name
      }
    });
  }
  BaseMessage.prototype = Object.create(Message.prototype);
  BaseMessage.prototype.toString = function() {
    return "[" + ((this.name!=undefined) ? this.name : this.predicate.toString()) + "]";
  };

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function FunctionMessage(domain, range) {
    if(!(this instanceof FunctionMessage)) return new FunctionMessage(domain, range);

    if(!(domain instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(range instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "domain": {
        value: domain
      },
      "range": {
        value: range
      }
    });
  }
  FunctionMessage.prototype = Object.create(Message.prototype);
  FunctionMessage.prototype.toString = function() {
    return "(" + this.domain.toString() + "->" + this.range.toString() + ")";
  }; 

  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function MethodMessage(domain, range, context) {
    if(!(this instanceof MethodMessage)) return new MethodMessage(domain, range, context);

    if(!(domain instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(range instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(context instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "domain": {
        value: domain
      },
      "range": {
        value: range
      },
      "context": {
        value: context
      }
    });
  }
  MethodMessage.prototype = Object.create(Message.prototype);
  MethodMessage.prototype.toString = function() {
    return "(" + this.domain.toString() + "->" + this.range.toString() + "|" + this.context.toString() + ")";
  };

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function ObjectMessage(map) {
    if(!(this instanceof ObjectMessage)) return new ObjectMessage(map);

    // TODO
    if(!(map instanceof Map)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber); 

    Object.defineProperties(this, {
      "strict": {
        value: map.strict
      },
      "map": {
        value: map
      }
    });
  }
  ObjectMessage.prototype = Object.create(Message.prototype);
  ObjectMessage.prototype.toString = function() {
    var lbr = (this.map.strict) ? "{" : "|";
    var rbr = (this.map.strict) ? "}" : "|";
    return "(" + lbr + this.map.toString() + rbr + ")";
  };

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

  function DependentMessage(constructor) {
    if(!(this instanceof DependentMessage)) return new DependentMessage(constructor);

    /// TODO
    if(!(constructor instanceof Constructor)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  DependentMessage.prototype = Object.create(Message.prototype);
  DependentMessage.prototype.toString = function() {
    return "(" + this.constructor.toString() + "->" + "*" + ")";
  };

  //   _           _  ___         _               _   
  //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function AndMessage(first, second) {
    if(!(this instanceof AndMessage)) return new AndMessage(first, second);

    if(!(first instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  AndMessage.prototype = Object.create(Message.prototype);
  AndMessage.prototype.toString = function() {
    return "(" + this.first.toString() + "and" + this.second.toString() + ")";
  };

  //  ___       ___         _               _   
  // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

  function OrMessage(first, second) { 
    if(!(this instanceof OrMessage)) return new OrMessage(first, second);

    if(!(first instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  OrMessage.prototype = Object.create(Message.prototype);
  OrMessage.prototype.toString = function() {
    return "(" + this.first.toString() + "or" + this.second.toString() + ")";
  };

  // _  _     _    ___         _               _   
  //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

  function NotMessage(sub) { 
    if(!(this instanceof NotMessage)) return new NotMessage(sub);

    if(!(sub instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    });
  }
  NotMessage.prototype = Object.create(Message.prototype);
  NotMessage.prototype.toString = function() {
    return "(not" + this.sub.toString() + ")";
  };

  //__      ___ _   _    ___         _               _   
  //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

  function WithMessage(binding, sub) {
    if(!(this instanceof WithMessage)) return new WithMessage(binding, sub);

    if(!(binding instanceof Object)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "binding": {
        value: binding
      },
      "sub": {
        value: sub
      }
    });
  }
  WithMessage.prototype = Object.create(Message.prototype);
  WithMessage.prototype.toString = function() {
    var domain = "";
    for(name in this.binding) domain += ((domain===""?"":",")) + name;
    return "(with {" + domain + "}" + this.sub.toString() + ")";
  };

  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function IntersectionMessage(first, second) { 
    if(!(this instanceof IntersectionMessage)) return new IntersectionMessage(first, second);

    if(!(first instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  IntersectionMessage.prototype = Object.create(Message.prototype);
  IntersectionMessage.prototype.toString = function() {
    return "(" + this.first.toString() + "cap" + this.second.toString() + ")";
  };

  // _   _      _          ___         _               _   
  //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function UnionMessage(first, second) {
    if(!(this instanceof UnionMessage)) return new UnionMessage(first, second);

    if(!(first instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  UnionMessage.prototype = Object.create(Message.prototype);
  UnionMessage.prototype.toString = function() {
    return "(" + this.first.toString() + "cup" + this.second.toString() + ")";
  };

  // _  _               _   _          ___         _               _   
  //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
  //         |___/                                                     

  function NegationMessage(sub) { 
    if(!(this instanceof NegationMessage)) return new NegationMessage(sub);

    if(!(sub instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    }); 
  }
  NegationMessage.prototype = Object.create(Message.prototype);
  NegationMessage.prototype.toString = function() {
    return "(neg" + this.sub.toString() + ")";
  };

  // ___      __ _        _   _          ___         _               _   
  //| _ \___ / _| |___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_)  _| / -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___|_| |_\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function ReflectionMessage(trap, sub) {
    if(!(this instanceof ReflectionMessage)) return new ReflectionMessage(trap, sub);

    if((typeof trap)!=="string") error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber); 
    if(!(sub instanceof Message)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "trap": {
        value: trap
      },
      "sub": {
        value: sub
      }
    });
  }
  ReflectionMessage.prototype = Object.create(Message.prototype);
  ReflectionMessage.prototype.toString = function() {
    return "(" + this.trap + " @ " + this.sub.toString() + ")";
  };

  // ___      ___         _               _   
  //|_ _|_ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\___\___/_||_\__|_| \__,_\__|\__|

  function InMessage(id) {
    if(!(this instanceof InMessage)) return new InMessage(id);

    if(!(id instanceof Variable)) error("Wrong Identifier", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "id": {
        value: id
      }
    });
  }
  InMessage.prototype = Object.create(Message.prototype);
  InMessage.prototype.toString = function() {
    return "(in(" + this.id.toString() + "))";
  };

  //  ___       _    ___         _               _   
  // / _ \ _  _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | || |  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/ \_,_|\__|\___\___/_||_\__|_| \__,_\__|\__|

  function OutMessage(id) {
    if(!(this instanceof OutMessage)) return new OutMessage(id);

    // TODO
    if(!(id instanceof Variable)) error("Wrong Identifier", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "id": {
        value: id
      }
    });
  }
  OutMessage.prototype = Object.create(Message.prototype);
  OutMessage.prototype.toString = function() {
    return "(out(" + this.id.toString() + "))";
  };

  // ___             _ _  ___         _               _   
  //| __|__ _ _ __ _| | |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _/ _ \ '_/ _` | | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\___/_| \__,_|_|_|\___\___/_||_\__|_| \__,_\__|\__|

  function ForallMessage(constructor) {
    if(!(this instanceof ForallMessage)) return new ForallMessage(constructor);

    // TODO
    if(!(constructor instanceof Constructor)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  ForallMessage.prototype = Object.create(Message.prototype);
  ForallMessage.prototype.toString = function() {
    return "(forall " + this.constructor.toString() + ")";
  }

  // ___                    _          ___         _               _   
  //| _ \___ __ _  _ _ _ __(_)_ _____ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_) _| || | '_(_-< \ V / -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___\__|\_,_|_| /__/_|\_/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function RecursiveMessage(constructor) {
    if(!(this instanceof RecursiveMessage)) return new RecursiveMessage(constructor);

    // TODO
    if(!(constructor instanceof Constructor)) error("Wrong Message", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  RecursiveMessage.prototype = Object.create(Message.prototype);
  RecursiveMessage.prototype.toString = function() {
    return "(recursive " + this.constructor.toString() + ")";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Blame", {});

  TreatJS.define(TreatJS.Message, "Base", BaseMessage);

  TreatJS.define(TreatJS.Message, "Function", FunctionMessage);
  TreatJS.define(TreatJS.Message, "Method", MethodMessage);
  TreatJS.define(TreatJS.Message, "Dependent", DependentMessage);
  TreatJS.define(TreatJS.Message, "Object", ObjectMessage);

  TreatJS.define(TreatJS.Message, "With", WithMessage);

  TreatJS.define(TreatJS.Message, "And", AndMessage);
  TreatJS.define(TreatJS.Message, "Or", OrMessage);
  TreatJS.define(TreatJS.Message, "Not", NotMessage);

  TreatJS.define(TreatJS.Message, "Intersection", IntersectionMessage);
  TreatJS.define(TreatJS.Message, "Union", UnionMessage);
  TreatJS.define(TreatJS.Message, "Negation", NegationMessage);

  TreatJS.define(TreatJS.Message, "Reflection", ReflectionMessage);

  TreatJS.define(TreatJS.Message, "In", InMessage);
  TreatJS.define(TreatJS.Message, "Out", OutMessage);

  TreatJS.define(TreatJS.Message, "Forall", ForallMessage);
  TreatJS.define(TreatJS.Message, "Recursive", RecursiveMessage);


})(TreatJS);

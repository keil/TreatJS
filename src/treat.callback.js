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

TreatJS.package("TreatJS.Callback", function (TreatJS, Contract, configuration) {

  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function RootCallback(context, subject, contract) {

    function throwNegativeBlame () {
      throw new TreatJS.Error.NegativeBlame(context, contract);
    }

    function throwPositiveBlame () {
      throw new TreatJS.Error.PositiveBlame(subject, contract);
    }

    return {
      checkBlameState: function({context, subject}) {
        if (context==false) {
          throwNegativeBlame();
        } else if(subject==false) {
          throwPositiveBlame();
        }
      }
    }
  }

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(callback) {

    let domain = {context:true, subject:true};
    let range = {context:true, subject:true};

    function update() {
      const context = (domain.subject && range.context);
      const subject = (domain.context && (!domain.subject || range.subject));

      if(!(context && subject)) callback({context:context, subject:subject});
    }

    return {
      domain: function({context, subject}) {
        domain = {
          context: (domain.context && context),
          subject: (domain.subject && subject)
        };
        update();
      },
      range: function({context, subject}) {
        range = {
          context: (range.context && context),
          subject: (range.subject && subject)
        };
        update();
      }    
    }
  }

  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function IntersectionCallback(callback) {

    let left = {context:true, subject:true};
    let right = {context:true, subject:true};

    function update() {
      const context = (left.context || right.context);
      const subject = (left.subject && right.subject);

      if(!(context && subject)) callback({context:context, subject:subject});
    }

    return {
      left: function({context, subject}) {
        left = {
          context: (left.context && context),
          subject: (left.subject && subject)
        };
        update();
      },
      right: function({context, subject}) {
        right = {
          context: (right.context && context),
          subject: (right.subject && subject)
        };
        update();
      }    
    }
  }

  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function UnionCallback(callback) {

    let left = {context:true, subject:true};
    let right = {context:true, subject:true};

    function update() {
      const context = (left.context && right.context);
      const subject = (left.subject || right.subject);

      if(!(context && subject)) callback({context:context, subject:subject});
    }

    return {
      left: function({context, subject}) {
        left = {
          context: (left.context && context),
          subject: (left.subject && subject)
        };
        update();
      },
      right: function({context, subject}) {
        right = {
          context: (right.context && context),
          subject: (right.subject && subject)
        };
        update();
      }    
    }
  }

  //   _          _                         _    ___      _ _ _             _   
  //  /_\   _____(_)__ _ _ _  _ __  ___ _ _| |_ / __|__ _| | | |__  __ _ __| |__
  // / _ \ (_-<_-< / _` | ' \| '  \/ -_) ' \  _| (__/ _` | | | '_ \/ _` / _| / /
  ///_/ \_\/__/__/_\__, |_||_|_|_|_\___|_||_\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //               |___/                                                        

  function AssignmentCallback(callback) {

    let properties = {context:true, subject:true};

    function update() {
      const context = (properties.context && properties.subject);

      if(!context) callback({context:context, subject:true});
    }

    return {
      properties: function({context, subject}) {
        properties = {
          context: (properties.context && context),
          subject: (properties.subject && subject)
        };
        update();
      }
    }
  }

  // ___        _    ___      _ _ _             _   
  //| __|__ _ _| |__/ __|__ _| | | |__  __ _ __| |__
  //| _/ _ \ '_| / / (__/ _` | | | '_ \/ _` / _| / /
  //|_|\___/_| |_\_\\___\__,_|_|_|_.__/\__,_\__|_\_\

  function ForkCallback(callbackContext, callbackSubject) {

    let contract = {context:true, subject:true};

    function update() {
      const context = contract.context;
      const subject = contract.subject;

      if(!context) callbackContext({context:context, subject:true});
      if(!subject) callbackSubject({context:true, subject:subject});
    }

    return {
      contract: function({context, subject}) {
        contract = {
          context: (contract.context && context),
          subject: (contract.subject && subject)
        };
        update();
      }
    }
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Root         : RootCallback,
    Function     : FunctionCallback,
    Intersection : IntersectionCallback,
    Union        : UnionCallback, 
    Assignment   : AssignmentCallback,
    Fork         : ForkCallback
  };

});

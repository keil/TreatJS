/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
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

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function newFunctionCallback(callback) {

    let domain = {context:true, subject:true};
    let range = {context:true, subject:true};

    function update() {
      callback({
        context: (domain.subject && range.context),
        subject: (domain.context && (!domain.subject || range.subject))
      });
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

  function newIntersectionCallback(callback) {

    let left = {context:true, subject:true};
    let right = {context:true, subject:true};

    function update() {
      callback({
        context: (left.context || right.context),
        subject: (left.subject && right.subject)
      });
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

  function newUnionCallback(callback) {

    let left = {context:true, subject:true};
    let right = {context:true, subject:true};

    function update() {
      callback({
        context: (left.context && right.context),
        subject: (left.subject || right.subject)
      });
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

  function newAssignmentCallback(callback) {

    let properties = {context:true, subject:true};

    function update() {
      callback({
        context: (properties.context && properties.subject),
        subject: true
      });
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

  function newForkCallback(callbackContext, callbackSubject) {

    let contract = {context:true, subject:true};

    function update() {

      callbackSubject({
        context: true,
        subject: contract.subject
      });

      callbackContext({
        context: contract.context,
        subject: true
      });

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
    newFunction:      newFunctionCallback,
    newIntersection:  newIntersectionCallback,
    newUnion:         newUnionCallback, 
    newAssignment:    newAssignmentCallback,
    newFork:          newForkCallback
  };

});

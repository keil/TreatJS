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

  /*
   * TODO
   * - update only if handle changes
   */

  //  ___  _     _        _    ___      _ _ _             _   
  // / _ \| |__ (_)___ __| |_ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_ \| / -_) _|  _| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_.__// \___\__|\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //          |__/                                            
  //

// TODO, because object CB collect the outcome of its subcontract, ist might hapen that it mapps context and subject to false

  function createObject(callback) {

    // internal values
    var properties = {context:true, subject:true};

    // update constraint
    function update() {
      callback(properties);
    }

    // return new callback handler
    return {
      properties: function({context, subject}) {
        properties = {
          context: (properties.context && context),
          subject: (properties.subject && subject)
        }
        update();
      }
    }
  }



  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function createFunctionCallback(callback) {

    // internal values
    var domain = {context:true, subject:true};
    var range = {context:true, subject:true};

    // update constraint
    function update() {
      callback({
        context: (domain.subject && range.context),
        subject: (domain.context && (!domain.subject || range.subject))
      });
    }

    // return new callback handler
    return {
      domain: function(handle) {
        domain = handle;
        update();
      },
      range: function(handle) {
        range = handle;
        update();
      }    
    }
  }


  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function createFunctionCallback(callback) {

    // internal values
    var domain = {context:true, subject:true};
    var range = {context:true, subject:true};

    // update constraint
    function update() {
      callback({
        context: (domain.subject && range.context),
        subject: (domain.context && (!domain.subject || range.subject))
      });
    }

    // return new callback handler
    return {
      domain: function(handle) {
        domain = handle;
        update();
      },
      range: function(handle) {
        range = handle;
        update();
      }    
    }
  }

  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function createIntersectionCallback(callback) {

    // internal values
    var left = {context:true, subject:true};
    var right = {context:true, subject:true};
    
    // update constraint
    function update() {
      print("callback:", left.context, left.subject, right.context, right.subject);
      callback({
        context: (left.context || right.context),
        subject: (left.subject && right.subject)
      });
    }

    // return new callback handler
    return {
      left: function(handle) {
        print("update left:", handle.context, handle.subject);

        left = handle;
        update();
      },
      right: function(handle) {
        print("update right:", handle.context, handle.subject);

        right = handle;
        update();
      }    
    }
  }


  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function createUnionCallback(callback) {

    // intrnal values
    var left = {context:true, subject:true};
    var right = {context:true, subject:true};

    // update constraint
    function update() {
      callback({
        context: (left.context && right.context),
        subject: (left.subject || right.subject)
      });
    }

    // return new callback handler
    return {
      left: function(handle) {
        left = handle;
        update();
      },
      right: function(handle) {
        right = handle;
        update();
      }    
    }
  }

  //   _          _                         _    ___      _ _ _             _   
  //  /_\   _____(_)__ _ _ _  _ __  ___ _ _| |_ / __|__ _| | | |__  __ _ __| |__
  // / _ \ (_-<_-< / _` | ' \| '  \/ -_) ' \  _| (__/ _` | | | '_ \/ _` / _| / /
  ///_/ \_\/__/__/_\__, |_||_|_|_|_\___|_||_\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //               |___/                                                        

  function createAssignmentCallback(callback) {

    // intrnal values
    var contract = {context:true, subject:true};

    // update constraint
    function update() {
      callback({
        context: (contract.context && contract.subject),
        subject: true
      });
    }

    // return new callback handler
    return {
      contract: function(handle) {
        contract = handle;
        update();
      }
    }
  }

  // ___        _    ___      _ _ _             _   
  //| __|__ _ _| |__/ __|__ _| | | |__  __ _ __| |__
  //| _/ _ \ '_| / / (__/ _` | | | '_ \/ _` / _| / /
  //|_|\___/_| |_\_\\___\__,_|_|_|_.__/\__,_\__|_\_\

  function createForkCallback(callbackSubject, callbackContext) {

    // intrnal values
    var contract = {context:true, subject:true};

    // update constraint
    function update() {

      callbackSubject({
        context: true,
        subject: contract.subject
      });

      callbackContext({
        context: contract.contet,
        subject: true
      });

    }

    // return new callback handler
    return {
      contract: function(handle) {
        contract = handle;
        update();
      }
    }
  }













  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Object: createObject,
    createFunction:      createFunctionCallback,
    Intersection:  createIntersectionCallback,
    createAssignment: createAssignmentCallback,
    createUnion:         createUnionCallback
  };

});

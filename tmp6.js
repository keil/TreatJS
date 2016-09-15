  //  ___  _     _        _    ___      _ _ _             _   
  // / _ \| |__ (_)___ __| |_ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_ \| / -_) _|  _| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_.__// \___\__|\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //          |__/                                            
  //

  // TODO, because object CB collect the outcome of its subcontract, ist might hapen that it mapps context and subject to false

  /* function createObject(callback) {

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
  */

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\
  /*
     function newFunctionCallback(callback) {

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
  */


    // get current context
    var context = Contexts[Contextx.length-1];
  function ObjectHandler(contract, global, handler) {
    if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, handler);
    else Handler.call(this);

    var callback = ObjectCallback(handler, contract);

    var callbacks = {};
    var cache = new WeakMap();

    function getCallback(name) {
      callbacks[name] = callbacks[name] || PropertyCallback(callback.objectHandler, contract);
      return callbacks[name];
    }

    this.get = function(target, name, receiver) {

      function assert(target, name, global, callback) {
        if(contract.map instanceof StringMap) {
          return (contract.map.has(name)) ? assertWith(target[name], contract.map.get(name), global, callback.getHandler) : target[name];
        } else {
          var target = target[name];
          contract.map.slice(name).foreach(function(i, contract) {
            target = assertWith(target, contract, global, callback.getHandler);
          });
          return target;
        } 
      }

      var callback = getCallback(name);

      if(target[name] instanceof Object) {
        if(cache.has(target[name])) {
          return cache.get(target[name]);
        } else {
          var contracted = assert(target, name, global, callback);
          cache.set(target[name], contracted);
          return contracted;
        }
      } else {
        return assert(target, name, global, callback);
      }
    };

    this.set = function(target, name, value, reveiver) {
      var callback = getCallback(name);

      if(contract.map instanceof StringMap) {
        value = (contract.map.has(name)) ? assertWith(value, contract.map.get(name), global, callback.setHandler) : value;
      } else {
        contract.map.slice(name).foreach(function(i, contract) {
          value = assertWith(value, contract, global, callback.setHandler);
        });
      } 

      return target[name] = value;
    }
  }
  ObjectHandler.prototype = Object.create(Handler.prototype);


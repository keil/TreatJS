/**
 * Make TransparentProxy available in standard engines.
 * Warning: The created proxies are NOT transparent with respect to JavaScript's 
 * build in equality operators.
 */
var TransparentProxy = TransparentProxy || (function() {

  /** Maps a proxy to its target.
  */
  var proxies = new WeakMap();

  /** Unrolls a proxy obejct.
  */
  function getIdentitiyObject(o) {

    /** Unpack proxies.
    */
    if(proxies.has(o)) return getIdentitiyObject(proxies.get(o));
    /** Otherwise.
    */
    else return o;
  }

  /**
   * Equality comparison.
   * The function behaves like JavaScript's '==' operator, but reveals proxies of that realm.
   */
  function equals(arg0, arg1) {
    var lhs = getIdentitiyObject(arg0);
    var rhs = getIdentitiyObject(arg1);
    return lhs == rhs;
  }

  /**
   * Identity comparison.
   * The function behaves like JavaScript's '===' operator, but reveals proxies of that realm.
   */
  function identical(arg0, arg1) {
    var lhs = getIdentitiyObject(arg0);
    var rhs = getIdentitiyObject(arg1);
    return lhs === rhs;
  }

  /** TransparentProxy constructor.
  */
  function TransparentProxy(target, handler) {
    if(!(this instanceof TransparentProxy)) return new TransparentProxy(target, handler);

    /** Create opaque proxy.
    */
    var proxy = new Proxy(target, handler);

    /** Add proxy-target mapping to list of proxies.
    */
    proxies.set(proxy, target);

    /** Return new opaque proxy.
    */
    return proxy;
  }

  /**
   * Create a new proxy realm.
   */
  Object.defineProperty(TransparentProxy, "createRealm", {
    value : function createRealm() {

      /**
       * List of proxies of that realm.
       */
      var realm =  new WeakSet();

      /**
       * Unrolls a proxy obejct.
       */
      function getIdentitiyObject(o, realm = new WeakSet()) {

        /**
         * Stop unrolling when reaching a proxy of that realm/
         */
        if(realm.has(o)) return o;
        /**
         * Unpack proxies.
         */
        else if(proxies.has(o)) return getIdentitiyObject(proxies.get(o));
        /**
         * Otherwise.
         */
        else return o;

      }

      /**
       * Equality comparison.
       * The function behaves like JavaScript's '==' operator, but reveals proxies of that realm.
       */
      function equals(arg0, arg1) {
        var lhs = getIdentitiyObject(arg0, realm);
        var rhs = getIdentitiyObject(arg1, realm);
        return lhs == rhs;
      }

      /**
       * Identity comparison.
       * The function behaves like JavaScript's '===' operator, but reveals proxies of that realm.
       */
      function identical(arg0, arg1) {
        var lhs = getIdentitiyObject(arg0, realm);
        var rhs = getIdentitiyObject(arg1, realm);
        return lhs === rhs;
      }

      /** TransparentProxy constructor.
      */
      function TransparentProxy(target, handler) {
        if(!(this instanceof TransparentProxy)) return new TransparentProxy(target, handler);

        /** Create opaque proxy.
        */
        var proxy = new Proxy(target, handler);

        /** Set proxy-target entry to list of all proxies.
        */
        proxies.set(proxy, target);

        /**
         * Add 'proxy' to list of proxies of that realm.
         */
        realm.add(proxy)

          /** Return new opaque proxy.
          */
          return proxy;
      }

      return {Proxy: TransparentProxy, 
        createRealm: createRealm, 
        equals: equals, 
        identical: identical, 
        WeakMap: WeakMap, 
        WeakSet: WeakSet, 
        Map: Map, 
        Set: Set
      }
    }});


  /**
   * Set 'TransparentProxy' constructor.
   */
  Object.defineProperty(this, "TransparentProxy", {value:TransparentProxy});

  /**
   * Sets global 'equals' method.
   */
  Object.defineProperty(Object, "equals", {value:equals});

  /**
   * Sets global 'identical' method.
   */
  Object.defineProperty(Object, "identical", {value:identical});

  /**
   * Return 'TransparentProxy' constructor.
   */
  return TransparentProxy;

})(this);



function Cache() {     
        var handlerMap = new WeakMap();

        /** put entry
         * @param object Key
         * @param object Value
         */
        this.put = function(proxy, handler) {
                return handlerMap.set(proxy, handler);
        };
        /** get entry
         * @param proxy Key value
         */
        this.get = function(proxy) {
                return handlerMap.get(proxy);
        };

        /** contains key
         * @param proxy
         * @return true if key is element of map, false otherwise
         */
        this.contains = function(key) {
                return (handlerMap.get(key, undefined) !== undefined) ? true : false;
        }
};

// AccessHandler Cache
var __cache = new  __HandlerCache();
// FucntionHandler Cache
var __fcache = new  __HandlerCache();



function WeakMap() {
		var keys = [];
		var values = [];
		return Object.freeze({
				set: function(key, value) {
						if (key !== Object(key)) { 
								throw new TypeError("Object expected");						}
						var i = keys.indexOf(key);
						if (i < 0) { i = keys.length; }
						keys[i] = key;
						values[i] = value;
				},
			   get: function(key) {
					   var i = keys.indexOf(key);
					   return i < 0 ? undefined : values[i];
			   },
			   remove: function(key) {
					   var i = keys.indexOf(key);
					   if(i >= 0) {
							   keys.remove(i);
							   values.remove(i);
					   }
			   }
		});
}

// Copyright (C) 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Implements StringMap - a map api for strings.
 *
 * @author Mark S. Miller
 * @author Jasvir Nagra
 * @overrides StringMap
 */

var StringMap;

(function() {

		var create = Object.create;
		var freeze = Object.freeze;
		function constFunc(func) {
				func.prototype = null;
				return freeze(func);
		}

		function keyEscape(key) {
				if ('string' !== typeof(key)) {
						throw new TypeError('Not a string: ' + key);
				}
				return ('#' + key);
		}

		function keyUnescape(key) {
				if ('string' !== typeof(key)) {
						throw new TypeError('Not a string: ' + key);
				}
				return (key.substring(1));
		}	

		StringMap = function StringMap() {

				var objAsMap = create(null);

				return freeze({
						get: constFunc(function(key) {
								return objAsMap[keyEscape(key)];
						}),
								set: constFunc(function(key, value) {
										objAsMap[keyEscape(key)] = value;
								}),
								has: constFunc(function(key) {
										return (keyEscape(key)) in objAsMap;
								}),
								foreach: constFunc(function(callback) {
										for(var key in objAsMap) callback(keyUnescape(key), objAsMap[key])
								}),
								'delete': constFunc(function(key) {
										return delete objAsMap[keyEscape(key)];
								})
				});
		};

})();

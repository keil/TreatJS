/*
 * JavaScript Reflection API
 *  for Access Permission Contracts
 *  - Library
 *
 * Copyright (c) 2013, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * $Date: 2013-03-07 11:18:52 +0100 (Thu, 07 Mar 2013) $
 * $Rev: 23136 $
 */
(function(APC){

		//////////////////////////////////////////////////
		// MAP . ENTRY
		//////////////////////////////////////////////////

		function __Entry(key, value) {
				if(!(this instanceof __Entry)) return new __Entry(key, value);

				this.key = key;
				this.value = value;
				this.next = null;
		};

		/** NEXT
		 * @return Map.Entry
		 */
		__Entry.prototype.next = function() {
				return this.next;
		}

		/** CONTAINS
		 * @param callback function
		 */
		__Entry.prototype.foreach = function(callback) {
				callback(this.key, this.value);
				if(this.next instanceof __Entry) this.next.foreach(callback);
		}


		/** CONTAINS
		 * @param key key value
		 * @return true | false
		 */
		__Entry.prototype.contains = function(key) {
				return (this.key==key) ? true : 
						((this.next instanceof __Entry) ? this.next.contains(key) : false);
		};

		/** GET
		 * @param key key value
		 * @return any
		 */
		__Entry.prototype.get = function(key) {
				return (this.key==key) ? this.value : 
						((this.next instanceof __Entry) ? this.next.get(key) : undefined);
		};

		/** SET
		 * @param entry Map.Entry
		 */
		__Entry.prototype.set = function(entry) {
				if(this.key==entry.key) {
						this.value = entry.value;
				} else if(this.next instanceof __Entry) {
						this.next.set(entry);
				} else{
						this.next = entry;
				}
		};



		//////////////////////////////////////////////////
		// MAP
		//////////////////////////////////////////////////

		function __Map() {
				if(!(this instanceof __Map)) return new __Map();

				this.head = null
		};

		/** CONTAINS
		 * @param key key value
		 * @return true | false
		 */
		__Map.prototype.contains = function(key) {
				return (this.head instanceof __Entry) ? this.head.contains(key) : false;
		};

		/** GET
		 * @param key key value
		 * @return any | undefined
		 */
		__Map.prototype.get = function(key) {
				return (this.head instanceof __Entry) ? this.head.get(key) : undefined;
		}

		/** SET
		 * @param key key value
		 * @param value value
		 * @return value
		 */
		__Map.prototype.set = function(key, value) {
				entry = new __Entry(key, value);
				if(this.head instanceof __Entry) this.head.set(entry);
				else this.head = entry;
				return value;
		}

		/** FOREACH
		 * @param callback function
		 */
		__Map.prototype.foreach = function(callback) {
				if(this.head instanceof __Entry) this.head.foreach(callback);
		}

		/** CLEAR */
		__Map.prototype.clear = function() {
				this.head = null;
		}





		//////////////////////////////////////////////////
		// APC . Util . Map
		//////////////////////////////////////////////////
		APC.Util 			= {};
		APC.Util.Map 		= __Map;
		APC.Util.Map.Entry 	= __Entry;

})(__APC);

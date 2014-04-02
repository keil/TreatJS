/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
load("src/treat.js");
load("test/contracts.js");


/**
function O(a) {
        this.m = function() {
                print("#1 " + a);
                //var a = 4712;
                print("#2 " + a);
        }
}

var c = new O("4711");
c.m();
c.m();
*/

/*
var o = {x:45, y:65};
o[/a/g] = 654;
o[new RegExp("^ab$")]  = 76543;


//o.foreach(function() {});

for(var i in o) {
        print("@@@ " + i);
}

function stringToRegExp(string) {
        var parts = string.split('/');
        return eval(string);


    //    return /+'parts[1]'+/;

      //  return parts.join('/');

        var regexp= '';
        parts.foreach(function(i,v) {
                regexp += (v + '/');
        });
        
        return regexp;
        
        //return ()
}
*/

function error(msg) {
        print("!" + msg);
}

// argumnents
// ? array, object

function Map() {
        if(!(this instanceof Map)) return new Map(elements);

        var keys = [];
        var values = [];

        this.foreach = function(callback) {
                keys.foreach(function (index, key) {
                        callback(key, values[index]);     
                });
        }

        this.set = function(key, value) {
                if(keys.indexOf(key)==-1) keys.push(key);

                var index = keys.indexOf(key);
                values[index] = value;

                return keys.length;
        }

        this.get = function(key) {
                return values[keys.indexOf(key)];
        }

        this.has = function(key) {
                return (keys.indexOf(key)==-1) ? false : true;
        }
}



function StringMap(elements) {
        if(!(this instanceof StringMap)) return new StringMap(elements);
        else Map.call(this);
 
        var set = this.set;
        this.set = function(key, value) {
               if(!(typeof key === "string")) error("Wrong Type. String required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
               else set(key, value);
        }

        if(elements instanceof Array) {
                var base = this; 
                elements.foreach(function(key, value) {
                        base.set(key.toString(), value);
                });
        } else if(elements instanceof Object) {
                for(var key in elements) {
                        this.set(key, elements[key]);
                }
        } else {}
}
StringMap.prototype = new Map();


function RegExpMap() {
        if(!(this instanceof RegExpMap)) return new RegExpMap();
        else Map.call(this);
 
        var set = this.set;
        this.set = function(key, value) {
               if(!(key instanceof RegExp)) error("Wrong Type. RegExp required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
               else set(key, value);
        }
}
RegExpMap.prototype = new Map();





var m1 = new Map([",_", /cha/]);
m1.set(/cha/, true);
m1.set("L", "3")

print(m1 instanceof Map);

m1.foreach(function (key, value) {
        print("M1: " + key + " >> " + value);
});

var m2 = new Map({xx:",_", yy:/chacha/});
m2.set(/chacha/, true);
m2.set("LL", "3")

print(m2 instanceof Map);

m2.foreach(function (key, value) {
        print("M2: " + key + " >> " + value);
});



var sm1 = new StringMap([",_", /cha/]);
//sm1.set(/cha/, true);
sm1.set("L", "3")

print(sm1 instanceof Map);

sm1.foreach(function (key, value) {
        print("SM1: " + key + " >> " + value);
});

var sm2 = new StringMap({xx:",_", yy:/chacha/});
//sm2.set(/chacha/, true);
sm2.set("L", "3")

print(sm2 instanceof Map);

sm2.foreach(function (key, value) {
        print("SM1: " + key + " >> " + value);
});


var rm1 = new RegExpMap([",_", /cha/]);
rm1.set(/cha/, true);
//rm1.set("L", "3")

print(rm1 instanceof Map);

rm1.foreach(function (key, value) {
        print("RM1: " + key + " >> " + value);
});




/*

var sm = new StringMap({aa:44,bb:22});
sm.set("a", 1);
sm.set("b", 2);

var sm2 = new StringMap([4711,4712]);
sm2.set("x", 1);
sm2.set("y", 2);

print(sm.get("a"));

print(sm instanceof Map);
print(sm instanceof StringMap);
print(sm instanceof RegExpMap);
sm.foreach(function(i,v) {
        print("* " + i + " : " + v);
});

sm2.foreach(function(i,v) {
        print("$ " + i + " : " + v);
});

var rm = new RegExpMap([/a/,/s/,/chacha/,/L/]);
rm.set(/test/, 76);


print(rm instanceof Map);
print(rm instanceof StringMap);
print(rm instanceof RegExpMap);

rm.foreach(function(i,v) {
        print("$ " + i + " : " + v);
});


// TODO, check Types
// in set method



/*

var wm1 = new Map();
wm1.set(/chacha/, 65889);
wm1.set("chacha", 2345);

var r = /567/;
var wm2 = new Map([[],[]]);
wm2.set(r,654);

//wm1.foreach(function(i,v) {print("%%%%% " + v)});

for(var v in (wm2.entries())) {
        print("&&&&& " + v);
}
*/


/*
print(wm2.size);/*.foreach(function(i,v) {
        print("&&&&& " + v);
});*/
/*
print(wm2.entries().next()); //.foreach(function(i,v) { print("&&&&& " + v);});

for(var v in wm2) {
        print("&&&&& " + v);
}


print(wm2.get(r));
*/

/*


print("/abs/a".split('/').length);
print("/abs/a".split('/'));

print(stringToRegExp("/a/"));
print(stringToRegExp("/a/") instanceof RegExp);

print(stringToRegExp("a"));
print(stringToRegExp("a") instanceof RegExp);

*/

quit();

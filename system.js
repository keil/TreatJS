/*
 *  JavaScript Contracts
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * $Date: 2014-01-08 15:56:23 +0100 (Wed, 08 Jan 2014) $
 * $Rev: 23677 $
 */

//////////////////////////////////////////////////
// ARRAY FOREACH
//////////////////////////////////////////////////

Array.prototype.foreach = function( callback ) {
        for( var k=0; k<this .length; k++ ) {
                callback( k, this[ k ] );
        }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
};

Array.prototype.clone = function() {
        return this.slice(0);
};

Array.prototype.clear = function() {
        while (this.length > 0) {
                this.pop();
        }
};

//////////////////////////////////////////////////
// SYSOUT
//////////////////////////////////////////////////

/* API Standard Output
*/
function __sysout(value) {
        if(typeof print != "undefined")
                // JS Shell concole oputput
                print(value);
        else if(document.write != "undefined")
                document.write(value);
        else if(typeof alert  != "undefined")
                // Standard alert notification
                alert(value);
}

//////////////////////////////////////////////////
// DUMP
//////////////////////////////////////////////////

/* Dump Values to String Output
*/
function __dump(value) {
        if (value === Object(value)) return "[" + typeof value + "]";
        if (typeof value == "string") return "\"" + value + "\"";
        return "" + value;
}

//////////////////////////////////////////////////
// OUTPUT
//////////////////////////////////////////////////

var fstWidth = 100;
var sndWidth = 20;
var seperator = ".";

/** Standard Output
*/
function __out(string) {
        putstr(padding_right(string + " ", seperator, fstWidth));
}

/** Notice Output
*/
function __notice(string) {
        putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
        putstr("\n");
}

/** OK Output
*/
function __ok() {
        putstr(padding_left(" OK", seperator, sndWidth));
        putstr("\n");
}

/** DONE Output
*/
function __done() {
        putstr(padding_left(" DONE", seperator, sndWidth));
        putstr("\n");
}

/** BLANK Output
*/
function __blank() {
        putstr(padding_left(seperator, seperator, sndWidth));
        putstr("\n");
}

/** FAILED Output
*/
function __fail() {
        putstr(padding_left(" FAILED", seperator, sndWidth));
        putstr("\n");
}

/** Sub-Standard Output
*/
function __subout(string) {
        putstr(padding_right("... " + string + " ", seperator, fstWidth));
}


//////////////////////////////////////////////////
// TESTCASE
//////////////////////////////////////////////////

/* Dump Values to String Output
*/
function __testcase(file) {
        __sysout("\n\n\n\n\n");
        __sysout("##################################################");
        __sysout("##")
                __sysout("## " + file);
        __sysout("##")
                __sysout("##################################################");
        __sysout("\n");

        (function() {
                load(file);
        })();
}

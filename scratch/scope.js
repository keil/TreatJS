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

// TODO, \
// test scope
// test scope, contract


// ich will dem vertrag chacha binden, und zwar das im kontext
var chacha = 4711;
print (chacha);

var h = function() { chacha = 4712; }
var hprime = $.assert(
                h,
                new $.FunctionContract(Array(Any), ChachaIs4711)
                );

//hprime();
print (chacha);


//
//var x = $.assign(
//                0,
//                new $.Let({Math:Math}, AbsLowerThan100)
//                );
//
//


var chacha = 4711;
//this.chacha = 356456;
function writeChaCha() {
        chacha = chacha+1;
}

        //print("&&&2 " + this.chacha);
        //print("The Math Object:" + this.Math);
       // if(this.chacha==4711) quit();
       // this.bla=6;
        //print(chacha);
       // var tmp = 7654;
       // tmp = tmp=+1;
        //var tmp = this.y;

GraterThanX = function(arg) {
        this.chachsdfga;
        chacha=chacha+1;;
        writeChaCha();
        return (arg>=x);
}

var f = function(x, y) {
        return (x>=y) ? x : y;
}

var g = $.assert(
                f,
                new $.FunctionContract(
                        Array(IsNumber, IsNumber),
                        new $.With({x:x}, GraterThanX)
                        )
                );

print("@1: " + chacha);

print ( g(1,2) );

print("@2: " + chacha);






// further scope example


var p = function(arg) { return (this.arg>0) };

var obj = {x:4711,do:function() {this.x=4712;}}
var contract = new $.ObjectContract({
        x:IsNumber,
        do:new $.FunctionContract(Array(Any), p)
});

var test = assert(obj, c);
var g = test.do;
g();

/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// _____             _      _ ___  ___       _   
//|_   _| _ ___ __ _| |_ _ | / __|/ _ \ _  _| |_ 
//  | || '_/ -_) _` |  _| || \__ \ (_) | || |  _|
//  |_||_| \___\__,_|\__|\__/|___/\___/ \_,_|\__|
//                                               

function TreatJSOut() {
  if(!(this instanceof TreatJSOut)) return new TreatJSOut();
}
TreatJSOut.prototype = {};

// log classes
TreatJSOut.prototype.ASSERT = "ASSERT";
TreatJSOut.prototype.SANDBOX = "SANDBOX";
TreatJSOut.prototype.INTERNAL = "INTERNAL";
TreatJSOut.prototype.DECOMPILE = "DECOMPILE";

// log output
TreatJSOut.prototype.log = function (classid, message, target) {};
TreatJSOut.prototype.println = function (message) {};
TreatJSOut.prototype.printsubln = function (message) {};

// _____             _      _ ___ ___ _        _ _  ___       _   
//|_   _| _ ___ __ _| |_ _ | / __/ __| |_  ___| | |/ _ \ _  _| |_ 
//  | || '_/ -_) _` |  _| || \__ \__ \ ' \/ -_) | | (_) | || |  _|
//  |_||_| \___\__,_|\__|\__/|___/___/_||_\___|_|_|\___/ \_,_|\__|

function TreatJSShellOut() {
  if(!(this instanceof TreatJSShellOut)) return new TreatJSShellOut(sysout);
}
TreatJSShellOut.prototype = Object.create(TreatJSOut.prototype);

TreatJSShellOut.prototype.fstWidth = 100;
TreatJSShellOut.prototype.sndWidth = 20;
TreatJSShellOut.prototype.splitWidth = 30;
TreatJSShellOut.prototype.subSplitWidth = 26;
TreatJSShellOut.prototype.valueWidth = 9;

TreatJSShellOut.prototype.log = function (classid, message, target) {

  var target = ((target)?" "+target:"");

  if(/\r|\n/.exec(target) | target.length>50) {
    this.out(padding_right(classid + " \\ " + message + " ", ".", this.splitWidth));
    this.blank();
    this.raw(target + "\n");
  } else {
    this.out(padding_right(classid + " \\ " + message + " ", ".", this.splitWidth) + target);
    this.blank();
  }
};

TreatJSShellOut.prototype.println = function (message) {
  this.out(padding_right(message + " ", ".", this.splitWidth));
  this.blank();
};

TreatJSShellOut.prototype.printsubln = function (message, value) {
  this.subout(padding_right(message + " ", ".", this.subSplitWidth) + padding_left(value + "", " ", this.valueWidth));
  this.blank(); 
};

TreatJSShellOut.prototype.seperator = ".";
TreatJSShellOut.prototype.subseperator = "... ";

TreatJSShellOut.prototype.out = function (string) {
  putstr(padding_right(string + " ", this.seperator, this.fstWidth));
};

TreatJSShellOut.prototype.subout = function (string) {
  putstr(padding_right(this.subseperator + string + " ", this.seperator, this.fstWidth));
};

TreatJSShellOut.prototype.raw = function (string) {
  putstr(string);
};

TreatJSShellOut.prototype.blank = function () {
  putstr(padding_left(this.seperator, this.seperator, this.sndWidth));
  putstr("\n");
};

TreatJSShellOut.prototype.ok = function () {
  putstr(padding_left(" OK", this.seperator, this.sndWidth));
  putstr("\n");
};

TreatJSShellOut.prototype.done = function () {
  putstr(padding_left(" DONE", this.seperator, this.sndWidth));
  putstr("\n");
};

TreatJSShellOut.prototype.fail = function () {
  putstr(padding_left(" FAILED", this.seperator, this.sndWidth));
  putstr("\n");
};

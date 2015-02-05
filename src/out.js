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

// _____             _      _ ___  ___       _   
//|_   _| _ ___ __ _| |_ _ | / __|/ _ \ _  _| |_ 
//  | || '_/ -_) _` |  _| || \__ \ (_) | || |  _|
//  |_||_| \___\__,_|\__|\__/|___/\___/ \_,_|\__|
//                                               

function TreatJSOut() {
  if(!(this instanceof TreatJSOut)) return new TreatJSOut();
}
TreatJSOut.prototype = {};

TreatJSOut.prototype.out = function () {};
TreatJSOut.prototype.subout = function () {};
TreatJSOut.prototype.blank = function () {};
TreatJSOut.prototype.ok = function () {};
TreatJSOut.prototype.done = function () {};
TreatJSOut.prototype.fail = function () {};

// _____             _      _ ___ ___ _        _ _  ___       _   
//|_   _| _ ___ __ _| |_ _ | / __/ __| |_  ___| | |/ _ \ _  _| |_ 
//  | || '_/ -_) _` |  _| || \__ \__ \ ' \/ -_) | | (_) | || |  _|
//  |_||_| \___\__,_|\__|\__/|___/___/_||_\___|_|_|\___/ \_,_|\__|

function TreatJSShellOut(sysout) {
  if(!(this instanceof TreatJSShellOut)) return new TreatJSShellOut(sysout);

  // seperator
  var slash = " / ";

  // classes
  var ASSERT = "ASSERT";
  var SANDBOx = "SANDBOX";
  var DECOMPILE = "DECOMPILE";





}
TreatJSShellOut.prototype = Object.create(TreatJSOut.prototype);

TreatJSShellOut.prototype.fstWidth = 100;
TreatJSShellOut.prototype.sndWidth = 20;

TreatJSShellOut.prototype.seperator = ".";
TreatJSShellOut.prototype.subseperator = "... ";

TreatJSShellOut.prototype.out = function (string) {
  putstr(padding_right(string + " ", this.seperator, this.fstWidth));
};

TreatJSShellOut.prototype.subout = function (string) {
  putstr(padding_right(this.subseperator + string + " ", this.seperator, this.fstWidth));
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


/**
  TreatJSShellOut.prototype

  function __notice(string) {
  putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
  putstr("\n");
  }
  */

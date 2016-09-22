/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Log", function (TreatJS, Contract, configuration) {

  const TOPASSERT = "TOPASSERT";
  const ASSERT = "ASSERT";

  const TOPCONSTRUCT = "TOPCONSTRUCT";
  const CONSTRUCT = "CONSTRUCT";

  const SANDBOX = "SANDBOX";
  const INTERNAL = "INTERNAL";
  const DECOMPILE = "DECOMPILE";

  const headWidth = 30;
  const cmdWidth = 30;

  const seperator = ".";
  const subseperator = "... ";

  const fstWidth = 100;
  const sndWidth = 20;
  
  function topassert(cmd, msg) {
    log(TOPASSERT, cmd, msg);
  }

  function assert(cmd, msg) {
    log(ASSERT, cmd, msg);
  }

  function construct(cmd, msg) {
    log(CONSTRUCT, cmd, msg);
  }


  function topconstruct(cmd, msg) {
    log(TOPCONSTRUCT, cmd, msg);
  }


  function decompile(cmd, msg) {
    log(DECOMPILE, cmd, msg);
  }

  function sandbox(cmd, msg) {
    log(SANDBOX, cmd, msg);
  }

  function internal(cmd, msg) {
    log(INTERNAL, cmd, msg);
  }

  /* Log 
   */
  function log(op, cmd="", msg="") {
    if(/\r|\n/.exec(msg) | msg.length>50) {
      out(head("["+op+"]") + " " + body(op));
      blank();
      raw(msg + "\n");
    } else {
      out(head("["+op+"]") + " " + body(op, msg));
      blank();
    }
  }

  function head(id) {
    return padding_right(id + " ", ".", headWidth);
  }

  function body(cmd, msg) {
    return padding_right(cmd+" ", ".", cmdWidth)+((msg!==undefined) ? " "+msg : "");
  }

  /** Standard Output (Head + Message)
  */
  function out(string) {
    putstr(padding_right(string + " ", seperator, fstWidth));
  }

  /** Sub-Standard Output (Message)
  */
  function subout(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth));
  }

  /** Blank Output (End Of Line)
  */
  function blank() {
    putstr(padding_left(seperator, seperator, sndWidth));
    putstr("\n");
  }

  /** OK Output (End Of Line)
  */
  function ok() {
    putstr(padding_left(" OK", seperator, sndWidth));
    putstr("\n");
  }

  /** DONE Output (End Of Line)
  */
  function done() {
    putstr(padding_left(" DONE", seperator, sndWidth));
    putstr("\n");
  }

  /** FAILED Output (End Of Line)
  */
  function fail() {
    putstr(padding_left(" FAILED", seperator, sndWidth));
    putstr("\n");
  }

  /** Notice Output (Sub-Output including Blank)
  */
  function notice(string) {
    putstr(padding_right(subseperator + string + " ", seperator, fstWidth+sndWidth));
    putstr("\n");
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    assert:     assert,
    decompile,  decompile,
    sandbox,    sandbox,
    internal,   internal
  };

});

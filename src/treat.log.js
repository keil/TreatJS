/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Log", function (TreatJS, Contract, Configuration, Realm) {

  const print = Configuration.print || (function() {});

  const Keys = Object.freeze({
    ASSERT      : "ASSERT",
    CONSTRUCT   : "CONSTRUCT",
    SANDBOX     : "SANDBOX",
    CALLBACK    : "CALLBACK",
    INTERNAL    : "INTERNAL"
  });

  const headWidth = 20;
  const cmdWidth = 20;

  const bodyWidth = 100;

  const seperator = ".";
  const subseperator = "... ";

  function log(op, cmd="", msg="") {
    if(/\r|\n/.exec(msg) || msg.length>50) {
      print(mkHead("["+op+"]") + " " + mkBody(cmd));
      print(msg + "\n");
    } else {
      print(mkHead("["+op+"]") + mkBody(cmd, msg));
    }
  }

  function line(body="") {
    print(mkLine(body));
  }

  function subline(body="") {
    print(mkSubLine(body));
  }

  function prompt(head="", body="") {
    print(mkPrompt(head, body));
  }

  function mkHead(id) {
    return padding_right(id+" ", ".", headWidth-1)+" ";
  }

  function mkBody(cmd="", msg="") {
    return msg? 
      padding_right(padding_right(cmd+" ", ".", cmdWidth-1)+" "+msg, seperator, bodyWidth):
      padding_right(cmd+" ", seperator, bodyWidth);
  }

  function mkLine(msg="") {
    return padding_right(msg+" ", seperator, headWidth+bodyWidth);
  }

  function mkSubLine(msg="") {
    return padding_right(subseperator+" "+msg+" ", seperator, headWidth+bodyWidth);
  }

  function mkPrompt(key="", msg="") {
    if(/\r|\n/.exec(msg) || msg.length>50) msg = msg.name ? msg.name : "[unnamed function]";
    return padding_right(padding_right(subseperator+key+" ", seperator, headWidth-4)+" "+msg, seperator, headWidth+bodyWidth);
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Keys:    Keys,
    log:     log,
    line:    line,
    subline: subline,
    prompt:  prompt
  };

});

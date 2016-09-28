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

TreatJS.package("TreatJS.Canonicalize", function (TreatJS, Contract, configuration) {

  // TODO
  // is it possible to write uncanonical conytracts?
  // and if yes? 
  //
  // the only non-canonical case are delayed cintracts at first contract of an intersection
  // and immediate intersections or delayed intersections in an intersection

  //                        _         _ _        
  //  __ __ _ _ _  ___ _ _ (_)__ __ _| (_)______ 
  // / _/ _` | ' \/ _ \ ' \| / _/ _` | | |_ / -_)
  // \__\__,_|_||_\___/_||_|_\__\__,_|_|_/__\___|

  function canonicalize(contract) {
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(canonical(contract)) return contract;
    else {
      switch(true) {
        case contract instanceof OrContract:
          return canonicalize(expandOr(contract));
          break;
        case contract instanceof IntersectionContract:
          return canonicalize(expandIntersection(contract));
          break;
        case contract instanceof NotContract:
          return canonicalize(expandNot(contract));
          break;
        case contract instanceof NegationContract:
          return canonicalize(expandNegation(contract));
          break;
        case contract instanceof WithContract:
          return canonicalize(expandWith(contract));
          break;
        default:
          error("Contract not implemented!" + "\n" + contract, (new Error()).fileName, (new Error()).lineNumber);
          break;
      }
    }
  }






  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    Base:           BaseContract,
    Constructor:    ConstructorContract,
    Object:         ObjectContract,
    Function:       FunctionContract,
    Dependent:      DependentContract,
    IIntersection:  IIntersectionContract,
    DIntersection:  DIntersectionContract,
    Union:          UnionContract
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Base:           BaseContract,
    Constructor:    ConstructorContract,
    Object:         ObjectContract,
    Function:       FunctionContract,
    Dependent:      DependentContract,
    IIntersection:  IIntersectionContract,
    DIntersection:  DIntersectionContract,
    Union:          UnionContract
  };



});


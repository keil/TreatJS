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
(function(_) {

  // out
  var error = _.error;

  // predicates
  var canonical = _.canonical;
  var delayed = _.delayed;
  var immediate = _.immediate;

  // prototypes
  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  // contracts
  var DelayedContract = _.Delayed;
  var ImmediateContract = _.Immediate;
  var CombinatorContract = _.Combinator;
  var WrapperContract = _.Wrapper;

  var ContractConstructor = _.Constructor;

  var BaseContract = _.BaseContract;

  var FunctionContract = _.FunctionContract;
  var MethodContract = _.MethodContract;
  var DependentContract = _.DependentContract;
  var ObjectContract = _.ObjectContract;

  var WithContract = _.With;

  var AndContract = _.And;
  var OrContract = _.Or;
  var NotContract = _.Not;

  var UnionContract = _.Union;
  var IntersectionContract = _.Intersection;
  var NegationContract = _.Negation;

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
          error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
          break;
      }
    }
  }

  function expandIntersection(contract) {
    if(!(contract instanceof IntersectionContract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var first = canonicalize(contract.first);
    var second = canonicalize(contract.second);

    switch(true) {

      case immediate(first):
      case delayed(first):
        if(immediate(second)) return IntersectionContract(second, first);
        else return expandIntersectionOn(first, second);
        break;

      case immediate(second):
      case delayed(second):
        return expandIntersectionOn(first, second);
        break;

      case first instanceof UnionContract:
        return UnionContract(canonicalize(expandIntersectionOn(first.first, second)), canonicalize(expandIntersectionOn(first.second, second)));
        break;

      case first instanceof AndContract:
        return AndContract(canonicalize(expandIntersectionOn(first.first, second)), canonicalize(expandIntersectionOn(first.second, second)));
        break;

      case first instanceof OrContract:
        return OrContract(first.first, canonicalize(OrContract(first.second, second)));
        break;

      case first instanceof IntersectionContract:
        return IntersectionContract(first.first, canonicalize(IntersectionContract(first.second, second)));
        break;

      default:
        error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
        break;
    } 
  }

  function expandOr(contract) {
    if(!(contract instanceof OrContract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var first = canonicalize(contract.first);
    var second = canonicalize(contract.second);

    switch(true) {

      case immediate(first):
      case delayed(first):
        if(immediate(second)) return OrContract(second, first);
        else return expandOrOn(first, second);
        break;

      case immediate(second):
      case delayed(second):
        return expandOrOn(first, second);
        break;

      case first instanceof UnionContract:
        return UnionContract(canonicalize(expandOrOn(first.first, second)), canonicalize(expandOrOn(first.second, second)));
        break;

      case first instanceof AndContract:
        return AndContract(canonicalize(expandOrOn(first.first, second)), canonicalize(expandOrOn(first.second, second)));
        break;

      case first instanceof OrContract:
        return OrContract(first.first, canonicalize(OrContract(first.second, second)));
        break;

      case first instanceof IntersectionContract:
        return IntersectionContract(first.first, canonicalize(IntersectionContract(first.second, second)));
        break;

      default:
        error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
        break;
    }
  }

  function expandIntersectionOn(contract, contractP)  {
    switch(true) {
      case contractP instanceof OrContract:
        return OrContract(IntersectionContract(contract, contractP.first), IntersectionContract(contract, contractP.second));
        break;
      case contractP instanceof AndContract:
        return AndContract(IntersectionContract(contract, contractP.first), IntersectionContract(contract, contractP.second));
        break;
      case contractP instanceof IntersectionContract:
        return IntersectionContract(contractP.first, IntersectionContract(contract, contractP.second));
        break;
      case contractP instanceof UnionContract:
        return UnionContract(IntersectionContract(contract, contractP.first), IntersectionContract(contract, contractP.second));
        break;
      default:
        error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
        break;
    }
  }

  function expandOrOn(contract, contractP)  {
    switch(true) {
      case contractP instanceof OrContract:
        return OrContract(contractP.first, OrContract(contract, contractP.second));
        break;
      case contractP instanceof AndContract:
        return AndContract(OrContract(contract, contractP.first), OrContract(contract, contractP.second));
        break;
      case contractP instanceof IntersectionContract:
        return IntersectionContract(OrContract(contract, contractP.first), OrContract(contract, contractP.second));
        break;
      case contractP instanceof UnionContract:
        return UnionContract(OrContract(contract, contractP.first), OrContract(contract, contractP.second));
        break;
      default:
        error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
        break;
    }
  }

  function expandWith(contract) {
    if(!(contract instanceof WithContract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var sub = canonicalize(contract.sub);
    var binding = contract.binding;

    // canonical contracts
    /*if(canonical(sub)) return contract;
      else*/ {
        switch(true) {
          case sub instanceof OrContract:
            return OrContract(WithContract(binding, sub.first), WithContract(binding, sub.second));
            break;
          case sub instanceof IntersectionContract:
            return IntersectionContract(WithContract(binding, sub.first), WithContract(binding, sub.second));
            break;
          case sub instanceof NotContract:
            return expandWith(WithContract(binding, canonicalize(sub)));
            break;
          case sub instanceof NegationContract:
            return expandWith(WithContract(binding, canonicalize(sub)));
            break;
          case sub instanceof WithContract:
            return expandWith(WithContract(binding, canonicalize(sub)));
            break;
          default:
            error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
            break;
        }
      }
  }

  function expandNegation(contract) {
    if(!(contract instanceof NegationContract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var sub = canonicalize(contract.sub);

    // canonical contracts
    /*if(canonical(sub)) return contract;
      else*/ {
        switch(true) {
          case sub instanceof OrContract:
            return AndContract(NegationContract(sub.first), NegationContract(sub.second));
            break;
          case sub instanceof AndContract:
            return OrContract(NegationContract(sub.first), NegationContract(sub.second));
            break;
          case sub instanceof IntersectionContract:
            return UnionContract(NegationContract(sub.first), NegationContract(sub.second));
            break;
          case sub instanceof UnionContract:
            return IntersectionContract(NegationContract(sub.first), NegationContract(sub.second));
            break;
          case sub instanceof NotContract:
            return sub.sub;
            break;
          case sub instanceof NegationContract:
            return sub.sub;
            break;
          case sub instanceof WithContract:
            return WithContract(sub.binding, NegationContract(sub.sub));
            break;
          default:
            error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
            break;
        }
      }
  }

  function expandNot(contract) {
    if(!(contract instanceof NotContract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var sub = canonicalize(contract.sub);

    // canonical contracts
    /*if(canonical(sub)) return contract;
      else*/ {
        switch(true) {
          case sub instanceof OrContract:
            return AndContract(NotContract(sub.first), NotContract(sub.second));
            break;
          case sub instanceof AndContract:
            return OrContract(NotContract(sub.first), NotContract(sub.second));
            break;
          case sub instanceof IntersectionContract:
            return UnionContract(NotContract(sub.first), NotContract(sub.second));
            break;
          case sub instanceof UnionContract:
            return IntersectionContract(NotContract(sub.first), NotContract(sub.second));
            break;
          case sub instanceof NotContract:
            return sub.sub;
            break;
          case sub instanceof NegationContract:
            return sub.sub;
            break;
          case sub instanceof WithContract:
            return WithContract(sub.binding, NotContract(sub.sub));
            break;
          default:
            error("Contract not implemented: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
            break;
        }
      }  
  }

  /**
   * Canonicalize 
   */

  __define("canonicalize", canonicalize, _);

})(TreatJS);

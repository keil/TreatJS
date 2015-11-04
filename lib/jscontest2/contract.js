/*
 * JavaScript Reflection API
 *  for Access Permission Contracts
 *
 * Copyright (c) 2013, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * $Date: 2014-06-03 13:29:36 +0200 (Tue, 03 Jun 2014) $
 * $Rev: 24474 $
 */

(function(APC){

  //////////////////////////////////////////////////
  // Contract
  // data structure for contracts
  //
  // RegEx              = /.../
  // Name               = x...
  // Literal            = {} | ^ | @ | ? | Name | RegEx | !(Literal)
  // Set                = Literal | (Contract) | (Contract+Contract) | (Contract&Contract) 
  // Quantifiable       = Set | Set? | Set*
  // Contract           = Quantifiable | Quantifiable.Contract 
  //////////////////////////////////////////////////

  function __AccessContract() {
    if(!(this instanceof __AccessContract)) return new __AccessContract();
  }
  __AccessContract.prototype = {};
  //__AccessContract.prototype = Object.create(TreatJS.Contract.prototype);

  //////////////////////////////////////////////////
  // LITERALE
  //////////////////////////////////////////////////

  /**
   * {} Literal (empty set)
   */
  function Empty() {
    if(!(this instanceof Empty)) return __cache.c(new Empty());
    else __AccessContract.call(this);
  }
  Empty.prototype = Object.create(__AccessContract.prototype);

  /** n({}) ::= true */
  Empty.prototype.isEmpty = function() {
    return true;
  }
  /** w({}) ::= false */
  Empty.prototype.isBlank = function() {
    return false;
  }
  /** v({}) ::= false */
  Empty.prototype.isNullable = function() {
    return false;
  }
  /** m({}) ::= false */
  Empty.prototype.isIndifferent = function() {
    return false;
  }
  /** m*({}) ::= false */
  Empty.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r({}) ::= false */
  Empty.prototype.isReadable = function(name) {
    return false;
  }
  /** w({}) ::= false */
  Empty.prototype.isWriteable =  function(name) {
    return false;
  }
  //////////////////////////////////////////////////
  /** first({}) ::= {} */
  Empty.prototype.first = function() {
    // return new Array(this);
    // CHANGED, no need of returning this
    // EmptySet can be moved to contract! 
    return new Array();
  }
  /** (d_name {}) ::= {} */
  Empty.prototype.derive = function(name) {
    return new Empty();
  }
  /** (d_literal {}) ::= {} */
  Empty.prototype.lderive = function(larg) {
    return this;
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Empty.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;

    /** otherwise */
    //							   else return false;

    if(arg.isNullable()) return false;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Empty.prototype.isSubSetOf = function(arg, ctx) {
    /** C <= C' |= true  | n(C) */
    // return true;
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce {} */
  Empty.prototype.reduce =  function() {
    /** reduce {} ::= {} */
    return this;
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Empty.prototype.dump = function() {
    return " [{}] ";
  }
  /** To String
   * @return string
   */
  Empty.prototype.toString = function() {
    return "{}"; 
  }

  /**
   * ^ Literal (empty literal)
   */
  function Null() {
    if(!(this instanceof Null)) return __cache.c(new Null());
    else __AccessContract.call(this);

  }
  Null.prototype = Object.create(__AccessContract.prototype);

  /** n(^) ::= false */
  Null.prototype.isEmpty = function() {
    return false;
  }
  /** w(^) ::= false */
  Null.prototype.isBlank = function() {
    return false;
  }
  /** v(^) ::= true */
  Null.prototype.isNullable = function() {
    return true;
  }
  /** m(^) ::= false */
  Null.prototype.isIndifferent = function() {
    return false;
  }
  /** m*(^) ::= false */
  Null.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r(^) ::= false */
  Null.prototype.isReadable = function(name) {
    return false;
  }
  /** w(^) ::= false */
  Null.prototype.isWriteable =  function(name) {
    return false;
  }
  //////////////////////////////////////////////////
  /** first(^) ::= ^ */
  Null.prototype.first = function() {
    return new Array(this);
  }
  /** (d_name ^) ::= {} */
  Null.prototype.derive = function(name) {
    return new Empty();
  }
  /** (d_literal ^) ::= ^ if literal == ^, @ oterhwise */
  Null.prototype.lderive = function(larg) {
    //if(larg==new At()) return new Null(); // TODO
    //else return (larg==this) ? this : new Empty();

    //return new Empty();

    return (larg==this) ? this : new Empty();


  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Null.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) */
    //							   else if(arg.isBlank()) return true;


    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));


  }
  /** ctx |- C >= this */
  Null.prototype.isSubSetOf = function(arg, ctx) {
    /** C <= C' |= true  | n(C') */
    if(arg.isNullable()) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    else return false;
  }
  //////////////////////////////////////////////////
  /** reduce ^ */
  Null.prototype.reduce =  function() {
    /** reduce ^ ::= ^ */
    return this;
    //return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Null.prototype.dump = function() {
    return " [] ";
  }
  /** To String
   * @return string
   */
  Null.prototype.toString = function() {
    return "^"; 
  }

  /**
   * @ Literal (null)
   */
  function At() {
    if(!(this instanceof At)) return __cache.c(new At());
    else __AccessContract.call(this);

  }
  At.prototype = Object.create(__AccessContract.prototype);

  /** n(@) ::= true */
  At.prototype.isEmpty = function() {
    return false;
  }
  /** w(@) ::= true */
  At.prototype.isBlank = function() {
    return true;
  }
  /** v(@) ::= false */
  At.prototype.isNullable = function() {
    return false;
  }
  /** m(@) ::= false */
  At.prototype.isIndifferent = function() {
    return false;
  }
  /** m*(@) ::= false */
  At.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r(@) ::= false */
  At.prototype.isReadable = function(name) {
    return false;
  }
  /** w(@) ::= false */
  At.prototype.isWriteable =  function(name) {
    return false;
  }
  //////////////////////////////////////////////////
  /** first(@) ::= @ */
  At.prototype.first = function() {
    return new Array(this);
  }
  /** (d_name @) ::= @ */
  At.prototype.derive = function(name) {
    return new Empty();
  }
  /** (d_literal @) ::= @ */
  At.prototype.lderive = function(larg) {
    // if(larg==new Null()) return this;
    if(larg==new Null()) return Empty();
    else if(larg==this) return new Null();
    else return new Empty();
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  At.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;

    if(arg.isNullable()) return false;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  At.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce @ */
  At.prototype.reduce =  function() {
    /** reduce @ ::= @ */
    return this;
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  At.prototype.dump = function() {
    return " [@] ";
  }
  /** To String
   * @return string
   */
  At.prototype.toString = function() {
    return "@"; 
  }


  /**
   * ? Literal (universe)
   */
  function Alphabet() {
    if(!(this instanceof Alphabet)) return __cache.c(new Alphabet());
    else __AccessContract.call(this);

  }
  Alphabet.prototype = Object.create(__AccessContract.prototype);

  /** n(?) ::= false */
  Alphabet.prototype.isEmpty = function() {
    return false;
  }
  /** w(?) ::= false */
  Alphabet.prototype.isBlank = function() {
    return false;
  }
  /** v(?) ::= false */
  Alphabet.prototype.isNullable = function() {
    return false;
  }
  /** m(?) ::= false */
  Alphabet.prototype.isIndifferent = function() {
    return true;
  }
  /** m*(?) ::= false */
  Alphabet.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r(?) ::= true */
  Alphabet.prototype.isReadable = function(name) {
    return true;
  }
  /** w(?) ::= true */
  Alphabet.prototype.isWriteable =  function(name) {
    return true;
  }
  //////////////////////////////////////////////////
  /** first(?) ::= ? */
  Alphabet.prototype.first = function() {
    return new Array(this);
  }
  /** (d_name ?) ::= ^ */
  Alphabet.prototype.derive = function(name) {
    return new Null();
  }
  /** (d_literal ?) ::= ? if literal=^, ^ otherwise */
  Alphabet.prototype.lderive = function(larg) {
    // if (larg==new Null()) return this;
    if(larg==new Null()) return Empty();
    else return new Null();
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Alphabet.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //				   if(arg==this) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    //				   else if(arg.isNullable()) return false;
    /** C <= C' |= true  | n(C) */
    //				   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //				   else if(arg.isBlank()) return true;
    /** C <= C' |= false  | m(C) and !m(C') */
    //				   else if(arg.isUniversal()) return false;

    if(arg.isNullable()) return false;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));

  }
  /** ctx |- C >= this */
  Alphabet.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce ? ::= ? */
  Alphabet.prototype.reduce =  function() {
    /** reduce ? ::= ? */
    return this;
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Alphabet.prototype.dump = function() {
    return " [?] ";
  }
  /** To String
   * @return string
   */
  Alphabet.prototype.toString = function() {
    return "?"; 
  }

  /**
   * x Literal (property name)
   */
  function Name(varname) {
    if(!(this instanceof Name)) return __cache.c(new Name(varname));
    else __AccessContract.call(this);

    this.varname = varname;
  }
  Name.prototype = Object.create(__AccessContract.prototype);

  /** n(varname) ::= false */
  Name.prototype.isEmpty = function() {
    return false;
  }
  /** w(varname) ::= false */
  Name.prototype.isBlank = function() {
    return false;
  }
  /** v(varname) ::= false */
  Name.prototype.isNullable = function() {
    return false;
  }
  /** m(varname) ::= false */
  Name.prototype.isIndifferent = function() {
    return false;
  }
  /** m*(varname) ::= false */
  Name.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r(varname) ::= varname == name */
  Name.prototype.isReadable = function(name) {
    return (name == this.varname);
  }
  /** w(varname) ::= varname == name */
  Name.prototype.isWriteable =  function(name) {
    return (name == this.varname);
  }
  //////////////////////////////////////////////////
  /** first(varname) ::= varname */
  Name.prototype.first = function() {
    return new Array(this);
  }
  /** (d_name varname) ::= ^ if varname == name, @ otherwise */
  Name.prototype.derive = function(name) {
    return (name == this.varname) ? Null() : Empty();
  }
  /** (d_literal varname) ::= varname if literal=^, ^ if literal==varname, ^,{} if liteal==?, {} oterhwise */
  Name.prototype.lderive = function(larg) {
    if(larg==this) return new Null(); //TODO
    if(larg==new Null()) return Empty();
    //   else if(larg==new Alphabet()) return new Null(); // TODO
    // else if (larg==new Null()) return this;
    else if(larg==new At()) return new Null(); // TODO
    else return new Empty();
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Name.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;

    if(arg.isNullable()) return false;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Name.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce varname ::= varname */
  Name.prototype.reduce =  function() {
    /** reduce varname ::= varname */
    return this;
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Name.prototype.dump = function() {
    return " [" + this.varname + "] ";
  }
  /** To String
   * @return string
   */
  Name.prototype.toString = function() {
    return "\"" + this.varname + "\"";
  }


  /**
   * RegEx Literal (regular expression)
   */
  function RegEx(regex) {
    // TODO
    if(!(this instanceof RegEx)) return __cache.c(new RegEx(regex));
    else __AccessContract.call(this);

    this.regex = regex;
  }
  // TODO
  RegEx.prototype = Object.create(__AccessContract.prototype);

  /** n(RegEx) ::= false */
  RegEx.prototype.isEmpty = function() {
    return false;
  }
  /** w(RegEx) ::= false */
  RegEx.prototype.isBlank = function() {
    return false;
  }
  /** v(RegEx) ::= false */
  RegEx.prototype.isNullable = function() {
    return false;
  }
  /** m(RegEx) ::= false */
  RegEx.prototype.isIndifferent = function() {
    return false;
  }
  /** m*(RegEx) ::= false */
  RegEx.prototype.isUniversal =  function() {
    return false;
  }
  //////////////////////////////////////////////////
  /** r(RegEx) ::= RegEx ~ name */
  RegEx.prototype.isReadable = function(name) {
    return (new RegExp(this.regex)).test(name);
  }
  /** w(RegEx) ::= RegEx ~ name */
  RegEx.prototype.isWriteable =  function(name) {
    return (new RegExp(this.regex)).test(name);
  }
  //////////////////////////////////////////////////
  /** first(RegEx) ::= RegEx */
  RegEx.prototype.first = function() {
    return new Array(this);
  }
  /** (d_name RegEx) ::= ^ if RegEx ~ name, {} otherwise */
  RegEx.prototype.derive = function(name) {
    return (new RegExp(this.regex)).test(name) ? new Null() : new Empty();
  }
  /** (d_literal RegEx) ::= RegEx if literal==^, ^ if literal==RegEx,  ^,{} if liteal==?, {} oterhwise */
  RegEx.prototype.lderive = function(larg) {
    if(larg==this) return new Null(); //TODO
    if(larg==new Null()) return Empty();
    //	   else if(larg==new Alphabet()) return new Null(); // TODO 
    //  else if (larg==new Null()) return this;
    else if(larg==new At()) return new Null(); // TODO
    else return new Empty();
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  RegEx.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;

    if(arg.isNullable()) return false;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  RegEx.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce RegEx ::= RegEx */
  RegEx.prototype.reduce =  function() {
    /** reduce RegEx ::= RegEx */
    return this;
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  RegEx.prototype.dump = function() {
    return " [/" + this.regex + "/] ";
  }
  /** To String
   * @return string
   */
  RegEx.prototype.toString = function() {
    return "/" + this.regex + "/"; 
  }




  //////////////////////////////////////////////////
  // QUANTIFIABLE
  //////////////////////////////////////////////////

  /**
   * C? Contract (optional)
   */
  function Option(contract) {
    if(!(this instanceof Option)) return __cache.c(new Option(contract));
    else __AccessContract.call(this);

    // NORMALIZATION
    /** {}? ~ ^ */
    if(contract==new Empty()) return new Null();
    /** ^? ~ ^ */
    else if(contract==new Null()) return new Null();
    /** @? ~ ^ */
    else if(contract==new At()) return new Null();

    this.contract = contract;
  }
  // TODO
  Option.prototype = Object.create(__AccessContract.prototype);

  /** n(C?) ::= false */
  Option.prototype.isEmpty = function() {
    return false;
  }
  /** w(C?) ::= w(C) */
  Option.prototype.isBlank = function() {
    return this.contract.isBlank();
  }
  /** v(C?) :== true */
  Option.prototype.isNullable = function() {
    return true;
  }
  /** m(C?) ::= m(C) */
  Option.prototype.isIndifferent = function() {
    return this.contract.isIndifferent();
  }
  /** m*(C?) ::= m*(C) */
  Option.prototype.isUniversal =  function() {
    return this.contract.isUniversal();
  }
  //////////////////////////////////////////////////
  /** r(C?) ::= r(C) */
  Option.prototype.isReadable = function(name) {
    return this.contract.isReadable(name);
  }
  /** w(C?) ::= w(C) */
  Option.prototype.isWriteable =  function(name) {
    return this.contract.isWriteable(name);
  }
  //////////////////////////////////////////////////
  /** first(C?) ::= first(C) */
  Option.prototype.first = function() {
    return this.contract.first();//.concat(new Array(new Null()));
  }
  /** (d_name C?) ::= (d_name C) */
  Option.prototype.derive = function(name) {
    return this.contract.derive(name);
  }
  /** (d_literal C?) ::= (d_literal C)? */
  Option.prototype.lderive = function(larg) {
    /** (d_^ C?) ::= C? */
    //if (larg==new Null()) return this;
    if(larg==new Null()) return Null();
    else return this.contract.lderive(larg);
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Option.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //							   else if((arg==new Null())) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //							   else if(this.isUniversal()) return true;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Option.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce C?  */
  Option.prototype.reduce =  function() {
    /** C? ~ ^ | n(C) */
    if(this.contract.isEmpty()) return new Null();
    /** C? ~ ^ | w(C) */
    else if(this.contract.isBlank()) return new Null();
    /** reduce C? ::= (reduce C)? */
    else return new Option(this.contract.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Option.prototype.dump = function() {
    return this.contract.dump() + "? ";
  }
  /** To String
   * @return string
   */
  Option.prototype.toString = function() {
    return this.contract.toString() + "?";
  }


  /**
   * C* Contract (kleene star)
   */
  function Star(contract) {
    if(!(this instanceof Star)) return __cache.c(new Star(contract));
    else __AccessContract.call(this);

    // NORMALIZATION
    /** ^* ~ ^ */
    if(contract==new Null()) return new Null();
    /** ^* ~ ^ */
    else if(contract==new Null()) return new Null();
    /** @* ~ ^ */
    else if(contract==new At()) return new Null();

    this.contract = contract;

  }
  Star.prototype = Object.create(__AccessContract.prototype);


  /** n(C*) ::= false */
  Star.prototype.isEmpty = function() {
    return false;
  }
  /** w(C*) ::= w(C) */
  Star.prototype.isBlank = function() {
    return this.contract.isBlank();
  }
  /** v(C*) :== true */
  Star.prototype.isNullable = function() {
    return true;
  }
  /** m(C*) ::= m(C) */
  Star.prototype.isIndifferent = function() {
    return  this.contract.isIndifferent();
  }
  /** m*(C*) ::= m*(C) + m() */
  Star.prototype.isUniversal =  function() {
    return (this.contract.isIndifferent() ||  this.contract.isUniversal());
  }
  //////////////////////////////////////////////////
  /** r(C*) ::= r(C) */
  Star.prototype.isReadable = function(name) {
    return this.contract.isReadable(name);
  }
  /** w(C*) ::= w(C) */
  Star.prototype.isWriteable =  function(name) {
    return this.contract.isWriteable(name);
  }
  //////////////////////////////////////////////////
  /** first(C*) ::= first(C) */
  Star.prototype.first = function() {
    return this.contract.first();//.concat(new Array(new Null()));
  }
  /** (d_name C*) ::= (d_name C).C* */
  Star.prototype.derive = function(name) {
    return new Concat(this.contract.derive(name), this);
  }
  /** (d_literal C*) ::= (d_literal C).C* */
  Star.prototype.lderive = function(larg) {
    /** (d_^ C*) ::= C* */
    //							   if (larg==new Null()) return this;
    if(larg==new Null()) return Null();

    else return new Concat(this.contract.lderive(larg), new Star(this.contract));
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Star.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //							   else if((arg==new Null())) return true;
    /** C <= C' |= true  | n(C) */
    //							   else if(arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //							   else if(this.isUniversal()) return true;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Star.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce C* */
  Star.prototype.reduce =  function() {
    /** C* ~ ^ | n(C) */
    if(this.contract.isEmpty()) return new Null();
    /** C* ~ ^ | w(C) */
    else if(this.contract.isBlank()) return new Null();
    /** reduce C* ::= (reduce C)* */
    else return new Star(this.contract.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Star.prototype.dump = function() {
    return this.contract.dump() + "* ";
  }
  /** To String
   * @return string
   */
  Star.prototype.toString = function() {
    return this.contract.toString() + "*";
  }


  //////////////////////////////////////////////////
  // SETS
  //////////////////////////////////////////////////

  /**
   * C0+C1 Contract (logical or)
   */
  function Or(contract0, contract1) {
    if(!(this instanceof Or)) return __cache.c(new Or(contract0, contract1));
    else __AccessContract.call(this);

    // NORMALIZATION
    /** (C+C) ~ C */
    if(contract0==contract1) return contract0;
    /** ({}+C) ~ C */
    else if(contract0==new Empty()) return contract1;
    else if(contract1==new Empty()) return contract0;
    /** (@+C) ~ C */
    else if(contract0==new At()) return contract1;
    else if(contract1==new At()) return contract0;

    this.contract0 = contract0;
    this.contract1 = contract1;
  }
  Or.prototype = Object.create(__AccessContract.prototype);

  /** n(C0+C1) ::= n(C0) & n(C1) */
  Or.prototype.isEmpty = function() {
    return this.contract0.isEmpty() && this.contract1.isEmpty();
  }
  /** w(C0+C1) ::= w(C0) & w(C1) */
  Or.prototype.isBlank = function() {
    return this.contract0.isBlank() && this.contract1.isBlank();
  }
  /** v(C0+C1) :== v(C0) + v(C1) */
  Or.prototype.isNullable = function() {
    return (this.contract0.isNullable() || this.contract1.isNullable());
  }
  /** m(C0+C1) ::= m(C0) + m(C1) */
  Or.prototype.isIndifferent = function() {
    return  (this.contract0.isIndifferent() ||  this.contract1.isIndifferent());
  }
  /** m*(C0+C1) ::= m*(C0) + m*(C1) */
  Or.prototype.isUniversal =  function() {
    return (this.contract0.isUniversal() || this.contract1.isUniversal());
  }
  //////////////////////////////////////////////////
  /** r(C0+C1) :== r(C0) + r(C1) */
  Or.prototype.isReadable = function(name) {
    return (this.contract0.isReadable(name) || this.contract1.isReadable(name));
  }
  /** w(C0+C1) :== w(C0) + w(C1) */
  Or.prototype.isWriteable =  function(name) {
    return (this.contract0.isWriteable(name) || this.contract1.isWriteable(name));
  }
  //////////////////////////////////////////////////
  /** first(C0+C1) ::= first(C0) + first(C1) */
  Or.prototype.first = function() {
    return this.contract0.first().concat(this.contract1.first());
  }
  /** (d_name C0+C1) :== (d_name C0) + (d_name C1) */
  Or.prototype.derive = function(name) {
    return new Or(this.contract0.derive(name), this.contract1.derive(name));
  }
  /** (d_literal C0+C1) ::= (d_literal C0) + (d_literal C1) */
  Or.prototype.lderive = function(larg) {
    /** (d_^ C?) ::= C? */
    /*if (larg==new Null()) return this;
      else*/ return new Or(this.contract0.lderive(larg), this.contract1.lderive(larg))
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Or.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //			   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //			   else if((arg==new Null()) && this.isNullable()) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    //			   else
    if(arg.isNullable() && !this.isNullable()) return false;
    /** C <= C' |= true  | n(C) */
    //			   else if(arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //			   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //			   else if(this.isUniversal()) return true;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Or.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce C+C' */
  Or.prototype.reduce =  function() {
    /** (C+C') ~ {} | n(C)&n(C') */
    if(this.contract0.isEmpty()&&this.contract1.isEmpty()) return new Empty();
    /** (C+C') ~ {} | w(C)&w(C') */
    else if(this.contract0.isBlank()&&this.contract1.isBlank()) return new At();
    /** (C+C') ~ C/C' | n(C)/n(C') */
    else if(this.contract0.isEmpty()) return this.contract1;
    else if(this.contract1.isEmpty()) return this.contract0;
    /** (C+C') ~ C/C' | w(C)/w(C') */
    else if(this.contract0.isBlank()) return this.contract1;
    else if(this.contract1.isBlank()) return this.contract0;
    /** (C+C') ~ C | C >= C' */
    else if(this.contract0.isSupSetOf(this.contract1, new __CcContext())) return this.contract0;
    /** (C+C') ~ C' | C <= C' */
    else if(this.contract1.isSupSetOf(this.contract0, new __CcContext())) return this.contract1;
    /** reduce C+C' ::= (reduce C)+(reduce C') */
    else return new Or(this.contract0.reduce(), this.contract1.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Or.prototype.dump = function() {
    return " (" + this.contract0.dump() + " + " +  this.contract1.dump() +  ") ";
  }
  /** To String
   * @return string
   */
  Or.prototype.toString = function() {
    return "(" + this.contract0.toString() + "+" + this.contract1.toString() + ")";
  }


  /**
   * C0&C1 Contract (logical and)
   */
  function And(contract0, contract1) {
    if(!(this instanceof And)) return __cache.c(new And(contract0, contract1));
    else __AccessContract.call(this);

    // NORMALIZATION
    /** (C&C) ~ C */
    if(contract0==contract1) return contract0;
    /** ({}&C) ~ {} */
    else if(contract0==new Empty()) return new Empty();
    else if(contract1==new Empty()) return new Empty();
    /** (@&C) ~ @ */
    else if(contract0==new At()) return new At();
    else if(contract1==new At()) return new At();

    this.contract0 = contract0;
    this.contract1 = contract1;
  }
  And.prototype = Object.create(__AccessContract.prototype);

  /** n(C0&C1) ::= n(C0) + n(C1) */
  And.prototype.isEmpty = function() {
    return this.contract0.isEmpty() || this.contract1.isEmpty();
  }
  /** w(C0&C1) ::= w(C0) + w(C1) */
  And.prototype.isBlank = function() {
    return this.contract0.isBlank() || this.contract1.isBlank();
  }
  /** v(C0&C1) :== v(C0) & v(C1) */
  And.prototype.isNullable = function() {
    return (this.contract0.isNullable() && this.contract1.isNullable());
  }
  /** m(C0&C1) ::= m(C0) & m(C1) */
  And.prototype.isIndifferent = function() {
    return (this.contract0.isIndifferent() && this.contract1.isIndifferent());
  }
  /** m*(C0&C1) ::= m*(C0) & m*(C1) */
  And.prototype.isUniversal =  function() {
    return (this.contract0.isUniversal() && this.contract1.isUniversal());
  }
  //////////////////////////////////////////////////
  /** r(C0&C1) :== r(C0) & r(C1) */
  And.prototype.isReadable = function(name) {
    return (this.contract0.isReadable(name) && this.contract1.isReadable(name));
  }
  /** w(C0&C1) :== w(C0) & w(C1) */
  And.prototype.isWriteable =  function(name) {
    return (this.contract0.isWriteable(name) && this.contract1.isWriteable(name));
  }
  //////////////////////////////////////////////////
  /** first(C0&C1) ::= first(C0) & first(C1) */
  And.prototype.first = function() {

    return this.contract0.first().concat(this.contract1.first());

    // var result = new Array();
    // arr0 = this.contract0.first();
    // arr1 = this.contract1.first();
    // arr0.foreach(function(k0, v0) {
    //		   arr1.foreach(function(k1, v1) {
    //				   if(v0==v1)
    //				   result.push(v0);
    //		   });
    // });
    //   return result;
  }
  /** (d_name C0&C1) :== (d_name C0) & (d_name C1) */
  And.prototype.derive = function(name) {
    return new And(this.contract0.derive(name), this.contract1.derive(name));
  }
  /** (d_literal C0&C1) ::= (d_literal C0) & (d_literal C1) */
  And.prototype.lderive = function(larg) {
    /** (d_^ C?) ::= C? */
    /*if (larg==new Null()) return this;
      else*/ return new And(this.contract0.lderive(larg), this.contract1.lderive(larg))
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  And.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //							   else if((arg==new Null()) && this.isNullable()) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    //							   else
    if(arg.isNullable() && !this.isNullable()) return false;
    /** C <= C' |= true  | n(C) */
    //							   else if (arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //							   else if(this.isUniversal()) return true;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  And.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce C&C' */
  And.prototype.reduce =  function() {
    /** (C&C') ~ C/C' | n(C)/n(C') */
    if(this.contract0.isEmpty()) return new Empty();
    else if(this.contract1.isEmpty()) return new Empty();
    /** (C&C') ~ C/C' | w(C)/w(C') */
    else if(this.contract0.isBlank()) return new At();
    else if(this.contract1.isBlank()) return new At();
    /** (C&C') ~ C' | C >= C' */
    else if(this.contract0.isSubSetOf(this.contract1, new __CcContext())) return this.contract0;
    /** (C&C') ~ C | C <= C' */
    else if(this.contract1.isSubSetOf(this.contract0, new __CcContext())) return this.contract1;
    /** reduce C&C' ::= (reduce C)&(reduce C') */
    else return new And(this.contract0.reduce(), this.contract1.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  And.prototype.dump = function() {
    return " (" + this.contract0.dump() + " & " +  this.contract1.dump() +  ") ";
  }
  /** To String
   * @return string
   */
  And.prototype.toString = function() {
    return "(" + this.contract0.toString() + "&" + this.contract1.toString() + ")";
  }


  /**
   * !C Contract (negation)
   */
  function Neg(contract) {
    if(!(this instanceof Neg)) return __cache.c(new Neg(contract));
    else __AccessContract.call(this);

    this.contract = contract;
  }
  Neg.prototype = Object.create(__AccessContract.prototype);

  /** n(!C) ::= m(C) + m*(C) */
  Neg.prototype.isEmpty = function() {
    // negation only effects to literals
    //return (this.contract.isUniversal() || this.contract.isIndifferent());
    return false;
  }
  /** w(!C) ::= m*(C) */
  Neg.prototype.isBlank = function() {
    // negation only effects to literals
    return (this.contract.isUniversal() || this.contract.isIndifferent());
  }
  /** v(!C) ::= false if v(C), false otherwise */
  Neg.prototype.isNullable = function() {
    return this.contract.isNullable() ? false : true;
  }
  /** m(!C) ::= v(C) + n(C) */
  Neg.prototype.isIndifferent = function() {
    return (this.contract.isNullable() || this.contract.isEmpty());
  }
  /** m*(!C) ::= n(C) + w(c) */
  Neg.prototype.isUniversal =  function() {
    return (this.contract.isEmpty() || this.contract.isBlank());
  }
  //////////////////////////////////////////////////
  /** r(!C) ::= false if r(C), false otherwise */
  Neg.prototype.isReadable = function(name) {
    return this.contract.isReadable(name) ? false : true;
  }
  /** w(!C) ::= false if w(C), false otherwise */
  Neg.prototype.isWriteable =  function(name) {
    return this.contract.isWriteable(name) ? false : true;
  }
  //////////////////////////////////////////////////
  /** first(!C) ::= first(C) */
  Neg.prototype.first = function() {
    //  return new Array(new Alphabet()); // TODO
    return new Array(new Alphabet()).concat(this.contract.first()); // TODO
    //   return this.contract.first();
  }
  /** (d_name !C) :== !(d_name C) */
  Neg.prototype.derive = function(name) {
    return new Neg(this.contract.derive(name));
  }
  /** (d_literal !C) ::= !(b_literal C) */
  Neg.prototype.lderive = function(larg) {
    /** (d_^ C?) ::= C? */
    /*if (larg==new Null()) return this;



    // else*/

    // TODO
    //			   if(larg==new Alphabet()) return new Null();
    //			   if(larg==this.contract) return new Empty();
    //			   else return new Null();




    // TODO
    if(larg==new Alphabet()) return new Neg(Null()); 
    return new Neg(this.contract.lderive(larg));
    //	   // TODO
    //	   if(arg=this.contract) return false;
    //	   else return true;
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Neg.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //			   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //			   else if((arg==new Null()) && this.isNullable()) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    //			   else
    if(arg.isNullable() && !this.isNullable()) return false;
    /** C <= C' |= true  | n(C) */
    //			   else if(arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //			   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //			   else if(this.isUniversal()) return true;
    /** C <= C' |= false  | m(C) and !m(C') */

    /** C <= C' |= true  | ctx(C <= C') */
    var ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, this.contract.first(), ctx.bind(ccExp)) && unfold(this, arg, arg.first(), ctx.bind(ccExp));

  }
  /** ctx |- C >= this */
  Neg.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce !C */
  Neg.prototype.reduce =  function() {
    /** !(C) ~ @ | m*(C) */
    if(this.contract.isUniversal()) return  new At();
    /** SPECIAL: !(C) ~ @ | m(C) */
    else if(this.contract.isIndifferent()) return  new At();
    /** SPECIAL: !(^) ~ ? | m(C) */
    else if(this.contract==new Null()) return  new Alphabet();
    /** reduce !(C) ::= !(reduce C) */
    else return new Neg(this.contract.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Neg.prototype.dump = function() {
    return " !(" + this.contract.dump() +  ") ";
  }
  /** To String
   * @return string
   */
  Neg.prototype.toString = function() {
    return "!(" + this.contract.toString() + ")" ;
  }



  //////////////////////////////////////////////////
  // CONTRACT
  //////////////////////////////////////////////////


  /**
   * C.C Contract (concatenation)
   */
  function Concat(contract0, contract1) {
    if(!(this instanceof Concat)) return __cache.c(new Concat(contract0, contract1));
    else __AccessContract.call(this);

    // NORMALIZATION
    /** (^.C) ~ C */
    if(contract0 == new Null()) return contract1;
    /** ({}.C) ~ C */
    if(contract0 == new Empty()) return new Empty();
    /** (@.C) ~ C */
    if(contract0 == new At()) return new At();

    this.contract0 = contract0;
    this.contract1 = contract1;
  }
  Concat.prototype = Object.create(__AccessContract.prototype);

  /** n(C0.C1) ::= n(C0) */
  Concat.prototype.isEmpty = function() {
    return this.contract0.isEmpty() || this.contract1.isEmpty();
  }
  /** w(C0.C1) ::= w(C0) & w(C1) */
  Concat.prototype.isBlank = function() {
    return this.contract0.isBlank();
  }
  /** v(C0.C1) :== v(C0) & v(C1) */
  Concat.prototype.isNullable = function() {
    return (this.contract0.isNullable() && this.contract1.isNullable());
  }
  /** m(C0.C1) ::= false */
  Concat.prototype.isIndifferent = function() {
    if(this.contract0.isNullable()) return this.contract1.isIndifferent();
    else return this.contract0.isIndifferent();
  }
  /** m*(C0.C1) ::= false */
  Concat.prototype.isUniversal =  function() {
    return (this.contract0.isUniversal() && this.contract1.isNullable())
      || (this.contract1.isUniversal() && this.contract0.isNullable())
      || (this.contract0.isUniversal() && this.contract1.isUniversal());
  }
  //////////////////////////////////////////////////
  /** r(C0.C1) :== r(C0)+r(C1) if v(C0), r(C0) otherwise */
  Concat.prototype.isReadable = function(name) {
    if(this.contract0.isNullable()) return (this.contract0.isReadable(name) || this.contract1.isReadable(name))
    else return this.contract0.isReadable(name);
  }
  /** r(C0.C1) :== w(C1) if v(C0), w(C0) if v(C1,) false otherwise */
  Concat.prototype.isWriteable =  function(name) {
    if(this.contract0.isNullable()) return this.contract1.isWriteable(name);
    else if(this.contract1.isNullable()) return this.contract0.isWriteable(name);
    else return false;
  }
  //////////////////////////////////////////////////
  /** first(C0.C1) ::= first(C1) if v(C0), first(C0) otherwise */
  Concat.prototype.first = function() {
    if(this.contract0.isNullable()) return  this.contract0.first().concat(this.contract1.first());
    else return this.contract0.first();
  }
  /** (d_name C0.C1) :== (d_name C0).C1 + (d_name C1) if v(C0), (d_name C0).c1 otherwise */
  Concat.prototype.derive = function(name) {
    if(this.contract0.isNullable()) return new Or(Concat(this.contract0.derive(name), this.contract1), this.contract1.derive(name));
    else return new Concat(this.contract0.derive(name), this.contract1);
  }
  /** (d_literal C0.C1) ::= (d_literal C0).C1 + (d_literal C1) if v(C0), (d_literal C0).c1 otherwise */
  Concat.prototype.lderive = function(larg) {
    /** (d_^ C?) ::= C? */
    /*if (larg==new Null()) return this;
      else*/ if(this.contract0.isNullable()) return new new Or(new Concat(this.contract0.lderive(larg), this.contract1), this.contract1.lderive(larg));
    else return new Concat(this.contract0.lderive(larg), this.contract1);
  }
  //////////////////////////////////////////////////
  /** ctx |- C <= this */
  Concat.prototype.isSupSetOf = function(arg, ctx) {
    /** C <= C' |= true  | C=C' */
    //							   if(arg==this) return true;
    /** ^ <= C' |= true  | v(C') */
    //							   else if((arg==new Null()) && this.isNullable()) return true;
    /** C <= C' |= false  | v(C) and ~v(C') */
    //							   else
    if(arg.isNullable() && !this.isNullable()) return false;
    /** C <= C' |= true  | n(C) */
    //							   else if(arg.isEmpty()) return true;
    /** C <= C' |= true  | w(C) & !n(C') */
    //							   else if(arg.isBlank()) return true;
    /** C <= C' |= true  | m(C') */
    //							   else if(this.isUniversal()) return true;

    /** C <= C' |= true  | ctx(C <= C') */
    ccExp = new __CcExp(arg, this);
    if(ctx.contains(ccExp)) return true;
    /** otherwise */
    else return unfold(this, arg, arg.first(), ctx.bind(ccExp));
  }
  /** ctx |- C >= this */
  Concat.prototype.isSubSetOf = function(arg, ctx) {
    return arg.isSupSetOf(this, ctx);
  }
  //////////////////////////////////////////////////
  /** reduce C.C' */
  Concat.prototype.reduce =  function() {
    /** (C.C') ~ {} | n(C) */
    if(this.contract0.isEmpty()) return new Empty();
    /** (C.C') ~ {} | w(C) */
    else if(this.contract0.isBlank()) return new At();
    /** reduce C.C' ::= (reduce C).(reduce C') */
    else return new Concat(this.contract0.reduce(), this.contract1.reduce());
  }
  //////////////////////////////////////////////////
  /** Dump
   * @return string
   */
  Concat.prototype.dump = function() {
    return  " " + this.contract0.dump() + " . " +  this.contract1.dump() +  " ";
  }
  /** To String
   * @return string
   */
  Concat.prototype.toString = function() {
    return this.contract0.toString() + "." + this.contract1.toString();
  }
















  //////////////////////////////////////////////////
  // APC . Contract
  //////////////////////////////////////////////////
  APC.Contract = {};

  APC.Contract.Empty          = Empty;
  APC.Contract.Null       		= Null;

  APC.Contract.At     			  = At;
  APC.Contract.Alphabet   		= Alphabet;
  APC.Contract.Name       		= Name;
  APC.Contract.RegEx      		= RegEx;

  APC.Contract.Option	        = Option;
  APC.Contract.Star		        = Star;
  APC.Contract.Or			        = Or;
  APC.Contract.And		        = And;
  APC.Contract.Neg		        = Neg;
  APC.Contract.Concat   	    = Concat;



  //////////////////////////////////////////////////
  //  CONTAINMENT CALCULUS
  //  context and expressions
  //////////////////////////////////////////////////


  /** UNFOLD
   * @param
   * E >= F ::= lderive_{c \in firstc(E)} (E>=F)
   * {e>=f | e \in lderive_{c}(E), e \in lderive_{c}(F)}
   * @param E super-contract
   * @param F sub-contract
   * @param first set of first literals
   * @param ctx containment context 
   * @return true|false
   */
  function unfold(E, F, first, ctx) {

    // TODO
    first = E.first().concat(F.first());
    E = E.reduce();
    F = F.reduce();

    // verbose - true, print output: false, do not print the output
    var verbose  = true;
    if(verbose) __sysout("## isSupSetOf: " + E + ">=" + F);
    if(verbose) __sysout("## first : " + first);

    var result = true;

    first.foreach(function(k, literal) {

      var lderive_E = E.lderive(literal);
      var lderive_F = F.lderive(literal);

      if(verbose) __sysout("## derive : " + literal);
      if(verbose) __sysout("## lderive_E: " + lderive_E);
      if(verbose) __sysout("## lderive_F: " + lderive_F);

      result = result && lderive_E.isSupSetOf(lderive_F, ctx);

      if(verbose) __sysout("## result: " + result);
      if(verbose) __sysout("\n");

      if(!result) return result; // break
    });
    return result;
  }



  /** Containment Calculus
   * Expression: C0 <= C1
   */
  function __CcExp(contract0, contract1) {
  }
  __CcExp.prototype = {
    /** To String
     * @return string
     */
    toString: function() {
      return contract0.toString() + "<=" + contract1.toString();
    }
  }


  /** Containment Calculus
   * Context: {} | <Context, Expression>
   */
  function __CcContext() {	
    // cache array
    this.context = new StringMap();

    this.key = function(v) {
      return ("\"" + v + "\"");		
    }
  }
  __CcContext.prototype = {

    /* bind function
     * @param CC Expression
     * @return <CC Context, CC Expression>
     */
    bind: function(ccExp) {
      // clone context
      var newCtx = new __CcContext();
      this.context.foreach(function(k, v) {
        newCtx.put(v);
      });
      // bind new CC Expression
      if(!newCtx.contains(ccExp)) {
        newCtx.put(ccExp);
      }
      return newCtx;
    },

    /* put
     * @param ccExp CC Expression
     * $return CC Expression
     */
    put: function(ccExp) {
      this.context.set(ccExp.toString(), ccExp);
      return ccExp;
    },

    /* get
     * @param ccExp CC Expression
     * $return CC Expression
     */
    get: function(ccExp) {
      return this.context.get(ccExp.toString());
    },

    /* contains
     * @param ccExp CC Expression
     * $return true, if ccExp in cache, false otherwise
     */
    contains: function(ccExp) {
      return this.context.has(ccExp.toString());
    }
  }




  //////////////////////////////////////////////////
  // APC . Contract
  //////////////////////////////////////////////////
  APC.Contract.Containment = {};
  APC.Contract.Containment.Expression = __CcExp;
  APC.Contract.Containment.Context = __CcContext;





  //////////////////////////////////////////////////
  //  CONTRACT CACHE
  //  cache for access permission contracts
  //////////////////////////////////////////////////

  /** Path Cache 
  */
  function __ContractCache() {
    // cache array
    this.cache = new StringMap();
  }
  __ContractCache.prototype = {

    /* cache function
     * @param contract access permission contract
     * @return access permission contract
     */
    c: function(contract) {
      if(this.contains(contract.toString())) {
        return this.get(contract.toString());
      } else {
        return this.put(contract.toString(), contract);
      }
    },

    /* put
     * @param key cache key
     * @param value cahe value
     * $return value
     */
    put: function(key, value) {
      this.cache.set(key, value);
      return value;
    },

    /* get
     * @param key cache key
     * $return value
     */
    get: function(key) {
      return this.cache.get(key);
    },

    /* contains
     * @param key cache key
     * $return true, if key in cache, false otherwise
     */
    contains: function(key) {
      return this.cache.has(key);
    },

    /* clear cache
    */
    clear: function() {
      this.cache = new StringMap();
    }
  }


  // current path cache
  var __cache = new __ContractCache();



  //////////////////////////////////////////////////
  // APC . Contract
  //////////////////////////////////////////////////
  APC.Contract.Cache = __cache;



})(__APC);

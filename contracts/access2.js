var AccessContract = Contract.Constructor (function ctor (str, Object, Error, undefined, print) {

  var StringMap = (function() {

    var create = Object.create;
    var freeze = Object.freeze;
    function constFunc(func) {
      func.prototype = null;
      return freeze(func);
    }

    function keyEscape(key) {
      if ('string' !== typeof(key)) {
        throw new TypeError('Not a string: ' + key);
      }
      return ('#' + key);
    }

    function keyUnescape(key) {
      if ('string' !== typeof(key)) {
        throw new TypeError('Not a string: ' + key);
      }
      return (key.substring(1));
    }	

    return function StringMap() {

      var objAsMap = create(null);

      return freeze({
        get: constFunc(function(key) {
          return objAsMap[keyEscape(key)];
        }),
          set: constFunc(function(key, value) {
            objAsMap[keyEscape(key)] = value;
          }),
          has: constFunc(function(key) {
            return (keyEscape(key)) in objAsMap;
          }),
          foreach: constFunc(function(callback) {
            for(var key in objAsMap) callback(keyUnescape(key), objAsMap[key])
          }),
          'delete': constFunc(function(key) {
            return delete objAsMap[keyEscape(key)];
          })
      });
    };

  })();

  var APC = {};






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

    //////////////////////////////////////////////////
    // LITERALE
    //////////////////////////////////////////////////

    /**
     * {} Literal (empty set)
     */
    function __EmptyLiteral() {
      if(!(this instanceof __EmptyLiteral)) return __cache.c(new __EmptyLiteral());
      else __AccessContract.call(this);
    }
    __EmptyLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n({}) ::= true */
    __EmptyLiteral.prototype.isEmpty = function() {
      return true;
    }
    /** w({}) ::= false */
    __EmptyLiteral.prototype.isBlank = function() {
      return false;
    }
    /** v({}) ::= false */
    __EmptyLiteral.prototype.isNullable = function() {
      return false;
    }
    /** m({}) ::= false */
    __EmptyLiteral.prototype.isIndifferent = function() {
      return false;
    }
    /** m*({}) ::= false */
    __EmptyLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r({}) ::= false */
    __EmptyLiteral.prototype.isReadable = function(name) {
      return false;
    }
    /** w({}) ::= false */
    __EmptyLiteral.prototype.isWriteable =  function(name) {
      return false;
    }
    //////////////////////////////////////////////////
    /** first({}) ::= {} */
    __EmptyLiteral.prototype.first = function() {
      // return new Array(this);
      // CHANGED, no need of returning this
      // EmptySet can be moved to contract! 
      return new Array();
    }
    /** (d_name {}) ::= {} */
    __EmptyLiteral.prototype.derive = function(name) {
      return new __EmptyLiteral();
    }
    /** (d_literal {}) ::= {} */
    __EmptyLiteral.prototype.lderive = function(larg) {
      return this;
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __EmptyLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __EmptyLiteral.prototype.isSubSetOf = function(arg, ctx) {
      /** C <= C' |= true  | n(C) */
      // return true;
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce {} */
    __EmptyLiteral.prototype.reduce =  function() {
      /** reduce {} ::= {} */
      return this;
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __EmptyLiteral.prototype.dump = function() {
      return " [{}] ";
    }
    /** To String
     * @return string
     */
    __EmptyLiteral.prototype.toString = function() {
      return "{}"; 
    }

    /**
     * ^ Literal (empty literal)
     */
    function __NullLiteral() {
      if(!(this instanceof __NullLiteral)) return __cache.c(new __NullLiteral());
      else __AccessContract.call(this);

    }
    __NullLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n(^) ::= false */
    __NullLiteral.prototype.isEmpty = function() {
      return false;
    }
    /** w(^) ::= false */
    __NullLiteral.prototype.isBlank = function() {
      return false;
    }
    /** v(^) ::= true */
    __NullLiteral.prototype.isNullable = function() {
      return true;
    }
    /** m(^) ::= false */
    __NullLiteral.prototype.isIndifferent = function() {
      return false;
    }
    /** m*(^) ::= false */
    __NullLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r(^) ::= false */
    __NullLiteral.prototype.isReadable = function(name) {
      return false;
    }
    /** w(^) ::= false */
    __NullLiteral.prototype.isWriteable =  function(name) {
      return false;
    }
    //////////////////////////////////////////////////
    /** first(^) ::= ^ */
    __NullLiteral.prototype.first = function() {
      return new Array(this);
    }
    /** (d_name ^) ::= {} */
    __NullLiteral.prototype.derive = function(name) {
      return new __EmptyLiteral();
    }
    /** (d_literal ^) ::= ^ if literal == ^, @ oterhwise */
    __NullLiteral.prototype.lderive = function(larg) {
      //if(larg==new __AtLiteral()) return new __NullLiteral(); // TODO
      //else return (larg==this) ? this : new __EmptyLiteral();

      //return new __EmptyLiteral();

      return (larg==this) ? this : new __EmptyLiteral();


    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __NullLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __NullLiteral.prototype.isSubSetOf = function(arg, ctx) {
      /** C <= C' |= true  | n(C') */
      if(arg.isNullable()) return true;
      /** C <= C' |= false  | v(C) and ~v(C') */
      else return false;
    }
    //////////////////////////////////////////////////
    /** reduce ^ */
    __NullLiteral.prototype.reduce =  function() {
      /** reduce ^ ::= ^ */
      return this;
      //return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __NullLiteral.prototype.dump = function() {
      return " [] ";
    }
    /** To String
     * @return string
     */
    __NullLiteral.prototype.toString = function() {
      return "^"; 
    }

    /**
     * @ Literal (null)
     */
    function __AtLiteral() {
      if(!(this instanceof __AtLiteral)) return __cache.c(new __AtLiteral());
      else __AccessContract.call(this);

    }
    __AtLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n(@) ::= true */
    __AtLiteral.prototype.isEmpty = function() {
      return false;
    }
    /** w(@) ::= true */
    __AtLiteral.prototype.isBlank = function() {
      return true;
    }
    /** v(@) ::= false */
    __AtLiteral.prototype.isNullable = function() {
      return false;
    }
    /** m(@) ::= false */
    __AtLiteral.prototype.isIndifferent = function() {
      return false;
    }
    /** m*(@) ::= false */
    __AtLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r(@) ::= false */
    __AtLiteral.prototype.isReadable = function(name) {
      return false;
    }
    /** w(@) ::= false */
    __AtLiteral.prototype.isWriteable =  function(name) {
      return false;
    }
    //////////////////////////////////////////////////
    /** first(@) ::= @ */
    __AtLiteral.prototype.first = function() {
      return new Array(this);
    }
    /** (d_name @) ::= @ */
    __AtLiteral.prototype.derive = function(name) {
      return new __EmptyLiteral();
    }
    /** (d_literal @) ::= @ */
    __AtLiteral.prototype.lderive = function(larg) {
      // if(larg==new __NullLiteral()) return this;
      if(larg==new __NullLiteral()) return __EmptyLiteral();
      else if(larg==this) return new __NullLiteral();
      else return new __EmptyLiteral();
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __AtLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __AtLiteral.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce @ */
    __AtLiteral.prototype.reduce =  function() {
      /** reduce @ ::= @ */
      return this;
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __AtLiteral.prototype.dump = function() {
      return " [@] ";
    }
    /** To String
     * @return string
     */
    __AtLiteral.prototype.toString = function() {
      return "@"; 
    }


    /**
     * ? Literal (universe)
     */
    function __QMarkLiteral() {
      if(!(this instanceof __QMarkLiteral)) return __cache.c(new __QMarkLiteral());
      else __AccessContract.call(this);

    }
    __QMarkLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n(?) ::= false */
    __QMarkLiteral.prototype.isEmpty = function() {
      return false;
    }
    /** w(?) ::= false */
    __QMarkLiteral.prototype.isBlank = function() {
      return false;
    }
    /** v(?) ::= false */
    __QMarkLiteral.prototype.isNullable = function() {
      return false;
    }
    /** m(?) ::= false */
    __QMarkLiteral.prototype.isIndifferent = function() {
      return true;
    }
    /** m*(?) ::= false */
    __QMarkLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r(?) ::= true */
    __QMarkLiteral.prototype.isReadable = function(name) {
      return true;
    }
    /** w(?) ::= true */
    __QMarkLiteral.prototype.isWriteable =  function(name) {
      return true;
    }
    //////////////////////////////////////////////////
    /** first(?) ::= ? */
    __QMarkLiteral.prototype.first = function() {
      return new Array(this);
    }
    /** (d_name ?) ::= ^ */
    __QMarkLiteral.prototype.derive = function(name) {
      return new __NullLiteral();
    }
    /** (d_literal ?) ::= ? if literal=^, ^ otherwise */
    __QMarkLiteral.prototype.lderive = function(larg) {
      // if (larg==new __NullLiteral()) return this;
      if(larg==new __NullLiteral()) return __EmptyLiteral();
      else return new __NullLiteral();
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __QMarkLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __QMarkLiteral.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce ? ::= ? */
    __QMarkLiteral.prototype.reduce =  function() {
      /** reduce ? ::= ? */
      return this;
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __QMarkLiteral.prototype.dump = function() {
      return " [?] ";
    }
    /** To String
     * @return string
     */
    __QMarkLiteral.prototype.toString = function() {
      return "?"; 
    }

    /**
     * x Literal (property name)
     */
    function __NameLiteral(varname) {
      if(!(this instanceof __NameLiteral)) return __cache.c(new __NameLiteral(varname));
      else __AccessContract.call(this);

      this.varname = varname;
    }
    __NameLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n(varname) ::= false */
    __NameLiteral.prototype.isEmpty = function() {
      return false;
    }
    /** w(varname) ::= false */
    __NameLiteral.prototype.isBlank = function() {
      return false;
    }
    /** v(varname) ::= false */
    __NameLiteral.prototype.isNullable = function() {
      return false;
    }
    /** m(varname) ::= false */
    __NameLiteral.prototype.isIndifferent = function() {
      return false;
    }
    /** m*(varname) ::= false */
    __NameLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r(varname) ::= varname == name */
    __NameLiteral.prototype.isReadable = function(name) {
      return (name == this.varname);
    }
    /** w(varname) ::= varname == name */
    __NameLiteral.prototype.isWriteable =  function(name) {
      return (name == this.varname);
    }
    //////////////////////////////////////////////////
    /** first(varname) ::= varname */
    __NameLiteral.prototype.first = function() {
      return new Array(this);
    }
    /** (d_name varname) ::= ^ if varname == name, @ otherwise */
    __NameLiteral.prototype.derive = function(name) {
      return (name == this.varname) ? new __NullLiteral() : new __EmptyLiteral();
    }
    /** (d_literal varname) ::= varname if literal=^, ^ if literal==varname, ^,{} if liteal==?, {} oterhwise */
    __NameLiteral.prototype.lderive = function(larg) {
      if(larg==this) return new __NullLiteral(); //TODO
      if(larg==new __NullLiteral()) return __EmptyLiteral();
      //   else if(larg==new __QMarkLiteral()) return new __NullLiteral(); // TODO
      // else if (larg==new __NullLiteral()) return this;
      else if(larg==new __AtLiteral()) return new __NullLiteral(); // TODO
      else return new __EmptyLiteral();
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __NameLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __NameLiteral.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce varname ::= varname */
    __NameLiteral.prototype.reduce =  function() {
      /** reduce varname ::= varname */
      return this;
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __NameLiteral.prototype.dump = function() {
      return " [" + this.varname + "] ";
    }
    /** To String
     * @return string
     */
    __NameLiteral.prototype.toString = function() {
      return "\"" + this.varname + "\"";
    }


    /**
     * RegEx Literal (regular expression)
     */
    function __RegExLiteral(regex) {
      // TODO
      if(!(this instanceof __RegExLiteral)) return __cache.c(new __RegExLiteral(regex));
      else __AccessContract.call(this);

      this.regex = regex;
    }
    // TODO
    __RegExLiteral.prototype = Object.create(__AccessContract.prototype);

    /** n(RegEx) ::= false */
    __RegExLiteral.prototype.isEmpty = function() {
      return false;
    }
    /** w(RegEx) ::= false */
    __RegExLiteral.prototype.isBlank = function() {
      return false;
    }
    /** v(RegEx) ::= false */
    __RegExLiteral.prototype.isNullable = function() {
      return false;
    }
    /** m(RegEx) ::= false */
    __RegExLiteral.prototype.isIndifferent = function() {
      return false;
    }
    /** m*(RegEx) ::= false */
    __RegExLiteral.prototype.isUniversal =  function() {
      return false;
    }
    //////////////////////////////////////////////////
    /** r(RegEx) ::= RegEx ~ name */
    __RegExLiteral.prototype.isReadable = function(name) {
      return (new RegExp(this.regex)).test(name);
    }
    /** w(RegEx) ::= RegEx ~ name */
    __RegExLiteral.prototype.isWriteable =  function(name) {
      return (new RegExp(this.regex)).test(name);
    }
    //////////////////////////////////////////////////
    /** first(RegEx) ::= RegEx */
    __RegExLiteral.prototype.first = function() {
      return new Array(this);
    }
    /** (d_name RegEx) ::= ^ if RegEx ~ name, {} otherwise */
    __RegExLiteral.prototype.derive = function(name) {
      return (new RegExp(this.regex)).test(name) ? new __NullLiteral() : new __EmptyLiteral();
    }
    /** (d_literal RegEx) ::= RegEx if literal==^, ^ if literal==RegEx,  ^,{} if liteal==?, {} oterhwise */
    __RegExLiteral.prototype.lderive = function(larg) {
      if(larg==this) return new __NullLiteral(); //TODO
      if(larg==new __NullLiteral()) return __EmptyLiteral();
      //	   else if(larg==new __QMarkLiteral()) return new __NullLiteral(); // TODO 
      //  else if (larg==new __NullLiteral()) return this;
      else if(larg==new __AtLiteral()) return new __NullLiteral(); // TODO
      else return new __EmptyLiteral();
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __RegExLiteral.prototype.isSupSetOf = function(arg, ctx) {
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
    __RegExLiteral.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce RegEx ::= RegEx */
    __RegExLiteral.prototype.reduce =  function() {
      /** reduce RegEx ::= RegEx */
      return this;
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __RegExLiteral.prototype.dump = function() {
      return " [/" + this.regex + "/] ";
    }
    /** To String
     * @return string
     */
    __RegExLiteral.prototype.toString = function() {
      return "/" + this.regex + "/"; 
    }




    //////////////////////////////////////////////////
    // QUANTIFIABLE
    //////////////////////////////////////////////////

    /**
     * C? Contract (optional)
     */
    function __QMarkContract(contract) {
      if(!(this instanceof __QMarkContract)) return __cache.c(new __QMarkContract(contract));
      else __AccessContract.call(this);

      // NORMALIZATION
      /** {}? ~ ^ */
      if(contract==new __EmptyLiteral()) return new __NullLiteral();
      /** ^? ~ ^ */
      else if(contract==new __NullLiteral()) return new __NullLiteral();
      /** @? ~ ^ */
      else if(contract==new __AtLiteral()) return new __NullLiteral();

      this.contract = contract;
    }
    // TODO
    __QMarkContract.prototype = Object.create(__AccessContract.prototype);

    /** n(C?) ::= false */
    __QMarkContract.prototype.isEmpty = function() {
      return false;
    }
    /** w(C?) ::= w(C) */
    __QMarkContract.prototype.isBlank = function() {
      return this.contract.isBlank();
    }
    /** v(C?) :== true */
    __QMarkContract.prototype.isNullable = function() {
      return true;
    }
    /** m(C?) ::= m(C) */
    __QMarkContract.prototype.isIndifferent = function() {
      return this.contract.isIndifferent();
    }
    /** m*(C?) ::= m*(C) */
    __QMarkContract.prototype.isUniversal =  function() {
      return this.contract.isUniversal();
    }
    //////////////////////////////////////////////////
    /** r(C?) ::= r(C) */
    __QMarkContract.prototype.isReadable = function(name) {
      return this.contract.isReadable(name);
    }
    /** w(C?) ::= w(C) */
    __QMarkContract.prototype.isWriteable =  function(name) {
      return this.contract.isWriteable(name);
    }
    //////////////////////////////////////////////////
    /** first(C?) ::= first(C) */
    __QMarkContract.prototype.first = function() {
      return this.contract.first();//.concat(new Array(new __NullLiteral()));
    }
    /** (d_name C?) ::= (d_name C) */
    __QMarkContract.prototype.derive = function(name) {
      return this.contract.derive(name);
    }
    /** (d_literal C?) ::= (d_literal C)? */
    __QMarkContract.prototype.lderive = function(larg) {
      /** (d_^ C?) ::= C? */
      //if (larg==new __NullLiteral()) return this;
      if(larg==new __NullLiteral()) return __NullLiteral();
      else return this.contract.lderive(larg);
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __QMarkContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //							   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //							   else if((arg==new __NullLiteral())) return true;
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
    __QMarkContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce C?  */
    __QMarkContract.prototype.reduce =  function() {
      /** C? ~ ^ | n(C) */
      if(this.contract.isEmpty()) return new __NullLiteral();
      /** C? ~ ^ | w(C) */
      else if(this.contract.isBlank()) return new __NullLiteral();
      /** reduce C? ::= (reduce C)? */
      else return new __QMarkContract(this.contract.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __QMarkContract.prototype.dump = function() {
      return this.contract.dump() + "? ";
    }
    /** To String
     * @return string
     */
    __QMarkContract.prototype.toString = function() {
      return this.contract.toString() + "?";
    }


    /**
     * C* Contract (kleene star)
     */
    function __StarContract(contract) {
      if(!(this instanceof __StarContract)) return __cache.c(new __StarContract(contract));
      else __AccessContract.call(this);

      // NORMALIZATION
      /** ^* ~ ^ */
      if(contract==new __NullLiteral()) return new __NullLiteral();
      /** ^* ~ ^ */
      else if(contract==new __NullLiteral()) return new __NullLiteral();
      /** @* ~ ^ */
      else if(contract==new __AtLiteral()) return new __NullLiteral();

      this.contract = contract;

    }
    __StarContract.prototype = Object.create(__AccessContract.prototype);


    /** n(C*) ::= false */
    __StarContract.prototype.isEmpty = function() {
      return false;
    }
    /** w(C*) ::= w(C) */
    __StarContract.prototype.isBlank = function() {
      return this.contract.isBlank();
    }
    /** v(C*) :== true */
    __StarContract.prototype.isNullable = function() {
      return true;
    }
    /** m(C*) ::= m(C) */
    __StarContract.prototype.isIndifferent = function() {
      return  this.contract.isIndifferent();
    }
    /** m*(C*) ::= m*(C) + m() */
    __StarContract.prototype.isUniversal =  function() {
      return (this.contract.isIndifferent() ||  this.contract.isUniversal());
    }
    //////////////////////////////////////////////////
    /** r(C*) ::= r(C) */
    __StarContract.prototype.isReadable = function(name) {
      return this.contract.isReadable(name);
    }
    /** w(C*) ::= w(C) */
    __StarContract.prototype.isWriteable =  function(name) {
      return this.contract.isWriteable(name);
    }
    //////////////////////////////////////////////////
    /** first(C*) ::= first(C) */
    __StarContract.prototype.first = function() {
      return this.contract.first();//.concat(new Array(new __NullLiteral()));
    }
    /** (d_name C*) ::= (d_name C).C* */
    __StarContract.prototype.derive = function(name) {
      return new __ConcatContract(this.contract.derive(name), this);
    }
    /** (d_literal C*) ::= (d_literal C).C* */
    __StarContract.prototype.lderive = function(larg) {
      /** (d_^ C*) ::= C* */
      //							   if (larg==new __NullLiteral()) return this;
      if(larg==new __NullLiteral()) return __NullLiteral();

      else return new __ConcatContract(this.contract.lderive(larg), new __StarContract(this.contract));
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __StarContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //							   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //							   else if((arg==new __NullLiteral())) return true;
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
    __StarContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce C* */
    __StarContract.prototype.reduce =  function() {
      /** C* ~ ^ | n(C) */
      if(this.contract.isEmpty()) return new __NullLiteral();
      /** C* ~ ^ | w(C) */
      else if(this.contract.isBlank()) return new __NullLiteral();
      /** reduce C* ::= (reduce C)* */
      else return new __StarContract(this.contract.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __StarContract.prototype.dump = function() {
      return this.contract.dump() + "* ";
    }
    /** To String
     * @return string
     */
    __StarContract.prototype.toString = function() {
      return this.contract.toString() + "*";
    }


    //////////////////////////////////////////////////
    // SETS
    //////////////////////////////////////////////////

    /**
     * C0+C1 Contract (logical or)
     */
    function __OrContract(contract0, contract1) {
      if(!(this instanceof __OrContract)) return __cache.c(new __OrContract(contract0, contract1));
      else __AccessContract.call(this);

      // NORMALIZATION
      /** (C+C) ~ C */
      if(contract0==contract1) return contract0;
      /** ({}+C) ~ C */
      else if(contract0==new __EmptyLiteral()) return contract1;
      else if(contract1==new __EmptyLiteral()) return contract0;
      /** (@+C) ~ C */
      else if(contract0==new __AtLiteral()) return contract1;
      else if(contract1==new __AtLiteral()) return contract0;

      this.contract0 = contract0;
      this.contract1 = contract1;
    }
    __OrContract.prototype = Object.create(__AccessContract.prototype);

    /** n(C0+C1) ::= n(C0) & n(C1) */
    __OrContract.prototype.isEmpty = function() {
      return this.contract0.isEmpty() && this.contract1.isEmpty();
    }
    /** w(C0+C1) ::= w(C0) & w(C1) */
    __OrContract.prototype.isBlank = function() {
      return this.contract0.isBlank() && this.contract1.isBlank();
    }
    /** v(C0+C1) :== v(C0) + v(C1) */
    __OrContract.prototype.isNullable = function() {
      return (this.contract0.isNullable() || this.contract1.isNullable());
    }
    /** m(C0+C1) ::= m(C0) + m(C1) */
    __OrContract.prototype.isIndifferent = function() {
      return  (this.contract0.isIndifferent() ||  this.contract1.isIndifferent());
    }
    /** m*(C0+C1) ::= m*(C0) + m*(C1) */
    __OrContract.prototype.isUniversal =  function() {
      return (this.contract0.isUniversal() || this.contract1.isUniversal());
    }
    //////////////////////////////////////////////////
    /** r(C0+C1) :== r(C0) + r(C1) */
    __OrContract.prototype.isReadable = function(name) {
      return (this.contract0.isReadable(name) || this.contract1.isReadable(name));
    }
    /** w(C0+C1) :== w(C0) + w(C1) */
    __OrContract.prototype.isWriteable =  function(name) {
      return (this.contract0.isWriteable(name) || this.contract1.isWriteable(name));
    }
    //////////////////////////////////////////////////
    /** first(C0+C1) ::= first(C0) + first(C1) */
    __OrContract.prototype.first = function() {
      return this.contract0.first().concat(this.contract1.first());
    }
    /** (d_name C0+C1) :== (d_name C0) + (d_name C1) */
    __OrContract.prototype.derive = function(name) {
      return new __OrContract(this.contract0.derive(name), this.contract1.derive(name));
    }
    /** (d_literal C0+C1) ::= (d_literal C0) + (d_literal C1) */
    __OrContract.prototype.lderive = function(larg) {
      /** (d_^ C?) ::= C? */
      /*if (larg==new __NullLiteral()) return this;
        else*/ return new __OrContract(this.contract0.lderive(larg), this.contract1.lderive(larg))
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __OrContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //			   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //			   else if((arg==new __NullLiteral()) && this.isNullable()) return true;
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
    __OrContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce C+C' */
    __OrContract.prototype.reduce =  function() {
      /** (C+C') ~ {} | n(C)&n(C') */
      if(this.contract0.isEmpty()&&this.contract1.isEmpty()) return new __EmptyLiteral();
      /** (C+C') ~ {} | w(C)&w(C') */
      else if(this.contract0.isBlank()&&this.contract1.isBlank()) return new __AtLiteral();
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
      else return new __OrContract(this.contract0.reduce(), this.contract1.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __OrContract.prototype.dump = function() {
      return " (" + this.contract0.dump() + " + " +  this.contract1.dump() +  ") ";
    }
    /** To String
     * @return string
     */
    __OrContract.prototype.toString = function() {
      return "(" + this.contract0.toString() + "+" + this.contract1.toString() + ")";
    }


    /**
     * C0&C1 Contract (logical and)
     */
    function __AndContract(contract0, contract1) {
      if(!(this instanceof __AndContract)) return __cache.c(new __AndContract(contract0, contract1));
      else __AccessContract.call(this);

      // NORMALIZATION
      /** (C&C) ~ C */
      if(contract0==contract1) return contract0;
      /** ({}&C) ~ {} */
      else if(contract0==new __EmptyLiteral()) return new __EmptyLiteral();
      else if(contract1==new __EmptyLiteral()) return new __EmptyLiteral();
      /** (@&C) ~ @ */
      else if(contract0==new __AtLiteral()) return new __AtLiteral();
      else if(contract1==new __AtLiteral()) return new __AtLiteral();

      this.contract0 = contract0;
      this.contract1 = contract1;
    }
    __AndContract.prototype = Object.create(__AccessContract.prototype);

    /** n(C0&C1) ::= n(C0) + n(C1) */
    __AndContract.prototype.isEmpty = function() {
      return this.contract0.isEmpty() || this.contract1.isEmpty();
    }
    /** w(C0&C1) ::= w(C0) + w(C1) */
    __AndContract.prototype.isBlank = function() {
      return this.contract0.isBlank() || this.contract1.isBlank();
    }
    /** v(C0&C1) :== v(C0) & v(C1) */
    __AndContract.prototype.isNullable = function() {
      return (this.contract0.isNullable() && this.contract1.isNullable());
    }
    /** m(C0&C1) ::= m(C0) & m(C1) */
    __AndContract.prototype.isIndifferent = function() {
      return (this.contract0.isIndifferent() && this.contract1.isIndifferent());
    }
    /** m*(C0&C1) ::= m*(C0) & m*(C1) */
    __AndContract.prototype.isUniversal =  function() {
      return (this.contract0.isUniversal() && this.contract1.isUniversal());
    }
    //////////////////////////////////////////////////
    /** r(C0&C1) :== r(C0) & r(C1) */
    __AndContract.prototype.isReadable = function(name) {
      return (this.contract0.isReadable(name) && this.contract1.isReadable(name));
    }
    /** w(C0&C1) :== w(C0) & w(C1) */
    __AndContract.prototype.isWriteable =  function(name) {
      return (this.contract0.isWriteable(name) && this.contract1.isWriteable(name));
    }
    //////////////////////////////////////////////////
    /** first(C0&C1) ::= first(C0) & first(C1) */
    __AndContract.prototype.first = function() {

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
    __AndContract.prototype.derive = function(name) {
      return new __AndContract(this.contract0.derive(name), this.contract1.derive(name));
    }
    /** (d_literal C0&C1) ::= (d_literal C0) & (d_literal C1) */
    __AndContract.prototype.lderive = function(larg) {
      /** (d_^ C?) ::= C? */
      /*if (larg==new __NullLiteral()) return this;
        else*/ return new __AndContract(this.contract0.lderive(larg), this.contract1.lderive(larg))
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __AndContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //							   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //							   else if((arg==new __NullLiteral()) && this.isNullable()) return true;
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
    __AndContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce C&C' */
    __AndContract.prototype.reduce =  function() {
      /** (C&C') ~ C/C' | n(C)/n(C') */
      if(this.contract0.isEmpty()) return new __EmptyLiteral();
      else if(this.contract1.isEmpty()) return new __EmptyLiteral();
      /** (C&C') ~ C/C' | w(C)/w(C') */
      else if(this.contract0.isBlank()) return new __AtLiteral();
      else if(this.contract1.isBlank()) return new __AtLiteral();
      /** (C&C') ~ C' | C >= C' */
      else if(this.contract0.isSubSetOf(this.contract1, new __CcContext())) return this.contract0;
      /** (C&C') ~ C | C <= C' */
      else if(this.contract1.isSubSetOf(this.contract0, new __CcContext())) return this.contract1;
      /** reduce C&C' ::= (reduce C)&(reduce C') */
      else return new __AndContract(this.contract0.reduce(), this.contract1.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __AndContract.prototype.dump = function() {
      return " (" + this.contract0.dump() + " & " +  this.contract1.dump() +  ") ";
    }
    /** To String
     * @return string
     */
    __AndContract.prototype.toString = function() {
      return "(" + this.contract0.toString() + "&" + this.contract1.toString() + ")";
    }


    /**
     * !C Contract (negation)
     */
    function __NegContract(contract) {
      if(!(this instanceof __NegContract)) return __cache.c(new __NegContract(contract));
      else __AccessContract.call(this);

      this.contract = contract;
    }
    __NegContract.prototype = Object.create(__AccessContract.prototype);

    /** n(!C) ::= m(C) + m*(C) */
    __NegContract.prototype.isEmpty = function() {
      // negation only effects to literals
      //return (this.contract.isUniversal() || this.contract.isIndifferent());
      return false;
    }
    /** w(!C) ::= m*(C) */
    __NegContract.prototype.isBlank = function() {
      // negation only effects to literals
      return (this.contract.isUniversal() || this.contract.isIndifferent());
    }
    /** v(!C) ::= false if v(C), false otherwise */
    __NegContract.prototype.isNullable = function() {
      return this.contract.isNullable() ? false : true;
    }
    /** m(!C) ::= v(C) + n(C) */
    __NegContract.prototype.isIndifferent = function() {
      return (this.contract.isNullable() || this.contract.isEmpty());
    }
    /** m*(!C) ::= n(C) + w(c) */
    __NegContract.prototype.isUniversal =  function() {
      return (this.contract.isEmpty() || this.contract.isBlank());
    }
    //////////////////////////////////////////////////
    /** r(!C) ::= false if r(C), false otherwise */
    __NegContract.prototype.isReadable = function(name) {
      return this.contract.isReadable(name) ? false : true;
    }
    /** w(!C) ::= false if w(C), false otherwise */
    __NegContract.prototype.isWriteable =  function(name) {
      return this.contract.isWriteable(name) ? false : true;
    }
    //////////////////////////////////////////////////
    /** first(!C) ::= first(C) */
    __NegContract.prototype.first = function() {
      //  return new Array(new __QMarkLiteral()); // TODO
      return new Array(new __QMarkLiteral()).concat(this.contract.first()); // TODO
      //   return this.contract.first();
    }
    /** (d_name !C) :== !(d_name C) */
    __NegContract.prototype.derive = function(name) {
      return new __NegContract(this.contract.derive(name));
    }
    /** (d_literal !C) ::= !(b_literal C) */
    __NegContract.prototype.lderive = function(larg) {
      /** (d_^ C?) ::= C? */
      /*if (larg==new __NullLiteral()) return this;



      // else*/

      // TODO
      //			   if(larg==new __QMarkLiteral()) return new __NullLiteral();
      //			   if(larg==this.contract) return new __EmptyLiteral();
      //			   else return new __NullLiteral();




      // TODO
      if(larg==new __QMarkLiteral()) return new __NegContract(__NullLiteral()); 
      return new __NegContract(this.contract.lderive(larg));
      //	   // TODO
      //	   if(arg=this.contract) return false;
      //	   else return true;
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __NegContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //			   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //			   else if((arg==new __NullLiteral()) && this.isNullable()) return true;
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
    __NegContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce !C */
    __NegContract.prototype.reduce =  function() {
      /** !(C) ~ @ | m*(C) */
      if(this.contract.isUniversal()) return  new __AtLiteral();
      /** SPECIAL: !(C) ~ @ | m(C) */
      else if(this.contract.isIndifferent()) return  new __AtLiteral();
      /** SPECIAL: !(^) ~ ? | m(C) */
      else if(this.contract==new __NullLiteral()) return  new __QMarkLiteral();
      /** reduce !(C) ::= !(reduce C) */
      else return new __NegContract(this.contract.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __NegContract.prototype.dump = function() {
      return " !(" + this.contract.dump() +  ") ";
    }
    /** To String
     * @return string
     */
    __NegContract.prototype.toString = function() {
      return "!(" + this.contract.toString() + ")" ;
    }



    //////////////////////////////////////////////////
    // CONTRACT
    //////////////////////////////////////////////////


    /**
     * C.C Contract (concatenation)
     */
    function __ConcatContract(contract0, contract1) {
      if(!(this instanceof __ConcatContract)) return __cache.c(new __ConcatContract(contract0, contract1));
      else __AccessContract.call(this);

      // NORMALIZATION
      /** (^.C) ~ C */
      if(contract0 == new __NullLiteral()) return contract1;
      /** ({}.C) ~ C */
      if(contract0 == new __EmptyLiteral()) return new __EmptyLiteral();
      /** (@.C) ~ C */
      if(contract0 == new __AtLiteral()) return new __AtLiteral();

      this.contract0 = contract0;
      this.contract1 = contract1;
    }
    __ConcatContract.prototype = Object.create(__AccessContract.prototype);

    /** n(C0.C1) ::= n(C0) */
    __ConcatContract.prototype.isEmpty = function() {
      return this.contract0.isEmpty() || this.contract1.isEmpty();
    }
    /** w(C0.C1) ::= w(C0) & w(C1) */
    __ConcatContract.prototype.isBlank = function() {
      return this.contract0.isBlank();
    }
    /** v(C0.C1) :== v(C0) & v(C1) */
    __ConcatContract.prototype.isNullable = function() {
      return (this.contract0.isNullable() && this.contract1.isNullable());
    }
    /** m(C0.C1) ::= false */
    __ConcatContract.prototype.isIndifferent = function() {
      if(this.contract0.isNullable()) return this.contract1.isIndifferent();
      else return this.contract0.isIndifferent();
    }
    /** m*(C0.C1) ::= false */
    __ConcatContract.prototype.isUniversal =  function() {
      return (this.contract0.isUniversal() && this.contract1.isNullable())
        || (this.contract1.isUniversal() && this.contract0.isNullable())
        || (this.contract0.isUniversal() && this.contract1.isUniversal());
    }
    //////////////////////////////////////////////////
    /** r(C0.C1) :== r(C0)+r(C1) if v(C0), r(C0) otherwise */
    __ConcatContract.prototype.isReadable = function(name) {
      if(this.contract0.isNullable()) return (this.contract0.isReadable(name) || this.contract1.isReadable(name))
      else return this.contract0.isReadable(name);
    }
    /** r(C0.C1) :== w(C1) if v(C0), w(C0) if v(C1,) false otherwise */
    __ConcatContract.prototype.isWriteable =  function(name) {
      if(this.contract0.isNullable()) return this.contract1.isWriteable(name);
      else if(this.contract1.isNullable()) return this.contract0.isWriteable(name);
      else return false;
    }
    //////////////////////////////////////////////////
    /** first(C0.C1) ::= first(C1) if v(C0), first(C0) otherwise */
    __ConcatContract.prototype.first = function() {
      if(this.contract0.isNullable()) return  this.contract0.first().concat(this.contract1.first());
      else return this.contract0.first();
    }
    /** (d_name C0.C1) :== (d_name C0).C1 + (d_name C1) if v(C0), (d_name C0).c1 otherwise */
    __ConcatContract.prototype.derive = function(name) {
      if(this.contract0.isNullable()) return new __OrContract(__ConcatContract(this.contract0.derive(name), this.contract1), this.contract1.derive(name));
      else return new __ConcatContract(this.contract0.derive(name), this.contract1);
    }
    /** (d_literal C0.C1) ::= (d_literal C0).C1 + (d_literal C1) if v(C0), (d_literal C0).c1 otherwise */
    __ConcatContract.prototype.lderive = function(larg) {
      /** (d_^ C?) ::= C? */
      /*if (larg==new __NullLiteral()) return this;
        else*/ if(this.contract0.isNullable()) return new new __OrContract(new __ConcatContract(this.contract0.lderive(larg), this.contract1), this.contract1.lderive(larg));
      else return new __ConcatContract(this.contract0.lderive(larg), this.contract1);
    }
    //////////////////////////////////////////////////
    /** ctx |- C <= this */
    __ConcatContract.prototype.isSupSetOf = function(arg, ctx) {
      /** C <= C' |= true  | C=C' */
      //							   if(arg==this) return true;
      /** ^ <= C' |= true  | v(C') */
      //							   else if((arg==new __NullLiteral()) && this.isNullable()) return true;
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
    __ConcatContract.prototype.isSubSetOf = function(arg, ctx) {
      return arg.isSupSetOf(this, ctx);
    }
    //////////////////////////////////////////////////
    /** reduce C.C' */
    __ConcatContract.prototype.reduce =  function() {
      /** (C.C') ~ {} | n(C) */
      if(this.contract0.isEmpty()) return new __EmptyLiteral();
      /** (C.C') ~ {} | w(C) */
      else if(this.contract0.isBlank()) return new __AtLiteral();
      /** reduce C.C' ::= (reduce C).(reduce C') */
      else return new __ConcatContract(this.contract0.reduce(), this.contract1.reduce());
    }
    //////////////////////////////////////////////////
    /** Dump
     * @return string
     */
    __ConcatContract.prototype.dump = function() {
      return  " " + this.contract0.dump() + " . " +  this.contract1.dump() +  " ";
    }
    /** To String
     * @return string
     */
    __ConcatContract.prototype.toString = function() {
      return this.contract0.toString() + "." + this.contract1.toString();
    }
















    //////////////////////////////////////////////////
    // APC . Contract
    //////////////////////////////////////////////////
    APC.Contract = {};

    APC.Contract.EmptySetLiteral	= __EmptyLiteral;
    APC.Contract.EmptyLiteral		= __NullLiteral;

    APC.Contract.AtLiteral			= __AtLiteral;
    APC.Contract.QMarkLiteral		= __QMarkLiteral;
    APC.Contract.NameLiteral		= __NameLiteral;
    APC.Contract.RegExLiteral		= __RegExLiteral;

    APC.Contract.QMarkContract		= __QMarkContract;
    APC.Contract.StarContract		= __StarContract;
    APC.Contract.OrContract			= __OrContract;
    APC.Contract.AndContract		= __AndContract;
    APC.Contract.NegContract		= __NegContract;
    APC.Contract.ConcatContract		= __ConcatContract;





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



})(APC);

APC.Parser = (function(APC){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */

  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
    return '"' + s
  .replace(/\\/g, '\\\\')  // backslash
  .replace(/"/g, '\\"')    // closing quote character
  .replace(/\x08/g, '\\b') // backspace
  .replace(/\t/g, '\\t')   // horizontal tab
  .replace(/\n/g, '\\n')   // line feed
  .replace(/\f/g, '\\f')   // form feed
  .replace(/\r/g, '\\r')   // carriage return
  .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
  + '"';
  }

  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "Start": parse_Start,
        "RegEx": parse_RegEx,
        "Name": parse_Name,
        "Literal": parse_Literal,
        "Set": parse_Set,
        "Quantifiable": parse_Quantifiable,
        "Contract": parse_Contract
      };

      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "Start";
      }

      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];

      function padLeft(input, padding, length) {
        var result = input;

        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }

        return result;
      }

      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;

        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }

        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }

      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }

        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }

        rightmostFailuresExpected.push(failure);
      }

      function parse_Start() {
        var result0;
        var pos0;

        pos0 = pos;
        result0 = parse_Contract();
        if (result0 !== null) {
          result0 = (function(offset, contract) { return contract; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_RegEx() {
        var result0, result1, result2;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 47) {
          result0 = "/";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/\"");
          }
        }
        if (result0 !== null) {
          if (/^[a-zA-Z0-9_^$?*+.\\(){}[\],|\-]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[a-zA-Z0-9_^$?*+.\\\\(){}[\\],|\\-]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[a-zA-Z0-9_^$?*+.\\(){}[\],|\-]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[a-zA-Z0-9_^$?*+.\\\\(){}[\\],|\\-]");
                }
              }
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 47) {
              result2 = "/";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"/\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, regex) {
            var string = "";
            regex.foreach(function(k,v) {
              string += v;
            });
            return string;
          })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_Name() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        result0 = [];
        if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_]");
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[a-zA-Z0-9_]");
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, name) {
            var string = "";
            name.foreach(function(k,v) {
              string += v;
            });
            return string;
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_Literal() {
        var result0, result1, result2;
        var pos0, pos1;

        pos0 = pos;
        if (input.charCodeAt(pos) === 64) {
          result0 = "@";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"@\"");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, l) { return new APC.Contract.AtLiteral(); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.charCodeAt(pos) === 63) {
            result0 = "?";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"?\"");
            }
          }
          if (result0 !== null) {
            result0 = (function(offset, l) { return new APC.Contract.QMarkLiteral(); })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            if (input.substr(pos, 2) === "!(") {
              result0 = "!(";
              pos += 2;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"!(\"");
              }
            }
            if (result0 !== null) {
              result1 = parse_Literal();
              if (result1 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result2 = ")";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, l) { return new APC.Contract.NegContract(l); })(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              result0 = parse_RegEx();
              if (result0 !== null) {
                result0 = (function(offset, l) { return new APC.Contract.RegExLiteral(l); })(pos0, result0);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                result0 = parse_Name();
                if (result0 !== null) {
                  result0 = (function(offset, l) { return new APC.Contract.NameLiteral(l); })(pos0, result0);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
            }
          }
        }
        return result0;
      }

      function parse_Set() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Contract();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 43) {
              result2 = "+";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"+\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_Contract();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, s0, s1) { return new APC.Contract.OrContract(s0, s1); })(pos0, result0[1], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 40) {
            result0 = "(";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"(\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_Contract();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 38) {
                result2 = "&";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"&\"");
                }
              }
              if (result2 !== null) {
                result3 = parse_Contract();
                if (result3 !== null) {
                  if (input.charCodeAt(pos) === 41) {
                    result4 = ")";
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("\")\"");
                    }
                  }
                  if (result4 !== null) {
                    result0 = [result0, result1, result2, result3, result4];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, s0, s1) { return new APC.Contract.AndContract(s0, s1); })(pos0, result0[1], result0[3]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 40) {
              result0 = "(";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"(\"");
              }
            }
            if (result0 !== null) {
              result1 = parse_Contract();
              if (result1 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result2 = ")";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, s) { return s; })(pos0, result0[1]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              result0 = parse_Literal();
              if (result0 !== null) {
                result0 = (function(offset, s) { return s; })(pos0, result0);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
          }
        }
        return result0;
      }

      function parse_Quantifiable() {
        var result0, result1;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        result0 = parse_Set();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 63) {
            result1 = "?";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"?\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, q) { return new APC.Contract.QMarkContract(q); })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_Set();
          if (result0 !== null) {
            if (input.charCodeAt(pos) === 42) {
              result1 = "*";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"*\"");
              }
            }
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, q) { return new APC.Contract.StarContract(q); })(pos0, result0[0]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_Set();
            if (result0 !== null) {
              result0 = (function(offset, q) { return q; })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
        }
        return result0;
      }

      function parse_Contract() {
        var result0, result1, result2;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        result0 = parse_Quantifiable();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_Contract();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, c0, c1) { return new APC.Contract.ConcatContract(c0, c1); })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_Quantifiable();
          if (result0 !== null) {
            result0 = (function(offset, c) { return c; })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }


      function cleanupExpected(expected) {
        expected.sort();

        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }

      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */

        var line = 1;
        var column = 1;
        var seenCR = false;

        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }

        return { line: line, column: column };
      }


      var result = parseFunctions[startRule]();

      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();

        throw new this.SyntaxError(
            cleanupExpected(rightmostFailuresExpected),
            found,
            offset,
            errorPosition.line,
            errorPosition.column
            );
      }

      return result;
    },

    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };

  /* Thrown when a parser encounters a syntax error. */

  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;

      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }

      foundHumanized = found ? quote(found) : "end of input";

      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }

    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };

  result.SyntaxError.prototype = Error.prototype;

  return result;
})(APC);













var apcon = (str instanceof Object) ? str : APC.Parser.parse(str); //(str instaneco)







var any = Contract.Base(function(property) {
  return true;
});
var readable = Contract.Base(function(name) {
  //print("readable? " + name + " " + apcon.isReadable(name));
  //return true;
  return apcon.isReadable(name);
  //return (property!=="b");
  //return true;
});
var writeable = Contract.Base(function(name) {
  //print("writeable? " + name + " " + apcon.isWriteable(name));
  return apcon.isWriteable(name);
  //return true;
});

var Access = Contract.Constructor(ctor).ctor;

/*var membrane = Contract.Constructor(function membrane(target, name, receiver) {
  var apconPrime = apcon.derive(name);
  print("^^^ " + apconPrime);
//return Access("a");
return Access("a", Object, Error, undefined, print));
})*/




//  var Access = Contract.Constructor(ctor).ctor;
//  apcon.derive("a");

//  var get = Contract.Get(Contract.And(
//    Contract.AFunction({1:readable}, any),
//    Contract.AFunction({1:writeable}, any
//    Contract.Dependent(Contract.Constructor(membrane))
//Contract.AFunction({}, Access(apcon.derive("a"), print))
//Contract.Dependent(Contract.Constructor(ctor))
//  ));
var get = Contract.Get(Contract.AFunction({1:readable}, any));
var set = Contract.Set(Contract.AFunction({1:writeable}, any));

return Contract.And(get, set);

// TODO, return

});

var Access = AccessContract.ctor;

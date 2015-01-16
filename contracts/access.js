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



    //////////////////////////////////////////////////
    // LITERALE
    //////////////////////////////////////////////////

    /**
     * {} Literal (empty set)
     */
    function __EmptySetLiteral() {
      return __cache.c({
        /** n({}) ::= true */
        isEmpty: function() {
          return true;
        },
             /** w({}) ::= false */
             isBlank: function() {
               return false;
             },
             /** v({}) ::= false */
             isNullable: function() {
               return false;
             },
             /** m({}) ::= false */
             isIndifferent: function() {
               return false;
             },
             /** m*({}) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r({}) ::= false */
             isReadable: function(name) {
               return false;
             },
             /** w({}) ::= false */
             isWriteable: function(name) {
               return false;
             },
             //////////////////////////////////////////////////
             /** first({}) ::= {} */
             first: function() {
               // return new Array(this);
               // CHANGED, no need of returning this
               // EmptySet can be moved to contract! 
               return new Array();
             },
             /** (d_name {}) ::= {} */
             derive: function(name) {
               return new __EmptySetLiteral();
             },
             /** (d_literal {}) ::= {} */
             lderive: function(larg) {
               return this;
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               /** C <= C' |= true  | n(C) */
               // return true;
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce {} */
             reduce: function() {
               /** reduce {} ::= {} */
               return this;
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [{}] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "{}"; 
             }
      });
    }

    /**
     * ^ Literal (empty literal)
     */
    function __EmptyLiteral() {
      return __cache.c({
        /** n(^) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(^) ::= false */
             isBlank: function() {
               return false;
             },
             /** v(^) ::= true */
             isNullable: function() {
               return true;
             },
             /** m(^) ::= false */
             isIndifferent: function() {
               return false;
             },
             /** m*(^) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r(^) ::= false */
             isReadable: function(name) {
               return false;
             },
             /** w(^) ::= false */
             isWriteable: function(name) {
               return false;
             },
             //////////////////////////////////////////////////
             /** first(^) ::= ^ */
             first: function() {
               return new Array(this);
             },
             /** (d_name ^) ::= {} */
             derive: function(name) {
               return new __EmptySetLiteral();
             },
             /** (d_literal ^) ::= ^ if literal == ^, @ oterhwise */
             lderive: function(larg) {
               //if(larg==new __AtLiteral()) return new __EmptyLiteral(); // TODO
               //else return (larg==this) ? this : new __EmptySetLiteral();

               //return new __EmptySetLiteral();

               return (larg==this) ? this : new __EmptySetLiteral();


             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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


             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               /** C <= C' |= true  | n(C') */
               if(arg.isNullable()) return true;
               /** C <= C' |= false  | v(C) and ~v(C') */
               else return false;
             },
             //////////////////////////////////////////////////
             /** reduce ^ */
             reduce: function() {
               /** reduce ^ ::= ^ */
               return this;
               //return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "^"; 
             }
      });
    }

    /**
     * @ Literal (null)
     */
    function __AtLiteral() {
      return __cache.c({
        /** n(@) ::= true */
        isEmpty: function() {
          return false;
        },
             /** w(@) ::= true */
             isBlank: function() {
               return true;
             },
             /** v(@) ::= false */
             isNullable: function() {
               return false;
             },
             /** m(@) ::= false */
             isIndifferent: function() {
               return false;
             },
             /** m*(@) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r(@) ::= false */
             isReadable: function(name) {
               return false;
             },
             /** w(@) ::= false */
             isWriteable: function(name) {
               return false;
             },
             //////////////////////////////////////////////////
             /** first(@) ::= @ */
             first: function() {
               return new Array(this);
             },
             /** (d_name @) ::= @ */
             derive: function(name) {
               return new __EmptySetLiteral();
             },
             /** (d_literal @) ::= @ */
             lderive: function(larg) {
               // if(larg==new __EmptyLiteral()) return this;
               if(larg==new __EmptyLiteral()) return __EmptySetLiteral();
               else if(larg==this) return new __EmptyLiteral();
               else return new __EmptySetLiteral();
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce @ */
             reduce: function() {
               /** reduce @ ::= @ */
               return this;
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [@] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "@"; 
             }
      });
    }

    /**
     * ? Literal (universe)
     */
    function __QMarkLiteral() {
      return __cache.c({
        /** n(?) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(?) ::= false */
             isBlank: function() {
               return false;
             },
             /** v(?) ::= false */
             isNullable: function() {
               return false;
             },
             /** m(?) ::= false */
             isIndifferent: function() {
               return true;
             },
             /** m*(?) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r(?) ::= true */
             isReadable: function(name) {
               return true;
             },
             /** w(?) ::= true */
             isWriteable: function(name) {
               return true;
             },
             //////////////////////////////////////////////////
             /** first(?) ::= ? */
             first: function() {
               return new Array(this);
             },
             /** (d_name ?) ::= ^ */
             derive: function(name) {
               return new __EmptyLiteral();
             },
             /** (d_literal ?) ::= ? if literal=^, ^ otherwise */
             lderive: function(larg) {
               // if (larg==new __EmptyLiteral()) return this;
               if(larg==new __EmptyLiteral()) return __EmptySetLiteral();
               else return new __EmptyLiteral();
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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

             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce ? ::= ? */
             reduce: function() {
               /** reduce ? ::= ? */
               return this;
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [?] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "?"; 
             }
      });
    }

    /**
     * x Literal (property name)
     */
    function __NameLiteral(varname) {
      return __cache.c({
        /** n(varname) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(varname) ::= false */
             isBlank: function() {
               return false;
             },
             /** v(varname) ::= false */
             isNullable: function() {
               return false;
             },
             /** m(varname) ::= false */
             isIndifferent: function() {
               return false;
             },
             /** m*(varname) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r(varname) ::= varname == name */
             isReadable: function(name) {
               return (name == varname);
             },
             /** w(varname) ::= varname == name */
             isWriteable: function(name) {
               return (name == varname);
             },
             //////////////////////////////////////////////////
             /** first(varname) ::= varname */
             first: function() {
               return new Array(this);
             },
             /** (d_name varname) ::= ^ if varname == name, @ otherwise */
             derive: function(name) {
               return (name == varname) ? new __EmptyLiteral() : new __EmptySetLiteral();
             },
             /** (d_literal varname) ::= varname if literal=^, ^ if literal==varname, ^,{} if liteal==?, {} oterhwise */
             lderive: function(larg) {
               if(larg==this) return new __EmptyLiteral(); //TODO
               if(larg==new __EmptyLiteral()) return __EmptySetLiteral();
               //   else if(larg==new __QMarkLiteral()) return new __EmptyLiteral(); // TODO
               // else if (larg==new __EmptyLiteral()) return this;
               else if(larg==new __AtLiteral()) return new __EmptyLiteral(); // TODO
               else return new __EmptySetLiteral();
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce varname ::= varname */
             reduce: function() {
               /** reduce varname ::= varname */
               return this;
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [" + varname + "] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "\"" + varname + "\"";
             }
      });
    }

    /**
     * RegEx Literal (regular expression)
     */
    function __RegExLiteral(regex) {
      return __cache.c({
        /** n(RegEx) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(RegEx) ::= false */
             isBlank: function() {
               return false;
             },
             /** v(RegEx) ::= false */
             isNullable: function() {
               return false;
             },
             /** m(RegEx) ::= false */
             isIndifferent: function() {
               return false;
             },
             /** m*(RegEx) ::= false */
             isUniversal: function() {
               return false;
             },
             //////////////////////////////////////////////////
             /** r(RegEx) ::= RegEx ~ name */
             isReadable: function(name) {
               return (new RegExp(regex)).test(name);
             },
             /** w(RegEx) ::= RegEx ~ name */
             isWriteable: function(name) {
               return (new RegExp(regex)).test(name);
             },
             //////////////////////////////////////////////////
             /** first(RegEx) ::= RegEx */
             first: function() {
               return new Array(this);
             },
             /** (d_name RegEx) ::= ^ if RegEx ~ name, {} otherwise */
             derive: function(name) {
               return (new RegExp(regex)).test(name) ? new __EmptyLiteral() : new __EmptySetLiteral();
             },
             /** (d_literal RegEx) ::= RegEx if literal==^, ^ if literal==RegEx,  ^,{} if liteal==?, {} oterhwise */
             lderive: function(larg) {
               if(larg==this) return new __EmptyLiteral(); //TODO
               if(larg==new __EmptyLiteral()) return __EmptySetLiteral();
               //	   else if(larg==new __QMarkLiteral()) return new __EmptyLiteral(); // TODO 
               //  else if (larg==new __EmptyLiteral()) return this;
               else if(larg==new __AtLiteral()) return new __EmptyLiteral(); // TODO
               else return new __EmptySetLiteral();
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce RegEx ::= RegEx */
             reduce: function() {
               /** reduce RegEx ::= RegEx */
               return this;
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " [/" + regex + "/] ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "/" + regex + "/"; 
             }
      });
    }



    //////////////////////////////////////////////////
    // QUANTIFIABLE
    //////////////////////////////////////////////////

    /**
     * C? Contract (optional)
     */
    function __QMarkContract(contract) {
      // NORMALIZATION
      /** {}? ~ ^ */
      if(contract==new __EmptySetLiteral()) return new __EmptyLiteral();
      /** ^? ~ ^ */
      else if(contract==new __EmptyLiteral()) return new __EmptyLiteral();
      /** @? ~ ^ */
      else if(contract==new __AtLiteral()) return new __EmptyLiteral();

      return __cache.c({
        /** n(C?) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(C?) ::= w(C) */
             isBlank: function() {
               return contract.isBlank();
             },
             /** v(C?) :== true */
             isNullable: function() {
               return true;
             },
             /** m(C?) ::= m(C) */
             isIndifferent: function() {
               return contract.isIndifferent();
             },
             /** m*(C?) ::= m*(C) */
             isUniversal: function() {
               return contract.isUniversal();
             },
             //////////////////////////////////////////////////
             /** r(C?) ::= r(C) */
             isReadable: function(name) {
               return contract.isReadable(name);
             },
             /** w(C?) ::= w(C) */
             isWriteable: function(name) {
               return contract.isWriteable(name);
             },
             //////////////////////////////////////////////////
             /** first(C?) ::= first(C) */
             first: function() {
               return contract.first();//.concat(new Array(new __EmptyLiteral()));
             },
             /** (d_name C?) ::= (d_name C) */
             derive: function(name) {
               return  contract.derive(name);
             },
             /** (d_literal C?) ::= (d_literal C)? */
             lderive: function(larg) {
               /** (d_^ C?) ::= C? */
               //if (larg==new __EmptyLiteral()) return this;
               if(larg==new __EmptyLiteral()) return __EmptyLiteral();
               else return contract.lderive(larg);
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //							   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //							   else if((arg==new __EmptyLiteral())) return true;
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce C?  */
             reduce: function() {
               /** C? ~ ^ | n(C) */
               if(contract.isEmpty()) return new __EmptyLiteral();
               /** C? ~ ^ | w(C) */
               else if(contract.isBlank()) return new __EmptyLiteral();
               /** reduce C? ::= (reduce C)? */
               else return new __QMarkContract(contract.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return contract.dump() + "? ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return contract.toString() + "?";
             }
      });
    }

    /**
     * C* Contract (kleene star)
     */
    function __StarContract(contract) {
      // NORMALIZATION
      /** ^* ~ ^ */
      if(contract==new __EmptyLiteral()) return new __EmptyLiteral();
      /** ^* ~ ^ */
      else if(contract==new __EmptyLiteral()) return new __EmptyLiteral();
      /** @* ~ ^ */
      else if(contract==new __AtLiteral()) return new __EmptyLiteral();

      return __cache.c({
        /** n(C*) ::= false */
        isEmpty: function() {
          return false;
        },
             /** w(C*) ::= w(C) */
             isBlank: function() {
               return contract.isBlank();
             },
             /** v(C*) :== true */
             isNullable: function() {
               return true;
             },
             /** m(C*) ::= m(C) */
             isIndifferent: function() {
               return  contract.isIndifferent();
             },
             /** m*(C*) ::= m*(C) + m() */
             isUniversal: function() {
               return (contract.isIndifferent() ||  contract.isUniversal());
             },
             //////////////////////////////////////////////////
             /** r(C*) ::= r(C) */
             isReadable: function(name) {
               return contract.isReadable(name);
             },
             /** w(C*) ::= w(C) */
             isWriteable: function(name) {
               return contract.isWriteable(name);
             },
             //////////////////////////////////////////////////
             /** first(C*) ::= first(C) */
             first: function() {
               return contract.first();//.concat(new Array(new __EmptyLiteral()));
             },
             /** (d_name C*) ::= (d_name C).C* */
             derive: function(name) {
               return new __ConcatContract(contract.derive(name), this);
             },
             /** (d_literal C*) ::= (d_literal C).C* */
             lderive: function(larg) {
               /** (d_^ C*) ::= C* */
               //							   if (larg==new __EmptyLiteral()) return this;
               if(larg==new __EmptyLiteral()) return __EmptyLiteral();

               else return new __ConcatContract(contract.lderive(larg), new __StarContract(contract));
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //							   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //							   else if((arg==new __EmptyLiteral())) return true;
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce C* */
             reduce: function() {
               /** C* ~ ^ | n(C) */
               if(contract.isEmpty()) return new __EmptyLiteral();
               /** C* ~ ^ | w(C) */
               else if(contract.isBlank()) return new __EmptyLiteral();
               /** reduce C* ::= (reduce C)* */
               else return new __StarContract(contract.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return contract.dump() + "* ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return contract.toString() + "*";
             }
      });
    }



    //////////////////////////////////////////////////
    // SETS
    //////////////////////////////////////////////////

    /**
     * C0+C1 Contract (logical or)
     */
    function __OrContract(contract0, contract1) {
      // NORMALIZATION
      /** (C+C) ~ C */
      if(contract0==contract1) return contract0;
      /** ({}+C) ~ C */
      else if(contract0==new __EmptySetLiteral()) return contract1;
      else if(contract1==new __EmptySetLiteral()) return contract0;
      /** (@+C) ~ C */
      else if(contract0==new __AtLiteral()) return contract1;
      else if(contract1==new __AtLiteral()) return contract0;

      return __cache.c({
        /** n(C0+C1) ::= n(C0) & n(C1) */
        isEmpty: function() {
          return contract0.isEmpty() && contract1.isEmpty();
        },
             /** w(C0+C1) ::= w(C0) & w(C1) */
             isBlank: function() {
               return contract0.isBlank() && contract1.isBlank();
             },
             /** v(C0+C1) :== v(C0) + v(C1) */
             isNullable: function() {
               return (contract0.isNullable() || contract1.isNullable());
             },
             /** m(C0+C1) ::= m(C0) + m(C1) */
             isIndifferent: function() {
               return  (contract0.isIndifferent() ||  contract1.isIndifferent());
             },
             /** m*(C0+C1) ::= m*(C0) + m*(C1) */
             isUniversal: function() {
               return (contract0.isUniversal() || contract1.isUniversal());
             },
             //////////////////////////////////////////////////
             /** r(C0+C1) :== r(C0) + r(C1) */
             isReadable: function(name) {
               return (contract0.isReadable(name) || contract1.isReadable(name));
             },
             /** w(C0+C1) :== w(C0) + w(C1) */
             isWriteable: function(name) {
               return (contract0.isWriteable(name) || contract1.isWriteable(name));
             },
             //////////////////////////////////////////////////
             /** first(C0+C1) ::= first(C0) + first(C1) */
             first: function() {
               return contract0.first().concat(contract1.first());
             },
             /** (d_name C0+C1) :== (d_name C0) + (d_name C1) */
             derive: function(name) {
               return new __OrContract(contract0.derive(name), contract1.derive(name));
             },
             /** (d_literal C0+C1) ::= (d_literal C0) + (d_literal C1) */
             lderive: function(larg) {
               /** (d_^ C?) ::= C? */
               /*if (larg==new __EmptyLiteral()) return this;
                 else*/ return new __OrContract(contract0.lderive(larg), contract1.lderive(larg))
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //			   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //			   else if((arg==new __EmptyLiteral()) && this.isNullable()) return true;
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce C+C' */
             reduce: function() {
               /** (C+C') ~ {} | n(C)&n(C') */
               if(contract0.isEmpty()&&contract1.isEmpty()) return new __EmptySetLiteral();
               /** (C+C') ~ {} | w(C)&w(C') */
               else if(contract0.isBlank()&&contract1.isBlank()) return new __AtLiteral();
               /** (C+C') ~ C/C' | n(C)/n(C') */
               else if(contract0.isEmpty()) return contract1;
               else if(contract1.isEmpty()) return contract0;
               /** (C+C') ~ C/C' | w(C)/w(C') */
               else if(contract0.isBlank()) return contract1;
               else if(contract1.isBlank()) return contract0;
               /** (C+C') ~ C | C >= C' */
               else if(contract0.isSuperSetOf(contract1, new __CcContext())) return contract0;
               /** (C+C') ~ C' | C <= C' */
               else if(contract1.isSuperSetOf(contract0, new __CcContext())) return contract1;
               /** reduce C+C' ::= (reduce C)+(reduce C') */
               else return new __OrContract(contract0.reduce(), contract1.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " (" + contract0.dump() + " + " +  contract1.dump() +  ") ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "(" + contract0.toString() + "+" + contract1.toString() + ")";
             }
      });
    }

    /**
     * C0&C1 Contract (logical and)
     */
    function __AndContract(contract0, contract1) {
      // NORMALIZATION
      /** (C&C) ~ C */
      if(contract0==contract1) return contract0;
      /** ({}&C) ~ {} */
      else if(contract0==new __EmptySetLiteral()) return new __EmptySetLiteral();
      else if(contract1==new __EmptySetLiteral()) return new __EmptySetLiteral();
      /** (@&C) ~ @ */
      else if(contract0==new __AtLiteral()) return new __AtLiteral();
      else if(contract1==new __AtLiteral()) return new __AtLiteral();

      return __cache.c({
        /** n(C0&C1) ::= n(C0) + n(C1) */
        isEmpty: function() {
          return contract0.isEmpty() || contract1.isEmpty();
        },
             /** w(C0&C1) ::= w(C0) + w(C1) */
             isBlank: function() {
               return contract0.isBlank() || contract1.isBlank();
             },
             /** v(C0&C1) :== v(C0) & v(C1) */
             isNullable: function() {
               return (contract0.isNullable() && contract1.isNullable());
             },
             /** m(C0&C1) ::= m(C0) & m(C1) */
             isIndifferent: function() {
               return (contract0.isIndifferent() && contract1.isIndifferent());
             },
             /** m*(C0&C1) ::= m*(C0) & m*(C1) */
             isUniversal: function() {
               return (contract0.isUniversal() && contract1.isUniversal());
             },
             //////////////////////////////////////////////////
             /** r(C0&C1) :== r(C0) & r(C1) */
             isReadable: function(name) {
               return (contract0.isReadable(name) && contract1.isReadable(name));
             },
             /** w(C0&C1) :== w(C0) & w(C1) */
             isWriteable: function(name) {
               return (contract0.isWriteable(name) && contract1.isWriteable(name));
             },
             //////////////////////////////////////////////////
             /** first(C0&C1) ::= first(C0) & first(C1) */
             first: function() {

               return contract0.first().concat(contract1.first());

               // var result = new Array();
               // arr0 = contract0.first();
               // arr1 = contract1.first();
               // arr0.foreach(function(k0, v0) {
               //		   arr1.foreach(function(k1, v1) {
               //				   if(v0==v1)
               //				   result.push(v0);
               //		   });
               // });
               //   return result;
             },
             /** (d_name C0&C1) :== (d_name C0) & (d_name C1) */
             derive: function(name) {
               return new __AndContract(contract0.derive(name), contract1.derive(name));
             },
             /** (d_literal C0&C1) ::= (d_literal C0) & (d_literal C1) */
             lderive: function(larg) {
               /** (d_^ C?) ::= C? */
               /*if (larg==new __EmptyLiteral()) return this;
                 else*/ return new __AndContract(contract0.lderive(larg), contract1.lderive(larg))
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //							   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //							   else if((arg==new __EmptyLiteral()) && this.isNullable()) return true;
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce C&C' */
             reduce: function() {
               /** (C&C') ~ C/C' | n(C)/n(C') */
               if(contract0.isEmpty()) return new __EmptySetLiteral();
               else if(contract1.isEmpty()) return new __EmptySetLiteral();
               /** (C&C') ~ C/C' | w(C)/w(C') */
               else if(contract0.isBlank()) return new __AtLiteral();
               else if(contract1.isBlank()) return new __AtLiteral();
               /** (C&C') ~ C' | C >= C' */
               else if(contract0.isSubSetOf(contract1, new __CcContext())) return contract0;
               /** (C&C') ~ C | C <= C' */
               else if(contract1.isSubSetOf(contract0, new __CcContext())) return contract1;
               /** reduce C&C' ::= (reduce C)&(reduce C') */
               else return new __AndContract(contract0.reduce(), contract1.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " (" + contract0.dump() + " & " +  contract1.dump() +  ") ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "(" + contract0.toString() + "&" + contract1.toString() + ")";
             }
      });
    }

    /**
     * !C Contract (negation)
     */
    function __NegContract(contract) {
      return __cache.c({
        /** n(!C) ::= m(C) + m*(C) */
        isEmpty: function() {
          // negation only effects to literals
          //return (contract.isUniversal() || contract.isIndifferent());
          return false;
        },
             /** w(!C) ::= m*(C) */
             isBlank: function() {
               // negation only effects to literals
               return (contract.isUniversal() || contract.isIndifferent());
             },
             /** v(!C) ::= false if v(C), false otherwise */
             isNullable: function() {
               return contract.isNullable() ? false : true;
             },
             /** m(!C) ::= v(C) + n(C) */
             isIndifferent: function() {
               return (contract.isNullable() || contract.isEmpty());
             },
             /** m*(!C) ::= n(C) + w(c) */
             isUniversal: function() {
               return (contract.isEmpty() || contract.isBlank());
             },
             //////////////////////////////////////////////////
             /** r(!C) ::= false if r(C), false otherwise */
             isReadable: function(name) {
               return contract.isReadable(name) ? false : true;
             },
             /** w(!C) ::= false if w(C), false otherwise */
             isWriteable: function(name) {
               return contract.isWriteable(name) ? false : true;
             },
             //////////////////////////////////////////////////
             /** first(!C) ::= first(C) */
             first: function() {
               //  return new Array(new __QMarkLiteral()); // TODO
               return new Array(new __QMarkLiteral()).concat(contract.first()); // TODO
               //   return contract.first();
             },
             /** (d_name !C) :== !(d_name C) */
             derive: function(name) {
               return new __NegContract(contract.derive(name));
             },
             /** (d_literal !C) ::= !(b_literal C) */
             lderive: function(larg) {
               /** (d_^ C?) ::= C? */
               /*if (larg==new __EmptyLiteral()) return this;



               // else*/

               // TODO
               //			   if(larg==new __QMarkLiteral()) return new __EmptyLiteral();
               //			   if(larg==contract) return new __EmptySetLiteral();
               //			   else return new __EmptyLiteral();




               // TODO
               if(larg==new __QMarkLiteral()) return new __NegContract(__EmptyLiteral()); 
               return new __NegContract(contract.lderive(larg));
               //	   // TODO
               //	   if(arg=contract) return false;
               //	   else return true;
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //			   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //			   else if((arg==new __EmptyLiteral()) && this.isNullable()) return true;
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
               else return unfold(this, arg, contract.first(), ctx.bind(ccExp)) && unfold(this, arg, arg.first(), ctx.bind(ccExp));

             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce !C */
             reduce: function() {
               /** !(C) ~ @ | m*(C) */
               if(contract.isUniversal()) return  new __AtLiteral();
               /** SPECIAL: !(C) ~ @ | m(C) */
               else if(contract.isIndifferent()) return  new __AtLiteral();
               /** SPECIAL: !(^) ~ ? | m(C) */
               else if(contract==new __EmptyLiteral()) return  new __QMarkLiteral();
               /** reduce !(C) ::= !(reduce C) */
               else return new __NegContract(contract.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return " !(" + contract.dump() +  ") ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return "!(" + contract.toString() + ")" ;
             }
      });
    }



    //////////////////////////////////////////////////
    // CONTRACT
    //////////////////////////////////////////////////


    /**
     * C.C Contract (concatenation)
     */
    function __ConcatContract(contract0, contract1) {
      // NORMALIZATION
      /** (^.C) ~ C */
      if(contract0 == new __EmptyLiteral()) return contract1;
      /** ({}.C) ~ C */
      if(contract0 == new __EmptySetLiteral()) return new __EmptySetLiteral();
      /** (@.C) ~ C */
      if(contract0 == new __AtLiteral()) return new __AtLiteral();

      return __cache.c({
        /** n(C0.C1) ::= n(C0) */
        isEmpty: function() {
          return contract0.isEmpty() || contract1.isEmpty();
        },
             /** w(C0.C1) ::= w(C0) & w(C1) */
             isBlank: function() {
               return contract0.isBlank();
             },
             /** v(C0.C1) :== v(C0) & v(C1) */
             isNullable: function() {
               return (contract0.isNullable() && contract1.isNullable());
             },
             /** m(C0.C1) ::= false */
             isIndifferent: function() {
               if(contract0.isNullable()) return contract1.isIndifferent();
               else return contract0.isIndifferent();
             },
             /** m*(C0.C1) ::= false */
             isUniversal: function() {
               return (contract0.isUniversal() && contract1.isNullable())
                 || (contract1.isUniversal() && contract0.isNullable())
                 || (contract0.isUniversal() && contract1.isUniversal());
             },
             //////////////////////////////////////////////////
             /** r(C0.C1) :== r(C0)+r(C1) if v(C0), r(C0) otherwise */
             isReadable: function(name) {
               if(contract0.isNullable()) return (contract0.isReadable(name) || contract1.isReadable(name))
               else return contract0.isReadable(name);
             },
             /** r(C0.C1) :== w(C1) if v(C0), w(C0) if v(C1,) false otherwise */
             isWriteable: function(name) {
               if(contract0.isNullable()) return contract1.isWriteable(name);
               else if(contract1.isNullable()) return contract0.isWriteable(name);
               else return false;
             },
             //////////////////////////////////////////////////
             /** first(C0.C1) ::= first(C1) if v(C0), first(C0) otherwise */
             first: function() {
               if(contract0.isNullable()) return  contract0.first().concat(contract1.first());
               else return contract0.first();
             },
             /** (d_name C0.C1) :== (d_name C0).C1 + (d_name C1) if v(C0), (d_name C0).c1 otherwise */
             derive: function(name) {
               if(contract0.isNullable()) return new __OrContract(__ConcatContract(contract0.derive(name), contract1), contract1.derive(name));
               else return new __ConcatContract(contract0.derive(name), contract1);
             },
             /** (d_literal C0.C1) ::= (d_literal C0).C1 + (d_literal C1) if v(C0), (d_literal C0).c1 otherwise */
             lderive: function(larg) {
               /** (d_^ C?) ::= C? */
               /*if (larg==new __EmptyLiteral()) return this;
                 else*/ if(contract0.isNullable()) return new new __OrContract(new __ConcatContract(contract0.lderive(larg), contract1), contract1.lderive(larg));
               else return new __ConcatContract(contract0.lderive(larg), contract1);
             },
             //////////////////////////////////////////////////
             /** ctx |- C <= this */
             isSuperSetOf: function(arg, ctx) {
               /** C <= C' |= true  | C=C' */
               //							   if(arg==this) return true;
               /** ^ <= C' |= true  | v(C') */
               //							   else if((arg==new __EmptyLiteral()) && this.isNullable()) return true;
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
             },
             /** ctx |- C >= this */
             isSubSetOf: function(arg, ctx) {
               return arg.isSuperSetOf(this, ctx);
             },
             //////////////////////////////////////////////////
             /** reduce C.C' */
             reduce: function() {
               /** (C.C') ~ {} | n(C) */
               if(contract0.isEmpty()) return new __EmptySetLiteral();
               /** (C.C') ~ {} | w(C) */
               else if(contract0.isBlank()) return new __AtLiteral();
               /** reduce C.C' ::= (reduce C).(reduce C') */
               else return new __ConcatContract(contract0.reduce(), contract1.reduce());
             },
             //////////////////////////////////////////////////
             /** Dump
              * @return string
              */
             dump: function() {
               return  " " + contract0.dump() + " . " +  contract1.dump() +  " ";
             },
             /** To String
              * @return string
              */
             toString: function() {
               return contract0.toString() + "." + contract1.toString();
             }
      });
    }



    //////////////////////////////////////////////////
    // APC . Contract
    //////////////////////////////////////////////////
    APC.Contract = {};

    APC.Contract.EmptySetLiteral	= __EmptySetLiteral;
    APC.Contract.EmptyLiteral		= __EmptyLiteral;

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
      if(verbose) __sysout("## isSuperSetOf: " + E + ">=" + F);
      if(verbose) __sysout("## first: " + first);

      var result = true;

      first.foreach(function(k, literal) {

        var lderive_E = E.lderive(literal);
        var lderive_F = F.lderive(literal);

        if(verbose) __sysout("## derive: " + literal);
        if(verbose) __sysout("## lderive_E: " + lderive_E);
        if(verbose) __sysout("## lderive_F: " + lderive_F);

        result = result && lderive_E.isSuperSetOf(lderive_F, ctx);

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
      return {
        /** To String
         * @return string
         */
        toString: function() {
          return contract0.toString() + "<=" + contract1.toString();
        }
      }
    }

    /** Containment Calculus
     * Context: {} | <Context, Expression>
     */
    function __CcContext() {	
      // cache array
      var context = new StringMap();

      var key = function(v) {
        return ("\"" + v + "\"");		
      }

      return {

        /* bind function
         * @param CC Expression
         * @return <CC Context, CC Expression>
         */
        bind: function(ccExp) {
          // clone context
          var newCtx = new __CcContext();
          context.foreach(function(k, v) {
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
            context.set(ccExp.toString(), ccExp);
            return ccExp;
          },

          /* get
           * @param ccExp CC Expression
           * $return CC Expression
           */
          get: function(ccExp) {
            return context.get(ccExp.toString());
          },

          /* contains
           * @param ccExp CC Expression
           * $return true, if ccExp in cache, false otherwise
           */
          contains: function(ccExp) {
            return context.has(ccExp.toString());
          }
      }
    };



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
      var cache = new StringMap();

      return {

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
            cache.set(key, value);
            return value;
          },

          /* get
           * @param key cache key
           * $return value
           */
          get: function(key) {
            return cache.get(key);
          },

          /* contains
           * @param key cache key
           * $return true, if key in cache, false otherwise
           */
          contains: function(key) {
            return cache.has(key);
          },

          /* clear cache
          */
          clear: function() {
            cache = new StringMap();
          }
      }
    }

    // current path cache
    var __cache = new __ContractCache();



    //////////////////////////////////////////////////
    // APC . Contract
    //////////////////////////////////////////////////
    APC.Contract.Cache = __cache;



  })(APC);

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
   * $Date: 2013-03-07 11:18:52 +0100 (Thu, 07 Mar 2013) $
   * $Rev: 23136 $
   */
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



























  // xxx

  var contract = APC.Parser.parse(str);

  var any = Contract.Base(function(property) {
    return true;
  });
  var readable = Contract.Base(function(name) {
    print("readable? " + name + " " + contract.isReadable(name));
    return contract.isReadable(name);
    //return (property!=="b");
    //return true;
  });
  var writeable = Contract.Base(function(name) {
    print("writeable? " + name + " " + contract.isWriteable(name));

    return contract.isWriteable(name);
    //return true;
  });

//  var get = Contract.Get(Contract.And(
//        Contract.AFunction({1:readable}, any),
//        any
//        //Contract.Dependent(Contract.Constructor(ctor))
//        ));
   var get = Contract.Get(Contract.AFunction({1:readable}, any));
  var set = Contract.Set(Contract.AFunction({1:writeable}, any));

  return Contract.And(get, set);
});

var Access = AccessContract.ctor;


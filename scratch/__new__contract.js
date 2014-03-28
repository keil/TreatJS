var $ = new Object();

// TODO, add verbose mode

(function($){

        var _ = $.Contract = new Object();

        // arg --> bool
        BaseContract = function() {
                this.verify = function(arg) {return true};
                this.toString = function() {return this.verify.toString();}
        }

        FunctionContract = function(c1, c2) {
                this.c1 = c1;
                this.c2 = c2;
        };

        /*
         */
        GraterThanZero = function() {
                this.verify = function(arg) {return (arg>0)};
        }
        GraterThanZero.prototype = new BaseContract();

        /*
         */
        IsNumber = function() {
                this.verify = function(arg) {
                        return ((typeof arg) == "number")};
        }
        IsNumber.prototype = new BaseContract();

        /*
         */
        IsString = function() {
                this.verify = function(arg) {return ((typeof arg) == "string")};
        }
        IsString.prototype = new BaseContract();


        _.BaseContract = BaseContract;
        _.FunctionContract = FunctionContract;

        _.IsNumber = IsNumber;
        _.IsString = IsString;
        _.GraterThanZero = GraterThanZero;

})($);




(function($) {

        var _ = $;

        function error(msg) {
                __sysout("Error: " + msg);
                quit();
        }

        function assign(arg, contract) {
                if(contract instanceof $.Contract.FunctionContract) {
                        // TODO, chech if function
                        var handler = new FunctionHandler(contract);
                        var proxy = new Proxy(arg, handler);
                        // TODO: cache
                        return proxy;
//                } else if (contract instanceof $.Contract.ObjectContract) {
//                        // TODO:check if Object make proxy
                } else if(contract instanceof $.Contract.BaseContract) {
                        // TODO, cheeck if primitive, what to do else ?
                        var valid = contract.verify(arg);
                        if(!valid) error("violated contract: " + contract.toString());
                        else return arg;
                        // TODO: verify contract
                }

        // TODO, else ?
        }


        // TODO, this code considers only functions with exaxtly one argument
        // an extension is possible
        function FunctionHandler(contract) {
                this.apply = function(target, thisArg, args) {
                                args[0] = assign(args[0], contract.c1);
                                var val = target.apply(thisArg, args);
                                return assign(val, contract.c2);
						};
						
                this.construct = function(target, args) {
                        return this.apply(target, this, args);
                }
        }


        _.assign = assign;


})($);




var func        = function(x) {return 4711;}
var func2       = function(x) {return "adsf";}
var contract    = new $.Contract.FunctionContract(new $.Contract.IsNumber(), new $.Contract.IsNumber());

// test : Number --> Number
var test        = $.assign(func, contract);
var test2       = $.assign(func2, contract);


//__sysout(test);

print( test(1) );
//print( test(new Number(1)) );
//print( test("a") );

//$.Contract.IsNumber = {verify:function(){return true;}};

// wenn ich aber keine reference auf das object habe, kann ich es dann austauschen ?
contract.c2 = new $.Contract.IsString();
print(contract.c2);

print( test2(1) );

//print( test2("a") );





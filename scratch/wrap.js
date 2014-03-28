//(function(){

function wrap(arg, allowedScope) {

        function violation(msg, file, line) {
                __sysout("Violation: (" + file + ":" + line + "):\n" + msg);
                quit();
        }

        function ScopeHandler(allowedScope) {
                this.get = function (target, key) {
                        __sysout("[[GET]] " + key);
                        if(key in allowedScope)
                                return allowedScope[key] || undefined;
                        else 
                                violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.set = function (target, key, vValue) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.delete = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.enumerate = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);

                };
                this.iterate = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.keys = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);

                };
                this.has = function (target, key) {
                    //    __sysout("[[HAS]] " + key + (key in allowedScope));
                        if(key in allowedScope)
                                return key in allowedScope;
                        else 
                                violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.hasOwn = function (target, key) {
                        if(key in allowedScope)
                                return target.hasItem(key);
                        else 
                                violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);

                };
                this.defineProperty = function (target, key, oDesc) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);

                };
                this.getPropertyNames = function (target) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.getOwnPropertyNames = function (target) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);

                };
                this.getPropertyDescriptor = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.getOwnPropertyDescriptor = function (target, key) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
                this.fix = function (target) {
                        violation("Unauthorized Access " + key, (new Error()).fileName, (new Error()).lineNumber);
                };
        }

        return new Proxy(arg, new ScopeHandler(allowedScope));


}


var x = "x";
this.y = "y";

var xx = "xx";
this.yy = "yy";


function test2() {
        print("xx is: " + xx);
        print("yy is: " + yy);
        //print("this.xx is: " + this.xx);
        //print("this.yy is: " + this.yy);

        xx = "abc";
        var xx = "abc";

        //this.yy = "abc";
        var yy = "abc";

        return Math.abs("324");

}

function test() {

        print("x is: " + x);
        print("y is: " + y);
        //print("this.x is: " + this.x);
        //print("this.y is: " + this.y);

        // read access to x
        x;

        // write access to x;
        x = "4711";

        // create var x
        var x = 4712;

        // read access to x again
        x;

        // write access to x again;
        x = "4711";


        // read access to y
        //this.y;

        // write access to y;
        //this.y = "4711";

        // create var y
        var y = 4712;

        // read access to x again
        //this.y;

        // write access to x again;
        //this.y = "4711";

        test2();

}

with(wrap({}, {eval:eval, print:print, test:test, wrap:wrap, test2:test2})) {
        eval("("+test.toString()+").apply(wrap({},{}));");
}

print("x is: " + x);
print("y is: " + y);
print("this.x is: " + this.x);
print("this.y is: " + this.y);

print("xx is: " + xx);
print("yy is: " + yy);
print("this.xx is: " + this.xx);
print("this.yy is: " + this.yy);

//})();

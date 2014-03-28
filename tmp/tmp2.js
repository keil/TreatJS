function wrap(arg, env) {
//        return arg;
        return new Proxy(arg, {
                "get": function (oTarget, sKey) {
                        __sysout(env + "[[get]]" + sKey);

                        return oTarget[sKey] /*|| oTarget.getItem(sKey)*/ || undefined;
                },
               "set": function (oTarget, sKey, vValue) {
                       __sysout(env + "[[set]]" + sKey);

                       if (sKey in oTarget) { return false; }
                       return (oTarget[sKey] = vValue);
               },
               "delete": function (oTarget, sKey) {
                       __sysout(env + "[[delete]]" + sKey);

                       if (sKey in oTarget) { return false; }
                       return oTarget.removeItem(sKey);
               },
               "enumerate": function (oTarget, sKey) {
                       __sysout(env + "[[enumerate]]" + sKey);

                       return oTarget.keys();
               },
               "iterate": function (oTarget, sKey) {
                       __sysout(env + "[[SETiterate" + sKey);

                       return oTarget.keys();
               },
               "keys": function (oTarget, sKey) {
                       __sysout(env + "[[keys]]" + sKey);

                       return oTarget.keys();
               },
               "has": function (oTarget, sKey) {
                       __sysout(env + "[[has]]" + sKey);

                       return sKey in oTarget /*|| oTarget.hasItem(sKey)*/;
               },
               "hasOwn": function (oTarget, sKey) {
                       __sysout(env + "[[hasOwn]]" + sKey);

                       return oTarget.hasItem(sKey);
               },
               "defineProperty": function (oTarget, sKey, oDesc) {
                       __sysout(env + "[[defineProperty]]" + sKey);

                       if (oDesc && "value" in oDesc) { oTarget.setItem(sKey, oDesc.value); }
                       return oTarget;
               },
               "getPropertyNames": function (oTarget) {
                       __sysout(env + "[[getPropertyNames]]" + name);

                       return Object.getPropertyNames(oTarget).concat(oTarget.keys());
               },
               "getOwnPropertyNames": function (oTarget) {
                       __sysout(env + "[[getOwnPropertyNames]]");

                       return Object.getOwnPropertyNames(oTarget).concat(oTarget.keys());
               },
               "getPropertyDescriptor": function (oTarget, sKey) {
                       __sysout(env + "[[getPropertyDescriptor]]" + sKey);

                       var vValue = oTarget[sKey] || oTarget.getItem(sKey)
                               return vValue ? {
                                       "value": vValue,
                                               "writable": true,
                                               "enumerable": true,
                                               "configurable": false
                               } : undefined;
               },
               "getOwnPropertyDescriptor": function (oTarget, sKey) {
                       __sysout(env + "[[getOwnPropertyDescriptor]]" + sKey);

                       var vValue = oTarget.getItem(sKey);
                       return vValue ? {
                               "value": vValue,
                                       "writable": true,
                                       "enumerable": true,
                                       "configurable": false
                       } : undefined;
               },
               "fix":  function (oTarget) {
                       __sysout(env + "[[FIX]]" );

                       return "not implemented yet!";
               },
        });
}


/*

var out1 = 1;
this.out2 = 2;

var chacha = "chacha";
var martha = "martha";


function test2() {

}

      function test() {

     print("@" + chacha); 
     this.martha="4711";
       // print("@1 " + arg);
        //print("@1 " + (thisArg===this));
        //__sysout("CALL __sysout");
        //print("CALL print");
}




//with(wrap({chacha:4712,thisArg:wrap({}, "this"), }, "scope")) {
with(wrap({chacha:4712})) {

        function xtest() {

     print("@" + chacha); 
       // print("@1 " + arg);
        //print("@1 " + (thisArg===this));
        //__sysout("CALL __sysout");
        //print("CALL print");
}


        (test.apply(wrap({chacha:4711})));


        eval("("+test.toString()+").apply(wrap({chacha:4711}))");

        
        //print("@2 " + arg);
        //print("@2 " + (thisArg===this));
        //print(arg);
        //eval("("+test.toString()+").apply({out1:654});");
        //eval("(("+test.toString()+").bind({chacha:4711}))()");

               //test();
}
print("AFTER CALL:" + out1); 



//testfunc();

//print("@@@" + wtd);

/*
var x = 9; 
var module = {
  x: 81,
  getX: function() { return this.x; }
};

print(module.getX()); // 81

var getX = module.getX;
print(getX()); // 9, because in this case, "this" refers to the global object

// create a new function with 'this' bound to module
var boundGetX = getX.bind(module);
print(boundGetX()); // 81

var chacha = 4711;
;

((function() { print(this.chacha)}).bind({chacha:333}))();

*/

//quit();
//


//var scope = {chacha:4712}
//var chacha = 4711;

//print(evalcx("(function(){return this.chacha;})()"), scope);



/*
var g = newGlobal();
print(g);
print(g===this);

f = function() {return this.chacha;}
f();

*
* /
*
*/

/*
for (var i = 0; i <= 100; i++) {
        var g = newGlobal();
        //gg = evalcx("var martha = (function(){return 4711;});", g)
        print(evalcx("(function(){return this.martha();})()"), {martha:function(){return 4711;}});
}
*/

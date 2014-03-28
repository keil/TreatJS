// NOTE: Old evaluation of base contracts
//
// 
                    //    contract = new String("function(arg) { chacha=chacha+1; writeChaCha(); return (arg>=x);}");
/*
var string = "(" + contract.toString() + ")(arg)";
                                print ( "EVAL: " + string);


                        var protectedScope = {chacha:7654};
                        with(new Proxy(protectedScope, new ScopeHandler(protectedScope))) {
                                                                
                                //print("(" + contract.toString() + ")(arg)");
                                if(!eval("(" + contract.toString() + ")(arg)"))
                                       
                                else 
                                        return arg;

                        }; 


*/



                                //contract(arg);
                       // var func = new Proxy(contract, new BaseHandler({}));
                      //  func(arg);

                        //var protectedScope = {Proxy:Proxy, BaseHandler:BaseHandler, contract:contract, arg:arg, eval:eval, violation:violation, Error:Error, print:print, predicate:null};
                       /* with(new Proxy({}, new ScopeHandler({}))) {
                               if(!contract(arg))
                                        violation("Violated Contract: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
                                else 
                                        return arg;

                        }

                        */


                }


//                        var predicate = (function (arg) {  return typeof arg == "number"; });
//                        print(typeof predicate); new Proxy(predicate, new BaseHandler({}))(arg);  
//__sysout("44444444444444444");


                        //var predicate = new Proxy(contract, new BaseHandler());




                        // TODO, das this is zugreifbar aus dem wisth .. sollte faher das predicate in einen handelr eingepackt werden
                        // TODO
                       // if(!(contract instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                       // this.chacha = "<3";
                      //  print("&&&1 " + this.chacha);
    /**                    var protectedScope = {Proxy:Proxy, BaseHandler:BaseHandler, contract:contract, arg:arg, eval:eval, violation:violation, Error:Error, print:print, predicate:null};
                        with(new Proxy(protectedScope, new ScopeHandler(protectedScope))) {
                                //this.print(this.s);
                            //    if(!eval("(" + contract.toString() + ")(arg)"))
                               // if(!eval("(" + predicate.toString() + ")(arg)"))
                                //if(!eval("predicate(arg)"))
                                //
                               // eval("var predicate = (" + contract.toString() + "); + print(typeof predicate);");
                               //
                               
                              //  print("print(typeof predicate); new Proxy( (" + contract.toString() + "), new BaseHandler())(arg);")

                                if(!eval("new Proxy( (" + contract.toString() + "), new BaseHandler())(arg);"))
                            //            if(false)
                                        violation("Violated Contract: " + contract.toString(), (new Error()).fileName, (new Error()).lineNumber);
                                else 
                                        return arg;

                        }; 
                }
*/
/*


                else if (contract instanceof BaseContract) {
                        __sysout("adfasd");
                        with(new Proxy(this, new ScopeHandler(contract.scope))) {
                                //   Math.abs(1); 
                                //contract.predicate(4);
                                if(!eval("(" + contract.predicate.toString() + ")(arg)"))
                                        error("Violated Contract: " + contract.toString());
                                else 
                                        return arg;

                                // //var valid = (contract instanceof Function) ? (contract(arg)==true) : false;
                                // if(!valid) error("Violated Contract: " + contract.toString());
                                // else return arg;

                                //return false;
                                return assert(arg, contract.predicate) 
                        }; 
                } else {
                        // TODO, bind args

                        var valid =  eval("(" + contract.toString() + ")(arg)");
                        //var valid = (contract instanceof Function) ? (contract(arg)==true) : false;
                        if(!valid) error("Violated Contract: " + contract.toString());
                        else return arg;
                }
                */

                // TODO
                // give assert a return value {true, false} and evaluate it if required
                // needed to implement OR


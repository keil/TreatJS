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

        //  _____      _ _ _                _        
        // / ____|    | | | |              | |       
        //| |     __ _| | | |__   __ _  ___| | _____ 
        //| |    / _` | | | '_ \ / _` |/ __| |/ / __|
        //| |___| (_| | | | |_) | (_| | (__|   <\__ \
        // \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/

        function Callback(callback) {
                if(!(this instanceof Callback)) return new Callback(callback);

                var sub;
                var subMsg;

                function evalCallback() {
                        if((sub==true) || (sub==false)) {
                                callback(sub, subMsg);
                        }
                }
                function updateSub(arg, msg) {
                        sub = (sub!=false) ? arg : sub;
                        subMsg = (sub!=false) ? msg : subMsg;
                }

                Object.defineProperties(this, {
                        "subHandler": {
                                get: function(arg, msg) {
                                        updateSub(arg, msg);
                                        evalCallback()
                                }}
                });
        }

        function AndCallback(callback) {
                if(!(this instanceof AndCallback)) return new AndCallback(callback);

                var left;
                var leftMsg;

                var right;
                var rightMsg;

                function evalCallback() {
                        if((left==false) || (right==false)) {
                                callback(false, leftMsg+" [[AND]] "+rightMsg);
                        } else if((left==true) && (right==true)) {
                                callback(true, leftMsg+" [[AND]] "+rightMsg);
                        }
                }
                function updateLeft(arg, msg) {
                        left = (left!=false) ? arg : left;
                        leftMsg = (left!=false) ? msg : leftMsg;
                }
                function updateRight(arg, msg) {
                        right = (right!=false) ? arg : right;
                        rightMsg = (right!=false) ? msg : rightMsg;
                }

                Object.defineProperties(this, {
                        "leftHandler": {
                                get: function(arg, msg) {
                                        updateLeft(arg, msg);
                                        evalCallback()
                                }},
                        "rightHandler": {
                                get: function(arg, msg) {
                                        updateRight(arg, msg);
                                        evalCallback()
                                }},
                });
        }

        function OrCallback(callback) {
                if(!(this instanceof OrCallback)) return new OrCallback(callback);

                var left;
                var leftMsg;

                var right;
                var rightMsg;

                function evalCallback() {
                        if((left==false) && (right==false)) {
                                callback(false, leftMsg+" [[OR]] "+rightMsg);
                        } else if((left==true) || (right==true)) {
                                callback(true, leftMsg+" [[OR]] "+rightMsg);
                        }
                }
                function updateLeft(arg, msg) {
                        left = (left!=false) ? arg : left;
                        leftMsg = (left!=false) ? msg : leftMsg;
                }
                function updateRight(arg, msg) {
                        right = (right!=false) ? arg : right;
                        rightMsg = (right!=false) ? msg : rightMsg;
                }

                Object.defineProperties(this, {
                        "leftHandler": {
                                get: function(arg, msg) {
                                        updateLeft(arg, msg);
                                        evalCallback()
                                }},
                        "rightHandler": {
                                get: function(arg, msg) {
                                        updateRight(arg, msg);
                                        evalCallback()
                                }},

                });
        }

        function NotCallback(callback) {
                if(!(this instanceof NotCallback)) return new NotCallback(callback);

                var sub;
                var subMsg;

                function evalCallback() {
                        if((sub==true) || (sub==false)) {
                                callback(!sub, "[[NOT]] "+subMsg);
                        }
                }
                function updateSub(arg, msg) {
                        sub = (sub!=false) ? arg : sub;
                        subMsg = (sub!=false) ? msg : subMsg;
                }

                Object.defineProperties(this, {
                        "subHandler": {
                                get: function(arg, msg) {
                                        updateSub(arg, msg);
                                        evalCallback()
                                }}
                });
        }

        _.Callback = Callback;
        _.AndCallback = AndCallback;
        _.OrCallback = OrCallback;
        _.NotCallback = NotCallback;

})(_);

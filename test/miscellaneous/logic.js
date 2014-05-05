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

var u = _.Logic.Unknown;
var f = _.Logic.False;
var t = _.Logic.True;
var x = _.Logic.Conflict;

function test(v,vp,op,r) {
  switch(op) {
    case 'and':
      out2(v,vp,op,r,(_.Logic.and(v,vp)===r));
      break;
    case 'or':
      out2(v,vp,op,r,(_.Logic.or(v,vp)===r));
      break;
    case 'not':
      out1(v,vp,op,r,(_.Logic.not(v)===r));
      break;
  }

  function out1(v,vp,op,r,s) {
    var sp = s ? 'TRUE  ' : 'FALSE ';
    print(sp+op+v.toString()+'='+r.toString());
  }

  function out2(v,vp,op,r,s) {
    var sp = s ? 'TRUE  ' : 'FALSE ';
    print(sp+v.toString()+op+vp.toString()+'='+r.toString());
  }
}

// not
print("\n\n** NOT **\n");

test(u,undefined,'not',u);
test(f,undefined,'not',t);
test(t,undefined,'not',f);
test(x,undefined,'not',x);

// and
print("\n\n** AND **\n");

test(u,u,'and',u);
test(u,f,'and',f);
test(u,t,'and',u);
test(u,x,'and',f);

test(f,u,'and',f);
test(f,f,'and',f);
test(f,t,'and',f);
test(f,x,'and',f);

test(t,u,'and',u);
test(t,f,'and',f);
test(t,t,'and',t);
test(t,x,'and',x);

test(x,u,'and',f);
test(x,f,'and',f);
test(x,t,'and',x);
test(x,x,'and',x);

// and
print("\n\n** OR **\n");

test(u,u,'or',u);
test(u,f,'or',u);
test(u,t,'or',t);
test(u,x,'or',t);

test(f,u,'or',u);
test(f,f,'or',f);
test(f,t,'or',t);
test(f,x,'or',x);

test(t,u,'or',t);
test(t,f,'or',t);
test(t,t,'or',t);
test(t,x,'or',t);

test(x,u,'or',t);
test(x,f,'or',x);
test(x,t,'or',t);
test(x,x,'or',x);

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
    case 'implies':
      out2(v,vp,op,r,(_.Logic.implies(v,vp)===r));
      break;
    case 'lesseq':
      out2(v,vp,op,r,(_.Logic.lesseq(v,vp)===r));
      break;
    case 'not':
      out1(v,vp,op,r,(_.Logic.not(v)===r));
      break;
    case 'convolution':
      out1(v,vp,op,r,(_.Logic.convolution(v)===r));
      break;
    case 'meet':
      out2(v,vp,op,r,(_.Logic.meet(v,vp)===r));
      break;
    case 'join':
      out2(v,vp,op,r,(_.Logic.join(v,vp)===r));
      break;
    case 'entails':
      out2(v,vp,op,r,(_.Logic.entails(v,vp)===r));
      break;
    case 'subseteq':
      out2(v,vp,op,r,(_.Logic.subseteq(v,vp)===r));
      break;
    case 'neg':
      out1(v,vp,op,r,(_.Logic.neg(v)===r));
      break;

  }

  function out1(v,vp,op,r,s) {
    var sp = s ? 'TRUE  ' : 'FALSE ';
    print(sp+" "+op+" "+v.toString()+' = '+r.toString());
  }

  function out2(v,vp,op,r,s) {
    var sp = s ? 'TRUE  ' : 'FALSE ';
    print(sp+v.toString()+" "+op+" "+vp.toString()+' = '+r.toString());
  }
}

// convolution
print("\n\n** CONVOLUTION **\n");

test(u,undefined,'convolution',x);
test(f,undefined,'convolution',t);
test(t,undefined,'convolution',f);
test(x,undefined,'convolution',u);

// truth

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

// or
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

// implies
print("\n\n** IMPLIES **\n");

test(u,u,'implies',t);
test(u,f,'implies',x);
test(u,t,'implies',t);
test(u,x,'implies',x);

test(f,u,'implies',t);
test(f,f,'implies',t);
test(f,t,'implies',t);
test(f,x,'implies',t);

test(t,u,'implies',u);
test(t,f,'implies',f);
test(t,t,'implies',t);
test(t,x,'implies',x);

test(x,u,'implies',u);
test(x,f,'implies',u);
test(x,t,'implies',t);
test(x,x,'implies',t);

// lesseq
print("\n\n** LESSEQ **\n");

test(u,u,'lesseq',t);
test(u,f,'lesseq',f);
test(u,t,'lesseq',t);
test(u,x,'lesseq',f);

test(f,u,'lesseq',t);
test(f,f,'lesseq',t);
test(f,t,'lesseq',t);
test(f,x,'lesseq',t);

test(t,u,'lesseq',f);
test(t,f,'lesseq',f);
test(t,t,'lesseq',t);
test(t,x,'lesseq',f);

test(x,u,'lesseq',f);
test(x,f,'lesseq',f);
test(x,t,'lesseq',t);
test(x,x,'lesseq',t);

// knowledge 

// not
print("\n\n** NEQ **\n");

test(u,undefined,'neg',u);
test(f,undefined,'neg',t);
test(t,undefined,'neg',f);
test(x,undefined,'neg',x);

// and
print("\n\n** MEET **\n");

test(u,u,'meet',u);
test(u,f,'meet',u);
test(u,t,'meet',u);
test(u,x,'meet',u);

test(f,u,'meet',u);
test(f,f,'meet',f);
test(f,t,'meet',u);
test(f,x,'meet',f);

test(t,u,'meet',u);
test(t,f,'meet',u);
test(t,t,'meet',t);
test(t,x,'meet',t);

test(x,u,'meet',u);
test(x,f,'meet',f);
test(x,t,'meet',t);
test(x,x,'meet',x);

// or
print("\n\n** JOIN **\n");

test(u,u,'join',u);
test(u,f,'join',f);
test(u,t,'join',t);
test(u,x,'join',x);

test(f,u,'join',f);
test(f,f,'join',f);
test(f,t,'join',x);
test(f,x,'join',x);

test(t,u,'join',t);
test(t,f,'join',x);
test(t,t,'join',t);
test(t,x,'join',x);

test(x,u,'join',x);
test(x,f,'join',x);
test(x,t,'join',x);
test(x,x,'join',x);

// implies
print("\n\n** ENTAILS **\n");

test(u,u,'entails',x);
test(u,f,'entails',x);
test(u,t,'entails',x);
test(u,x,'entails',x);

test(f,u,'entails',t);
test(f,f,'entails',x);
test(f,t,'entails',t);
test(f,x,'entails',x);

test(t,u,'entails',f);
test(t,f,'entails',f);
test(t,t,'entails',x);
test(t,x,'entails',x);

test(x,u,'entails',u);
test(x,f,'entails',f);
test(x,t,'entails',t);
test(x,x,'entails',x);

// lesseq
print("\n\n** SUBSETEQ **\n");

test(u,u,'subseteq',t);
test(u,f,'subseteq',t);
test(u,t,'subseteq',t);
test(u,x,'subseteq',t);

test(f,u,'subseteq',f);
test(f,f,'subseteq',t);
test(f,t,'subseteq',f);
test(f,x,'subseteq',t);

test(t,u,'subseteq',f);
test(t,f,'subseteq',f);
test(t,t,'subseteq',t);
test(t,x,'subseteq',t);

test(x,u,'subseteq',f);
test(x,f,'subseteq',f);
test(x,t,'subseteq',f);
test(x,x,'subseteq',t);

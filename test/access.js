var con = __APC.Parser.parse("a.a");

print(__APC.Contract.Null);

var target = {a:{a:{}, b:{}, c:{}}, b:{a:{}, b:{}, c:{}}, c:{a:{}, b:{}, c:{}}};
var object = Contract.assert(target, Contract.With(__APC.Contract, Access(con, __APC)));

object.a;

//object.b;
//object.a.a;
//object.a.b;

//object.a = 7;
//object.b = 7;

////object.a.a = 7;
//
//object.a.b = 7;
//object.b.a = 7;


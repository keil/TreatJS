var con = __APC.Parser.parse("a.a");

var target = {a:{a:{}, b:{}, c:{}}, b:{a:{}, b:{}, c:{}}, c:{a:{}, b:{}, c:{}}};
var object = Contract.assert(target, Contract.With({a:2}, Access(con)));

object.a;
//object.b;
//object.a.a;
//object.a.b;

//object.a = 7;
//object.b = 7;

object.a.a = 7;
//object.a.b = 7;
//object.b.a = 7;


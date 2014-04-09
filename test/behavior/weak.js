/*
var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}));

test.a;
test.b;
//test.c;


*/
var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true));

test.a;
test.b;
//test.c;
//
//
//
//

var c = _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true, true);

print(c.strict);
print(c.sign);
print(c.map);


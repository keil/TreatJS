var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, false, true));

//test.a;
//test.b;
test.c;
//test.a;

var obj = {a:"4711", b:4712, c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true, true));

test.a;
test.b;
test.c;


var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.Not(_.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, false, true)));

test.a;
//test.b;
test.c;
//test.a;

var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.Not(_.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true, true)));

//test.a;
//test.b;
//test.c;

test.c = 4711;
test.c;

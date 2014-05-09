var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, false));

test.a;
test.b;
//test.c;
test.a;

var obj = {a:4711, b:"4712", c:true}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true));

//test.a;
//test.b;
//test.c;

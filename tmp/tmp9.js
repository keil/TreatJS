



/**
var a = {a:"L", b:"LL", c:{}};
for(var p in a) print(";;; a[" + p + "]: " + a[p]);
print("\n\n");

function clone(obj) {
        var tmp = {};
        for(var property in obj) tmp[property] = obj[property];
        return tmp;
}

function clear(obj) {
        for(var property in obj) delete obj[property];
}

// copy objA[property] => objB[property]
function copy(objA, objB) {
        for(var property in objA) objB[property]=objA[property];
}


var b = clone(a);
for(var p in a) print(";;; a[" + p + "]: " + a[p]);
for(var p in b) print(";;; b[" + p + "]: " + b[p]);
for(var p in b) print(";;; b[" + p + "] == a[" + p + "]: " + (a[p]==b[p]));
print("\n\n");


clear(a);
for(var p in a) print(";;; a[" + p + "]: " + a[p]);
for(var p in b) print(";;; b[" + p + "]: " + b[p]);
for(var p in b) print(";;; b[" + p + "] == a[" + p + "]: " + (a[p]==b[p]));
print("\n\n");

copy(b,a);
for(var p in a) print(";;; a[" + p + "]: " + a[p]);
for(var p in b) print(";;; b[" + p + "]: " + b[p]);
for(var p in b) print(";;; b[" + p + "] == a[" + p + "]: " + (a[p]==b[p]));

**/




//for(i in a) print(a[i]);
/**
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor();
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}

var b = cloneObject(a);

//for(i in b) print(b[i]);

a.clear();
//for(i in a) print(a[i]);


for(p in b) {
a[p]=b[p];
}

for(i in a) print(a[i]);

for(i in b) print(b[i]==a[i]);

/*
function A(v) {
        this.v = function() { return v;};
}

var theV = "LL";

var con = function() {
        var v = theV;
        return  new A(v);
};

var aa = new A();
var ab = new con();

var theV = "LL";

var con = function() {
        var v = theV;
        return  new A(v);
};

var ac = new con();

print("#1 " + aa.v());
print("#2 " + ab.v());
print("#3 " + ac.v());

*/


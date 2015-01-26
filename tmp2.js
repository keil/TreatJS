

var object = {a:1, b:2, c:3};

var handler = {get:function(target, name, receiver) {
  print("@CALL " + name);
  return target[name];
}};

var metahandler = {get:function(target, name, receiver) {
  print("@METACALL " + name);
  //return target[name];
  return (target[name]) ? function(targetP, nameP, receiverP) {
    return (target[name])(targetP, nameP, receiverP);
  } : undefined;
}};

var proxy = new Proxy(object, new Proxy(handler, metahandler));

print(proxy.a);
print(proxy.a = 2);
print(proxy.a);






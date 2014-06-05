function _wrap_(fn) {
	return fn;
}

function add(x, y) {
    return _wrap_(function (x, y) {
        return x + y;
    }).bind(this)(x, y);
}

print(add(2, 3));

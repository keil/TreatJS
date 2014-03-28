// left padding s with c to a total of n chars
function padding_left(s, c, n) {
		if (! s || ! c || s.length >= n) {
				return s;
		}

		var max = (n - s.length)/c.length;
		for (var i = 0; i < max; i++) {
				s = c + s;
		}

		return s;
}

// right padding s with c to a total of n chars
function padding_right(s, c, n) {
		if (! s || ! c || s.length >= n) {
				return s;
		}

		var max = (n - s.length)/c.length;
		for (var i = 0; i < max; i++) {
				s += c;
		}

		return s;
}

// left margin s with n times c
function margin_left(s, c, n) {
		var margin = '';
		for(i=0; i<n; i++) {
				margin += c;
		}

		return (margin+s);
}

// right margin s with n times c
function margin_right(s, c, n) {
		var margin = '';
		for(i=0; i<n; i++) {
				margin += c;
		}

		return (s+margin);
}

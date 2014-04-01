default: bootstrap.js
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap.js -i

run: bootstrap_test.js
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap_test.js -i

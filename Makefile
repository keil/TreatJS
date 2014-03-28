default:
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap.js -i
	#	../../js/src/shell/js -f bootstrap.js -i

test:
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap_test.js -i
	#../../js/src/shell/js -f bootstrap_test.js -i

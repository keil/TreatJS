default:
	js -f bootstrap.js -i
#	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap.js -i

run:
	js -f bootstrap_test.js -i
#	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap.js -i	

octane:
	js -f bootstrap_benchmark.js -i
#	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap_benchmark.js -i

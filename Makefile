default:
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap.js -i

run:
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap_test.js -i

octane:
	../../mozjs-24.2.0/js/src/shell/js24 -f bootstrap_benchmark.js -i

default:
	./js -f bootstrap.js -f src/shell.js -i

.PHONY: test
test:
	./js -f bootstrap.js -f src/shell.js -f test/test.js -i

octane:
	./js -f bootstrap.js -f src/shell.js -f benchmark/ocaten/octane.js -i

#typed:
#	./js -f bootstrap_typedoctane.js -i

inference:
	./js -f bootstrap.js -f src/shell.js -f bootstrap_typedoctane.js -f benchmark/typedoctane/inference.js

inferencef:
	rm -f benchmark/typedoctane/TYPES.js
	./js -f bootstrap.js -f src/shell.js -f bootstrap_typedoctane.js -f benchmark/typedoctane/inference.js >> benchmark/typedoctane/TYPES.js

typed:
	./js -f bootstrap.js -f src/shell.js -f bootstrap_typedoctane.js -f benchmark/typedoctane/typed.js

default:
	./js -f shell/shell.js -f bootstrap.js -f test/default.js -i

# -f contracts/contracts.js



noion:
	./js --no-ion -f src/shell.js -f bootstrap.js -f contracts/contracts.js -f test/default.js -i

nojit:
	./js --no-ion --no-baseline -f src/shell.js -f bootstrap.js -f contracts/contracts.js -f test/default.js -i

treatjs:
	./js -f src/shell.js -f bootstrap.js -f contracts/contracts.js -i

.PHONY: test
test:
	./js -f src/shell.js -f bootstrap.js -f contracts/contracts.js -f contracts/aliases.js -f test/test.js -i

octane:
	./js -f src/shell.js -f bootstrap.js -f benchmark/octane/octane.js -i

inference:
	./js -f src/shell.js -f bootstrap.js -f benchmark/typedoctane/typedoctane.js -f benchmark/typedoctane/inference.js

inferencef:
	rm -f benchmark/typedoctane/TYPES.js
	./js -f src/shell.js -f bootstrap.js -f benchmark/typedoctane/typedoctane.js -f benchmark/typedoctane/inference.js >> benchmark/typedoctane/types/types.$(file).js

typed:
	./js -f src/shell.js -f bootstrap.js -f benchmark/typedoctane/typedoctane.js -f benchmark/typedoctane/types/types.$(file).js -f benchmark/typedoctane/typed.js

typedf:
	./js -f src/shell.js -f bootstrap.js -f benchmark/typedoctane/typedoctane.js -f benchmark/typedoctane/types/types.$(file).js -f benchmark/typedoctane/typed.js >> benchmark/typedoctane/out/$(mode).$(file).out

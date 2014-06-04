default:
	./js -f bootstrap.js -i

run:
	./js -f bootstrap_test.js -i

octane:
	./js -f bootstrap_benchmark.js -i

#typed:
#	./js -f bootstrap_typedoctane.js -i

inference:
	./js -f bootstrap_typedoctane.js -f benchmark/typedoctane/inference.js

inferencef:
	rm -f benchmark/typedoctane/TYPES.js
	./js -f bootstrap_typedoctane.js -f benchmark/typedoctane/inference.js >> benchmark/typedoctane/TYPES.js

typed:
	./js -f bootstrap_typedoctane.js -f benchmark/typedoctane/typed.js

default:
	./js -f bootstrap.js -i

run:
	./js -f bootstrap_test.js -i

octane:
	./js -f bootstrap_benchmark.js -i

typed:
	./js -f bootstrap_typedoctane.js -i

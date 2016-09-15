.PHONY: octane
octane:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.js -f benchmarks/octane/typed.js

inference:
	cd ../ && ./js.transparent -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/inference.js > benchmarks/octane/types/types.js

.PHONY: default octane run inference richards deltablue crypto raytrace earleyboyer regexp splay navierstokes pdfjs mandreel gbemu codeload box2d zlib typescript

# Default target for testing.
default:
	$(MAKE) --no-print-directory regexp > octane/results/regexp.${timestamp}.txt
#	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.splay.js -f ${octane}/typed.js -f ${octane}/run.splay.js -f ${octane}/run.js
	#cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.splay.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.splay.js

# Timestamps.
timestamp=$(shell date +%Y%m%d)-$(shell date +%H%M%S)

# Path to octane base directory.
octane=benchmarks/octane

# Benchmarks programs.
richards:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.richards.js -f ${octane}/typed.js -f ${octane}/run.richards.js -f ${octane}/run.js

deltablue:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.deltablue.js -f ${octane}/typed.js -f ${octane}/run.deltablue.js -f ${octane}/run.js

crypto:	
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.crypto.js -f ${octane}/typed.js -f ${octane}/run.crypto.js -f ${octane}/run.js

raytrace:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.raytrace.js -f ${octane}/typed.js -f ${octane}/run.raytrace.js -f ${octane}/run.js

earleyboyer:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.earleyboyer.js -f ${octane}/typed.js -f ${octane}/run.earleyboyer.js -f ${octane}/run.js

regexp:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.regexp.js -f ${octane}/typed.js -f ${octane}/run.regexp.js -f ${octane}/run.js

splay:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.splay.js -f ${octane}/typed.js -f ${octane}/run.splay.js -f ${octane}/run.js

navierstokes:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.navierstokes.js -f ${octane}/typed.js -f ${octane}/run.navierstokes.js -f ${octane}/run.js

pdfjs:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.pdfjs.js -f ${octane}/typed.js -f ${octane}/run.pdfjs.js -f ${octane}/run.js

mandreel:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.mandreel.js -f ${octane}/typed.js -f ${octane}/run.mandreel.js -f ${octane}/run.js

gbemu:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.gbemu.js -f ${octane}/typed.js -f ${octane}/run.gbemu.js -f ${octane}/run.js

codeload:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.codeload.js -f ${octane}/typed.js -f ${octane}/run.codeload.js -f ${octane}/run.js

box2d:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.box2d.js -f ${octane}/typed.js -f ${octane}/run.box2d.js -f ${octane}/run.js

zlib:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.zlib.js -f ${octane}/typed.js -f ${octane}/run.zlib.js -f ${octane}/run.js

typescript:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/types/types.typescript.js -f ${octane}/typed.js -f ${octane}/run.typescript.js -f ${octane}/run.js


# Run all octaine benchmarks.
octane: richards deltablue crypto raytrace earleyboyer regexp splay navierstokes pdfjs mandreel gbemu codeload box2d zlib typescript

# Run all octaine benchmarks and writes.
run: 
	$(MAKE) --no-print-directory richards > octane/results/richards.${timestamp}.txt
	$(MAKE) --no-print-directory deltablue > octane/results/deltablue.${timestamp}.txt
	$(MAKE) --no-print-directory crypto > octane/results/crypto.${timestamp}.txt
	$(MAKE) --no-print-directory raytrace > octane/results/raytrace.${timestamp}.txt
	$(MAKE) --no-print-directory earleyboyer > octane/results/earleyboyer.${timestamp}.txt
	$(MAKE) --no-print-directory regexp > octane/results/regexp.${timestamp}.txt
	$(MAKE) --no-print-directory splay > octane/results/splay.${timestamp}.txt
	$(MAKE) --no-print-directory navierstokes > octane/results/navierstokes.${timestamp}.txt
	$(MAKE) --no-print-directory pdfjs > octane/results/pdfjs.${timestamp}.txt
	$(MAKE) --no-print-directory mandreel > octane/results/mandreel.${timestamp}.txt
	$(MAKE) --no-print-directory gbemu > octane/results/gbemu.${timestamp}.txt
	$(MAKE) --no-print-directory codeload > octane/results/codeload.${timestamp}.txt
	$(MAKE) --no-print-directory box2d > octane/results/box2d.${timestamp}.txt
	$(MAKE) --no-print-directory zlib > octane/results/zlib.${timestamp}.txt
	$(MAKE) --no-print-directory typescript > octane/results/typescript.${timestamp}.txt

# Run type inference on all files.
inference:
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.richards.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.richards.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.deltablue.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.deltablue.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.crypto.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.crypto.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.raytrace.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.raytrace.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.earleyboyer.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.earleyboyer.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.regexp.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.regexp.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.splay.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.splay.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.navierstokes.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.navierstokes.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.pdfjs.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.pdfjs.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.mandreel.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.mandreel.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.gbemu.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.gbemu.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.codeload.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.codeload.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.box2d.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.box2d.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.zlib.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.zlib.js
	cd ../ && ./js.transparent -f bootstrap.js -f ${octane}/typedoctane.js -f ${octane}/inference.js -f ${octane}/run.typescript.js -f ${octane}/run.js -f ${octane}/print.js > ${octane}/types/types.typescript.js

.PHONY: octane
octane:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.js -f benchmarks/octane/typed.js

inference:
	cd ../ && ./js.transparent -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/inference.js > benchmarks/octane/types/types.js



file=$(shell date +%Y%m%d)-$(shell date +%H%M%S)

run:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.js -f benchmarks/octane/typed.js > benchmarks/octane/results/${file}.txt












richards:
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.richards.js -f benchmarks/octane/typed.js

deltablue:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.deltablue.js -f benchmarks/octane/typed.js

crypto:	
	cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.crypto.js -f benchmarks/octane/typed.js

raytrace:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.raytrace.js -f benchmarks/octane/typed.js

earleyboyer:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.earleyboyer.js -f benchmarks/octane/typed.js

regexp:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.regexp.js -f benchmarks/octane/typed.js

splay:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.splay.js -f benchmarks/octane/typed.js

navierstokes:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.navierstokes.js -f benchmarks/octane/typed.js

pdfjs:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.pdfjs.js -f benchmarks/octane/typed.js

mandreel:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.mandreel.js -f benchmarks/octane/typed.js

gbemu:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.gbemu.js -f benchmarks/octane/typed.js

codeload:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.codeload.js -f benchmarks/octane/typed.js

box2d:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.box2d.js -f benchmarks/octane/typed.js

zlib:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.zlib.js -f benchmarks/octane/typed.js

typescript:
		cd ../ && ./js.transparent -f shell/shell.js -f bootstrap.js -f benchmarks/octane/typedoctane.js -f benchmarks/octane/types/types.typescript.js -f benchmarks/octane/typed.js



# Timestamps
timestamp=$(shell date +%Y%m%d)-$(shell date +%H%M%S)

# Run all octaine benchmarks
octane: richards deltablue crypto raytrace earleyboyer regexp splay navierstokes pdfjs mandreel gbemu codeload box2d zlib typescript

# Run all octaine benchmarks and writes 
run: 
	$(MAKE) --no-print-directory richards > benchmarks/octane/results/richards.${timestamp}.txt
	$(MAKE) --no-print-directory deltablue > benchmarks/octane/results/deltablue.${timestamp}.txt
	$(MAKE) --no-print-directory crypto > benchmarks/octane/results/crypto.${timestamp}.txt
	$(MAKE) --no-print-directory raytrace > benchmarks/octane/results/raytrace.${timestamp}.txt
	$(MAKE) --no-print-directory earleyboyer > benchmarks/octane/results/earleyboyer.${timestamp}.txt
	$(MAKE) --no-print-directory regexp > benchmarks/octane/results/regexp.${timestamp}.txt
	$(MAKE) --no-print-directory splay > benchmarks/octane/results/splay.${timestamp}.txt
	$(MAKE) --no-print-directory navierstokes > benchmarks/octane/results/navierstokes.${timestamp}.txt
	$(MAKE) --no-print-directory pdfjs > benchmarks/octane/results/pdfjs.${timestamp}.txt
	$(MAKE) --no-print-directory mandreel > benchmarks/octane/results/mandreel.${timestamp}.txt
	$(MAKE) --no-print-directory gbemu > benchmarks/octane/results/gbemu.${timestamp}.txt
	$(MAKE) --no-print-directory codeload > benchmarks/octane/results/codeload.${timestamp}.txt
	$(MAKE) --no-print-directory box2d > benchmarks/octane/results/box2d.${timestamp}.txt
	$(MAKE) --no-print-directory zlib > benchmarks/octane/results/zlib.${timestamp}.txt
	$(MAKE) --no-print-directory typescript > benchmarks/octane/results/typescript.${timestamp}.txt




octane=benchmarks/octane


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

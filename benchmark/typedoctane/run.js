// Copyright 2014 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//TreatJS.Statistic.reset();
//TreatJS.Config.print();

var base_dir = 'benchmark/typedoctane/';
var wrapped_dir = 'benchmark/wrapped/';
load(base_dir + 'base.js');

//_load_(wrapped_dir,'richards.js');
//_load_(wrapped_dir,'deltablue.js');
//_load_(wrapped_dir,'crypto.js');
//_load_(wrapped_dir,'raytrace.js');
//_load_(wrapped_dir,'earley-boyer.js');
//_load_(wrapped_dir,'regexp.js');
_load_(wrapped_dir,'splay.js'); 
//_load_(wrapped_dir,'navier-stokes.js');
//_load_(wrapped_dir,'pdfjs.js');

// failed (contract #2 has to be deavtivated)
//_load_(wrapped_dir,'mandreel.js');

//_load_(wrapped_dir,'gbemu-part1.js');
//_load_(wrapped_dir,'gbemu-part2.js');

//_load_(wrapped_dir,'code-load.js');

//_load_(wrapped_dir,'box2d.js');

//_load_(wrapped_dir,'zlib.js');
//_load_(wrapped_dir,'zlib-data.js');

// failed // TODO
// use online type information of typescript.js'
//_load_(wrapped_dir,'typescript.js');
//_load_(wrapped_dir,'typescript-input.js');
//_load_(wrapped_dir,'typescript-compiler.js');


var success = true;

function PrintResult(name, result) {
  print(name + ': ' + result);
}


function PrintError(name, error) {
  PrintResult(name, error);
  success = false;
}


function PrintScore(score) {
  if (success) {
    print('----');
    print('Score (version ' + BenchmarkSuite.version + '): ' + score);
  }
}


BenchmarkSuite.config.doWarmup = undefined;
BenchmarkSuite.config.doDeterministic = undefined;

BenchmarkSuite.config.doWarmup = true;
BenchmarkSuite.config.doDeterministic = true;


BenchmarkSuite.RunSuites({ NotifyResult: PrintResult,
                           NotifyError: PrintError,
                           NotifyScore: PrintScore });

// print, version number, configuration, statistics

TreatJS.Version.print();
TreatJS.Config.print();
TreatJS.Statistic.print();

_print_("//-- BEGIN: TYPES --");

_print_("");
_print_("_TYPES_=[];");
_print_("");

for(var funID in _types_) {

  // function
  _print_("_TYPES_['"+funID+"']=[];");

  if(_types_[funID]!==undefined) for(var callID = 0; callID < _types_[funID].length; callID++) {
    _print_("_TYPES_['"+funID+"']['"+callID+"']=[];");
    if(_types_[funID][callID]!==undefined) for(var argID = -1; argID < _types_[funID][callID].length; argID++) {
      _print_("_TYPES_['"+funID+"']['"+callID+"']["+argID+"]='"+_types_[funID][callID][argID]+"';");
    }
  }
}

_print_("//-- END: TYPES --");

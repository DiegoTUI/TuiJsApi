"use strict";

var crap = "crap before getScript";

$.ajaxSetup({async:false});
$.getScript("crap.js");
$.ajaxSetup({async:true});

console.log("after: " + crap);
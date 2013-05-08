"use strict";

var crap = "crap before getScript";

$.getScript("crap.js");

console.log("after: " + crap);
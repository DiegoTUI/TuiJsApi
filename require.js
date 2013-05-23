"use strict";
/*
 * TuiInnovation JS API.
 * require method for browsers.
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Global to hold the exported values.
 */
var module = {exports: {}};

/**
 * Adapt the require to import synchronously from the browser.
 */
function require(file)
{
	file = file.replace('..', '.');
	if (typeof debug != 'undefined')
	{
		debug('requiring ' + file);
	}
	module.exports = {gofuck:"yourself"};
	$.ajaxSetup({async:false});
	$.getScript(file);
	$.ajaxSetup({async:true});
	console.log("About to return module.exports: " + JSON.stringify(module.exports));
	return module.exports;
}


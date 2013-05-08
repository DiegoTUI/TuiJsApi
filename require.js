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
 * Adapt the require to import from the browser.
 */
function require(file)
{
	file = file.replace('..', '.');
	if (typeof debug != 'undefined')
	{
		debug('requiring ' + file);
	}
	$.ajaxSetup({async:false});
	$.getScript(file);
	$.ajaxSetup({async:true});
	console.log("Requiring module");
	for (key in module.exports)
		console.log(key);
	return module.exports;
}


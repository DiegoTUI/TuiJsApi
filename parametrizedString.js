'use strict';
/*
 * TuiInnovation JS API.
 * Parametrized string: a string with $keys$ to be replaced by actual params
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tui === 'undefined') {
	console.log("parametrizedString.js - requiring tui");
	var tui = require ('/js/tui.js');
}

/**
 * The parametrized string.
 * baseString: the string with the $keys$ in it
 * parameters: a dictionary with keys and values to be replaced in the baseString
 */
tui.parametrizedString = function(baseString, parameters)
{
	// self-reference
	var self = this;

	/**
	 * Returns baseString with all the parameters replaced
	 */
	self.replaceAll = function() {
		var replaced = baseString;

		if (baseString && parameters) {
			for (var key in parameters) {
				replaced = replaced.replace("$"+key+"$",parameters.key);
			}
		}

		return replaced;
	}

	/**
	 * Returns an array of strings with the $keys$ that are in baseString, but not in parameters
	 */
	 self.getLooseKeys = function() {
	 	var replaced = self.replaceAll();
	 	if (replaced != 'undefined')
	 		return replaced.match(/(?<=$)(.*?)(?=$)/);
	 	return replaced;
	 }

	return self;
}

module.exports = tui.parametrizedString;


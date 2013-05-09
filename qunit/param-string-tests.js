/**
 * TuiInnovation.
 * Parametrized string unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

//var ParametrizedString = require ('/js/parametrizedString.js'); 

var baseString = 'Hallo $who$. You $action$ my $relative$';

/**
 * Run tests. Check that the parametrized string returns the desired result.
 */
QUnit.module('param-string');
test('undefined parametrizedString', function() {
	var paramString = new tui.parametrizedString ();
	ok(typeof (paramString.replaceAll()) === 'undefined', 'empty parametrizedString returned undefined');
	ok(typeof (paramString.getLooseKeys()) === 'undefined', 'empty parametrizedString returned undefined loose keys');
});
test('exact match', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		relative: "mother"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	console.log("Exact match - replaceAll: " + paramString.replaceAll());
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother', 'string replaced correctly');
	ok(paramString.getLooseKeys() === null, 'exact match. No loose keys');
});
test('too many params', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		relative: "mother",
		extra1: "extra1",
		extra2: "extra2"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	console.log("Too many params - replaceAll: " + paramString.replaceAll());
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother', 'string replaced correctly');
	ok(paramString.getLooseKeys() === null, 'too many params. No loose keys');
});
test('too few params', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		extra2: "extra2"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	console.log("Too few params - replaceAll: " + paramString.replaceAll());
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my $relative$', 'string replaced correctly');
	ok(paramString.getLooseKeys().length === 1, 'Should have 1 loose key');
});
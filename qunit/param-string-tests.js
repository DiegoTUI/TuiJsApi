/**
 * TuiInnovation.
 * Parametrized string unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

//var ParametrizedString = require ('/js/parametrizedString.js'); 

var baseString = 'Hallo $who$. You $action$ my $relative$ $times$';

/**
 * Run tests. Check that the parametrized string returns the desired result.
 */
QUnit.module('param-string');
test('undefined parametrizedString', function() {
	var paramString = new tui.parametrizedString ();
	ok(typeof (paramString.replaceAll()) === 'undefined', 'empty parametrizedString returned undefined');
	ok(paramString.getLooseKeys().length === 0, 'empty parametrizedString returned empty loose keys');
});
test('exact match', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		relative: "mother",
		times: "twice"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	ok(paramString.getLooseKeys().length === 0, 'exact match. No loose keys');
});
test('too many params', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		relative: "mother",
		times: "twice",
		extra1: "extra1",
		extra2: "extra2"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my mother twice', 'string replaced correctly');
	ok(paramString.getLooseKeys().length === 0, 'too many params. No loose keys');
});
test('too few params', function() {
	var params = {
		who: "peoples",
		action: "fuck",
		extra2: "extra2"
	};
	var paramString = new tui.parametrizedString (baseString, params);
	ok(paramString.replaceAll() == 'Hallo peoples. You fuck my $relative$ $times$', 'string replaced correctly');
	ok(paramString.replaceAllClean() == 'Hallo peoples. You fuck my  ', 'string replaced correctly');
	ok(paramString.getLooseKeys().length === 2, 'Should have 2 loose key');
});

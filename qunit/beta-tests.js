/**
 * MoveinBlue website.
 * Beta unit tests.
 * http://moveinblue.com/
 *
 * Copyright (C) 2011 MoveinBlue.
 */

/* declare spurious Firebug globals */
var _firebug;
var _xdc_;
/* declare spurious Google Maps global */
var __e3_;

/**
 * Count the properties in a collection.
 */
function count_properties(collection)
{
	var total = 0;
	for (var property in collection)
	{
		total ++;
	}
	return total;
}

/**
 * Check that the given collection has the specified number of items.
 */
function check_collection(collection, name, items)
{
	var count = count_properties(collection);
	ok(count == items, name + ' should have ' + items + ' items, not ' + count);
}

/**
 * Get a function that checks the number of items in a collection.
 */
function collection_checker(name, items)
{
	return function(collection)
	{
		check_collection(collection, name, items);
		start();
	}
}

/**
 * Returns a generic OK function, with the given message.
 */
function generic_ok(message)
{
	return function(data)
	{
		ok(true, message);
		start();
	}
}

/**
 * Some test failed.
 */
function nok(error)
{
	var message = error.message || 'test failed';
	ok(false, message);
	start();
}

/**
 * Run tests. Check that objects exists. If they exist, the code compiles.
 */
QUnit.module('beta');
test('clear local storage', function() {
	localStorage.clear();
	ok(localStorage.length == 0, 'no items left in local storage');
});
test('tui object', function() {
	ok(tui, 'tui object exists');
});
test('tuiajax object', function() {
	console.log("Logging some crap: " + typeof tui.ajax);//+ (typeof tui != 'undefined'));
	QUnit.log(function( details ) {
	  console.log( "Log: ", details.result, details.message, details.source);
	});
	ok(tui, 'tui.ajax object exists');
});



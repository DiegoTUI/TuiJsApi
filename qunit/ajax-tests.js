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
module('beta');
test('clear local storage', function() {
	localStorage.clear();
	ok(localStorage.length == 0, 'no items left in local storage');
});
test('mib object', function() {
	ok(mib, 'mib object exists');
});
test('ajax object', function() {
	ok(ajax, 'ajax object exists');
});
test('login object', function() {
	ok(login, 'login object exists');
});
test('feedback', function() {
	ok(feedback, 'feedback exists');
});
test('activity selector', function() {
	ok(activity_selector, 'activity selector exists');
});
test('planner', function() {
	ok(planner, 'planner exists');
});
test('profile', function() {
	ok(profile, 'profile exists');
});
test('store object', function() {
	mib.store('key', {punch: 'line'});
	var result = mib.retrieve('key');
	ok(result.punch == 'line', 'retrieved attribute');
	result = mib.retrieve_remove('key');
	ok(result.punch == 'line', 'retrieved_removed attribute');
	ok(!mib.retrieve('key'), 'retrieving erases the object');
});
test('show help', function() {
	ok(mib.help_needed('a'), 'help a should be needed');
	ok(mib.help_needed('a'), 'help a should be needed still');
	mib.discard_help('a');
	ok(!mib.help_needed('a'), 'discarded help a should not be needed');
	ok(mib.help_needed('b'), 'help b should be needed');
	mib.discard_help('b');
	ok(!mib.help_needed('b'), 'help b should not be needed');
	ok(!mib.help_needed('a'), 'help a should not be needed still');
});


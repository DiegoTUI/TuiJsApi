/**
 * MoveinBlue website.
 * Activity tests: Search for activities, add comments.
 * http://moveinblue.com/
 *
 * Copyright (C) 2011 MoveinBlue.
 */

var global_destination;
var global_category;
var global_activity_id;

function ok_destination_names(destinations)
{
	ok(destinations.length > 0, '0 destinations found');
	if (destinations.length > 0)
	{
		global_destination = destinations[0].name;
	}
	start();
}

function ok_destination_detail(destination)
{
	ok(destination.name == global_destination, 'invalid destination name');
	start();
}

function ok_destination_affiliations(affiliations)
{
	ok(affiliations != null, 'null affiliations found');
	start();
}

function ok_categories(categories)
{
	ok(categories.length > 0, '0 categories found in ' + global_destination);
	if (categories.length > 0)
	{
		global_category = categories[0];
	}
	start();
}

function ok_activities(activities)
{
	ok(activities.length > 0, '0 activities found in ' + global_category + ' in ' + global_destination);
	if (activities.length > 0)
	{
		global_activity_id = activities[0].activity_id;
	}
	start();
}

function ok_details(activity)
{
	ok(activity.name, 'activity without name');
	start();
}

/* run tests */
module('activity');
asyncTest('load destinations', function() {
	activity_selector.load_destination_names(ok_destination_names, nok);
});
asyncTest('load destination', function() {
	activity_selector.load_destination(global_destination, ok_destination_detail, nok);
});
asyncTest('load affiliation urls', function() {
	activity_selector.load_destination_affiliations(global_destination, ok_destination_affiliations, nok);
});
asyncTest('load categories', function() {
	activity_selector.load_category_names(global_destination, ok_categories, nok);
});
asyncTest('load activities', function() {
	var criteria = {
		destination: global_destination,
		category: global_category,
	};
	activity_selector.load_recommended_activities(criteria, ok_activities, nok);
});
asyncTest('load activity details', function() {
	activity_selector.load_activity_details(global_activity_id, ok_details, nok);
});


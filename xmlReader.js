'use strict';
/*
 * TuiInnovation JS API.
 * XML Reader: receives an xml string and a description map and returns an array of objects
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tui === 'undefined') {
	console.log("xmlReader.js - requiring tui");
	var tui = require ('/js/tui.js');
}

/**
 * The XML reader.
 * xmlString: the xml in string format
 * descriptionMap: an array representing the values to be extracted from the xml.
 * see xmlreader-tests to fully understand this class
 */
tui.xmlReader = function(xmlString, descriptionMap)
{
	// self-reference
	var self = this;

	/**
	 * Reads the objects from the xmlString using the descriptionMap
	 * Returns an array of JS objects
	 * tag: the tag representing the objects in the xml to be read
	 */
	self.readObjects = function(tag) {
		//initialize result
		var result =[];
		//wrap the string in a jquery object
		var xmlObject = $($.parseXML(xmlString));
		//parse it
		xmlObject.find(tag).each(function() {
			result.push(processElement($(this)));
		});
		
		return result;
	}

	/**
	 * Process an element of the xml according to the description Map and returns an object
	 * element: a jquery object containing the element to be processed
	 */
	function processElement(element) {
		//initialize result
		var result = {};
		//iterate descriptionMap
		for (var i=0; i<descriptionMap.length; i++) {
			var item = descriptionMap[i];
			if (typeof item === 'string') {	//It's a string
				result[item] = element.find(item).text();
				tui.debug("Found string in descriptionMap. Field: " + item +". Value: " + result[item]);
			} 
			else if (typeof item === 'object') {	//It's a dictionary
				//get the first (and only) key of the dictionary
				for (var key in item) {
					var value = item[key];
					if (value instanceof Array) {	//It's a list
						//initialize list
						result[key] = [];
						//The array should contain only one element and it should be a dictionary
						if (value.length != 1) tui.error ("Malformed descriptionMap. More than 1 element in inner array: " + value);
						var innerObject = value[0];
						//get in the list replacing the dots by spaces
						tui.debug("about to iterate " + element.nodeName + " with replaced key: " + key.replace(/\./g,' '));
						element.find(key.replace(/\./g,' ')).each(function(){
							tui.debug("Checking for: " + key);
							var elementInList = {};
							for (var innerKey in innerObject) {
								elementInList[innerKey] = valueInXml($(this), innerObject[innerKey]);
							}
							result[key].push(elementInList);
						});
					}
					else if (typeof value === 'string') {	//It's a deep value
						result[key] = valueInXml(element, value);
					}
					break;	//we only consider the first key
				}
			} 
		}
		return result;
	}

	/**
	 * Explores an xml jQuery object and returns the value in path
	 * xmlObject: a jquery object containing the xml to look in
	 * path: a string like "Description.@languageCode" containing the path to look in. "@" is for attributes
	 */
	function valueInXml (xmlObject, path) {
		var realPath = path.startsWith('@') ? path.substringUpTo('@') : path.substringUpTo('.@');
		var attribute = path.substringFrom('@');
		var tip = realPath.length == 0 ? xmlObject : xmlObject.find(realPath.replace(/\./g,' '));
		var value = null;
		if (attribute === '') {	//No attributes
			value = tip.text();
		}
		else {	//There is an attribute at the end
			value = tip.attr(attribute);
		}
		tui.debug("Value for path " + path + ": " + value + ". RealPath: " + realPath + " - Attribute: " + attribute + " - Replaced RealPath: " + realPath.replace('.',' '));
		return value;
	}

	/**
	 * Explores an xml jQuery object and returns the inner object in path
	 * xmlObject: a jquery object containing the xml to look in
	 * path: a string like "Description.Code" containing the path to look in.
	 */
	function objectInXml (xmlObject, path) {
		var elementsInPath = path.split('.');
		for (var i=0; i<elementsInPath.length; i++) {
			var element = elementsInPath[i];
			xmlObject = xmlObject.find(element);
		}
		return $(xmlObject);
	}

	return self;
}

module.exports = tui.xmlReader;


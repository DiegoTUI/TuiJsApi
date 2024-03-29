'use strict';
/*
 * TuiInnovation JS API.
 * XML Reader: receives an xml string and a description map and returns an array of objects
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tuins === 'undefined') {
	tui.debug("XmlReader.js - initializing tuins");
	var tuins = {};
}

/**
 * The XML reader.
 * xmlString: the xml in string format
 * descriptionMap: an array representing the values to be extracted from the xml.
 * tag: the tag to indicate which objects in the xml should we look for. Root if undefined or null
 * see xmlreader-tests to fully understand this class
 */
tuins.XmlReader = function(xmlString, descriptionMap, tag)
{
	// self-reference
	var self = this;

	/**
	 * Reads the objects from the xmlString using the descriptionMap
	 * Returns an array of JS objects
	 * tag: the tag representing the objects in the xml to be read
	 */
	self.readObjects = function() {
		//initialize result
		var result =[];
		//wrap the string in a jquery object
		var xmlObject = $($.parseXML(xmlString));
		
		if (tag && (tag.length > 0)) { //We should return an array of objects
			xmlObject.find(tag).each(function() {
				result.push(processElement(this, descriptionMap));
			});
		} else {	//We should return a single object
			xmlObject.find(":root").each(function() {
				result = processElement(this, descriptionMap);
			});
		}

		return result;
	}

	/**
	 * Process an element of the xml according to the description Map and returns an object
	 * element: a DOM object containing the element to be processed
	 */
	function processElement(element, descriptionMap) {
		//initialize result
		var result = {};
		//iterate descriptionMap
		for (var i=0; i<descriptionMap.length; i++) {
			var item = descriptionMap[i];
			if (typeof item === 'string') {	//It's a string
				result[item] = $(element).find(item).text();
				//tui.debug("Found string in descriptionMap. Field: " + item +". Value: " + result[item]);
			} 
			else if (typeof item === 'object') {	//It's a dictionary
				 if (Object.keys(item).length !== 1)
                    tui.error ("Malformed descriptionMap. More than 1 element in object: " + JSON.stringify(item));
				//get the first (and only) key of the dictionary
				for (var key in item) {
					var value = item[key];
					if (value instanceof Array) {	//It's a list
						//tui.debug("Key: " + key + " is listified as: " + key.listify());
						//initialize list
						var listifiedKey = key.listify();
						result[listifiedKey] = [];
						
						//get in the list replacing the dots by spaces
						$(element).find(key.replace(/\./g,' ')).each(function(){
							//tui.debug("Checking for: " + $(this).text());
							result[listifiedKey].push(processElement(this, value));
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
	 * xmlObject: a DOM object containing the xml to look in
	 * path: a string like "Description.@languageCode" containing the path to look in. "@" is for attributes
	 */
	function valueInXml (xmlObject, path) {
		var realPath = path.startsWith('@') ? path.substringUpTo('@') : path.substringUpTo('.@');
		var attribute = path.substringFrom('@');
		var tip = realPath.length == 0 ? $(xmlObject) : $(xmlObject).find(realPath.replace(/\./g,' '));
		var value = null;
		if (attribute === '') {	//No attributes
			value = tip.text();
		}
		else {	//There is an attribute at the end
			value = tip.attr(attribute);
		}
		//tui.debug("Value for path " + path + ": " + value + ". RealPath: " + realPath + " - Attribute: " + attribute + " - Replaced RealPath: " + realPath.replace(/\./g,' '));
		return value;
	}

	return self;
}

module.exports = tuins.XmlReader;


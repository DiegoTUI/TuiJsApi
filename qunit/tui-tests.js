/**
 * TuiInnovation.
 * Tui unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Run tests. 
 */
QUnit.module('tui');
test('check that xmlToJson works', function() {
	var jsonObject = {
	    HotelListRQ: {
	        "@echoToken": "DummyEchoToken",
	        "@xmlns": "http://www.hotelbeds.com/schemas/2005/06/messages",
	        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
	        "@xsi:schemaLocation": "http://www.hotelbeds.com/schemas/2005/06/messages HotelListRQ.xsd",
	        Language: "ENG",
	        Credentials:{
	            User: "ISLAS",
	            "Password": "ISLAS"
	        },
	        Destination:{
	            "@code": "PMI",
	            "@type": "SIMPLE",
	            "#value": "Palma"
	        },
	        ZoneList:[{zone:{"@code":"01",
	                         "name":"Alcudia"}},
	                  {zone:{"@code":"02",
	                         "name":"Andratx"}},
	                  {zone:{"@code":"03",
	                         "name":"Portals"}}
	        ],
	        "#list":[{classification:{"@code":"01",
	                                  "#value":"class1"}},
	                 {classification:{"@code":"02",
	                                  "#value":"class2"}}
	        ]
	    }
	}

	var xmlString = tui.jsonToXml(jsonObject);
    for (var key in jsonObject) {
        checkNode(key, jsonObject[key], xmlString);
    }

    function checkNode(key, value, xmlString) {
	    if (key.startsWith('@')) {
	        ok(xmlString.contains(key.substringFrom('@'))===true,'attribute ' + key + ' passed correctly');
	    } else if (key === '#value') {
	        ok(xmlString.contains(value)===true, 'Value ' + value + ' passed correctly');
	    } else if (key === '#list') {
	        for (var i=0; i<value.length; i++) {
	            for (var innerKey in value[i]) {
	                checkNode(innerKey, value[i][innerKey], xmlString);
	            }
	        }
	    } else {
	        ok(xmlString.contains('<'+key)===true, 'key ' + key + ' found in opening');
	        ok(xmlString.contains('</'+key+'>')===true, 'key ' + key + ' found in closing');
	        if (typeof value === "string") {
	            ok(xmlString.contains(value)===true, 'string ' + value + 'found');
	        } else if (value instanceof Array) {
	            for (var i=0; i<value.length; i++) {
	                for (var innerKey in value[i]) {
	                    checkNode(innerKey, value[i][innerKey], xmlString);
	                }
	            }
	        } else if (value instanceof Object) {
	            for (var innerKey in value) {
	                checkNode(innerKey, value[innerKey], xmlString);
	            }
	        }
	    }
	}
});


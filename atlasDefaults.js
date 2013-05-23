'use strict';
/*
 * Atlas defaults for requests .
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tuins === 'undefined') {
  console.log("atlasDefaults.js - initializing tuins");
  var tuins = {};
  //console.log("parametrizedString.js - requiring tui");
  //var tui = require ('/js/tui.js');
}

/**
 * Pseudo-global to store Atlas defaults for requests
 */
tuins.atlasDefaults = {};

//ticketAvailRequest
tuins.atlasDefaults["ticketAvailRequest"] = {
		echoToken: function(){return tui.randomString(tui.echoTokenLength)},
		sessionId: function(){return tui.randomString(tui.sessionIdLength)},
		Language: "ENG",
		Credentials_User: "ISLAS",
		Credentials_Password: "ISLAS",
		PaginationData_itemsPerPage: "25",
		PaginationData_pageNumber: "1",
		ServiceOccupancy_AdultCount: "1",
		ServiceOccupancy_ChildCount: "0",
		Destination_code: "PMI",
		DateFrom_date: function(){
			var date = new Date();
			return tui.atlasDate (date);
		},
		DateTo_date: function(){
			var date = new Date();
			date.setDate(date.getDate() + 1);
			return tui.atlasDate (date);
		}
	};

//export module
module.exports = tuins.atlasDefaults;
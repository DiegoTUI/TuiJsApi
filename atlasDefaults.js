'use strict';
/*
 * Atlas defaults for requests .
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Pseudo-global to store Atlas defaults for requests and
 */
var atlasDefaults = {
	ticketAvailRequest: {
	//	echoToken: tui.randomString(tui.echoTokenLength),
	//	sessionId: tui.randomString(tui.sessionIdLength),
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

/*atlasDefaults["ticketAvailRequest"] = {
	//	echoToken: tui.randomString(tui.echoTokenLength),
	//	sessionId: tui.randomString(tui.sessionIdLength),
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
	};*/

//export module
module.exports = atlasDefaults;
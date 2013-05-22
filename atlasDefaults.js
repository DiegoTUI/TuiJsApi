/*
 * Atlas defaults for requests .
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Pseudo-global to store Atlas defaults for requests and
 */
var atlasDefaults = {};

atlasDefaults["ticketAvailRequest"] = {
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
			return date.getFullYear() + 
			 + (date.getMonth()+1)+
			 + date.getDate();
		}
	//	DateTo_date: tomorrow()
	};

function today() {
	var date = new Date();
	return date.getFullYear() + 
			 + pad00(date.getMonth()+1)+
			 + pad00(date.getDate());
}

function tomorrow() {
	var date = new Date();
	date.setDate(date.getDate() + 1);
	return date.getFullYear() + 
			 + pad00(date.getMonth()+1)+
			 + pad00(date.getDate());
}

function pad00(number)
{
	return number < 10 ? '0' + number : number;
}

//export module
module.exports = atlasDefaults;
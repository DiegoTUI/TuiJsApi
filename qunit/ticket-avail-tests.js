/**
 * TuiInnovation
 * TicketAvail unit tests
 *
 * Copyright (C) 2013 TuiInnovation.
 */


function ok_ticket_avail_request(data)
{
	tui.debug("Data received TicketAvailRQ: " + data);
	start();
}


/* run tests */
QUnit.module('ticket-avail');
asyncTest('load destinations', function() {
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};
	var ticketAvailRQ = new tui.ticketAvailRequest(parameters);
	ticketAvailRQ.sendRequest(ok_ticket_avail_request, nok);
});



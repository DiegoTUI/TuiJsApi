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
tui.debug("Passed QUnit module");
asyncTest('load destinations', function() {
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};
	tui.debug("Passed var parameters");
	var ticketAvailRQ = new tui.ticketAvailRequest(parameters);
	tui.debug("Passed var ticketAvailRQ");
	ticketAvailRQ.sendRequest(ok_ticket_avail_request, nok);
});



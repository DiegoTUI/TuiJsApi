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
/*asyncTest('load destinations', function() {
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};
	tui.debug("Passed var parameters");
	var ticketAvailRQ = new tui.ticketAvailRequest(parameters);
	tui.debug("Passed var ticketAvailRQ");
	ticketAvailRQ.sendRequest(ok_ticket_avail_request, nok);
});*/

asyncTest('raw ajax call', function() {
	var xmlrequest = '<TicketAvailRQ echoToken="DummyEchoToken" sessionId="DummySessionId" \
  xmlns="http://www.hotelbeds.com/schemas/2005/06/messages" \
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRQ.xsd">  \
  <Language>ENG</Language> \
  <Credentials> \
    <User>ISLAS</User> \
    <Password>ISLAS</Password> \
  </Credentials> \
  <PaginationData itemsPerPage="25" pageNumber="1"/> \
  <ServiceOccupancy> \
    <AdultCount>1</AdultCount> \
    <ChildCount>0</ChildCount> \
  </ServiceOccupancy> \
  <Destination code="PMI" type="SIMPLE"/> \
  <DateFrom date="20130723"/> \
  <DateTo date="20130724"/> \
</TicketAvailRQ>';
	var url= 'http://212.170.239.71/appservices/http/FrontendService';
	tui.debug("Passed var xmlrequest");
	var data = {"xml_request": xmlrequest};
	tui.debug("About to send data: " + JSON.stringify(data));
	ajax.send(data, url, ok_ticket_avail_request, nok);
});



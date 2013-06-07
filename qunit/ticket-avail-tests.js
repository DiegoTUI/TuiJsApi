/**
 * TuiInnovation
 * TicketAvail unit tests
 *
 * Copyright (C) 2013 TuiInnovation.
 */
var ticketAvailMap = [
{'DateFrom':'DateFrom.@date'},
{'DateTo':'DateTo.@date'},
'Currency',
{'CurrencyCode': 'Currency.@code'},
{'Name': 'TicketInfo.Name'},
{'TicketInfo.DescriptionList.Description':[{'Type': '@type'},
					 			{'Description': ''}]},
{'TicketInfo.ImageList.Image': [{'Type': 'Type'},
							{'Url': 'Url'}]}];

var ticketAvailMapAlt = [
{'TotalItems':'@totalItems'},
{'ServiceTicket':[{'DateFrom':'DateFrom.@date'},
	{'DateTo':'DateTo.@date'},
	'Currency',
	{'CurrencyCode': 'Currency.@code'},
	{'Name': 'TicketInfo.Name'},
	{'TicketInfo.DescriptionList.Description':[{'Type': '@type'},
					 			{'Description': ''}]},
	{'TicketInfo.ImageList.Image': [{'Type': 'Type'},
							{'Url': 'Url'}]}
	]}
];

/*function ok_ticket_avail_request(data, textStatus, jqXhr)
{
	//tui.debug("Data received TicketAvailRQ: " + data);
	tui.debug("text status: " + textStatus);
	//tui.debug("jqXhr: " + JSON.stringify(jqXhr));
	ok(textStatus === 'success', 'entered ok callback with an error: ' + textStatus);
	//Let's parse the response
	var xmlReader = new tuins.XmlReader (data, ticketAvailMapAlt);
	var parsedXml = xmlReader.readObjects('');
	tui.debug("number of serviceTickets retrieved: " + parsedXml.length);
	ok(parsedXml[0].ServiceTicketList.length == parseInt(parsedXml[0].TotalItems), "Wrong number of items retrieved. Should have retrieved " + parsedXml[0].TotalItems + " but the parsed array only has " + parsedXml[0].ServiceTicketList.length);
	start();
}*/

function ok_ticket_avail_request(data)
{
	tui.debug("number of objects in the reply: " + data.length);
	tui.debug("number of serviceTickets in the reply: " + data[0].ServiceTicketList.length);
	ok(data[0].ServiceTicketList.length == parseInt(data[0].TotalItems), "Wrong number of items retrieved. Should have retrieved " + data[0].TotalItems + " but the parsed array only has " + data[0].ServiceTicketList.length);
	start();
}

function nok(jqXhr, textStatus, errorThrown)
{
	tui.debug("Entering nok callback");
	var message = errorThrown || 'test failed';
	ok(false, message);
	start();
}


/* run tests */
QUnit.module('ticket-avail');
tui.debug("Passed QUnit module");
asyncTest('ticketAvailRequest', function() {
	var parameters = {
		Language: "ENG",
		Credentials_User: "ISLAS",
		ServiceOccupancy_AdultCount: "1"
	};

	tui.debug("Passed var parameters");
	var ticketAvailRQ = new tuins.TicketAvailRequest(parameters, ticketAvailMapAlt);
	tui.debug("Passed var ticketAvailRQ");
	ticketAvailRQ.sendRequest(ok_ticket_avail_request, nok);
});

/*asyncTest('raw ajax call', function() {
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
	//var url= 'http://212.170.239.71/appservices/http/FrontendService?xml_request=' + xmlrequest;
	var url2 = 'http://54.246.80.107/api/test_post.php'
	tui.debug("Passed var xmlrequest");
	var data = {"xml_request": xmlrequest};
	//var data = xmlrequest;
	var data2 = {field1:"number1", field2:"number2"};
	tui.debug("About to send data: " + JSON.stringify(data));
	tuins.ajax.send(data, url, ok_ticket_avail_request, nok, true);
	tui.debug("About to send data2: " + JSON.stringify(data2));
	tuins.ajax.send(data2, url2, ok_ticket_avail_request, nok, true);
});*/



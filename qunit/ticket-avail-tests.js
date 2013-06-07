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
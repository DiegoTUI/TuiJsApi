/*
 * Atlas requests and description maps.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tuins === 'undefined') {
  var tuins = {};
}

/**
 * Pseudo-global to store Atlas requests and description maps
 */
tuins.atlas = {
	url: 'http://54.246.80.107/appservices/http/FrontendService',
	ticketAvailRequest : '<TicketAvailRQ echoToken="$echoToken$" sessionId="$sessionId$" \
		xmlns="http://www.hotelbeds.com/schemas/2005/06/messages" \
  		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
  		xsi:schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRQ.xsd"> \
  <Language>$Language$</Language> \
  <Credentials> \
    <User>$Credentials_User$</User> \
    <Password>$Credentials_Password$</Password> \
  </Credentials> \
  <PaginationData itemsPerPage="$PaginationData_itemsPerPage$" pageNumber="$PaginationData_pageNumber$"/> \
  <ServiceOccupancy> \
    <AdultCount>$ServiceOccupancy_AdultCount$</AdultCount> \
    <ChildCount>$ServiceOccupancy_ChildCount$</ChildCount> \
  </ServiceOccupancy> \
  <Destination code="$Destination_code$" type="SIMPLE"/> \
  <DateFrom date="$DateFrom_date$"/> \
  <DateTo date="$DateTo_date$"/> \
</TicketAvailRQ>'	
};

//export module
module.exports = tuins.atlas;
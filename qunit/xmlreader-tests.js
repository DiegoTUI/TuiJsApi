/**
 * TuiInnovation.
 * Xml Reader unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var ticketAvailString = '<TicketAvailRS xsi-schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRS.xsd" totalItems="27" echoToken="DummyEchoToken"> \
	<AuditData> \
		<ProcessTime>647</ProcessTime> \
		<Timestamp>2013-05-13 10:49:38.031</Timestamp> \
		<RequestHost>10.162.29.83</RequestHost> \
		<ServerName>FORM</ServerName> \
		<ServerId>FO</ServerId> \
		<SchemaRelease>2005/06</SchemaRelease>  \
		<HydraCoreRelease>2.0.201304221213</HydraCoreRelease> \
		<HydraEnumerationsRelease>1.0.201304221213</HydraEnumerationsRelease> \
		<MerlinRelease>N/A</MerlinRelease> \
	</AuditData> \
	<PaginationData currentPage="1" totalPages="2"/> \
	<ServiceTicket xsi-type="ServiceTicket" availToken="9ey6mENxtyujqkVKnqvpMA=="> \
		<DateFrom date="DateFrom1"/> \
		<DateTo date="DateTo1"/> \
		<Currency code="EUR1">Euro1</Currency> \
		<TicketInfo xsi-type="ProductTicket"> \
			<Code>000200515</Code> \
			<Name>Ticket1</Name> \
			<DescriptionList> \
				<Description type="generalDescription" languageCode="ENG">Description 11</Description> \
				<Description type="generalDescription" languageCode="SPA">Description 12</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image11</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image12</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image13</Url> \
				</Image> \
			</ImageList> \
		</TicketInfo> \
	</ServiceTicket> \
	<ServiceTicket xsi-type="ServiceTicket" availToken="9ey6mENxtyujqkVKnqvpMA=="> \
		<DateFrom date="DateFrom2"/> \
		<DateTo date="DateTo2"/> \
		<Currency code="EUR2">Euro2</Currency> \
		<TicketInfo xsi-type="ProductTicket"> \
			<Code>000200515</Code> \
			<Name>Ticket2</Name> \
			<DescriptionList> \
				<Description type="generalDescription" languageCode="ENG">Description 21</Description> \
				<Description type="generalDescription" languageCode="SPA">Description 22</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image21</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image22</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image23</Url> \
				</Image> \
			</ImageList> \
		</TicketInfo> \
	</ServiceTicket> \
</TicketAvailRS>';

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

var ticketClassificationListString = '<TicketClassificationListRS xsi-schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketClassificationListRS.xsd" totalItems="9" echoToken="DummyEchoToken"> \
	<AuditData> \
		<ProcessTime>4</ProcessTime> \
		<Timestamp>2013-05-15 13:21:03.741</Timestamp> \
		<RequestHost>10.162.29.83</RequestHost> \
		<ServerName>FORM</ServerName> \
		<ServerId>FO</ServerId> \
		<SchemaRelease>2005/06</SchemaRelease> \
		<HydraCoreRelease>2.0.201304221213</HydraCoreRelease> \
		<HydraEnumerationsRelease>1.0.201304221213</HydraEnumerationsRelease> \
		<MerlinRelease>N/A</MerlinRelease> \
	</AuditData> \
	<Classification code="CULTU">Culture Museums</Classification> \
	<Classification code="FD">Full Day</Classification> \
	<Classification code="FOOD">Food Nightlife</Classification> \
	<Classification code="HD">In the morning</Classification> \
	<Classification code="MD">Multi Day Services</Classification> \
	<Classification code="OUTAC">Outdoor Adventure</Classification> \
	<Classification code="PARTE">Theme Aquatic Parks</Classification> \
	<Classification code="SHOW">Shows and Events</Classification> \
	<Classification code="SIGHT">Sightseeing Tours</Classification> \
</TicketClassificationListRS>';

var ticketClassificationListMap = [
{'Code':'@code'},
{'Name':''}];

var ticketClassificationListMapAlt = [
{'TotalItems':'@totalItems'},
{'Classification':[{'Code':'@code'},
					{'Name':''}]}];

/**
 * Run tests. Parse the above xmls with the above descriptionMaps and see what we got
 */
QUnit.module('xmlreader');

test('TicketAvail parsing test xml', function() {
	var xmlReader = new tuins.XmlReader (ticketAvailString, ticketAvailMap, 'ServiceTicket');
	var parsedXml = xmlReader.readObjects();
	//tui.debug("ticketAvail parsed: " + JSON.stringify(parsedXml));
	//Now chek some stuff about the parsed xml
	ok(parsedXml instanceof Array, 'parsedXml is an array');
	ok(parsedXml.length === 2, 'parsedXml has 2 elements');
	ok(parsedXml[0].DateFrom === 'DateFrom1', 'dateFrom is correct in 1');
	ok(parsedXml[0].DateTo === 'DateTo1', 'dateTo is correct in 1');
	ok(parsedXml[1].DateFrom === 'DateFrom2', 'dateFrom is correct in 2');
	ok(parsedXml[1].DateTo === 'DateTo2', 'dateTo is correct in 2');
	ok(parsedXml[0].Currency === 'Euro1', 'Currency is correct in 1');
	ok(parsedXml[0].CurrencyCode === 'EUR1', 'CurrencyCode is correct in 1');
	ok(parsedXml[1].Currency === 'Euro2', 'Currency is correct in 2');
	ok(parsedXml[1].CurrencyCode === 'EUR2', 'CurrencyCode is correct in 2');
	ok(parsedXml[0].Name === 'Ticket1', 'Ticket name is correct in 1');
	ok(parsedXml[1].Name === 'Ticket2', 'Ticket name is correct in 2');
	for (var i=0; i<parsedXml.length; i++) {
		var ImageList = parsedXml[i]['TicketInfo.ImageList.Image'.listify()];
		var DescriptionList = parsedXml[i]['TicketInfo.DescriptionList.Description'.listify()];
		ok(ImageList.length === 3, 'Only 3 images in the list: ' + ImageList.length);
		for (var j=0; j<3; j++) {
			ok(ImageList[j].Type === "S", "wrong image type in ticket " + i + " image " + j);
			ok(ImageList[j].Url === "Image"+(i+1)+""+(j+1), "wrong image url in ticket " + i + " image " + j);
		}
		ok(DescriptionList.length === 2, 'Only 2 descriptions in the list: ' + DescriptionList.length);
		for (var j=0; j<2; j++) {
			ok(DescriptionList[j].Type === "generalDescription", "wrong description type in ticket " + i + " description " + j);
			ok(DescriptionList[j].Description === "Description "+(i+1)+""+(j+1), "wrong description text in ticket " + i + " description " + j);
		}
	}
});

test('TicketAvailAlt parsing test xml', function() {
	var xmlReader = new tuins.XmlReader (ticketAvailString, ticketAvailMapAlt);
	var parsedXml = xmlReader.readObjects();
	//tui.debug("ticketAvail parsed: " + JSON.stringify(parsedXml));
	//Now chek some stuff about the parsed xml
	ok(parsedXml instanceof Object, 'parsedXml is an object');
	ok(parsedXml.TotalItems === '27', 'TotalItems retrieved is correct');
	ok(parsedXml.ServiceTicketList.length === 2, 'ServiceTicketList has 2 elements');
	ok(parsedXml.ServiceTicketList[0].DateFrom === 'DateFrom1', 'dateFrom is correct in 1');
	ok(parsedXml.ServiceTicketList[0].DateTo === 'DateTo1', 'dateTo is correct in 1');
	ok(parsedXml.ServiceTicketList[1].DateFrom === 'DateFrom2', 'dateFrom is correct in 2');
	ok(parsedXml.ServiceTicketList[1].DateTo === 'DateTo2', 'dateTo is correct in 2');
	ok(parsedXml.ServiceTicketList[0].Currency === 'Euro1', 'Currency is correct in 1');
	ok(parsedXml.ServiceTicketList[0].CurrencyCode === 'EUR1', 'CurrencyCode is correct in 1');
	ok(parsedXml.ServiceTicketList[1].Currency === 'Euro2', 'Currency is correct in 2');
	ok(parsedXml.ServiceTicketList[1].CurrencyCode === 'EUR2', 'CurrencyCode is correct in 2');
	ok(parsedXml.ServiceTicketList[0].Name === 'Ticket1', 'Ticket name is correct in 1');
	ok(parsedXml.ServiceTicketList[1].Name === 'Ticket2', 'Ticket name is correct in 2');
	for (var i=0; i<parsedXml.ServiceTicketList.length; i++) {
		var ImageList = parsedXml.ServiceTicketList[i]['TicketInfo.ImageList.Image'.listify()];
		var DescriptionList = parsedXml.ServiceTicketList[i]['TicketInfo.DescriptionList.Description'.listify()];
		ok(ImageList.length === 3, 'Only 3 images in the list: ' + ImageList.length);
		for (var j=0; j<3; j++) {
			ok(ImageList[j].Type === "S", "wrong image type in ticket " + i + " image " + j);
			ok(ImageList[j].Url === "Image"+(i+1)+""+(j+1), "wrong image url in ticket " + i + " image " + j);
		}
		ok(DescriptionList.length === 2, 'Only 2 descriptions in the list: ' + DescriptionList.length);
		for (var j=0; j<2; j++) {
			ok(DescriptionList[j].Type === "generalDescription", "wrong description type in ticket " + i + " description " + j);
			ok(DescriptionList[j].Description === "Description "+(i+1)+""+(j+1), "wrong description text in ticket " + i + " description " + j);
		}
	}
});

test('ticketClassificationList parsing test xml', function() {
	var xmlReader = new tuins.XmlReader (ticketClassificationListString, ticketClassificationListMap, 'Classification');
	var parsedXml = xmlReader.readObjects();	//reading classification tags
	//tui.debug("ticketClassificationList parsed: " + JSON.stringify(parsedXml));
	//Now chek some stuff about the parsed xml
	ok(parsedXml instanceof Array, 'parsedXml is an array');
	ok(parsedXml.length === 9, 'parsedXml has 9 elements');
	ok(parsedXml[0].Code === 'CULTU', 'Code in element 1 is ok');
	ok(parsedXml[0].Name === 'Culture Museums', 'Code in element 1 is ok');
	ok(parsedXml[1].Code === 'FD', 'Code in element 2 is ok');
	ok(parsedXml[1].Name === 'Full Day', 'Code in element 2 is ok');
	ok(parsedXml[2].Code === 'FOOD', 'Code in element 3 is ok');
	ok(parsedXml[2].Name === 'Food Nightlife', 'Code in element 3 is ok');
	ok(parsedXml[3].Code === 'HD', 'Code in element 4 is ok');
	ok(parsedXml[3].Name === 'In the morning', 'Code in element 4 is ok');
	ok(parsedXml[4].Code === 'MD', 'Code in element 5 is ok');
	ok(parsedXml[4].Name === 'Multi Day Services', 'Code in element 5 is ok');
	ok(parsedXml[5].Code === 'OUTAC', 'Code in element 6 is ok');
	ok(parsedXml[5].Name === 'Outdoor Adventure', 'Code in element 6 is ok');
	ok(parsedXml[6].Code === 'PARTE', 'Code in element 7 is ok');
	ok(parsedXml[6].Name === 'Theme Aquatic Parks', 'Code in element 7 is ok');
	ok(parsedXml[7].Code === 'SHOW', 'Code in element 8 is ok');
	ok(parsedXml[7].Name === 'Shows and Events', 'Code in element 8 is ok');
	ok(parsedXml[8].Code === 'SIGHT', 'Code in element 9 is ok');
	ok(parsedXml[8].Name === 'Sightseeing Tours', 'Code in element 9 is ok');

});

test('ticketClassificationListAlt parsing test xml', function() {
	var xmlReader = new tuins.XmlReader (ticketClassificationListString, ticketClassificationListMapAlt);
	var parsedXml = xmlReader.readObjects();	//Trying to read the base object
	//tui.debug("ticketClassificationList parsed: " + JSON.stringify(parsedXml));
	//Now chek some stuff about the parsed xml
	ok(parsedXml instanceof Object, 'parsedXml is an object');
	ok(parsedXml.TotalItems === '9', 'TotalItems retrieved is correct');
	ok(parsedXml.ClassificationList.length === 9, 'ClassificationList has 9 elements');
	ok(parsedXml.ClassificationList[0].Code === 'CULTU', 'Code in element 1 is ok');
	ok(parsedXml.ClassificationList[0].Name === 'Culture Museums', 'Code in element 1 is ok');
	ok(parsedXml.ClassificationList[1].Code === 'FD', 'Code in element 2 is ok');
	ok(parsedXml.ClassificationList[1].Name === 'Full Day', 'Code in element 2 is ok');
	ok(parsedXml.ClassificationList[2].Code === 'FOOD', 'Code in element 3 is ok');
	ok(parsedXml.ClassificationList[2].Name === 'Food Nightlife', 'Code in element 3 is ok');
	ok(parsedXml.ClassificationList[3].Code === 'HD', 'Code in element 4 is ok');
	ok(parsedXml.ClassificationList[3].Name === 'In the morning', 'Code in element 4 is ok');
	ok(parsedXml.ClassificationList[4].Code === 'MD', 'Code in element 5 is ok');
	ok(parsedXml.ClassificationList[4].Name === 'Multi Day Services', 'Code in element 5 is ok');
	ok(parsedXml.ClassificationList[5].Code === 'OUTAC', 'Code in element 6 is ok');
	ok(parsedXml.ClassificationList[5].Name === 'Outdoor Adventure', 'Code in element 6 is ok');
	ok(parsedXml.ClassificationList[6].Code === 'PARTE', 'Code in element 7 is ok');
	ok(parsedXml.ClassificationList[6].Name === 'Theme Aquatic Parks', 'Code in element 7 is ok');
	ok(parsedXml.ClassificationList[7].Code === 'SHOW', 'Code in element 8 is ok');
	ok(parsedXml.ClassificationList[7].Name === 'Shows and Events', 'Code in element 8 is ok');
	ok(parsedXml.ClassificationList[8].Code === 'SIGHT', 'Code in element 9 is ok');
	ok(parsedXml.ClassificationList[8].Name === 'Sightseeing Tours', 'Code in element 9 is ok');

});

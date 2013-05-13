/**
 * TuiInnovation.
 * Xml Reader unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var xmlString = '<TicketAvailRS xsi:schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRS.xsd" totalItems="27" echoToken="DummyEchoToken"> \
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
	<ServiceTicket xsi:type="ServiceTicket" availToken="9ey6mENxtyujqkVKnqvpMA=="> \
		<DateFrom date="DateFrom1"/> \
		<DateTo date="DateTo1"/> \
		<Currency code="EUR1">Euro1</Currency> \
		<TicketInfo xsi:type="ProductTicket"> \
			<Code>000200515</Code> \
			<Name>Ticket1</Name> \
			<DescriptionList> \
				<Description type="generalDescription" languageCode="ENG">Description 1</Description> \
				<Description type="generalDescription" languageCode="SPA">Descripcion 2</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>L</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image1</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image2</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image3</Url> \
				</Image> \
			</ImageList> \
		</TicketInfo> \
	</ServiceTicket> \
	<ServiceTicket xsi:type="ServiceTicket" availToken="9ey6mENxtyujqkVKnqvpMA=="> \
		<DateFrom date="DateFrom2"/> \
		<DateTo date="DateTo2"/> \
		<Currency code="EUR2">Euro2</Currency> \
		<TicketInfo xsi:type="ProductTicket"> \
			<Code>000200515</Code> \
			<Name>Ticket2</Name> \
			<DescriptionList> \
				<Description type="generalDescription" languageCode="ENG">Description 1</Description> \
				<Description type="generalDescription" languageCode="SPA">Descripcion 2</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>L</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image1</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image2</Url> \
				</Image> \
				<Image> \
					<Type>S</Type> \
					<Order>0</Order> \
					<VisualizationOrder>0</VisualizationOrder> \
					<Url>Image3</Url> \
				</Image> \
			</ImageList> \
		</TicketInfo> \
	</ServiceTicket> \
</TicketAvailRS>';

var descriptionMap = [
'DateFrom',
'DateTo',
'Currency',
{'CurrencyCode': 'Currency.@code'},
{'Name': 'TicketInfo.Name'},
{'TicketInfo.ImageList': [{'Type': 'Image.Type',
							'Url': 'Image.Url'}]},
{'TicketInfo.DescriptionList':[{'Type': 'Description.@type',
					 			'Description': 'Description'}]}];

/**
 * Run tests. Parse the above xml with the above descriptionMap and see what we got
 */
QUnit.module('xmlreader');
test('parsing test xml', function() {
	var xmlReader = new tui.xmlReader (xmlString, descriptionMap);
	var parsedXml = xmlReader.readObjects('ServiceTicket');
	//Now chek some stuff about the parsed xml
	ok(parsedXml instanceof Array, 'parsedXml should be an array');
	ok(parsedXml.length === 2, 'parsedXml should have 2 elements');
	ok(parsedXml[0].dateFrom === 'DateFrom1', 'dateFrom incorrect');
	ok(parsedXml[0].dateTo === 'DateTo1', 'dateTo incorrect');
	ok(parsedXml[1].dateFrom === 'DateFrom2', 'dateFrom incorrect');
	ok(parsedXml[1].dateTo === 'DateTo2', 'dateTo incorrect');
	ok(parsedXml[0].Currency === 'Euro1', 'Currency incorrect');
	ok(parsedXml[0].CurrencyCode === 'EUR1', 'CurrencyCode incorrect');
	ok(parsedXml[1].Currency === 'Euro2', 'Currency incorrect');
	ok(parsedXml[1].CurrencyCode === 'EUR2', 'CurrencyCode incorrect');
	ok(parsedXml[0].Name === 'Ticket1', 'Name incorrect');
	ok(parsedXml[1].Name === 'Ticket2', 'Name incorrect');
	for (var i=0; i<parsedXml.length; i++) {
		var ImageList = parsedXml[i]['TicketInfo.ImageList'];
		var DescriptionList = parsedXml[i]['TicketInfo.DescriptionList'];
		ok(ImageList.length === 3, 'Only 3 images in the list');
		ok(DescriptionList.length === 2, 'Only 2 descriptions in the list');
	}
	
});

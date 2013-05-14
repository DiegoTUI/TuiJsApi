/**
 * TuiInnovation.
 * Xml Reader unit tests.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

var xmlString = '<TicketAvailRS xsi-schemaLocation="http://www.hotelbeds.com/schemas/2005/06/messages TicketAvailRS.xsd" totalItems="27" echoToken="DummyEchoToken"> \
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
				<Description type="generalDescription" languageCode="SPA">Descripcion 12</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>L</Type> \
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
				<Description type="generalDescription" languageCode="SPA">Descripcion 22</Description> \
			</DescriptionList> \
			<ImageList> \
				<Image> \
					<Type>L</Type> \
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

var crap = '<Header> \
	<Level> \
		<craplist> \
			<item code="1">ITEM1</item> \
			<item code="2">ITEM2</item> \
			<item code="3">ITEM3</item> \
		</craplist> \
		<othercraplist> \
			<item code="1">ITEM1</item> \
			<item code="2">ITEM2</item> \
		</othercraplist> \
	</Level> \
	<Level> \
		<craplist> \
			<item code="1">ITEM1</item> \
		</craplist> \
		<othercraplist> \
			<item code="1">ITEM1</item> \
			<item code="2">ITEM2</item> \
			<item code="3">ITEM3</item> \
			<item code="4">ITEM4</item> \
		</othercraplist> \
	</Level> \
</Header>';

var stack = '<TicketAvailRS> \
  <ServiceTicket> \
      <TicketInfo xsi-type="ProductTicket"> \
        <DescriptionList> \
            <Description type="generalDescription" languageCode="ENG">Description 1</Description> \
            <Description type="generalDescription" languageCode="SPA">Descripcion 2</Description> \
        </DescriptionList> \
        <ImageList> \
            <Image type="generalImage">Image 1</Image> \
            <Image type="generalImage">Image 2</Image> \
        </ImageList> \
      </TicketInfo> \
    </ServiceTicket> \
</TicketAvailRS>';

var descriptionMap = [
{'DateFrom':'DateFrom.@date'},
{'DateTo':'DateTo.@date'},
'Currency',
{'CurrencyCode': 'Currency.@code'},
{'Name': 'TicketInfo.Name'},
{'TicketInfo.DescriptionList.Description':[{'Type': '@type',
					 			'Description': ''}]},
{'TicketInfo.ImageList.Image': [{'Type': 'Type',
							'Url': 'Url'}]}];

/**
 * Run tests. Parse the above xml with the above descriptionMap and see what we got
 */
QUnit.module('xmlreader');
/*test('holy piece of crap', function() {
	var xmlobject = $(crap);
	xmlobject.find("Level").each(function(){
		tui.debug ("Entered Level");
		$(this).find("craplist item").each(function(){
			tui.debug("craplist item: " + $(this).attr("code"));
			tui.debug("craplist name: " + $(this).text());
		});
	});
});*/

test('a capon', function() {
	var xmlobject = $($.parseXML(xmlString));
	xmlobject.find("ServiceTicket").each(function(){
		tui.debug ("Entered ServiceTicket");
		$(this).find("TicketInfo DescriptionList Description").each(function(){
			tui.debug("Node name: " + this.nodeName);
			tui.debug("Description type: " + $(this).attr("type"));
			tui.debug("Description itself: " + $(this).text());
		});
		$(this).find('TicketInfo ImageList Image').each(function(){
			tui.debug("Node name: " + this.nodeName);
			tui.debug("Image type: " + $(this).find("Type").text());
			tui.debug("Image url: " + $(this).find("Url").text());
			});
		});
	});

/*test('a capon II', function() {
	var xmlobject = $($.parseXML('<foo xs\:type="onetype">bar</foo>'))
	//var xmlobject = $($.parseXML('<?xml version="1.0" encoding ="utf-8"?><TicketAvailRS><ServiceTicket><TicketInfo kakafu:type="ProductTicket">kk</TicketInfo></ServiceTicket></TicketAvailRS>'));
	//var xmlobject = $($.parseXML('<TicketAvailRS><ServiceTicket><TicketInfo xsi-type="ProductTicket"><DescriptionList><Description type="generalDescription" languageCode="ENG">Description 1</Description><Description type="generalDescription" languageCode="SPA">Descripcion 2</Description></DescriptionList><ImageList><Image type="generalImage">Image 1</Image><Image type="generalImage">Image 2</Image></ImageList></TicketInfo></ServiceTicket></TicketAvailRS>'));
	xmlobject.find("ServiceTicket").each(function(i, e){
		console.log ("Entered ServiceTicket: " + i);
		$(e).find("TicketInfo DescriptionList Description").each(function(){
			console.log ("Entered Description e");
			console.log("Node name: " + this.nodeName);
			console.log("Description type: " + $(this).attr("type"));
			console.log("Description itself: " + $(this).text());
		});
		$(this).find("TicketInfo").each(function(){
			console.log ("Entered TicketInfo");
		});
		$(this).find("TicketInfo DescriptionList Description").each(function(){
			console.log ("Entered Description");
			console.log("Node name: " + this.nodeName);
			console.log("Description type: " + $(this).attr("type"));
			console.log("Description itself: " + $(this).text());
		});
		$(this).find("TicketInfo ImageList Image").each(function(){
			console.log ("Entered Image");
			console.log("Node name: " + this.nodeName);
			console.log("Image type: " + $(this).attr("type"));
			console.log("Image itself: " + $(this).text());
		});
	});
});*/

test('parsing test xml', function() {
	var xmlReader = new tui.xmlReader (xmlString, descriptionMap);
	var parsedXml = xmlReader.readObjects('ServiceTicket');
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
		var ImageList = parsedXml[i]['TicketInfo.ImageList'];
		var DescriptionList = parsedXml[i]['TicketInfo.DescriptionList'];
		ok(ImageList.length === 3, 'Only 3 images in the list: ' + ImageList.length);
		ok(DescriptionList.length === 2, 'Only 2 descriptions in the list: ' + DescriptionList.length);
	}
	
});

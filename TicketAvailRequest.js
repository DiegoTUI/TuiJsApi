'use strict';
/*
 * TuiInnovation JS API.
 * TicketAvailRequest: performs a TicketAvail request to ATLAS and resturns the results
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tuins === 'undefined') {
	tui.debug("TicketAvailRequest.js - initializing tuins");
	var tuins = {};
}

/**
 * The TicketAvail request.
 * queryParameters: the parameters to build the xml and perform the call
 * descriptionMap: the json describing wich fields you want to read from the xml
 * tag: the tag to indicate which objects in the xml should we look for. Root if undefined or null
 */
tuins.TicketAvailRequest = function(queryParameters, descriptionMap, tag)
{
	// self-reference
	var self = this;

	//requires
	var ParametrizedString = require('/js/ParametrizedString.js');
	var ajax = require('/js/ajax.js');
	var XmlReader = require('/js/XmlReader.js');

	//Initialize query parameters
	initQueryParams();

	/**
	 * Sends the ajax request to the apropriate url with the right xml and query parameters
	 * ok: callback in case of ok
	 * nok: callback in case of not ok
	 */
	self.sendRequest = function(ok, nok) {
		var parametrizedRequest = new ParametrizedString(tui.atlas.ticketAvailRequest, queryParameters);
		var data = {xml_request: parametrizedRequest.replaceAllClean()};
		tui.debug("about to launch request: " + JSON.stringify(data));
		//ajax.send(data, tui.atlas.url, ok, nok, /*isPost*/ true);
		ajax.send(data, tui.atlas.url, ajax.process([parseResponse, ok]), nok, /*isPost*/ true);
	}

	/**
	 * Check the query parameters and creates (if needed) some of the compulsory fields
	 */
	function initQueryParams() {
		//tui.debug("atlasDefaults for ticketAvailRequest: " + JSON.stringify(tui.atlasDefaults.ticketAvailRequest)); 
		for (var key in tui.atlasDefaults.ticketAvailRequest) {
			if (!(key in queryParameters)){
				queryParameters[key] = typeof tui.atlasDefaults.ticketAvailRequest[key] === "function" ?
											tui.atlasDefaults.ticketAvailRequest[key]() : tui.atlasDefaults.ticketAvailRequest[key];
			}
		}
	}

	/**
	 * Parses the xml received according to the provided descriptionMap and returns the result
	 * data: the xml received
	 */
	function parseResponse(data) {
		var xmlReader = new XmlReader (data, descriptionMap, tag);
		return xmlReader.readObjects();
	}

	return self;
}

module.exports = tuins.TicketAvailRequest;


'use strict';
/*
 * TuiInnovation JS API.
 * TicketAvailRequest: performs a TicketAvail request to ATLAS and resturns the results
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tuins === 'undefined') {
	tui.debug("ticketAvailRequest.js - initializing tuins");
	var tuins = {};
}

/**
 * The TicketAvail request.
 * parameters: the parameters to build the xml and perform the call
 */
tuins.ticketAvailRequest = function(parameters)
{
	// self-reference
	var self = this;

	//requires
	var ParametrizedString = require('/js/parametrizedString.js');
	var ajax = require('/js/ajax.js')

	//Initialize parameters
	initParams();

	/**
	 * Sends the ajax request to the apropriate url with the right xml and parameters
	 * ok: callback in case of ok
	 * nok: callback in case of not ok
	 */
	self.sendRequest = function(ok, nok) {
		var parametrizedRequest = new ParametrizedString(tui.atlas.ticketAvailRequest, parameters);
		var data = {xml_request: parametrizedRequest.replaceAllClean()};
		tui.debug("about to launch request: " + JSON.stringify(data));
		ajax.send(data, tui.atlas.url, ok, nok, /*isPost*/ true);
	}

	/**
	 * Check the parameters and creates (if needed) some of the compulsory fields
	 */
	function initParams() {
		/*if (!("echoToken" in parameters))
			parameters["echoToken"] = tui.randomString(tui.echoTokenLength);
		if (!("sessionId" in parameters))
			parameters["sessionId"] = tui.randomString(tui.sessionIdLength);*/
		//TODO: go with the rest of default parameters
		tui.debug("atlasDefaults for ticketAvailRequest: " + JSON.stringify(tui.atlasDefaults.ticketAvailRequest)); 
		for (var key in tui.atlasDefaults.ticketAvailRequest) {
			if (!(key in parameters)){
				parameters[key] = typeof tui.atlasDefaults.ticketAvailRequest[key] === "function" ?
											tui.atlasDefaults.ticketAvailRequest[key]() : tui.atlasDefaults.ticketAvailRequest[key];
			}
		}
	}

	return self;
}

module.exports = tuins.ticketAvailRequest;


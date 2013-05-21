'use strict';
/*
 * TuiInnovation JS API.
 * TicketAvailRequest: performs a TicketAvail request to ATLAS and resturns the results
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tui === 'undefined') {
	console.log("ticketAvailRequest.js - requiring tui");
	var tui = require ('/js/tui.js');
}

/**
 * The TicketAvail request.
 * parameters: the parameters to build the xml and perform the call
 */
tui.ticketAvailRequest = function(parameters)
{
	// self-reference
	var self = this;

	//requires
	var ParametrizedString = require('/js/parametrizedString.js');

	//Initialize parameters
	initParams();

	/**
	 * Sends the ajax request to the apropriate url with the right xml and parameters
	 * ok: callback in case of ok
	 * nok: callback in case of not ok
	 */
	self.sendRequest = function(ok, nok) {
		var parametrizedRequest = new ParametrizedString(tui.atlas.ticketAvailRequest, parameters);
		tui.debug("about to launch request: " + parametrizedRequest.replaceAllClean());
		tui.ajax.send(parametrizedRequest.replaceAllClean(), tui.atlas.url, ok, nok);
	}

	/**
	 * Check the parameters and creates (if needed) some of the compulsory fields
	 */
	function initParams() {
		if (!("echoToken" in parameters))
			parameters["echoToken"] = tui.randomString(tui.echoTokenLength);
		if (!("sessionId" in parameters))
			parameters["sessionId"] = tui.randomString(tui.sessionIdLength);
		//TODO: go with the rest of default parameters
	}

	return self;
}

module.exports = tui.ticketAvailRequest;


'use strict';
/*
 * TuiInnovation JS API.
 * Ajax async calls.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tui === 'undefined') {
	console.log("ajax.js - requiring tui");
	var tui = require ('/js/tui.js');
}

/**
 * An ajax request object.
 */
var ajaxRequest = function(options)
{
	// self-reference
	var self = this;

	// globals
	var maxRetries = 3;
	var ajaxTimeout = 4000;

	// instance data
	self.retries = 0;

	/**
	 * Set all the options for the request. This includes:
	 * data: the data to send to the server.
	 * url: the url to connect to.
	 * ok: callback for success.
	 * nok: callback for failure.
	 * timeout: connection time out.
	 * once: if the request is to be sent just once.
	 */
	self.setOptions = function(options)
	{
		if (!options)
		{
			return;
		}
		if (options.data)
		{
			self.data = options.data;
		}
		self.url = options.url;
		self.ok = options.ok;
		self.nok = options.nok;
		self.ajaxTimeout = options.timeout || 4000;
		self.once = options.once;
		self.type = options.type ? options.type : "GET";
	}

	self.setOptions(options);

	/**
	 * Function to send the Ajax request.
	 * Default type is POST
	 */
	self.send = function()
	{
		if (ajaxInflight.contains(self.url))
		{
			// there is another request to the same URL in flight
			tui.error('duplicated call to ' + self.url);
			if (self.once)
			{
				// ignore the request completely
				return;
			}
		}
		ajaxInflight.add(self.url);
		var startTime = new Date().getTime();
		var params = {
			data: self.data,
			url: self.url,
			type: self.type,
			dataType: 'json',
			timeout: ajaxTimeout,
			success: self.ok,
			complete: function(jqxhr, status) {
				tui.debug("Ajax complete. Status: " + status + " - jqxhr: " + JSON.stringify(jqxhr));
				self.ajaxComplete(jqxhr, status);
				ajaxInflight.remove(self.url);
				var elapsed = new Date().getTime() - startTime;
				tui.instrument(status, elapsed, self.url);
			}
		};
		$.ajax(params);
	}

	/**
	 * Ajax call complete, manage errors and call the callbacks.
	 */
	self.ajaxComplete = function(jqxhr, status)
	{
		if (status == 'success')
		{
			// will be called as success callback (self.ok)
			return;
		}
		var error;
		if (status == 'timeout')
		{
			self.retries++;
			if (self.retries < maxRetries)
			{
				ajaxTimeout += 2000;
				self.send();
				return;
			}
			error = new tui.Error('server_not_responding', 'Server not responding: ' + jqxhr.statusText);
		}
		else if (status == 'error' && jqxhr.status == 401)
		{
			error = new tui.Error('invalid_login', 'Invalid email or password');
		}
		else if (status == 'error')
		{
			error = new tui.Error('server_error', 'Server error: ' + JSON.stringify(jqxhr));
		}
		else if (status == 'parsererror')
		{
			error = new tui.Error('parse_error', 'Parse error: ' + JSON.stringify(jqxhr));
		}
		else
		{
			error = new tui.Error('unspecified_error', 'Unspecified error: ' + jqxhr.statusText);
		}
		if (self.nok)
		{
			self.nok(error, jqxhr);
		}
	}
}

/**
 * object to encapsulate Ajax globals and functions.
 */
tui.ajax = new function()
{
	// self-reference
	var self = this;

	/**
	 * Function to submit data using Ajax, with instrumentation.
	 * ok: function to call with data after a success.
	 * nok: function to call with error object after a failure.
	 */
	self.send = function(data, url, ok, nok, isPost, timeout)
	{
		var options = createOptions(data, url, ok, nok, isPost, timeout);
		if (!options)
		{
			return;
		}
		var request = new ajaxRequest(options);
		request.send();
	}

	/**
	 * Function to submit data using Ajax, just once.
	 * The second request onflight gets queued.
	 * ok: function to call with data after a success.
	 * nok: function to call with error object after a failure.
	 */
	self.sendOnce = function(data, url, ok, nok, isPost, timeout)
	{
		var options = createOptions(data, url, ok, nok, isPost, timeout);
		if (!options)
		{
			return;
		}
		options.once = true;
		var request = new ajaxRequest(options);
		request.send();
	}

	/**
	 * Process one result through a pipeline.
	 * Each function is called in order; if it returns a value it replaces the original.
	 */
	self.process = function(pipeline)
	{
		return function(data)
		{
			self.runPipeline(pipeline, data);
		};
	}

	/**
	 * Process the typical API result for multiple values through a callback or a pipeline.
	 * The typical result has total, results, offset and values; for pagination. Only the values are used here.
	 * For a single callback it is called with the values.
	 * For a pipeline each function is called in order; if it returns a value it replaces the original.
	 */
	self.processValues = function(callback)
	{
		return function(data)
		{
			if (typeof callback == 'function')
			{
				callback(data.values);
				return;
			}
			self.runPipeline(callback, data.values);
		};
	}

	/**
	 * Process each element in an array using a callback.
	 */
	self.processEach = function(callback)
	{
		return function(data)
		{
			for (var index in data)
			{
				var element = data[index];
				var result = callback(element);
				if (result)
				{
					data[index] = result;
				}
			}
		};
	}

	/**
	 * Run a value through a pipeline of functions.
	 * Each function in the pipeline has its turn to use or modify the data.
	 * If a function returns a value, it substitutes the original data.
	 */
	self.runPipeline = function(pipeline, data)
	{
		while (pipeline.length > 0)
		{
			var callback = pipeline.shift();
			if (!callback)
			{
				continue;
			}
			if (!self.checkCallback(callback, 'Wrong callback in pipeline'))
			{
				continue;
			}
			var result = callback(data);
			if (result)
			{
				data = result;
			}
		}
		return data;
	}

	/**
	 * Check that the callback is null, or a function.
	 * Returns true, or shows an error and returns false.
	 */
	self.checkCallback = function(callback, message)
	{
		if (!callback)
		{
			return true;
		}
		if (typeof callback != 'function')
		{
			tui.error(message);
			return false;
		}
		return true;
	}

	/**
	 * Create the options for the request, encapsulating all request data.
	 */
	function createOptions(data, url, ok, nok, isPost, timeout)
	{
		if (!self.checkCallback(ok, 'ok for ' + url + ' is not a function') ||
				!self.checkCallback(nok, 'nok for ' + url + ' is not a function'))
		{
			tui.error(url);
			return;
		}
		if (!url)
		{
			nok('Invalid URL');
			return;
		}
		var retrieved = ajaxCache.retrieve(data, url);
		if (retrieved)
		{
			if (ok)
			{
				ok(retrieved);
			}
			return;
		}
		return {
			data: data,
			url: url,
			ok: ajaxCache.storeOk(ok, url),
			nok: nok,
			type: isPost ? "GET" : "POST",
			timeout: timeout
		}
	}
}

/**
 * Pseudo-global to encapsulate a cache for Ajax call results.
 */
var ajaxCache = new function()
{
	// self-reference
	var self = this;

	// globals
	var cachePrefix = 'web.cache.';

	/**
	 * A structure with url: {days cached, version}. Increase the version to force a reload.
	 */
	var cachedUrls = {};

	/**
	 * Ensure that the given URL is cached for at least one day.
	 * version: optional version number; increase by one to force a reload.
	 */
	self.ensureCached = function(url, version)
	{
		if (!(url in cachedUrls))
		{
			cachedUrls[url] = {days: 1, version: version || 1};
		}
	}

	/**
	 * Return a callback that calls ok(), then stores the result in the cache.
	 */
	self.storeOk = function(ok, url)
	{
		if (!(url in cachedUrls))
		{
			return ok;
		}
		return function(result)
		{
			if (ok)
			{
				ok(result);
			}
			self.store(url, result);
		};
	}

	/**
	 * Store the data received for an Ajax call into local storage.
	 */
	self.store = function(url, data)
	{
		if (!(url in cachedUrls))
		{
			return;
		}
		data.stored = new Date().getTime();
		data.version = cachedUrls[url].version;
		localStorage[cachePrefix + url] = JSON.stringify(data);
	}

	/**
	 * Retrieve the data for a cached Ajax call from local storage.
	 * The data cannot contain any parameters; the url must be cached.
	 * Returns null if not found or expired, data otherwise.
	 */
	self.retrieve = function(data, url)
	{
		if (!(url in cachedUrls))
		{
			return null;
		}
		if (!$.isEmptyObject(data))
		{
			return null;
		}
		var cachedConfig = cachedUrls[url];
		var serialized = localStorage[cachePrefix + url];
		if (!serialized)
		{
			return null;
		}
		var cachedData;
		try
		{
			cachedData = JSON.parse(serialized);
		}
		catch (exception)
		{
			tui.error('parse stored ' + url);
			return null;
		}
		// check version and expiration date
		if (!cachedData.version || cachedData.version != cachedConfig.version)
		{
			return null;
		}
		var validInterval = cachedConfig.days * (1000 * 3600 * 24);
		var current = new Date().getTime();
		if (!cachedData.stored || cachedData.stored + validInterval < current)
		{
			return null;
		}
		return cachedData;
	}
}

/**
 * An ajax store of inflight calls for successive calls to the same url.
 */
var ajaxInflight = new function()
{
	// self-reference
	var self = this;

	// a structure with all inflight requests
	var inflight = {};

	/**
	 * Find out if there is an inflight request to the URL.
	 */
	self.contains = function(url)
	{
		return url in inflight;
	}

	/**
	 * Add an inflight request to avoid redundant calls.
	 */
	self.add = function(url)
	{
		inflight[url] = true;
	}

	/**
	 * Remove an inflight request.
	 */
	self.remove = function(url)
	{
		delete inflight[url];
	}
}

module.exports = tui.ajax;


'use strict';
/*
 * TuiInnovation JS API.
 * Ajax async calls.
 *
 * Copyright (C) 2013 TuiInnovation.
 */

if (typeof tui === 'undefined')
	var tui = require ('tui.js');

/**
 * An ajax request object.
 */
var ajax_request = function(options)
{
	// self-reference
	var self = this;

	// globals
	var max_retries = 3;
	var ajax_timeout = 4000;

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
	self.set_options = function(options)
	{
		if (!options)
		{
			return;
		}
		if (options.data)
		{
			login.add_token(options.data);
			self.data = options.data;
		}
		self.url = options.url;
		self.ok = options.ok;
		self.nok = options.nok;
		self.ajax_timeout = options.timeout || 4000;
		self.once = options.once;
	}

	self.set_options(options);

	/**
	 * Function to send the Ajax request.
	 */
	self.send = function()
	{
		if (ajax_inflight.contains(self.url))
		{
			// there is another request to the same URL in flight
			tui.error('duplicated call to ' + self.url);
			if (self.once)
			{
				// ignore the request completely
				return;
			}
		}
		ajax_inflight.add(self.url);
		var start_time = new Date().getTime();
		var params = {
			data: self.data,
			url: self.url,
			dataType: 'json',
			timeout: ajax_timeout,
			success: self.ok,
			complete: function(jqxhr, status) {
				self.ajax_complete(jqxhr, status);
				ajax_inflight.remove(self.url);
				var elapsed = new Date().getTime() - start_time;
				tui.instrument(status, elapsed, self.url);
			}
		};
		if ('password' in self.data)
		{
			params.type = 'POST';
		}
		$.ajax(params);
	}

	/**
	 * Ajax call complete, manage errors and call the callbacks.
	 */
	self.ajax_complete = function(jqxhr, status)
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
			if (self.retries < max_retries)
			{
				ajax_timeout += 2000;
				self.send();
				return;
			}
			error = new Error('server_not_responding', 'Server not responding: ' + jqxhr.statusText);
		}
		else if (status == 'error' && jqxhr.status == 401)
		{
			error = new Error('invalid_login', 'Invalid email or password');
		}
		else if (status == 'error')
		{
			error = new Error('server_error', 'Server error: ' + jqxhr.statusText);
		}
		else if (status == 'parsererror')
		{
			error = new Error('parse_error', 'Parse error: ' + jqxhr.statusText);
		}
		else
		{
			error = new Error('unspecified_error', 'Unspecified error: ' + jqxhr.statusText);
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
	self.send = function(data, url, ok, nok, timeout)
	{
		var options = create_options(data, url, ok, nok, timeout);
		if (!options)
		{
			return;
		}
		var request = new ajax_request(options);
		request.send();
	}

	/**
	 * Function to submit data using Ajax, just once.
	 * The second request onflight gets queued.
	 * ok: function to call with data after a success.
	 * nok: function to call with error object after a failure.
	 */
	self.send_once = function(data, url, ok, nok, timeout)
	{
		var options = create_options(data, url, ok, nok, timeout);
		if (!options)
		{
			return;
		}
		options.once = true;
		var request = new ajax_request(options);
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
			self.run_pipeline(pipeline, data);
		};
	}

	/**
	 * Process the typical API result for multiple values through a callback or a pipeline.
	 * The typical result has total, results, offset and values; for pagination. Only the values are used here.
	 * For a single callback it is called with the values.
	 * For a pipeline each function is called in order; if it returns a value it replaces the original.
	 */
	self.process_values = function(callback)
	{
		return function(data)
		{
			if (typeof callback == 'function')
			{
				callback(data.values);
				return;
			}
			self.run_pipeline(callback, data.values);
		};
	}

	/**
	 * Process each element in an array using a callback.
	 */
	self.process_each = function(callback)
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
	self.run_pipeline = function(pipeline, data)
	{
		while (pipeline.length > 0)
		{
			var callback = pipeline.shift();
			if (!callback)
			{
				continue;
			}
			if (!self.check_callback(callback, 'Wrong callback in pipeline'))
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
	self.check_callback = function(callback, message)
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
	function create_options(data, url, ok, nok, timeout)
	{
		if (!self.check_callback(ok, 'ok for ' + url + ' is not a function') ||
				!self.check_callback(nok, 'nok for ' + url + ' is not a function'))
		{
			tui.error(url);
			return;
		}
		if (!url)
		{
			nok('Invalid URL');
			return;
		}
		var retrieved = ajax_cache.retrieve(data, url);
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
			ok: ajax_cache.store_ok(ok, url),
			nok: nok,
			timeout: timeout
		}
	}
}

/**
 * Pseudo-global to encapsulate a cache for Ajax call results.
 */
var ajax_cache = new function()
{
	// self-reference
	var self = this;

	// globals
	var cache_prefix = 'web.cache.';

	/**
	 * A structure with url: {days cached, version}. Increase the version to force a reload.
	 */
	var cached_urls = {};

	/**
	 * Ensure that the given URL is cached for at least one day.
	 * version: optional version number; increase by one to force a reload.
	 */
	self.ensure_cached = function(url, version)
	{
		if (!(url in cached_urls))
		{
			cached_urls[url] = {days: 1, version: version || 1};
		}
	}

	/**
	 * Return a callback that calls ok(), then stores the result in the cache.
	 */
	self.store_ok = function(ok, url)
	{
		if (!(url in cached_urls))
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
		if (!(url in cached_urls))
		{
			return;
		}
		data.stored = new Date().getTime();
		data.version = cached_urls[url].version;
		localStorage[cache_prefix + url] = JSON.stringify(data);
	}

	/**
	 * Retrieve the data for a cached Ajax call from local storage.
	 * The data cannot contain any parameters; the url must be cached.
	 * Returns null if not found or expired, data otherwise.
	 */
	self.retrieve = function(data, url)
	{
		if (!(url in cached_urls))
		{
			return null;
		}
		if (!$.isEmptyObject(data))
		{
			return null;
		}
		var cached_config = cached_urls[url];
		var serialized = localStorage[cache_prefix + url];
		if (!serialized)
		{
			return null;
		}
		var cached_data;
		try
		{
			cached_data = JSON.parse(serialized);
		}
		catch (exception)
		{
			tui.error('parse stored ' + url);
			return null;
		}
		// check version and expiration date
		if (!cached_data.version || cached_data.version != cached_config.version)
		{
			return null;
		}
		var valid_interval = cached_config.days * (1000 * 3600 * 24);
		var current = new Date().getTime();
		if (!cached_data.stored || cached_data.stored + valid_interval < current)
		{
			return null;
		}
		return cached_data;
	}
}

/**
 * An ajax store of inflight calls for successive calls to the same url.
 */
var ajax_inflight = new function()
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


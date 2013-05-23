/*
 * TuiInnovation main object.
 * Global variables and functions.
 *
 * Copyright (C) 2013 TuiInnovation.
 */


/**
 * Pseudo-global for site-wide globals and functions.
 */
var tui = new function()
{
	// self-reference
	var self = this;

	// urls

	// globals
	self.debugMode = true;
	self.startTime = 0;
	self.browserVersion = null;
	self.echoTokenLength = 8;
	self.sessionIdLength = 8;
	self.sendEvents = {
		load: true,
		error: true,
		timeout: true,
		parserError: true
	};

	//Default values for requests in ATLAS
	self.atlasDefaults = require('/js/atlasDefaults.js');
	//Requests and description maps from ATLAS
	self.atlas = require('/js/atlas.js');
	

	/**
	 * Check out for testing mode: turns on local access and instrumentation.
	 */
	self.isTesting = function()
	{
		if (window.parent && window.parent != window)
		{
			// check isTesting in parent
			return window.parent.tui.isTesting();
		}
		if (!isConsoleActive())
		{
			return false;
		}
		if (('firebug' in console) || ('phantomjs' in console))
		{
			return true;
		}
		return false;
	}

	/**
	 * Instrument an application event.
	 * Will console.log() a string: 'testing.type.duration.message'.
	 * May also send an event to the server, if configured to do so.
	 */
	self.instrument = function(type, duration, message)
	{
		var event = type + '.' + duration + '.' + message;
		if (self.isTesting() || isConsoleActive())
		{
			var message = 'testing.' + event;
			if (type == 'error')
			{
				console.error(message);
			}
			else
			{
				console.log(message);
			}
		}
		if (!self.sendEvents[type])
		{
			return;
		}
		//send events to the server when configured to
		/*$.ajax({
			data: {
				event: event,
				appl: 'web',
				user_id: login.get_user_id()
			},
			dataType: 'text',
			url: self.api_url_event,
			timeout: 4000
		});*/
	}

	/**
	 * Show a debug message: only if tui.debugMode is active and the console can be logged to.
	 */
	self.debug = function(message)
	{
		if (!self.debugMode)
		{
			return;
		}
		if (self.isTesting())
		{
			message = 'debug.' + message;
		}
		if (isConsoleActive())
		{
			console.log(message);
		}
	}

	/**
	 * Show an error message, instrument it.
	 */
	self.error = function(message)
	{
		self.instrument('error', computeElapsed(), message);
	}

	/**
	 * Find out if the argument is a string.
	 */
	self.isString = function(argument)
	{
		return typeof argument == 'string';
	}

	/**
	 * Clone an object, including functions.
	 */
	self.cloneObject = function(object)
	{
		var cloned = (object instanceof Array) ? [] : {};
		for (var i in object)
		{
			if (object[i] && typeof object[i] == "object")
			{
				cloned[i] = cloneObject(object[i]);
			}
			else
			{
				cloned[i] = object[i];
			}
		}
		return cloned;
	};

	/**
	 * Converts numeric degrees to radians.
	 */
	self.toRad = function(number)
	{
		return number * Math.PI / 180;
	}

	/**
	 * Prototype for errors.
	 */
	self.Error = function(code, message)
	{
		this.error = true;
		this.code = code;
		this.message = message;
	}

	/**
	 * Finish loading the page. Used for instrumentation.
	 */
	self.finishLoading = function()
	{
		self.instrument('load', computeElapsed(), window.location.href);
	}

	/**
	 * Finish a visual change. Used for instrumentation.
	 */
	self.finishChange = function(message, timeout)
	{
		if (!message)
		{
			message = window.location.href;
		}
		var change = function()
		{
			self.instrument('change', timeout || 0, message);
		};
		if (!timeout)
		{
			change();
			return;
		}
		setTimeout(change, timeout);
	}

	/**
	 * Clear test data. Use only for testing purposes, as admin user.
	 */
	self.clearTestData = function(ok, nok)
	{
		//ajax.send({}, self.api_url_clear_test_data, ok, nok);
	}

	/**
	 * Format a date coming from the API: yyyy-mm-dd.
	 */
	self.formatDate = function(dateString)
	{
		if (!dateString)
		{
			return null;
		}
		return dateString.substringUpTo('T');
	}

	/**
	 * Format a time coming from the API: yyyy-mm-ddThh:mm+00.00.
	 */
	self.formatTime = function(dateString)
	{
		return dateString.substringUpTo('+').substringFrom('T');
	}

	/**
	 * Parse a date string from the API into a Date object.
	 * Date is in ISO format yyyy-mm-ddThh:mm+00.00.
	 */
	self.parseDate = function(dateString, offset)
	{
		if (!dateString)
		{
			return null;
		}
		var year = parseInt(dateString.substr(0, 4), 10);
		var month = parseInt(dateString.substr(5, 2), 10);
		var day = parseInt(dateString.substr(8, 2), 10);
		if (offset)
		{
			day += offset;
		}
		return new Date(year, month -1, day);
	}

	/**
	 * Return the date object in ISO 8601 format: yyyy-mm-dd.
	 */
	self.isoDate = function(date)
	{
		 return date.getFullYear() + '-'
			 + pad00(date.getMonth()+1)+'-'
			 + pad00(date.getDate());
	}

	/**
	 * Return the date object in ATLAS format: yyyymmdd.
	 */
	self.atlasDate = function(date)
	{
		 return (date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate()).toString();
	}

	/**
	 * Return a random string of length
	 */
	self.randomString = function(length)
	{
		 return Math.random().toString(36).substr(2, length);
	}

	/**
	 * Store a value in localStorage.
	 */
	self.store = function(key, value)
	{
		localStorage[key] = JSON.stringify(value);
	}

	/**
	 * Retrieve a value from localStorage.
	 */
	self.retrieve = function(key)
	{
		if (!localStorage[key])
		{
			return null;
		}
		return JSON.parse(localStorage[key]);
	}

	/**
	 * Retrieve a value from localStorage, remove it.
	 */
	self.retrieveRemove = function(key)
	{
		var value = self.retrieve(key);
		if (!value)
		{
			return null;
		}
		// work around an apparent bug in Chrome
		localStorage[key] = undefined;
		localStorage.removeItem(key);
		return value;
	}

	/**
	 * Detect the browser brand and the particular version.
	 */
	self.detectBrowserVersion = function()
	{
		if (self.browserVersion)
		{
			return self.browserVersion;
		}
		self.browserVersion =
		{
			userAgent: navigator.userAgent,
			version: '0',
			browser: 'unknown'
		}
		var lowerAgent = navigator.userAgent.toLowerCase();
		// PhantomJS is not detected in jQuery
		if (/phantomjs/.test(lowerAgent))
		{
			return extractVersion('phantomjs', $.browser.version);
		}
		if($.browser.msie)
		{
			return extractVersion('msie', $.browser.version);
		}
		// Chrome is not detected in jQuery
		if(/chrome/.test(lowerAgent))
		{
			return extractVersion('chrome', lowerAgent.substring(lowerAgent.indexOf('chrome/') +7));
		}
		if($.browser.safari)
		{
			return extractVersion('safari', lowerAgent.substring(lowerAgent.indexOf('safari/') +7));
		}
		if($.browser.mozilla)
		{
			//Is it Firefox?
			if(lowerAgent.indexOf('firefox') != -1)
			{
				return extractVersion('firefox', lowerAgent.substring(lowerAgent.indexOf('firefox/') + 8));
			}
			// If not then it must be another Mozilla
			return extractVersion('another_mozilla', lowerAgent);
		}
		if($.browser.opera)
		{
			return extractVersion('opera', lowerAgent.substring(lowerAgent.indexOf('version/') + 8));
		}
		return self.browserVersion;
	}

	/**
	 * Extract the version number, cache and return.
	 */
	function extractVersion(browser, fullVersion)
	{
		self.browserVersion.browser =  browser;
		self.browserVersion.version = fullVersion.substringUpTo('.');
		return self.browserVersion;
	}

	/**
	 * Check out if the console is active for logging.
	 */
	function isConsoleActive()
	{
		if (typeof console == 'undefined')
		{
			return false;
		}
		return ('log' in console);
	}

	/**
	 * Compute elapsed time up to now.
	 */
	function computeElapsed()
	{
		if (self.startTime != 0)
		{
			return new Date().getTime() - self.startTime;
		}
		return 0;
	}

	/**
	 * Pad a number to two digits.
	 */
	function pad00(number)
	{
		tui.debug ("pad00tui: " + number);
		return "jarltui";
		return number < 10 ? '0' + number : number;
	}
}

tui.startTime = new Date().getTime();
//export module
module.exports = tui;
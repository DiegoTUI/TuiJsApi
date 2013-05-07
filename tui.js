/*
 * TuiInnovation main object.
 * Global variables and functions.
 * http://moveinblue.com/
 *
 * Copyright (C) 2011 MoveinBlue.
 */


/**
 * Pseudo-global for site-wide globals and functions.
 */
var tui = new function()
{
	// self-reference
	var self = this;

	// urls
	self.aux = "you fuck my mother";

	// globals
	self.debug_mode = false;
	self.start_time = 0;
	self.browser_version = null;
	self.send_events = {
		load: true,
		error: true,
		timeout: true,
		parsererror: true
	};

	/**
	 * Check out for testing mode: turns on local access and instrumentation.
	 */
	self.is_testing = function()
	{
		if (window.parent && window.parent != window)
		{
			// check is_testing in parent
			return window.parent.tui.is_testing();
		}
		if (!is_console_active())
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
		if (self.is_testing() || is_console_active())
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
		if (!self.send_events[type])
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
	 * Show a debug message: only if tui.debug_mode is active and the console can be logged to.
	 */
	self.debug = function(message)
	{
		if (!self.debug_mode)
		{
			return;
		}
		if (self.is_testing())
		{
			message = 'debug.' + message;
		}
		if (is_console_active())
		{
			console.log(message);
		}
	}

	/**
	 * Show an error message, instrument it.
	 */
	self.error = function(message)
	{
		self.instrument('error', compute_elapsed(), message);
	}

	/**
	 * Find out if the argument is a string.
	 */
	self.is_string = function(argument)
	{
		return typeof argument == 'string';
	}

	/**
	 * Clone an object, including functions.
	 */
	self.clone_object = function(object)
	{
		var cloned = (object instanceof Array) ? [] : {};
		for (var i in object)
		{
			if (object[i] && typeof object[i] == "object")
			{
				cloned[i] = clone_object(object[i]);
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
	self.finish_loading = function()
	{
		self.instrument('load', compute_elapsed(), window.location.href);
	}

	/**
	 * Finish a visual change. Used for instrumentation.
	 */
	self.finish_change = function(message, timeout)
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
	self.clear_test_data = function(ok, nok)
	{
		ajax.send({}, self.api_url_clear_test_data, ok, nok);
	}

	/**
	 * Format a date coming from the API: yyyy-mm-dd.
	 */
	self.format_date = function(date_string)
	{
		if (!date_string)
		{
			return null;
		}
		return date_string.substringUpTo('T');
	}

	/**
	 * Format a time coming from the API: yyyy-mm-ddThh:mm+00.00.
	 */
	self.format_time = function(date_string)
	{
		return date_string.substringUpTo('+').substringFrom('T');
	}

	/**
	 * Parse a date string from the API into a Date object.
	 * Date is in ISO format yyyy-mm-ddThh:mm+00.00.
	 */
	self.parse_date = function(date_string, offset)
	{
		if (!date_string)
		{
			return null;
		}
		var year = parseInt(date_string.substr(0, 4), 10);
		var month = parseInt(date_string.substr(5, 2), 10);
		var day = parseInt(date_string.substr(8, 2), 10);
		if (offset)
		{
			day += offset;
		}
		return new Date(year, month -1, day);
	}

	/**
	 * Return the date object in ISO 8601 format: yyyy-mm-dd.
	 */
	self.iso_date = function(date)
	{
		 return date.getFullYear() + '-'
			 + pad00(date.getMonth()+1)+'-'
			 + pad00(date.getDate());
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
	self.retrieve_remove = function(key)
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
	self.detect_browser_version = function()
	{
		if (self.browser_version)
		{
			return self.browser_version;
		}
		self.browser_version =
		{
			user_agent: navigator.userAgent,
			version: '0',
			browser: 'unknown'
		}
		var lower_agent = navigator.userAgent.toLowerCase();
		// PhantomJS is not detected in jQuery
		if (/phantomjs/.test(lower_agent))
		{
			return extract_version('phantomjs', $.browser.version);
		}
		if($.browser.msie)
		{
			return extract_version('msie', $.browser.version);
		}
		// Chrome is not detected in jQuery
		if(/chrome/.test(lower_agent))
		{
			return extract_version('chrome', lower_agent.substring(lower_agent.indexOf('chrome/') +7));
		}
		if($.browser.safari)
		{
			return extract_version('safari', lower_agent.substring(lower_agent.indexOf('safari/') +7));
		}
		if($.browser.mozilla)
		{
			//Is it Firefox?
			if(lower_agent.indexOf('firefox') != -1)
			{
				return extract_version('firefox', lower_agent.substring(lower_agent.indexOf('firefox/') + 8));
			}
			// If not then it must be another Mozilla
			return extract_version('another_mozilla', lower_agent);
		}
		if($.browser.opera)
		{
			return extract_version('opera', lower_agent.substring(lower_agent.indexOf('version/') + 8));
		}
		return self.browser_version;
	}

	/**
	 * Extract the version number, cache and return.
	 */
	function extract_version(browser, full_version)
	{
		self.browser_version.browser =  browser;
		self.browser_version.version = full_version.substringUpTo('.');
		return self.browser_version;
	}

	/**
	 * Check out if the console is active for logging.
	 */
	function is_console_active()
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
	function compute_elapsed()
	{
		if (self.start_time != 0)
		{
			return new Date().getTime() - self.start_time;
		}
		return 0;
	}

	/**
	 * Pad a number to two digits.
	 */
	function pad00(number)
	{
		return number < 10 ? '0' + number : number;
	}
}

tui.start_time = new Date().getTime();
//export module
tui.debug("About to export tui");
module.exports = tui;


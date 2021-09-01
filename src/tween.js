(function ($, undefined) {
	var prefix = '', eventPrefix,
		vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
		testEl = document.createElement('div'),
		supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		transform,
		transitionProperty, transitionDuration, transitionTiming, transitionDelay,
		animationName, animationDuration, animationTiming, animationDelay,
		cssReset = {}

	function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase() }
	function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

	if (testEl.style.transform === undefined) $.each(vendors, function (vendor, event) {
		if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
			prefix = '-' + vendor.toLowerCase() + '-'
			eventPrefix = event
			return false
		}
	})

	transform = prefix + 'transform'
	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionDelay = prefix + 'transition-delay'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] =
		cssReset[animationName = prefix + 'animation-name'] =
		cssReset[animationDuration = prefix + 'animation-duration'] =
		cssReset[animationDelay = prefix + 'animation-delay'] =
		cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

	$.fx = {
		off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
		speeds: { _default: 400, fast: 200, slow: 600 },
		cssPrefix: prefix,
		transitionEnd: normalizeEvent('TransitionEnd'),
		animationEnd: normalizeEvent('AnimationEnd')
	}

	$.fn.tween = function (properties, duration, ease, callback, delay) {
		if ($.isFunction(duration))
			callback = duration, ease = undefined, duration = undefined
		if ($.isFunction(ease))
			callback = ease, ease = undefined
		if ($.isPlainObject(duration))
			ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
		if (duration) duration = (typeof duration == 'number' ? duration :
			($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
		if (delay) delay = parseFloat(delay) / 1000
		return this.anim(properties, duration, ease, callback, delay)
	}

	$.fn.anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {}, cssProperties, transforms = '',
			that = this, wrappedCallback, endEvent = $.fx.transitionEnd, fired = false

		if (duration === undefined) duration = $.fx.speeds._default / 1000
		if (delay === undefined) delay = 0
		if ($.fx.off) duration = 0
		if (typeof properties == 'string') {
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (ease || 'linear')
			endEvent = $.fx.animationEnd
		} else {
			cssProperties = []
			for (key in properties)
				if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
				else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

			if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ')
				cssValues[transitionDuration] = duration + 's'
				cssValues[transitionDelay] = delay + 's'
				cssValues[transitionTiming] = (ease || 'linear')
			}
		}
		wrappedCallback = function (event) {
			if (typeof event !== 'undefined') {
				if (event.target !== event.currentTarget) return
				$(event.target).unbind(endEvent, wrappedCallback)
			} else
				$(this).unbind(endEvent, wrappedCallback)

			fired = true
			$(this).css(cssReset)
			callback && callback.call(this)
		}
		if (duration > 0) {
			this.bind(endEvent, wrappedCallback)
			setTimeout(function () {
				if (fired) return
				wrappedCallback.call(that)
			}, ((duration + delay) * 1000) + 25)
		}
		this.size() && this.get(0).clientLeft
		this.css(cssValues)
		if (duration <= 0) setTimeout(function () {
			that.each(function () { wrappedCallback.call(this) })
		}, 0)

		return this
	}

	$.fn.scrollTo = function (options) {
		var defaults = {
			top: 0,    //滚动目标位置
			durTime: 500,  //过渡动画时间
			delay: 30,     //定时器时间
			callback: null   //回调函数
		};
		var opts = $.extend(defaults, options),
			timer = null,
			_this = this,
			curTop = _this.scrollTop(),//滚动条当前的位置
			subTop = opts.top - curTop,    //滚动条目标位置和当前位置的差值
			index = 0,
			dur = Math.round(opts.durTime / opts.delay),
			smoothScroll = function (t) {
				index++;
				var per = Math.round(subTop / dur);
				if (index >= dur) {
					console.log(t)
					_this.scrollTop(t);
					window.clearInterval(timer);
					if (opts.callback && typeof opts.callback == 'function') {
						opts.callback();
					}
					return;
				} else {
					console.log(curTop + index * per)
					_this.scrollTop(curTop + index * per);
				}
			};
		timer = window.setInterval(function () {
			smoothScroll(opts.top);
		}, opts.delay);
		return _this;
	};

	var origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
		var props = { opacity: opacity }
		if (scale) {
			props.scale = scale
			el.css($.fx.cssPrefix + 'transform-origin', '0 0')
		}
		return el.tween(props, speed, null, callback)
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call($(this))
			callback && callback.call(this)
		})
	}

	$.fn.show = function (speed, callback) {
		origShow.call(this)
		if (speed === undefined) speed = 0
		else this.css('opacity', 0)
		return anim(this, speed, 1, '1,1', callback)
	}

	$.fn.hide = function (speed, callback) {
		if (speed === undefined) return origHide.call(this)
		else return hide(this, speed, '0,0', callback)
	}

	$.fn.toggle = function (speed, callback) {
		if (speed === undefined || typeof speed == 'boolean')
			return origToggle.call(this, speed)
		else return this.each(function () {
			var el = $(this)
			el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
		})
	}

	$.fn.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback)
	}

	$.fn.fadeIn = function (speed, callback) {
		var target = this.css('opacity')
		if (target > 0) this.css('opacity', 0)
		else target = 1
		return origShow.call(this).fadeTo(speed, target, callback)
	}

	$.fn.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback)
	}

	$.fn.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = $(this)
			el[
				(el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
			](speed, callback)
		})
	}

	$.fn.longPress = function (fn, trsTime) {   //长按监听
		var $this = this;
		for (var i = 0; i < $this.length; i++) {
			(function (target) {
				var timeout;
				target.addEventListener('touchstart', function (event) {
					timeout = setTimeout(function () {
						fn(event);
					}, trsTime ? trsTime : 200);
				}, false);
				target.addEventListener('touchend', function (event) {
					clearTimeout(timeout);
				}, false);
			})($this[i]);
		}
	}

	testEl = null
})(Atu);
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

	$.fn.animate = function (properties, duration, ease, callback, delay) {
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
				if (supportedTransforms.test(key)) {
					transforms += key + '(' + properties[key] + ') '
				} else if (key == 'scrollTop') {
					return $.fn.tween(properties, duration, ease, callback, delay)
				} else {
					cssValues[key] = properties[key], cssProperties.push(dasherize(key))
				}

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

	$.fn.tween = function (properties, duration,properties2) {
		let ease = properties2 && properties2?.ease?properties2.ease:"linear" 
    let delay = properties2 && properties2?.delay?properties2.delay:0
    let callback = properties2 && properties2?.callback?properties2.callback:()=>{}

		console.log("tween", properties, duration, ease, callback, delay)

		let stepNum = Math.floor(duration * 60), stepI = 0
		let _this = this
		if (stepNum < 1) { stepNum = 1 }
		let attrs = [], attrType = "0", attrItem = [], attrStart = 0, attrEnd = 0
		let a = 1, unit = ""
    console.log(this)
		for (key in properties) {
      key=key.toLowerCase()
			attrs[key] = [];
			if (key == "scrollTop") {
				attrType = 1
				attrStart = this.scrollTop()
      } else {
				//css属性
				attrType = 0
       
      
        if(['','x','y','scale','scalex','scaley','rotate'].indexOf(key)>0){
          attrStart =( getElementTransforms($(_this)[0]).get(getTransformKey(key))||"0").replace(getTransformUnit(key), "")
        }else{
          attrStart = this.css(key).replace("px", "")
        }
       
			}
      if(['','x','y','scale','scalex','scaley','rotate'].indexOf(key)>0){
			  attrEnd = properties[key].replace(getTransformUnit(key), "")
      }else{
        console.log("key",properties[key])
        attrEnd = $.isNumber(properties[key])?properties[key]:properties[key].replace("px", "")
      }
      console.log("attrStart:",attrStart,"attrEnd:",attrEnd)
			console.log(key, attrStart)
			//attrItem.push(attrType)
			for (let i = 0; i < stepNum-1; i++) {

				attrs[key].push(easeFun(ease, attrStart, attrEnd, stepNum, i))
			}
      attrs[key].push(attrEnd)
			console.log(attrs[key])

		}
    function getTransformKey(key){
      let nkey=key
      if(nkey=='x'){nkey='translateX'}
      if(nkey=='y'){nkey='translateY'}
      if(nkey=='scalex'){nkey='scaleX'}
      if(nkey=='scaley'){nkey='scaleY'}
      return nkey
    }
    function getTransformUnit(key){
      return key=='rotate'?'deg':'px'
    }
    function getElementTransforms(el) {
  
      var str = el.style.transform || '';
      var reg  = /(\w+)\(([^)]*)\)/g;
      var transforms = new Map();
      var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
      return transforms;
    }
		function update(stepI) {
			reqAnimationFrame(function () {
				for (key in properties) {
          key=key.toLowerCase()
					if (key == "scrollTop") {
						_this.scrollTop(attrs[key][stepI])
					} else {
            if(['','x','y','scale','scalex','scaley','rotate'].indexOf(key)>0){
              
              _this.css("transform",getTransformKey(key)+"("+attrs[key][stepI]+getTransformUnit(key)+")")
            }else{
              _this.css(key, attrs[key][stepI])
            }
            
					
					}
				}
				console.log("update", key, attrs[key][stepI])
				if (stepI < stepNum - 1) {
					stepI++;
					update(stepI)
				}
			})
		}
		update(0)

	}

	var origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
		var props = { opacity: opacity }
		if (scale) {
			props.scale = scale
			el.css($.fx.cssPrefix + 'transform-origin', '0 0')
		}
		return el.animate(props, speed, null, callback)
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

var penner = (function () {

  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = {};
  var functionEasings = {
    linear: function () { return function (t) { return t; }; },
    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
    Bounce: function () { return function (t) {
      var pow2, b = 4;
      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
    }; },
    Elastic: function (amplitude, period) {
      if ( amplitude === void 0 ) amplitude = 1;
      if ( period === void 0 ) period = .5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return (t === 0 || t === 1) ? t : 
          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
      }
    }
  };

  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
  });

  Object.keys(functionEasings).forEach(function (name) {
    console.log(name)
    var easeIn = functionEasings[name];
    eases[name] = easeIn;
    eases[name+'easeIn'] = easeIn;
    eases[name+'easeOut'] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases[name+'easeInOut'] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases[name+'easeOutIn'] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });
  //console.log(eases)
  return eases;

})();
function easeFun(ease, s, e, d, t) {
	//s startVal,e endVal,d step t stepI 0~step
  ease=ease.replace(".ease","ease")

	let a = t / d, b = s * 1, c = e - s

	if (ease in penner) {
		return b + c * penner[ease]()( a )
	} else {
		return b + c * a;
	}
};
function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

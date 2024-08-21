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
  $.fn.pause = function () {
    this.css({"transition-play-state": "paused"})
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
  $.fn.animateFrom = function (properties0, properties, duration, ease, callback, delay) {
    if (typeof properties0 == 'string') {
      properties0=cssString2Object(properties0)
    }
    this.css(properties0)
    return this.animate(properties, duration, ease, callback, delay)
	}
	$.fn.anim = function (properties, duration, ease, callback, delay) {
    this.autoCss(properties)
    console.log("getElementTransforms",getElementTransforms($(this)[0]))
    
    console.log("anim",properties, duration, ease, callback, delay)
		var key, cssValues = {}, cssProperties, transforms = '',
			that = this, wrappedCallback, endEvent = $.fx.transitionEnd, fired = false

		if (duration === undefined) duration = $.fx.speeds._default / 1000
		if (delay === undefined) delay = 0
		if ($.fx.off) duration = 0
		if (typeof properties == 'string' && properties.indexOf(":")==-1) {
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (cssEase(ease) || 'linear')
			endEvent = $.fx.animationEnd
		} else {
      if(properties == 'string'){
        properties=cssString2Object(properties)
      }
			cssProperties =this.data('properties')?this.data('properties').split(","):[]
			for (key in properties)
        nkey=key
        if(key=="x" || key=="y" || key=="z"||supportedTransforms.test(key)){
          nkey="transform"
          let unit=getTransformUnit(key)
          let transforms=getElementTransforms($(this)[0])
          transforms.set(getTransformKey(key),properties[key].toString().replace(unit,'')+unit)
          nval=cssTransformObject2String(transforms)
  
        }else{
          nkey=dasherize(key)
          nval=properties[key]
        }
				if (key == 'scrollTop') {
					return $.fn.tween(properties, duration, ease, callback, delay)
				} else {
					cssValues[nkey] = nval
          if(cssProperties.indexOf(nkey)==-1){cssProperties.push(nkey)}
				}

			if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ')
        this.data('properties', cssProperties.join(','))
				cssValues[transitionDuration] = duration + 's'
				cssValues[transitionDelay] = delay + 's'
				cssValues[transitionTiming] = (cssEase(ease) || 'linear')
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
		if (duration >= 0) {
			this.bind(endEvent, wrappedCallback)
			setTimeout(function () {
				if (fired) return
				that.each(function () { wrappedCallback.call(that) })
			}, ((duration + delay) * 1000) + 25)
		}
		this.size() && this.get(0).clientLeft
    //console.log(this.size(), this.get(0).clientLeft)
    console.log("cssValues",cssValues)
		this.css(cssValues)
	
		return this
	}

	$.fn.tween = function (properties, duration,properties2) {
    let _this=this
		let ease = properties2 && properties2?.ease?properties2.ease:"linear" 
    let delay = properties2 && properties2?.delay?properties2.delay:0
    let callback = properties2 && properties2?.callback?properties2.callback:()=>{}

		console.log("tween", properties, duration, ease, callback, delay)
    if (duration >100) duration = duration / 1000
		let stepNum = Math.floor(duration * 60), stepI = 0

		if (stepNum < 1) { stepNum = 1 }
		let attrs = [], attrType = "0", attrItem = [], attrStart = 0, attrEnd = 0
		let a = 1, unit = ""
    console.log(this)
    //this.autoCss(properties)
		for (key in properties) {
      //key=key.toLowerCase()
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
          console.log(key,dasherize(key),_this.css(key),this,_this) 
          attrStart = _this.css(key).toString().replace("px", "")
        }
       
			}
      if(['','x','y','scale','scalex','scaley','rotate'].indexOf(key)>0){
			  attrEnd = properties[key].replace(getTransformUnit(key), "")
      }else{
        console.log("key",key,dasherize(key),properties[key])
        attrEnd = $.isNumber(properties[key])?properties[key]:properties[key].toString().replace("px", "")
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
    
		function update(stepI) {
			reqAnimationFrame(function () {
				for (key in properties) {
          //key=key.toLowerCase()
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
				//console.log("update", key, attrs[key][stepI])
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
  $.fn.autoCss=function(props){
    const obj=["width","height","top","left","background-color","font-size","line-height"]
    console.log("autoCss")
    const el = $(this)
   
    obj.forEach(properties => {
       let auto=props && !(properties in props)?0:1
        //console.log(properties,auto,props,properties in props)
        auto && el.css({[properties]:el.css(properties)})
    });
     
   
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
   // console.log(name)
    var easeIn = functionEasings[name];  
    eases[name] = easeIn;
    eases[name+'In'] =eases[name+'easeIn'] = easeIn;
    eases[name+'Out'] =eases[name+'easeOut'] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases[name+'InOut'] = eases[name+'easeInOut'] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases[name+'OutIn'] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });
  //console.log(eases)
  return eases;

})();
function cssEase(ease) {
  switch (ease) {
    case "linear":return "cubic-bezier(.5,0,.5,1)";
    case "QuadIn":return "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
    case "QuadOut":return "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    case "QuadInOut":return "cubic-bezier(0.455, 0.03, 0.515, 0.955)";
    case "CubicIn":return "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
    case "CubicOut":return "cubic-bezier(0.215, 0.61, 0.355, 1)";
    case "CubicInOut":return "cubic-bezier(0.645, 0.045, 0.355, 1)";
    case "QuartIn":return "cubic-bezier(0.895, 0.03, 0.685, 0.22)";
    case "QuartOut":return "cubic-bezier(0.165, 0.84, 0.44, 1)";
    case "QuartInOut":return "cubic-bezier(0.77, 0, 0.175, 1)";
    case "QuintIn":return "cubic-bezier(0.755, 0.05, 0.855, 0.06)";
    case "QuintOut":return "cubic-bezier(0.23, 1, 0.32, 1)";
    case "QuintInOut":return "cubic-bezier(0.86, 0, 0.07, 1)";
    case "ExpoIn":return "cubic-bezier(0.95, 0.05, 0.795, 0.035)";
    case "ExpoOut":return "cubic-bezier(0.19, 1, 0.22, 1)";
    case "ExpoInOut":return "cubic-bezier(1, 0, 0, 1)";
    case "SineIn":return "cubic-bezier(0.47, 0, 0.745, 0.715)";
    case "SineOut":return "cubic-bezier(0.39, 0.575, 0.565, 1)";
    case "SineInOut":return "cubic-bezier(0.445, 0.05, 0.55, 0.95)";
    case "CircIn":return "cubic-bezier(0.6, 0.04, 0.98, 0.335)";
    case "CircOut":return "cubic-bezier(0.075, 0.82, 0.165, 1)";
    case "CircInOut":return "cubic-bezier(0.785, 0.135, 0.15, 0.86)";
    case "BackIn":return "cubic-bezier(0.6, -0.28, 0.735, 0.045)";
    case "BackOut":return "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    case "BackInOut":return "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    case "ElasticIn":return "cubic-bezier(0.752, 0.085, 0.364, 1)";
    case "ElasticOut":return "cubic-bezier(0.22, 1, 0.365, 1)";
    case "ElasticInOut":return "cubic-bezier(1, -0.52, 0, 1.49)";
    case "BounceIn":return "cubic-bezier(0.2, 0.75, 0.45, 1)";
    case "BounceOut":return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "BounceInOut":return "cubic-bezier(0.895, 0.03, 0.685, 0.22)";
    default:
      return ease;
  }
}

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
function cssString2Object(cssString){
  const cssObject = {};
  const cssProperties = cssString.split(';');
  cssProperties.forEach((property) => {
    if (property.trim()!== '') {
      const [key, value] = property.split(':');
      cssObject[key.trim()] = value.trim();
    }
  });
  return cssObject
}
function cssObject2String(obj){
  let cssString = ''
  for(let key in obj){
    cssString+=key+':'+obj[key]+';'
  }
  return cssString
}
function cssTransformObject2String(myMap){
  let cssString = ''
  for (const [key, value] of myMap) {
    cssString += `${key}(${value}) `;
  }
  return cssString
}
function getTransformKey(key){
  let nkey=key
  if(nkey=='x'){nkey='translateX'}
  if(nkey=='y'){nkey='translateY'}
  if(nkey=='z'){nkey='translateZ'}
  return nkey
}
function getTransformUnit(key){
  console.log("getTransformUnit",key)
  return (key=='rotate'||key=='rotateX'||key=='rotateY')?'deg':'px'
}
function getElementTransforms(el) {

  var str = el.style.transform || '';
  var reg  = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
  return transforms;
}
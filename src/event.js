(function ($) {
	var _zid = 1, undefined,
		slice = Array.prototype.slice,
		isFunction = $.isFunction,
		isString = function (obj) { return typeof obj == 'string' },
		handlers = {},
		specialEvents = {},
		focusinSupported = 'onfocusin' in window,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	function zid(element) {
		return element._zid || (element._zid = _zid++)
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event)
		if (event.ns) var matcher = matcherFor(event.ns)
		return (handlers[zid(element)] || []).filter(function (handler) {
			return handler
				&& (!event.e || handler.e == event.e)
				&& (!event.ns || matcher.test(handler.ns))
				&& (!fn || zid(handler.fn) === zid(fn))
				&& (!selector || handler.sel == selector)
		})
	}

	function parse(event) {
		var parts = ('' + event).split('.')
		return { e: parts[0], ns: parts.slice(1).sort().join(' ') }
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) ||
			!!captureSetting
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type
	}

	function add(element, events, fn, data, selector, delegator, capture) {
		var id = zid(element), set = (handlers[id] || (handlers[id] = []))
		events.split(/\s/).forEach(function (event) {
			if (event == 'ready') return $(document).ready(fn)
      if (event == 'touchleft') return $(element).touchLeft(fn);
      if (event == 'touchright') return $(element).touchRight(fn);
      if (event == 'touchup') return $(element).touchUp(fn);
      if (event == 'touchdown') return $(element).touchDown(fn);
      if (event == 'longpress') return $(element).longPress(fn);
      if (event == 'scrollend') return $(element).scrollEnd(fn);
			var handler = parse(event)
			handler.fn = fn
			handler.sel = selector
			if (handler.e in hover) fn = function (e) {
				var related = e.relatedTarget
				if (!related || (related !== this && !$.contains(this, related)))
					return handler.fn.apply(this, arguments)
			}
			handler.del = delegator
			var callback = delegator || fn
			handler.proxy = function (e) {
				e = compatible(e)
				if (e.isImmediatePropagationStopped()) return
				e.data = data
				var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
				if (result === false) e.preventDefault(), e.stopPropagation()
				return result
			}
			handler.i = set.length
			set.push(handler)
			if ('addEventListener' in element)
				element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
		})
	}

	function remove(element, events, fn, selector, capture) {
		var id = zid(element);
		(events || '').split(/\s/).forEach(function (event) {
			findHandlers(element, event, fn, selector).forEach(function (handler) {
				delete handlers[id][handler.i]
				if ('removeEventListener' in element)
					element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
			})
		})
	}

	$.event = { add: add, remove: remove }

	$.proxy = function (fn, context) {
		var args = (2 in arguments) && slice.call(arguments, 2)
		if (isFunction(fn)) {
			var proxyFn = function () { return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
			proxyFn._zid = zid(fn)
			return proxyFn
		} else if (isString(context)) {
			if (args) {
				args.unshift(fn[context], fn)
				return $.proxy.apply(null, args)
			} else {
				return $.proxy(fn[context], fn)
			}
		} else {
			throw new TypeError("expected function")
		}
	}

	$.fn.bind = function (event, data, callback) {
		return this.on(event, data, callback)
	}
	$.fn.unbind = function (event, callback) {
		return this.off(event, callback)
	}
	$.fn.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1)
	}

	var returnTrue = function () { return true },
		returnFalse = function () { return false },
		ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
		eventMethods = {
			preventDefault: 'isDefaultPrevented',
			stopImmediatePropagation: 'isImmediatePropagationStopped',
			stopPropagation: 'isPropagationStopped'
		}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			source || (source = event)

			$.each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name]
				event[name] = function () {
					this[predicate] = returnTrue
					return sourceMethod && sourceMethod.apply(source, arguments)
				}
				event[predicate] = returnFalse
			})

			if (source.defaultPrevented !== undefined ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
					source.getPreventDefault && source.getPreventDefault())
				event.isDefaultPrevented = returnTrue
		}
		return event
	}

	function createProxy(event) {
		var key, proxy = { originalEvent: event }
		for (key in event)
			if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

		return compatible(proxy, event)
	}

	$.fn.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback)
	}
	$.fn.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback)
	}

	$.fn.live = function (event, callback) {
		$(document.body).delegate(this.selector, event, callback)
		return this
	}
	$.fn.die = function (event, callback) {
		$(document.body).undelegate(this.selector, event, callback)
		return this
	}

	$.fn.on = function (event, selector, data, callback, one) {
		var autoRemove, delegator, $this = this
		if (event && !isString(event)) {
			$.each(event, function (type, fn) {
				$this.on(type, selector, data, fn, one)
			})
			return $this
		}

		if (!isString(selector) && !isFunction(callback) && callback !== false)
			callback = data, data = selector, selector = undefined
		if (isFunction(data) || data === false)
			callback = data, data = undefined

		if (callback === false) callback = returnFalse

		return $this.each(function (_, element) {
			if (one) autoRemove = function (e) {
				remove(element, e.type, callback)
				return callback.apply(this, arguments)
			}

			if (selector) delegator = function (e) {
				var evt, match = $(e.target).closest(selector, element).get(0)
				if (match && match !== element) {
					evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element })
					return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
				}
			}

			add(element, event, callback, data, selector, delegator || autoRemove)
		})
	}
	$.fn.off = function (event, selector, callback) {
		var $this = this
		if (event && !isString(event)) {
			$.each(event, function (type, fn) {
				$this.off(type, selector, fn)
			})
			return $this
		}

		if (!isString(selector) && !isFunction(callback) && callback !== false)
			callback = selector, selector = undefined

		if (callback === false) callback = returnFalse

		return $this.each(function () {
			remove(this, event, callback, selector)
		})
	}

	$.fn.trigger = function (event, args) {
		event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
		event._args = args
		return this.each(function () {
			if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
			else if ('dispatchEvent' in this) this.dispatchEvent(event)
			else $(this).triggerHandler(event, args)
		})
	}

	$.fn.triggerHandler = function (event, args) {
		var e, result
		this.each(function (i, element) {
			e = createProxy(isString(event) ? $.Event(event) : event)
			e._args = args
			e.target = element
			$.each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e)
				if (e.isImmediatePropagationStopped()) return false
			})
		})
		return result
	}

		; ('focusin focusout focus blur load resize scroll unload click dblclick ' +
			'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
			'change select keydown keypress keyup error').split(' ').forEach(function (event) {
				$.fn[event] = function (callback) {
					return (0 in arguments) ? this.bind(event, callback) : this.trigger(event)
				}
			})

	$.Event = function (type, props) {
		if (!isString(type)) props = type, type = props.type
		var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
		if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
		event.initEvent(type, bubbles, true)
		return compatible(event)
	}

	$.fn.change = function () {
		var e = new Event('change');
		$(this)[0].dispatchEvent(e)
	};

  
  var touchObject=[],touchObjectXy=[],touchLeftId=-1,touchIds=[-1,-1,-1,-1]
  function iniTouchXY(obj,type,fn){
      //type 0 ,1,2,3：left,right,top,down
      if(touchObject.indexOf(obj)<0){
          touchObject.push(obj)
          //console.log("第一次添加",touchObject.indexOf(obj))
          touchObjectXy[touchObject.indexOf(obj)]={sxy:{x:0,y:0},exy:{x:0,y:0}}
      }
      let touchId=-1
      obj.addEventListener(touch, function (e) {
          touchId=touchIds[type]=touchObject.indexOf(obj)
          touchObjectXy[touchId].sxy=getXY(e);
      }, false);
      obj.addEventListener(touchend, function (e) {
          touchObjectXy[touchId]={sxy:{x:0,y:0},exy:{x:0,y:0}}
          touchId=touchIds[type]=-1
      }, false);
      
      $(document).on(touchmove,function(e){
          
          if(touchId>-1){
              touchObjectXy[touchId].exy=getXY(e);
  
              let sx=touchObjectXy[touchId].sxy.x,ex=touchObjectXy[touchId].exy.x
              let sy=touchObjectXy[touchId].sxy.y,ey=touchObjectXy[touchId].exy.y
              let dpx=$(window).width()*30/750
             // console.log(type,sx,ex,sy,ey)
              if((type==0 && ex<sx && Math.abs(ex-sx)>dpx)||(type==1 && ex>sx && Math.abs(ex-sx)>dpx)
                  ||(type==2 && ey<sy && Math.abs(ey-sy)>dpx)||(type==3 && ey>sy && Math.abs(ey-sy)>dpx)){
                  fn()
                  touchId=-1
              }
          }
  
      })
  }
  $.fn.touch=function(fun){
    $(this).on(touch, function (e) {   fun()})
  }
  $.fn.touchmove=function(fun){
      $(this)[0].addEventListener(touchmove, function (e) {
          e.preventDefault();
          fun()
      }, { passive: false }); 
  }
  $.fn.touchend=function(fun){
      $(this).on(touchend, function (e) {  fun()})
  }
  $.fn.touchLeft = function (fn) {
      //左滑
      var $this = this;
     // console.log($this)
      for (var i = 0; i < $this.length; i++) {
          (function (target) {
              iniTouchXY(target,0,fn)
          })($this[i]);
          
      }
  };
  $.fn.touchRight = function (fn) {
      //右滑
      var $this = this;
     // console.log($this)
      for (var i = 0; i < $this.length; i++) {
          (function (target) {
              iniTouchXY(target,1,fn)
          })($this[i]);
          
      }
      
  };
  $.fn.touchUp = function (fn) {
      //右滑
      var $this = this;
      //console.log($this)
      for (var i = 0; i < $this.length; i++) {
          (function (target) {
              iniTouchXY(target,2,fn)
          })($this[i]);
          
      }
      
  };
  $.fn.touchDown = function (fn) {
      //右滑
      var $this = this;
     // console.log($this)
      for (var i = 0; i < $this.length; i++) {
          (function (target) {
              iniTouchXY(target,3,fn)
          })($this[i]);
          
      }
      
  };
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
	};
  $.fn.scrollEnd = function (fn) {
    //右滑
    var $this = this;
    let isCheck=0,isDocument=$this[0] instanceof Document
    $this.on("scroll", function () {
      
      const scrollHeight = isDocument?$this[0].documentElement.scrollHeight:$this.prop('scrollHeight');
      const scrollTop = isDocument? $this[0].documentElement.scrollTop:$this.scrollTop();
      const clientHeight =isDocument?$this[0].documentElement.clientHeight:$this.height();
 
      console.log("scroll",isDocument,scrollHeight,scrollTop,clientHeight)
      if (scrollTop + clientHeight >= scrollHeight && !isCheck) {
        console.log('已滚动到底部');
        fn()
        isCheck=1
        setTimeout(()=>{isCheck=0},150)
      }
    })
    
};


})(Atu);
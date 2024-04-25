/* readme */
var Atu = (function () {
	var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
		document = window.document,
		elementDisplay = {}, classCache = {},
		cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
		fragmentRE = /^\s*<(\w+|!)[^>]*>/,
		singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		rootNodeRE = /^(?:body|html)$/i,
		capitalRE = /([A-Z])/g,
		methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
		adjacencyOperators = ['after', 'prepend', 'before', 'append'],
		table = document.createElement('table'),
		tableRow = document.createElement('tr'),
		containers = {
			'tr': document.createElement('tbody'),
			'tbody': table, 'thead': table, 'tfoot': table,
			'td': tableRow, 'th': tableRow,
			'*': document.createElement('div')
		},
		readyRE = /complete|loaded|interactive/,
		simpleSelectorRE = /^[\w-]*$/,
		class2type = {},
		toString = class2type.toString,
		atu = {},
		camelize, uniq,
		tempParent = document.createElement('div'),
		propMap = {
			'tabindex': 'tabIndex',
			'readonly': 'readOnly',
			'for': 'htmlFor',
			'class': 'className',
			'maxlength': 'maxLength',
			'cellspacing': 'cellSpacing',
			'cellpadding': 'cellPadding',
			'rowspan': 'rowSpan',
			'colspan': 'colSpan',
			'usemap': 'useMap',
			'frameborder': 'frameBorder',
			'contenteditable': 'contentEditable'
		},
		isArray = Array.isArray ||function (object) { return object instanceof Array }

	atu.matches = function (element, selector) {
		if (!selector || !element || element.nodeType !== 1) return false
		var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector
		if (matchesSelector) return matchesSelector.call(element, selector)
		var match, parent = element.parentNode, temp = !parent
		if (temp) (parent = tempParent).appendChild(element)
		match = ~atu.qsa(parent, selector).indexOf(element)
		temp && tempParent.removeChild(element)
		return match
	}

	function type(obj) {
		return obj == null ? String(obj) :
			class2type[toString.call(obj)] || "object"
	}
  function isNumber(val){
    var num = Number(val), type = typeof val
    return val != null && type != 'boolean' &&
      (type != 'string' || val.length) &&
      !isNaN(num) && isFinite(num) || false
  }
  function isString(val){
    return typeof val === "string";
  }
	function isFunction(value) { return type(value) == "function" }
	function isWindow(obj) { return obj != null && obj == obj.window }
	function isDocument(obj) { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	function isObject(obj) { return type(obj) == "object" }

	function isPlainObject(obj) {
		return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}

	function likeArray(obj) {
		return typeof obj.length == 'number'
	}

	function compact(array) { return filter.call(array, function (item) { return item != null }) }
	function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	camelize = function (str) { return str.replace(/-+(.)?/g, function (match, chr) { return chr ? chr.toUpperCase() : '' }) }

	function dasherize(str) {
		return str.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase()
	}
	uniq = function (array) { return filter.call(array, function (item, idx) { return array.indexOf(item) == idx }) }

	function classRE(name) {
		return name in classCache ?
			classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	}

	function maybeAddPx(name, value) {
		return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	}

	function defaultDisplay(nodeName) {
		var element, display
		if (!elementDisplay[nodeName]) {
			element = document.createElement(nodeName)
			document.body.appendChild(element)
			display = getComputedStyle(element, '').getPropertyValue("display")
			element.parentNode.removeChild(element)
			display == "none" && (display = "block")
			elementDisplay[nodeName] = display
		}
		return elementDisplay[nodeName]
	}

	function children(element) {
		return 'children' in element ?
			slice.call(element.children) :
			$.map(element.childNodes, function (node) { if (node.nodeType == 1) return node })
	}

	atu.fragment = function (html, name, properties) {
		var dom, nodes, container
		if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

		if (!dom) {
			if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
			if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
			if (!(name in containers)) name = '*'

			container = containers[name]
			container.innerHTML = '' + html
			dom = $.each(slice.call(container.childNodes), function () {
				container.removeChild(this)
			})
		}
		if (isPlainObject(properties)) {
			nodes = $(dom)
			$.each(properties, function (key, value) {
				if (methodAttributes.indexOf(key) > -1) nodes[key](value)
				else nodes.attr(key, value)
			})
		}

		return dom
	}
	atu.Z = function (dom, selector) {
		dom = dom || []
		dom.__proto__ = $.fn
		dom.selector = selector || ''
		return dom
	}
	atu.isZ = function (object) {
		return object instanceof atu.Z
	}
	atu.init = function (selector, context) {
		var dom
		if (!selector) return atu.Z()
		else if (typeof selector == 'string') {
			selector = selector.trim()
			if (selector[0] == '<' && fragmentRE.test(selector))
				dom = atu.fragment(selector, RegExp.$1, context), selector = null
			else if (context !== undefined) return $(context).find(selector)
			else dom = atu.qsa(document, selector)
		} else if (isFunction(selector)) return $(document).ready(selector)
		else if (atu.isZ(selector)) return selector
		else {
			if (isArray(selector)) dom = compact(selector)
			else if (isObject(selector))
				dom = [selector], selector = null
			else if (fragmentRE.test(selector))
				dom = atu.fragment(selector.trim(), RegExp.$1, context), selector = null
			else if (context !== undefined) return $(context).find(selector)
			else dom = atu.qsa(document, selector)
		}

		return atu.Z(dom, selector)
	}
	$ = function (selector, context) {
		return atu.init(selector, context)
	}

	function extend(target, source, deep) {
		for (key in source)
			if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
				if (isPlainObject(source[key]) && !isPlainObject(target[key]))
					target[key] = {}
				if (isArray(source[key]) && !isArray(target[key]))
					target[key] = []
				extend(target[key], source[key], deep)
			}
			else if (source[key] !== undefined) target[key] = source[key]
	}

	$.extend = function (target) {
		var deep, args = slice.call(arguments, 1)
		if (typeof target == 'boolean') {
			deep = target
			target = args.shift()
		}
		args.forEach(function (arg) { extend(target, arg, deep) })
		return target
	}
	atu.qsa = function (element, selector) {
		var found,
			maybeID = selector[0] == '#',
			maybeClass = !maybeID && selector[0] == '.',
			nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
			isSimple = simpleSelectorRE.test(nameOnly)
		return (isDocument(element) && isSimple && maybeID) ?
			((found = element.getElementById(nameOnly)) ? [found] : []) :
			(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
				slice.call(
					isSimple && !maybeID ?
						maybeClass ? element.getElementsByClassName(nameOnly) :
							element.getElementsByTagName(selector) :
						element.querySelectorAll(selector)
				)
	}

	function filtered(nodes, selector) {
		return selector == null ? $(nodes) : $(nodes).filter(selector)
	}

	$.contains = document.documentElement.contains ?
		function (parent, node) {
			return parent !== node && parent.contains(node)
		} :
		function (parent, node) {
			while (node && (node = node.parentNode))
				if (node === parent) return true
			return false
		}

	function funcArg(context, arg, idx, payload) {
		return isFunction(arg) ? arg.call(context, idx, payload) : arg
	}

	function setAttribute(node, name, value) {
		value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	}

	function className(node, value) {
		var klass = node.className || '',
			svg = klass && klass.baseVal !== undefined

		if (value === undefined) return svg ? klass.baseVal : klass
		svg ? (klass.baseVal = value) : (node.className = value)
	}

	function deserializeValue(value) {
		try {
			return value ?
				value == "true" ||
				(value == "false" ? false :
					value == "null" ? null :
						+value + "" == value ? +value :
							/^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value
		} catch (e) {
			return value
		}
	}

	$.type = type
	$.isFunction = isFunction
	$.isWindow = isWindow
	$.isArray = isArray
	$.isPlainObject = isPlainObject
	$.isEmptyObject = function (obj) {
		var name
		for (name in obj) return false
		return true
	}
	$.isNumber =isNumber
  $.isString =isString
	$.inArray = function (elem, array, i) {
		return emptyArray.indexOf.call(array, elem, i)
	}
	$.camelCase = camelize
	$.trim = function (str) {
		return str == null ? "" : String.prototype.trim.call(str)
	}
	$.isTel = function (s) {
		patrn = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[3-9]\d{9}$)|(1[3-9]\d{9}$)/;
		return patrn.exec(s) ? true : false;
	}
	$.isMobile = function (s) {
		var patrn = /^0{0,1}(13[0-9]|14(0|1|[4-9])|15([0-3]|[5-9])|16(2|5|6|7)|17[0-8]|18[0-9]|19([0-3]|[5-9]))+\d{8}$/
		return patrn.test(s)
	}
	$.isUrl = function (s) {
		patrn = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[3-9]\d{9}$)|(1[3-9]\d{9}$)/;
		return patrn.exec(s) ? true : false;
	}
	$.isEmail = function (s) {
		var patrn = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return patrn.exec(s) ? true : false;
	}
	$.isIdcard = function (s) {
		patrn = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[3-9]\d{9}$)|(1[3-9]\d{9}$)/;
		return patrn.exec(s) ? true : false;
	}
	$.isQQ = function (s) {
		var patrn = /^[1-9][0-9]{4,10}$/;
		return patrn.exec(s) ? true : false;
	}

	$.map = function (elements, callback) {
		var value, values = [], i, key
		if (likeArray(elements))
			for (i = 0; i < elements.length; i++) {
				value = callback(elements[i], i)
				if (value != null) values.push(value)
			}
		else
			for (key in elements) {
				value = callback(elements[key], key)
				if (value != null) values.push(value)
			}
		return flatten(values)
	}

	$.each = function (elements, callback) {
		var i, key
		if (likeArray(elements)) {
			for (i = 0; i < elements.length; i++)
				if (callback.call(elements[i], i, elements[i]) === false) return elements
		} else {
			for (key in elements)
				if (callback.call(elements[key], key, elements[key]) === false) return elements
		}
		return elements
	}

	$.grep = function (elements, callback) {
		return filter.call(elements, callback)
	}

	if (window.JSON) $.parseJSON = JSON.parse
	$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase()
	})

	$.fn = {
		constructor: atu.Z,
		forEach: emptyArray.forEach,
		reduce: emptyArray.reduce,
		push: emptyArray.push,
		sort: emptyArray.sort,
		splice: emptyArray.splice,
		indexOf: emptyArray.indexOf,
		concat: emptyArray.concat,

		map: function (fn) {
			return $($.map(this, function (el, i) { return fn.call(el, i, el) }))
		},
		slice: function () {
			return $(slice.apply(this, arguments))
		},
		ready: function (callback) {
			if (readyRE.test(document.readyState) && document.body) callback($)
			else document.addEventListener('DOMContentLoaded', function () {
				callback($)
			}, false)
			return this
		},
		get: function (idx) {
			return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
		},
		toArray: function () { return this.get() },
		size: function () {
			return this.length
		},
		remove: function () {
			return this.each(function () {
				if (this.parentNode != null)
					this.parentNode.removeChild(this)
			})
		},
		each: function (callback) {
			emptyArray.every.call(this, function (el, idx) {
				return callback.call(el, idx, el) !== false
			})
			return this
		},
		filter: function (selector) {
			if (isFunction(selector)) return this.not(this.not(selector))
			return $(filter.call(this, function (element) {
				return atu.matches(element, selector)
			}))
		},
		add: function (selector, context) {
			return $(uniq(this.concat($(selector, context))))
		},
		is: function (selector) {
			return this.length > 0 && atu.matches(this[0], selector)
		},
		not: function (selector) {
			var nodes = []
			if (isFunction(selector) && selector.call !== undefined)
				this.each(function (idx) {
					if (!selector.call(this, idx)) nodes.push(this)
				})
			else {
				var excludes = typeof selector == 'string' ? this.filter(selector) :
					(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
				this.forEach(function (el) {
					if (excludes.indexOf(el) < 0) nodes.push(el)
				})
			}
			return $(nodes)
		},
		has: function (selector) {
			return this.filter(function () {
				return isObject(selector) ?
					$.contains(this, selector) :
					$(this).find(selector).size()
			})
		},
		eq: function (idx) {
			return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
		},
		first: function () {
			var el = this[0]
			return el && !isObject(el) ? el : $(el)
		},
		last: function () {
			var el = this[this.length - 1]
			return el && !isObject(el) ? el : $(el)
		},
		find: function (selector) {
			var result, $this = this
			if (!selector) result = $()
			else if (typeof selector == 'object')
				result = $(selector).filter(function () {
					var node = this
					return emptyArray.some.call($this, function (parent) {
						return $.contains(parent, node)
					})
				})
			else if (this.length == 1) result = $(atu.qsa(this[0], selector))
			else result = this.map(function () { return atu.qsa(this, selector) })
			return result
		},
		closest: function (selector, context) {
			var nodes = [], collection = typeof selector == 'object' && $(selector)
			this.each(function (_, node) {
				while (node && !(collection ? collection.indexOf(node) >= 0 : atu.matches(node, selector)))
					node = node !== context && !isDocument(node) && node.parentNode
				if (node && nodes.indexOf(node) < 0) nodes.push(node)
			})
			return $(nodes)
		},


		parent: function (selector) {
			return filtered(uniq(this.pluck('parentNode')), selector)
		},
		children: function (selector) {
			return filtered(this.map(function () { return children(this) }), selector)
		},
		contents: function () {
			return this.map(function () { return this.contentDocument || slice.call(this.childNodes) })
		},
		siblings: function (selector) {
			return filtered(this.map(function (i, el) {
				return filter.call(children(el.parentNode), function (child) { return child !== el })
			}), selector)
		},

		empty: function () {
			return this.each(function () { this.innerHTML = '' })
		},
		pluck: function (property) {
			return $.map(this, function (el) { return el[property] })
		},
		show: function () {
			return this.each(function () {
				this.style.display == "none" && (this.style.display = '')
				if (getComputedStyle(this, '').getPropertyValue("display") == "none")
					this.style.display = defaultDisplay(this.nodeName)
			})
		},
		replaceWith: function (newContent) {
			return this.before(newContent).remove()
		},
		wrap: function (structure) {
			var func = isFunction(structure)
			if (this[0] && !func)
				var dom = $(structure).get(0),
					clone = dom.parentNode || this.length > 1

			return this.each(function (index) {
				$(this).wrapAll(
					func ? structure.call(this, index) :
						clone ? dom.cloneNode(true) : dom
				)
			})
		},
		wrapAll: function (structure) {
			if (this[0]) {
				$(this[0]).before(structure = $(structure))
				var children
				// drill down to the inmost element
				while ((children = structure.children()).length) structure = children.first()
				$(structure).append(this)
			}
			return this
		},
		wrapInner: function (structure) {
			var func = isFunction(structure)
			return this.each(function (index) {
				var self = $(this), contents = self.contents(),
					dom = func ? structure.call(this, index) : structure
				contents.length ? contents.wrapAll(dom) : self.append(dom)
			})
		},
		unwrap: function () {
			this.parent().each(function () {
				$(this).replaceWith($(this).children())
			})
			return this
		},
		clone: function () {
			return this.map(function () { return this.cloneNode(true) })
		},
		hide: function () {
			return this.css("display", "none")
		},
		toggle: function (setting) {
			return this.each(function () {
				var el = $(this)
					; (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
			})
		},
		prev: function (selector) { return $(this.pluck('previousElementSibling')).filter(selector || '*') },
		next: function (selector) { return $(this.pluck('nextElementSibling')).filter(selector || '*') },
		html: function (html) {
			return 0 in arguments ?
				this.each(function (idx) {
					var originHtml = this.innerHTML
					$(this).empty().append(funcArg(this, html, idx, originHtml))
				}) :
				(0 in this ? this[0].innerHTML : null)
		},
		outHtml:function(){
			return this[0].outHTML
		},
		text: function (text) {
			return 0 in arguments ?
				this.each(function (idx) {
					var newText = funcArg(this, text, idx, this.textContent)
					this.textContent = newText == null ? '' : '' + newText
				}) :
				(0 in this ? this.pluck('textContent').join("") : null)
		},
		attr: function (name, value) {
			var result
			return (typeof name == 'string' && !(1 in arguments)) ?
				(0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
				this.each(function (idx) {
					if (this.nodeType !== 1) return
					if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
					else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
				})
		},
		removeAttr: function (name) {
			return this.each(function () {
				this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
					setAttribute(this, attribute)
				}, this)
			})
		},
		prop: function (name, value) {
			name = propMap[name] || name
			return (typeof name == 'string' && !(1 in arguments)) ?
				(this[0] && this[0][name]) :
				this.each(function (idx) {
					if (isObject(name)) for (key in name) this[propMap[key] || key] = name[key]
					else this[name] = funcArg(this, value, idx, this[name])
				})
		},
		removeProp: function (name) {
			name = propMap[name] || name
			return this.each(function () { delete this[name] })
		},
		data: function (name, value) {
			var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

			var data = (1 in arguments) ?
				this.attr(attrName, value) :
				this.attr(attrName)

			return data !== null ? deserializeValue(data) : undefined
		},
		val: function (value) {
			if (0 in arguments) {
				if (value == null) value = ""
				return this.each(function (idx) {
					this.value = funcArg(this, value, idx, this.value)
				})
			} else {
				return this[0] && (this[0].multiple ?
					$(this[0]).find('option').filter(function () { return this.selected }).pluck('value') :
					this[0].value)
			}
		},

		offset: function (coordinates) {
			if (coordinates) return this.each(function (index) {
				var $this = $(this),
					coords = funcArg(this, coordinates, index, $this.offset()),
					parentOffset = $this.offsetParent().offset(),
					props = {
						top: coords.top - parentOffset.top,
						left: coords.left - parentOffset.left
					}

				if ($this.css('position') == 'static') props['position'] = 'relative'
				$this.css(props)
			})
			if (!this.length) return null
			if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
				return { top: 0, left: 0 }
			var obj = this[0].getBoundingClientRect()
			return {
				left: obj.left + window.pageXOffset,
				top: obj.top + window.pageYOffset,
				width: Math.round(obj.width),
				height: Math.round(obj.height)
			}
		},


		css: function (property, value) {
			if (arguments.length < 2) {
				var computedStyle, element = this[0]
				if (!element) return
				computedStyle = getComputedStyle(element, '')
				if (typeof property == 'string')
					return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
				else if (isArray(property)) {
					var props = {}
					$.each(property, function (_, prop) {
						props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
					})
					return props
				}
			}

			var css = ''
			if (type(property) == 'string') {
				if (!value && value !== 0)
					this.each(function () { this.style.removeProperty(dasherize(property)) })
				else
					css = dasherize(property) + ":" + maybeAddPx(property, value)
			} else {
				for (key in property)
					if (!property[key] && property[key] !== 0)
						this.each(function () { this.style.removeProperty(dasherize(key)) })
					else
						css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
			}

			return this.each(function () { this.style.cssText += ';' + css })
		},
		index: function (element) {
			return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function (name) {
			if (!name) return false
			return emptyArray.some.call(this, function (el) {
				return this.test(className(el))
			}, classRE(name))
		},
		addClass: function (name) {
			if (!name) return this
			return this.each(function (idx) {
				if (!('className' in this)) return
				classList = []
				var cls = className(this), newName = funcArg(this, name, idx, cls)
				newName.split(/\s+/g).forEach(function (klass) {
					if (!$(this).hasClass(klass)) classList.push(klass)
				}, this)
				classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
			})
		},
		removeClass: function (name) {
			return this.each(function (idx) {
				if (!('className' in this)) return
				if (name === undefined) return className(this, '')
				classList = className(this)
				funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
					classList = classList.replace(classRE(klass), " ")
				})
				className(this, classList.trim())
			})
		},
		toggleClass: function (name, when) {
			if (!name) return this
			return this.each(function (idx) {
				var $this = $(this), names = funcArg(this, name, idx, className(this))
				names.split(/\s+/g).forEach(function (klass) {
					(when === undefined ? !$this.hasClass(klass) : when) ?
						$this.addClass(klass) : $this.removeClass(klass)
				})
			})
		},
    scale:function(){
      let sx=sy=1,pxy='center center',i1=i2=0
      if (arguments.length ==2) {
        isString(arguments[1])?pxy=arguments[1]: i2=1;
      }
      if (arguments.length ==3) {i2=2; pxy=arguments[2];      }
      sx=arguments[i1];
      sy=arguments[i2];
      let s="scale("+sx+","+sy+")"
      return this.each(function (idx) {
        $(this).css({"transform":s,"-webkit-transform":s,"-moz-transform":s,"-ms-transform":s,
                     "transform-origin":pxy,"-webkit-transform-origin":pxy,"-moz-transform-origin":pxy,"-ms-transform-origin":pxy})
      })
    },
		scrollTop: function (value) {
			if (!this.length) return
			var hasScrollTop = 'scrollTop' in this[0]
			if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
			return this.each(hasScrollTop ?
				function () { this.scrollTop = value } :
				function () { this.scrollTo(this.scrollX, value) })
		},
		scrollLeft: function (value) {
			if (!this.length) return
			var hasScrollLeft = 'scrollLeft' in this[0]
			if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
			return this.each(hasScrollLeft ?
				function () { this.scrollLeft = value } :
				function () { this.scrollTo(value, this.scrollY) })
		},
		position: function () {
			if (!this.length) return

			var elem = this[0],
				offsetParent = this.offsetParent(),
				offset = this.offset(),
				parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

			offset.top -= parseFloat($(elem).css('margin-top')) || 0
			offset.left -= parseFloat($(elem).css('margin-left')) || 0

			parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
			parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

			return {
				top: offset.top - parentOffset.top,
				left: offset.left - parentOffset.left
			}
		},
		offsetParent: function () {
			return this.map(function () {
				var parent = this.offsetParent || document.body
				while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
					parent = parent.offsetParent
				return parent
			})
		}
	};
	['width', 'height'].forEach(function (dimension) {
		var dimensionProperty = dimension.replace(/./, function (m) { return m[0].toUpperCase() })

		$.fn[dimension] = function (value) {
			var offset, el = this[0]
			if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
				isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension]
			else return this.each(function (idx) {
				el = $(this)
				el.css(dimension, funcArg(this, value, idx, el[dimension]()))
			})
		}
		$.fn["inner"+dimensionProperty]=function(){
			var el = $(this),v1,v2
			if(dimension=='width'){
				v1='left'
				v2="right"
			}else{
				v1='top'
				v2="bottom"
			}
			return el[dimension]()-parseFloat(el.css('padding-'+v1))-parseFloat(el.css('padding-'+v2))
		}
		$.fn["outer"+dimensionProperty]=function(){
			var el = $(this),v1,v2
			if(dimension=='width'){
				v1='left'
				v2="right"
			}else{
				v1='top'
				v2="bottom"
			}
			return el[dimension]()+parseFloat(el.css('margin-'+v1))+parseFloat($(this).css('margin-'+v2))+parseFloat(el.css('border-'+v1+"-"+dimension))+parseFloat($(this).css('border-'+v2+"-"+dimension))
		}
	})

	function traverseNode(node, fun) {
		fun(node)
		for (var i = 0, len = node.childNodes.length; i < len; i++)
			traverseNode(node.childNodes[i], fun)
	}
	adjacencyOperators.forEach(function (operator, operatorIndex) {
		var inside = operatorIndex % 2

		$.fn[operator] = function () {
			var argType, nodes = $.map(arguments, function (arg) {
				var arr = []
				argType = type(arg)
				if (argType == "array") {
					arg.forEach(function (el) {
						if (el.nodeType !== undefined) return arr.push(el)
						else if ($.atu.isZ(el)) return arr = arr.concat(el.get())
						arr = arr.concat(atu.fragment(el))
					})
					return arr
				}
				return argType == "object" || arg == null ?
					arg : atu.fragment(arg)
			}),
				parent, copyByClone = this.length > 1
			if (nodes.length < 1) return this

			return this.each(function (_, target) {
				parent = inside ? target : target.parentNode

				target = operatorIndex == 0 ? target.nextSibling :
					operatorIndex == 1 ? target.firstChild :
						operatorIndex == 2 ? target : null

				var parentInDocument = $.contains(document.documentElement, parent)

				nodes.forEach(function (node) {
					if (copyByClone) node = node.cloneNode(true)
					else if (!parent) return $(node).remove()

					parent.insertBefore(node, target)
					if (parentInDocument) traverseNode(node, function (el) {
						if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
							(!el.type || el.type === 'text/javascript') && !el.src) {
							var target = el.ownerDocument ? el.ownerDocument.defaultView : window
							target['eval'].call(target, el.innerHTML)
						}
					})
				})
			})
		}

		$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
			$(html)[operator](this)
			return this
		}
	})

	atu.Z.prototype = $.fn
	atu.uniq = uniq
	atu.deserializeValue = deserializeValue
	$.atu = atu

	return $
})()

window.Atu = Atu
window.$ === undefined && (window.$ = Atu);
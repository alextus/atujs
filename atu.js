/* 
	ATTUS https://www.attus.cn
	2020.12.02 Beijing.Shanghai.China
	Wechat:alextus
	Mobile:13717810545
	Atu.js 不兼容IE6、8、9、10 浏览器，移动项目专用
	version:v1.1.5
*/
console.log("%c— 艾特图斯,2020.12,作品 —%c ", "padding:8px 15px; color:#f2efe8; background-color:#070e1d; line-height:25px;", "padding:8px 5px 5px 0; color:#070e1d; ")

var Atu = (function () {

	var undefined, key, $, classList, emptyArray = [],
		slice = emptyArray.slice,
		filter = emptyArray.filter,
		document = window.document,
		elementDisplay = {},
		classCache = {},
		cssNumber = {
			'column-count': 1,
			'columns': 1,
			'font-weight': 1,
			'line-height': 1,
			'opacity': 1,
			'z-index': 1,
			'zoom': 1
		},
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
			'tbody': table,
			'thead': table,
			'tfoot': table,
			'td': tableRow,
			'th': tableRow,
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
		isArray = Array.isArray || function (object) {
			return object instanceof Array
		}

	atu.matches = function (element, selector) {
		if (!selector || !element || element.nodeType !== 1) return false
		var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
			element.oMatchesSelector || element.matchesSelector
		if (matchesSelector) return matchesSelector.call(element, selector)
		var match, parent = element.parentNode,
			temp = !parent
		if (temp)(parent = tempParent).appendChild(element)
		match = ~atu.qsa(parent, selector).indexOf(element)
		temp && tempParent.removeChild(element)
		return match
	}

	function type(obj) {
		return obj == null ? String(obj) :
			class2type[toString.call(obj)] || "object"
	}

	function isFunction(value) {
		return type(value) == "function"
	}

	function isWindow(obj) {
		return obj != null && obj == obj.window
	}

	function isDocument(obj) {
		return obj != null && obj.nodeType == obj.DOCUMENT_NODE
	}

	function isObject(obj) {
		return type(obj) == "object"
	}

	function isPlainObject(obj) {
		return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}

	function likeArray(obj) {
		return typeof obj.length == 'number'
	}

	function compact(array) {
		return filter.call(array, function (item) {
			return item != null
		})
	}

	function flatten(array) {
		return array.length > 0 ? $.fn.concat.apply([], array) : array
	}
	camelize = function (str) {
		return str.replace(/-+(.)?/g, function (match, chr) {
			return chr ? chr.toUpperCase() : ''
		})
	}

	function dasherize(str) {
		return str.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase()
	}
	uniq = function (array) {
		return filter.call(array, function (item, idx) {
			return array.indexOf(item) == idx
		})
	}

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
			$.map(element.childNodes, function (node) {
				if (node.nodeType == 1) return node
			})
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
		args.forEach(function (arg) {
			extend(target, arg, deep)
		})
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
					/^[\[\{]/.test(value) ? JSON.parse(value) :
					value) :
				value
		} catch (e) {
			return value
		}
	}

	$.type = type
	$.isFunction = isFunction
	$.isWindow = isWindow
	$.isArray = isArray
	$.isPlainObject = isPlainObject
	$.isNumber = function (s) {
		return isNaN(s);
	}
	$.inArray = function (elem, array, i) {
		return emptyArray.indexOf.call(array, elem, i)
	}
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
	$.isEmail = function (s) {
		var patrn = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return patrn.exec(s) ? true : false;
	}
	$.isQQ = function (s) {
		var patrn = /^[1-9][0-9]{4,10}$/;
		return patrn.exec(s) ? true : false;
	}

	$.map = function (elements, callback) {
		var value, values = [],
			i, key
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

	$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase()
	})

	$.fn = {
		forEach: emptyArray.forEach,
		reduce: emptyArray.reduce,
		push: emptyArray.push,
		sort: emptyArray.sort,
		indexOf: emptyArray.indexOf,
		concat: emptyArray.concat,

		map: function (fn) {
			return $($.map(this, function (el, i) {
				return fn.call(el, i, el)
			}))
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
		toArray: function () {
			return this.get()
		},
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
			else result = this.map(function () {
				return atu.qsa(this, selector)
			})
			return result
		},
		closest: function (selector, context) {
			var node = this[0],
				collection = false
			if (typeof selector == 'object') collection = $(selector)
			while (node && !(collection ? collection.indexOf(node) >= 0 : atu.matches(node, selector)))
				node = node !== context && !isDocument(node) && node.parentNode
			return $(node)
		},

		parent: function (selector) {
			return filtered(uniq(this.pluck('parentNode')), selector)
		},
		children: function (selector) {
			return filtered(this.map(function () {
				return children(this)
			}), selector)
		},
		contents: function () {
			return this.map(function () {
				return slice.call(this.childNodes)
			})
		},
		empty: function () {
			return this.each(function () {
				this.innerHTML = ''
			})
		},
		pluck: function (property) {
			return $.map(this, function (el) {
				return el[property]
			})
		},
		show: function () {
			return this.each(function () {
				this.style.display == "none" && (this.style.display = '')
				if (getComputedStyle(this, '').getPropertyValue("display") == "none")
					this.style.display = defaultDisplay(this.nodeName)
			})
		},
		clone: function () {
			return this.map(function () {
				return this.cloneNode(true)
			})
		},
		hide: function () {
			return this.css("display", "none")
		},
		toggle: function (setting) {
			return this.each(function () {
				var el = $(this);
				(setting === undefined ? el.css("display") == "none" : setting) ? el.show(): el.hide()
			})
		},
		prev: function (selector) {
			return $(this.pluck('previousElementSibling')).filter(selector || '*')
		},
		next: function (selector) {
			return $(this.pluck('nextElementSibling')).filter(selector || '*')
		},
		html: function (html) {
			return 0 in arguments ?
				this.each(function (idx) {
					var originHtml = this.innerHTML
					$(this).empty().append(funcArg(this, html, idx, originHtml))
				}) :
				(0 in this ? this[0].innerHTML : null)
		},
		text: function (text) {
			return 0 in arguments ?
				this.each(function (idx) {
					var newText = funcArg(this, text, idx, this.textContent)
					this.textContent = newText == null ? '' : '' + newText
				}) :
				(0 in this ? this[0].textContent : null)
		},
		attr: function (name, value) {
			var result
			return (typeof name == 'string' && !(1 in arguments)) ?
				(!this.length || this[0].nodeType !== 1 ? undefined :
					(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
				) :
				this.each(function (idx) {
					if (this.nodeType !== 1) return
					if (isObject(name))
						for (key in name) setAttribute(this, key, name[key])
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
			return (1 in arguments) ?
				this.each(function (idx) {
					this[name] = funcArg(this, value, idx, this[name])
				}) :
				(this[0] && this[0][name])
		},
		data: function (name, value) {
			var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

			var data = (1 in arguments) ?
				this.attr(attrName, value) :
				this.attr(attrName)

			return data !== null ? deserializeValue(data) : undefined
		},
		val: function (value) {
			return 0 in arguments ?
				this.each(function (idx) {
					this.value = funcArg(this, value, idx, this.value)
				}) :
				(this[0] && (this[0].multiple ?
					$(this[0]).find('option').filter(function () {
						return this.selected
					}).pluck('value') :
					this[0].value))
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
					this.each(function () {
						this.style.removeProperty(dasherize(property))
					})
				else
					css = dasherize(property) + ":" + maybeAddPx(property, value)
			} else {
				for (key in property)
					if (!property[key] && property[key] !== 0)
						this.each(function () {
							this.style.removeProperty(dasherize(key))
						})
				else
					css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
			}
			return this.each(function () {
				this.style.cssText += ';' + css
			})
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
				var cls = className(this),
					newName = funcArg(this, name, idx, cls)
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
				var $this = $(this),
					names = funcArg(this, name, idx, className(this))
				names.split(/\s+/g).forEach(function (klass) {
					(when === undefined ? !$this.hasClass(klass) : when) ?
					$this.addClass(klass): $this.removeClass(klass)
				})
			})
		},
		scrollTop: function (value) {
			if (!this.length) return
			var hasScrollTop = 'scrollTop' in this[0]
			if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
			return this.each(hasScrollTop ?
				function () {
					this.scrollTop = value
				} :
				function () {
					this.scrollTo(this.scrollX, value)
				})
		},
		scrollLeft: function (value) {
			if (!this.length) return
			var hasScrollLeft = 'scrollLeft' in this[0]
			if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
			return this.each(hasScrollLeft ?
				function () {
					this.scrollLeft = value
				} :
				function () {
					this.scrollTo(value, this.scrollY)
				})
		},
		position: function () {
			if (!this.length) return

			var elem = this[0],
				offsetParent = this.offsetParent(),
				offset = this.offset(),
				parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
					top: 0,
					left: 0
				} : offsetParent.offset()

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
	}

	;
	['width', 'height'].forEach(function (dimension) {
		var dimensionProperty = dimension.replace(/./, function (m) {
			return m[0].toUpperCase()
		})

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
					argType = type(arg)
					return argType == "object" || argType == "array" || arg == null ?
						arg : atu.fragment(arg)
				}),
				parent, copyByClone = this.length > 1
			if (nodes.length < 1) return this

			return this.each(function (_, target) {
				parent = inside ? target : target.parentNode

				target = operatorIndex == 0 ? target.nextSibling :
					operatorIndex == 1 ? target.firstChild :
					operatorIndex == 2 ? target :
					null

				var parentInDocument = $.contains(document.documentElement, parent)

				nodes.forEach(function (node) {
					if (copyByClone) node = node.cloneNode(true)
					else if (!parent) return $(node).remove()

					parent.insertBefore(node, target)
					if (parentInDocument) traverseNode(node, function (el) {
						if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
							(!el.type || el.type === 'text/javascript') && !el.src)
							window['eval'].call(window, el.innerHTML)
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
window.$ === undefined && (window.$ = Atu)

;
(function ($) {
	var _zid = 1,
		undefined,
		slice = Array.prototype.slice,
		isFunction = $.isFunction,
		isString = function (obj) {
			return typeof obj == 'string'
		},
		handlers = {},
		specialEvents = {},
		focusinSupported = 'onfocusin' in window,
		focus = {
			focus: 'focusin',
			blur: 'focusout'
		},
		hover = {
			mouseenter: 'mouseover',
			mouseleave: 'mouseout'
		}

	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	function zid(element) {
		return element._zid || (element._zid = _zid++)
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event)
		if (event.ns) var matcher = matcherFor(event.ns)
		return (handlers[zid(element)] || []).filter(function (handler) {
			return handler &&
				(!event.e || handler.e == event.e) &&
				(!event.ns || matcher.test(handler.ns)) &&
				(!fn || zid(handler.fn) === zid(fn)) &&
				(!selector || handler.sel == selector)
		})
	}

	function parse(event) {
		var parts = ('' + event).split('.')
		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		}
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
		var id = zid(element),
			set = (handlers[id] || (handlers[id] = []))
		events.split(/\s/).forEach(function (event) {
			if (event == 'ready') return $(document).ready(fn)
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
				//console.log(element,e._args)
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

	$.event = {
		add: add,
		remove: remove
	}

	$.proxy = function (fn, context) {
		var args = (2 in arguments) && slice.call(arguments, 2)
		if (isFunction(fn)) {
			var proxyFn = function () {
				return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
			}
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

	var returnTrue = function () {
			return true
		},
		returnFalse = function () {
			return false
		},
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
		var key, proxy = {
			originalEvent: event
		}
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
					evt = $.extend(createProxy(e), {
						currentTarget: match,
						liveFired: element
					})
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

	;
	('focusin focusout focus blur load resize scroll unload click dblclick ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select keydown keypress keyup error').split(' ').forEach(function (event) {
		$.fn[event] = function (callback) {
			return (0 in arguments) ?
				this.bind(event, callback) :
				this.trigger(event)
		}
	})

	$.Event = function (type, props) {
		if (!isString(type)) props = type, type = props.type
		var event = document.createEvent(specialEvents[type] || 'Events'),
			bubbles = true
		if (props)
			for (var name in props)(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
		event.initEvent(type, bubbles, true)
		return compatible(event)
	}

})(Atu)

;
(function ($) {
	var jsonpID = 0,
		document = window.document,
		key,
		name,
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		scriptTypeRE = /^(?:text|application)\/javascript/i,
		xmlTypeRE = /^(?:text|application)\/xml/i,
		jsonType = 'application/json',
		htmlType = 'text/html',
		blankRE = /^\s*$/,
		originAnchor = document.createElement('a')

	originAnchor.href = window.location.href

	function triggerAndReturn(context, eventName, data) {
		var event = $.Event(eventName)
		$(context).trigger(event, data)
		return !event.isDefaultPrevented()
	}

	function triggerGlobal(settings, context, eventName, data) {
		if (settings.global) return triggerAndReturn(context || document, eventName, data)
	}
	$.active = 0

	function ajaxStart(settings) {
		if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	}

	function ajaxStop(settings) {
		if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	}

	function ajaxBeforeSend(xhr, settings) {
		var context = settings.context
		if (settings.beforeSend.call(context, xhr, settings) === false ||
			triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
			return false

		triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	}

	function ajaxSuccess(data, xhr, settings, deferred) {
		var context = settings.context,
			status = 'success'
		settings.success.call(context, data, status, xhr)
		if (deferred) deferred.resolveWith(context, [data, status, xhr])
		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
		ajaxComplete(status, xhr, settings)
	}

	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context
		settings.error.call(context, xhr, type, error)
		if (deferred) deferred.rejectWith(context, [xhr, type, error])
		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
		ajaxComplete(type, xhr, settings)
	}

	function ajaxComplete(status, xhr, settings) {
		var context = settings.context
		settings.complete.call(context, xhr, status)
		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
		ajaxStop(settings)
	}

	function empty() {}

	$.ajaxJSONP = function (options, deferred) {
		if (!('type' in options)) return $.ajax(options)

		var _callbackName = options.jsonpCallback,
			callbackName = ($.isFunction(_callbackName) ?
				_callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
			script = document.createElement('script'),
			originalCallback = window[callbackName],
			responseData,
			abort = function (errorType) {
				$(script).triggerHandler('error', errorType || 'abort')
			},
			xhr = {
				abort: abort
			},
			abortTimeout

		if (deferred) deferred.promise(xhr)

		$(script).on('load error', function (e, errorType) {
			clearTimeout(abortTimeout)
			$(script).off().remove()

			if (e.type == 'error' || !responseData) {
				ajaxError(null, errorType || 'error', xhr, options, deferred)
			} else {
				ajaxSuccess(responseData[0], xhr, options, deferred)
			}

			window[callbackName] = originalCallback
			if (responseData && $.isFunction(originalCallback))
				originalCallback(responseData[0])

			originalCallback = responseData = undefined
		})

		if (ajaxBeforeSend(xhr, options) === false) {
			abort('abort')
			return xhr
		}

		window[callbackName] = function () {
			responseData = arguments
		}
		script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
		document.head.appendChild(script)

		if (options.timeout > 0) abortTimeout = setTimeout(function () {
			abort('timeout')
		}, options.timeout)

		return xhr
	}

	$.ajaxSettings = {
		type: 'GET',
		beforeSend: empty,
		success: empty,
		error: empty,
		complete: empty,
		context: null,
		global: true,
		xhr: function () {
			return new window.XMLHttpRequest()
		},
		accepts: {
			script: 'text/javascript, application/javascript, application/x-javascript',
			json: jsonType,
			xml: 'application/xml, text/xml',
			html: htmlType,
			text: 'text/plain'
		},
		crossDomain: false,
		timeout: 0,
		processData: true,
		cache: true
	}

	function mimeToDataType(mime) {
		if (mime) mime = mime.split(';', 2)[0]
		return mime && (mime == htmlType ? 'html' :
			mime == jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text'
	}

	function appendQuery(url, query) {
		if (query == '') return url
		return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	}

	function serializeData(options) {
		if (options.processData && options.data && $.type(options.data) != "string")
			options.data = $.param(options.data, options.traditional)
		if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
			options.url = appendQuery(options.url, options.data), options.data = undefined
	}

	$.ajax = function (options) {
		var settings = $.extend({}, options || {}),
			deferred = $.Deferred && $.Deferred(),
			urlAnchor
		for (key in $.ajaxSettings)
			if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

		ajaxStart(settings)

		if (!settings.crossDomain) {
			urlAnchor = document.createElement('a')
			urlAnchor.href = settings.url
			urlAnchor.href = urlAnchor.href
			settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
		}

		if (!settings.url) settings.url = window.location.toString()
		serializeData(settings)

		var dataType = settings.dataType,
			hasPlaceholder = /\?.+=\?/.test(settings.url)
		if (hasPlaceholder) dataType = 'jsonp'

		if (settings.cache === false || (
				(!options || options.cache !== true) &&
				('script' == dataType || 'jsonp' == dataType)
			))
			settings.url = appendQuery(settings.url, '_=' + Date.now())

		if ('jsonp' == dataType) {
			if (!hasPlaceholder)
				settings.url = appendQuery(settings.url,
					settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
			return $.ajaxJSONP(settings, deferred)
		}

		var mime = settings.accepts[dataType],
			headers = {},
			setHeader = function (name, value) {
				headers[name.toLowerCase()] = [name, value]
			},
			protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
			xhr = settings.xhr(),
			nativeSetHeader = xhr.setRequestHeader,
			abortTimeout

		if (deferred) deferred.promise(xhr)

		if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
		setHeader('Accept', mime || '*/*')
		if (mime = settings.mimeType || mime) {
			if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
			xhr.overrideMimeType && xhr.overrideMimeType(mime)
		}
		if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

		if (settings.headers)
			for (name in settings.headers) setHeader(name, settings.headers[name])
		xhr.setRequestHeader = setHeader

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = empty
				clearTimeout(abortTimeout)
				var result, error = false
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
					dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
					result = xhr.responseText

					try {
						if (dataType == 'script')(1, eval)(result)
						else if (dataType == 'xml') result = xhr.responseXML
						else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
					} catch (e) {
						error = e
					}

					if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
					else ajaxSuccess(result, xhr, settings, deferred)
				} else {
					ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
				}
			}
		}

		if (ajaxBeforeSend(xhr, settings) === false) {
			xhr.abort()
			ajaxError(null, 'abort', xhr, settings, deferred)
			return xhr
		}

		if (settings.xhrFields)
			for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

		var async = 'async' in settings ? settings.async : true
		xhr.open(settings.type, settings.url, async, settings.username, settings.password)

		for (name in headers) nativeSetHeader.apply(xhr, headers[name])

		if (settings.timeout > 0) abortTimeout = setTimeout(function () {
			xhr.onreadystatechange = empty
			xhr.abort()
			ajaxError(null, 'timeout', xhr, settings, deferred)
		}, settings.timeout)

		xhr.send(settings.data ? settings.data : null)
		return xhr
	}

	function parseArguments(url, data, success, dataType) {
		if ($.isFunction(data)) dataType = success, success = data, data = undefined
		if (!$.isFunction(success)) dataType = success, success = undefined
		return {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		}
	}

	$.get = function ( /* url, data, success, dataType */ ) {
		return $.ajax(parseArguments.apply(null, arguments))
	}

	$.post = function ( /* url, data, success, dataType */ ) {
		var options = parseArguments.apply(null, arguments)
		options.type = 'POST'
		return $.ajax(options)
	}

	$.getJSON = function ( /* url, data, success */ ) {
		var options = parseArguments.apply(null, arguments)
		options.dataType = 'json'
		return $.ajax(options)
	}

	$.fn.load = function (url, data, success) {
		if (!this.length) return this
		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success
		if (parts.length > 1) options.url = parts[0], selector = parts[1]
		options.success = function (response) {
			self.html(selector ?
				$('<div>').html(response.replace(rscript, "")).find(selector) :
				response)
			callback && callback.apply(self, arguments)
		}
		$.ajax(options)
		return this
	}

	var escape = encodeURIComponent

	function serialize(params, obj, traditional, scope) {
		var type, array = $.isArray(obj),
			hash = $.isPlainObject(obj)
		$.each(obj, function (key, value) {
			type = $.type(value)
			if (scope) key = traditional ? scope :
				scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
			if (!scope && array) params.add(value.name, value.value)
			else if (type == "array" || (!traditional && type == "object"))
				serialize(params, value, traditional, key)
			else params.add(key, value)
		})
	}

	$.param = function (obj, traditional) {
		var params = []
		params.add = function (key, value) {
			if ($.isFunction(value)) value = value()
			if (value == null) value = ""
			this.push(escape(key) + '=' + escape(value))
		}
		serialize(params, obj, traditional)
		return params.join('&').replace(/%20/g, '+')
	}
})(Atu)

;
(function ($, undefined) {
	var prefix = '',
		eventPrefix,
		vendors = {
			Webkit: 'webkit',
			Moz: '',
			O: 'o'
		},
		testEl = document.createElement('div'),
		supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		transform,
		transitionProperty, transitionDuration, transitionTiming, transitionDelay,
		animationName, animationDuration, animationTiming, animationDelay,
		cssReset = {}

	function dasherize(str) {
		return str.replace(/([A-Z])/g, '-$1').toLowerCase()
	}

	function normalizeEvent(name) {
		return eventPrefix ? eventPrefix + name : name.toLowerCase()
	}

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
		speeds: {
			_default: 400,
			fast: 200,
			slow: 600
		},
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
		var key, cssValues = {},
			cssProperties, transforms = '',
			that = this,
			wrappedCallback, endEvent = $.fx.transitionEnd,
			fired = false

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
			that.each(function () {
				wrappedCallback.call(this)
			})
		}, 0)

		return this
	}

	$.fn.fadeIn = function (speed, easing, complete) {
		if ($(this).length == 0) {
			return;
		}
		if (typeof (speed) === 'undefined') speed = 400;
		if (typeof (easing) === 'undefined' || typeof (easing) !== 'string') easing = 'swing';
		if ($(this).css("display") == "none") {
			$(this).css('opacity', 0)
		}
		$(this).css({
			display: 'block',
			opacity: $(this).css('opacity')
		}).tween({
			opacity: 1
		}, speed, easing, function () {
			// complete callback

			if (typeof (easing) === 'function') {
				easing();
			} else if (typeof (complete) === 'function') {
				complete();
			}
		});

		return this;
	}
	$.fn.fadeOut = function (speed, easing, complete) {
		if (typeof (speed) === 'undefined') speed = 400;
		if (typeof (easing) === 'undefined' || typeof (easing) !== 'string') easing = 'swing';

		$(this).css({
			opacity: $(this).css('opacity')
		}).tween({
			opacity: 0
		}, speed, easing, function () {
			$(this).css('display', 'none');

			if (typeof (easing) === 'function') {
				easing();
			} else if (typeof (complete) === 'function') {
				complete();
			}
		});

		return this;
	}
	$.fn.fadeToggle = function (speed, easing, complete) {
		return this.each(function () {
			var el = $(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, easing, complete)
		})
	}

	testEl = null
})(Atu)



;
(function (a) {
	//实现对图片，script,css的加载，2015.12.12
	a.loadFile = function (b, c) {

		//b load Img ,c funciton
		if ("string" == typeof b) {
			b = new Array(b);
		}
		c = a.extend({}, a.fn.loadFile.defaults, c instanceof Function ? {
			all: c
		} : c);
		var d = new Array;
		a.each(b, function (index, file) {

			var att = file.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var isJS = ext == "js";
			var isIMG = ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif";

			if (isIMG) {
				var g = new Image;
				a(g).bind("load error", function (e) {
					d.push(g);
					a.checkLoad(b, c, d);
					a(this).unbind("load error")
				});

				g.src = file
			}

			if (isCSS || isJS) {
				var tag = isCSS ? "link" : "script";
				var link = (isCSS ? "href" : " src") + "='" + file + "'";
				if ($(tag + "[" + link + "]").length == 0) {
					var _attr = {
						type: isCSS ? 'text/css' : 'text/javascript'
					}
					if (isCSS) {
						_attr.rel = 'stylesheet'
						_attr.href = file
					} else {
						_attr.src = file
					}
					$("<" + tag + "></" + tag + ">").attr(_attr).appendTo($("head"));
				}
				d.push(file);
				a.checkLoad(b, c, d);


			}
		})
	};
	a.checkLoad = function (b, c, d) {

		if (c.each instanceof Function) {
			c.each.call()
		}
		if (d.length >= b.length && c.all instanceof Function) {

			c.all.call(this, d)
		}
	};
	a.fn.loadFile = function (b) {
		a.loadFile(this, b);
		return this
	};

	a.fn.loadFile.defaults = {
		each: null,
		all: null
	}
})(Atu);;
(function (a) {

	a.alert = function (msg) {
		if ($(".tipBox").length == 0) {
			$("body").append('<div class="tipBox"></div>')
		}
		$(".tipBox").append('<div class="tip">' + msg + '</div>').show()
		setTimeout(function () {
			$(".tipBox").html("").hide()
		}, 2000)
	};
	a.fn.alert = function (b) {
		a.alert(msg);
		return this
	};

})(Atu);
;(function ($) {
	$.fn.extend({
		inputIni: function () {
			let placeholder=$(this).data("placeholder")
			$(this).val(placeholder)
			$(this).focus(function () {
				if ($(this).val() == placeholder) {
					$(this).val("")
				}
				$(this).addClass("on")
			})
			$(this).focusout(function () {
				if ($(this).val() == "") {
					$(this).val(placeholder)
				}
				$(this).removeClass("on")
			})
		}
	})

})(Atu);

(function (a) {
	//实现对图片，script,css的加载，2015.12.12
	a.loadFile = function (b, c) {

		//b load Img ,c funciton
		if ("string" == typeof b) {
			b = new Array(b);
		}
		c = a.extend({}, a.fn.loadFile.defaults, c instanceof Function ? {
			all: c
		} : c);
		var d = new Array;
		a.each(b, function (index, file) {

			var att = file.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var isJS = ext == "js";
			var isIMG = ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif";

			if (isIMG) {
				var g = new Image;
				a(g).bind("load error", function (e) {
					d.push(g);
					a.checkLoad(b, c, d);
					a(this).unbind("load error")
				});

				g.src = file
			}
			if (isCSS || isJS) {
				var tag = isCSS ? "link" : "script";
				var attr = isCSS ? " type='text/css' rel='stylesheet' " : "";
				var link = (isCSS ? "href" : "src") + "='" + file + "'";
				if ($(tag + "[" + link + "]").length == 0) {
					$("head").append("<" + tag + attr + link + "></" + tag + ">");
				}
				d.push(file);
				a.checkLoad(b, c, d);
			}
		})
	};
	a.checkLoad = function (b, c, d) {

		if (c.each instanceof Function) {
			c.each.call()
		}
		if (d.length >= b.length && c.all instanceof Function) {
			c.all.call()
		}
	};
	a.fn.loadFile = function (b) {
		a.loadFile(this, b);
		return this
	};

	a.fn.loadFile.defaults = {
		each: null,
		all: null
	}
})(Atu);


var ua = navigator.userAgent.toLowerCase()

var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}


var isStorageSupport=localStorageSupported()  //全局变量，判断是否支持
var is_weixin=ua.match(/MicroMessenger/i)=="micromessenger"?true:false
var is_weibo=ua.match(/Weibo/i)=="weibo"?true:false
var is_iphone=ua.match(/iPhone|mac|iPod|iPad/i)
var is_mob=!isPc()
var is_pc =!is_mob
var supportsOrientationChange = "onorientationchange" in window, //是否开启手机横竖屏
	orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

var touch=is_mob?"touchstart":"mousedown"
var touchmove=is_mob?"touchmove":"mousemove"
var touchend=is_mob?"touchend":"mouseup"
var reqAnimationFrame = requestAnimationFrame = window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.oRequestAnimationFrame ||
function(callback) { setTimeout(callback, 1000 / 60); };

	


//创建空console对象，避免JS报错  
if (!window.console) {
	window.console = {};
	var console = window.console;

	var funcs = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
		'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
		'info', 'log', 'markTimeline', 'profile', 'profileEnd',
		'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'
	];
	for (var i = 0, l = funcs.length; i < l; i++) {
		var func = funcs[i];
		if (!console[func])
			console[func] = function () {};
	}
	if (!console.memory)
		console.memory = {};

}




function at(id) {
	return (document.getElementById(id));
}
var SoundLoad = [],
	SoundA = []
var Sound = {
	isPlay: false,
	path: "sound/",
	ini: function (v) {
		this.path = v
	},
	lastUrl: "",
	load: function (url, loop) {
		if ($(".sound").length == 0) {
			$("body").append("<div class='sound' style='display:none'></div>")
		}
		loopStr = loop ? "loop" : ""
		if ($("#" + url).length == 0) {
			SoundLoad[url] = 0
			SoundA.push(url)
			$(".sound").append('<audio src="' + this.path + '/' + url + '.mp3" id="' + url + '"  ' + loopStr + ' style="display:none" ></audio>')
		}
		this.get(url).onloadedmetadata = function () {
			console.log(url + ":加载完")
			SoundLoad[url] = 1
		};
	},
	loadTm: function (url, loop) {
		this.load(url, loop)

		this.get(url).onloadedmetadata = function () {
			console.log(url + ":加载完")
			SoundLoad[url] = 1
			loadTMNum++;
		};
	},
	get: function (v) {
		return document.getElementById(v);
	},
	play: function (url) {
		// if(!Sound.isPlay){return;}

		console.log("play", url)
		this.get(url).play();
		for (j = 1; j <= 10; j++) {
			this.iniVolume(url, j / 10, 32 * j)
		}


		Sound.isPlay = true;
		Sound.lastUrl = url
	},
	stop: function (url) {
		this.get(url).pause();

		this.get(url).currentTime = 0;
		Sound.isPlay = false;

	},
	pause: function (url) {

		if (Sound.isPlay) {
			for (i = 0; i < SoundA.length; i++) {
				for (j = 10; j >= 0; j--) {
					this.iniVolume(SoundA[i], j / 10, 32 * (10 - j))
				}

			}
			Sound.isPlay = false;
		} else {

			this.play(url)
			// Sound.isPlay=true;
		}

	},
	setVolume: function (url, v) {
		this.get(url).volume = v
		if (v == 0) {
			this.get(url).pause();
		}
		//console.log("setVolume",url,v)

	},
	iniVolume: function (url, v, t) {

		_t = this
		setTimeout(function () {
			_t.setVolume(url, v)
		}, t)
	}
};



function get(sProp) {
	var re = new RegExp("[&,?]" + sProp + "=([^//&]*)", "i");
	var a = re.exec(document.location.search);
	if (a == null) {
		return "";
	}
	return a[1];
};

function isPc() {
	//平台、设备和操作系统
	var system = {
		win: false,
		mac: false,
		xll: false,
		ipad: false
	};
	//检测平台 
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	system.ipad = (ua.match(/iPad/i) != null) ? true : false;
	//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面 
	if (system.win || system.mac || system.xll || system.ipad) {
		return true;
	} else {
		return false;
	}

};



function localStorageSupported() {

	try {
		localStorage.setItem("test", "test");
		localStorage.removeItem("test");
		return true;
	} catch (e) {
		return false;
	}

}



function localStorageSupported() {

	try {
	  localStorage.setItem("test", "test");
	  localStorage.removeItem("test");
	  return true;
	} catch(e){
	  return false;
	}
	
  }
  
  function getData(name){ 
  //注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
	 if(isStorageSupport){ 
		 v=localStorage.getItem(name)
		if(v==undefined){v="";}
		return v;
	 }
	  return ""; 
	 
  } 
  function setData(name, cookievalue)
  { 
  var date = new Date();
	 date.setTime(date.getTime() + 365*24* 3600 * 1000);
	 if(isStorageSupport){ 
		  localStorage.setItem(name,cookievalue);
	 }	
	  
  }
  var cookieBaseName="alextu_"
  function getCookie(name){ 
  //注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
	  name=cookieBaseName+name
	  var _cookie = document.cookie;
	  var firstchar = _cookie.indexOf(name);	 
	  if (firstchar != -1) {
		  firstchar += name.length + 1; 
		  lastchar = _cookie.indexOf(";", firstchar);
		  lastchar =lastchar == -1? _cookie.length:lastchar;
		  return unescape(_cookie.substring(firstchar, lastchar));
	  } 
	  return ""; 
	 
  } 
  function setCookie(name, value)
  { 
	  name=cookieBaseName+name
	  var date = new Date();
	  date.setTime(date.getTime() + 365*24* 3600 * 1000);
	  document.cookie = name + '=' + escape(value)+ ';path=/;  expires=' + date.toGMTString()
	  
  }
  
  function delCookie(name)
  {
	  var exp = new Date();
	  exp.setTime(exp.getTime() - 1);
	  document.cookie= name + "=;path=/;expires="+exp.toGMTString();
  }


function sendMsgBack(act, callBack) {
	console.log("sendMsgBack");
	var _p = {}

	if (typeof (act) == "object") {
		_p = act
	} else {
		_p = {
			"act": act
		}
	};

	$.get(evtUrl + "gateway.php?t=" + Math.random(), _p, function (d) {

		callBack(d);
	}, "json")
}

function RandArr(arr) {
	num = arr.length
	var temp_array = new Array();
	for (var index in arr) {
		temp_array.push(arr[index]);
	}
	var return_array = new Array();
	for (var i = 0; i < num; i++) {

		if (temp_array.length >= 0) {

			var arrIndex = Math.floor(Math.random() * temp_array.length);
			return_array[i] = temp_array[arrIndex];
			temp_array.splice(arrIndex, 1);
		} else {
			break;
		}
	}
	return return_array;
}

function getXY(e){
	
	e=e.originalEvent||e
	
	var _x=0,_y=0,_cx=0,_cy=0,_e=false
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)){
		if(e.targetTouches || e.changedTouches || e.touches){
			if(e.targetTouches[0] != undefined){
				_e=e.targetTouches[0]
			}else if(e.changedTouches[0] != undefined){
				_e=e.changedTouches[0]
			}else if(e.touches[0] != undefined){
				_e=e.touches[0]
			}
		}
	}
	if(!_e){_e=e}
	return {x:Math.floor(_e.pageX),y:Math.floor(_e.pageY),cx:Math.floor(_e.clientX),cy:Math.floor(_e.clientY)}
}



function Alexdate() {
	var sd = new Date()
	y = FormatNum(sd.getFullYear(), 4);
	m = FormatNum(sd.getMonth() + 1, 2);
	d = FormatNum(sd.getDate(), 2);
	return y + "" + m + "" + d;
}

function FormatNum(num, weishu) {

	s = num.toString()
	for (i = s.length; i < weishu; i++) {
		s = "0" + s;
	}

	return s;
}
function newImg(src) {
	var obj = new Image();
	obj.src = src;
	obj.onload = function () {}
	return obj;
}
function urlencode(url){
	return encodeURIComponent(url);
}
function urldecode(url){
	return decodeURIComponent(url);
}


window.onerror =function(errorMessage, scriptURI, lineNumber) {
	//$(".log").html(lineNumber+":"+errorMessage)
	console.log(lineNumber+":"+errorMessage)
}


function getRotate(obj) {
	var ele = $(obj).get(0);
	var groups = window.getComputedStyle(ele).transform.match(/(?:[^,]+,){5}s*([^,]+),s*([^,]+)/);
	var angle;
	if (groups) {
		var numbers = groups.slice(1).map(function (n) {
			return Number(n);
		});
		angle = Math.atan(numbers[1] / numbers[0]) / Math.PI * 180 + (numbers[0] < 0 ? 180 : 0);
		if (angle < 0) {
			angle += 360;
		}
	} else {
		angle = 0;
	}
	return angle;

}
var ani = {
	"zdIni": function (obj, v, t) {

		if (!canZD) {
			v = "translate(0,0)"
			$(obj).css({
				"transform": v,
				"-webkit-transform": v,
				"-ms-transform": v,
				"-moz-transform": v,
				"-o-transform": v
			})

		} else {
			setTimeout(function () {
				$(obj).css({
					"transform": v,
					"-webkit-transform": v,
					"-ms-transform": v,
					"-moz-transform": v,
					"-o-transform": v
				})
			}, t)
		}
	},
	"zd": function (obj, fd) {
		if (!canZD) {
			return
		}
		var v = "translate(0,0)",
			_t = this,
			dt = 50
		_t.zdIni(obj, v, 0)

		_t.zdIni(obj, v.replace("0,0", fd + "px,0"), dt)
		_t.zdIni(obj, v.replace("0,0", "0," + fd + "px"), 2 * dt)
		_t.zdIni(obj, v.replace("0,0", "-" + fd + "px,0"), 3 * dt)
		_t.zdIni(obj, v.replace("0,0", "0,-" + fd + "px"), 4 * dt)
		_t.zdIni(obj, v.replace("0,0", fd + "px,0"), 5 * dt)
		_t.zdIni(obj, v.replace("0,0", "0," + fd + "px"), 6 * dt)
		_t.zdIni(obj, v.replace("0,0", "-" + fd + "px,0"), 7 * dt)
		_t.zdIni(obj, v.replace("0,0", "0,-" + fd + "px"), 8 * dt)

		r = Math.random() * 1 + 0.4

		setTimeout(function () {
			_t.zd(obj, fd)
		}, r * 1000)

	},
	iniBgArr: [],
	iniBgT: [],
	iniBgMovie: function (obj, x, num, fps, isSpecial) {
		_l = this
		j = _l.iniBgArr[obj]
		j = j == undefined ? 0 : j % num
		$(obj).css({
			"background-position": -x * j + "px 0"
		})
		_l.iniBgArr[obj] = j + 1;

		nfps = fps
		if ((j + 1) % num == 0 && isSpecial == true) {
			nfps = Math.floor(Math.random() * 3000) + fps

		}
		_l.iniBgT[obj] = setTimeout(function () {

			_l.iniBgMovie(obj, x, num, fps, isSpecial)
		}, nfps)
	},
	iniImgArr: [],
	iniImgT: [],
	iniImgMovie: function (obj, num, fps) {
		_l = this
		j = _l.iniImgArr[obj]
		j = j == undefined ? 0 : j % num

		$(obj + " img").hide().eq(j).show()
		_l.iniImgArr[obj] = j + 1;
		_l.iniImgT[obj] = setTimeout(function () {

			_l.iniImgMovie(obj, num, fps)
		}, fps)
	},
	setImg: function (obj, path, type, width, height, num) {
		for (i = 0; i < num; i++) {
			$(obj).append('<img src="' + path + '/' + i + '.' + type + '" width="' + width + '" height="' + height + '"/>')
		}
		$(obj + " img").hide().eq(0).show()
	},
	clearMovie: function (arr) {
		_l = this
		for (i = 0; i < arr.length; i++) {
			if (_l.iniBgT[arr[i]]) {
				clearTimeout(_l.iniBgT[arr[i]])
			}
			if (_l.iniImgT[arr[i]]) {
				clearTimeout(_l.iniImgT[arr[i]])
			}
		}
	}
}



var log={
	ini:function(){
		if($("#atu_log").length==0){
			$("body").append('<div id="atu_log" style="position:fixed; top:0;z-index:999; padding:10px; background:#FFF; color:#000;"></div>')
		}},
	add:function(){ v=Array.prototype.slice.apply(arguments);this.ini();$("#atu_log").html(v.join(" ")+"<br/>"+$("#atu_log").html());},
	val:function(){ v=Array.prototype.slice.apply(arguments);this.ini();$("#atu_log").html(v.join(" ")+"<br/>");}	
}
function getEvtUrl() {
	var v = window.location.href,
		u = v.split("/"),
		s = "";
	for (i = 0; i < u.length - 1; i++) {
		s += u[i] + "/"
	}
	return s;
}
function getNowFormatDate() {
	var date = new Date();
	var curweek = "星期" + "日一二三四五六".charAt(new Date().getDay());
	var year = date.getFullYear();
	var month = FormatNum(date.getMonth() + 1);
	var strDate = FormatNum(date.getDate());
	var strHours=FormatNum(date.getHours(),2);
	var strMin=FormatNum(date.getMinutes(),2);
	var currentdate = curweek + " " + strHours + ":" + strMin;
	return currentdate;
}
function newDate(dateStr) {
	var dateArr = dateStr.split(/[- : \/]/);
	 return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
 }
 //时间格式化
 function format(time) {
   var time = parseInt(time);
   var m = parseInt(time / 60);
   var s = parseInt(time % 60);
   m = zero(m);
   s = zero(s);
   function zero(num) {
	 if (num < 10) {
	   num = "0" + num;
	 }
	 return num;
   }
   return m + ":" + s;
 }
 
function convertCanvasToImage(o) {
    var t = new Image;
    return t.src = o.toDataURL("image/png"),t
}
function convertCanvasToImgData(o) {

    return  o.toDataURL("image/jpeg")
}

function getTime2Time( t)
{
	time1=new Date().getTime()/1000;
    time2 = new Date(t).getTime()/1000
    var time_ = time1 - time2;
    return Math.floor((time_/(3600*24)));
}

Array.prototype.indexOf = function(o) {
    for (var t = 0; t < this.length; t++) if (this[t] == o) return t;
    return - 1
},
Array.prototype.remove = function(o) {
    var t = this.indexOf(o);
    t > -1 && this.splice(t, 1)
	};

	
Atu.ini=function(){
	var v=arguments
	cookieBaseName+=v[0];
  this.evtUrl = v[1] ? v[1] : location.href;
  this.wxUrl = v[2] ?v[2]:"http://atuad.cn/wx/";

  this.openid=getCookie("openid");
  this.ua=""
  this.site=""
  //console.log(typeof wx)
  if ("undefined" == typeof wx) {
    $.loadFile("http://res.wx.qq.com/open/js/jweixin-1.4.0.js")
   
  }
}

Atu.iniUser=function(callback,callback2){
	
	if(!this.openid ){
		var wx=get("wx")
		var d={}
		if(wx) {
			
			d.wx=wx
			wxArr=wx.split("|")
			console.log(wxArr)
		}
		this.sendDataBack("ini",d,function(p){
	
			if(p.openid){
				callback && callback(p)
				Atu.openid =p.openid
				setCookie("openid",p.openid)
				//if(wx){ location.replace(Atu.evtUrl);}
			}else{
				if(!wx && Atu.tokenUrl){location.replace(Atu.tokenUrl);}
			}
		})
	}else{
		
		callback2 && callback2(this.openid)
	}
}
Atu.act=Atu.sendDataBack=function(act,u,callback){
	var d=u||{}
		d.act=act
		d.openid=this.openid
	
	$.get(this.api,d,function(p){
		callback && callback(p)	
	},"jsonp")
		
}

Atu.iniWx=function(s){
	
	if(!this.wxUrl){
		console.log("未设置wxUrl");return;
	}
	
	$.get(this.wxUrl,"",function(d){
		

		  wx.config({
			  appId: d.appId,timestamp: d.timestamp,nonceStr: d.nonceStr,signature: d.signature,
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'updateAppMessageShareData', 'updateTimelineShareData', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'translateVoice', 'previewImage','openLocation'],
        openTagList: ['wx-open-launch-weapp','wx-open-launch-app'] 
			  
		  });
		  wx.ready(function () {Atu.iniShare(s); });
		  wx.error(function (res) { console.log("wxConfig Fail") });

	},"jsonp")
}
Atu.iniShare=function(s){
  //alert(s.title+":"+s.title2+":"+s.desc+":"+s.link+":"+s.imgUrl)
	wx.updateAppMessageShareData({ title: s.title, desc: s.desc, link: s.link, imgUrl: s.imgUrl, }, function(res) {}); 
	wx.updateTimelineShareData({ title: s.title2||s.title,  link: s.link, imgUrl: s.imgUrl, }, function(res) {});
	
	wx.onMenuShareAppMessage({title: s.title,desc: s.desc,link:s.link,imgUrl: s.imgUrl,success: function (res) {} }); 
	wx.onMenuShareTimeline({title: s.title2||s.title,link: s.link,imgUrl: s.imgUrl,success: function (res) {} });

}
Atu.iniClick=function(site){
  this.site=site
  this.ua = ua
  this.addClick()
}
Atu.addClick=function(str){
  var d={}
  d.url = location.href
  d.type = (!str || str == document.title)?0:1;
  d.title = str ? str : document.title
  d.site=this.site
  d.ua=this.ua
  
  $.get("http://atuad.cn/tongji", d, function (d) { 
     console.log("atu tongji inied")
  }, "jsonp")
}

window.onerror =function(errorMessage, scriptURI, lineNumber) {
	//$(".log").html(lineNumber+":"+errorMessage)
	console.log(lineNumber+":"+errorMessage)
}


function newDate(dateStr) {
   var dateArr = dateStr.split(/[- : \/]/);
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);
}
//时间格式化
function format(time) {
  var time = parseInt(time);
  var m = parseInt(time / 60);
  var s = parseInt(time % 60);
  m = zero(m);
  s = zero(s);
  function zero(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }
  return m + ":" + s;
}



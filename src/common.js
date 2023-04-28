/**
 * browser 浏览器类型检测，已通过chrome 93，ie 11
 */
var ua = navigator.userAgent.toLowerCase()
var up = navigator.platform.toLowerCase(); 
var browser = {
	ua: ua,
	ie: ua.indexOf('trident') > -1 ? true : false, //IE内核
	opera: !!window.opera && window.opera.version,
	webKit: ua.indexOf('applewebkit') > -1, //苹果、谷歌内核
	mac: ua.indexOf("macintosh") > -1,
	presto: ua.indexOf('presto') > -1, //opera内核
	chrome: ua.indexOf('chrome') > -1,
	safari: ua.indexOf('safari') > -1,
	firefox: ua.indexOf('firefox') > -1,
	edge: ua.indexOf('edg') > -1,
	gecko: ua.indexOf('gecko') > -1 && ua.indexOf('khtml') == -1, //火狐内核
	mobile: !!ua.match(/applewebkit.*mobile.*/), //是否为移动终端
	ios: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
	android: ua.indexOf('android') > -1,
	linux: ua.indexOf('linux') > -1, 
	iPhone: ua.indexOf('iphone') > -1, 
	iPad: ua.indexOf('ipad') > -1, 
	iPod: ua.indexOf('ipod') > -1, 
	SymbianOS: ua.indexOf('symbian') > -1||ua.indexOf('symbianos') > -1, 
	WindowsPhone: ua.indexOf('windows phone') > -1, 
	weixin: ua.indexOf('micromessenger') > -1,
	weibo: ua.indexOf('weibo') > -1,
	eleme: ua.indexOf('eleme') > -1,
	quirks: document.compatMode == "BackCompat",
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
browser.type=browser.ie ? "IE" : browser.opera ? "Opear" :  browser.edge ? "Edge" :
	browser.weixin ? "Weixin" :browser.chrome ? "Chrome" : browser.safari ? "Safari" : "other";
browser.engine=browser.webKit?"Webkit":browser.gecko?"Gecko":browser.ie?"Trident":"other"


var isWeixin = is_weixin = browser.weixin
var isWeibo = is_weibo = browser.weibo
var isEleme = is_eleme =  browser.eleme
var isIphone = is_iphone =  browser.iPhone
var iPad = is_ipad =  browser.iPad
var isPc=is_pc  =(browser.android||browser.iPhone||browser.iPad||browser.iPod||browser.SymbianOS||browser.WindowsPhone)?false:true;
var isMob =is_mob = !isPc
var system = {win: up.indexOf("win") == 0, mac: up.indexOf("mac") == 0, linux: up.indexOf("linux") == 0, xll: false, ipad:iPad }; 
system.type=system.win?"Win":system.mac?"Mac":system.ipad?"Ipad":browser.android?"Android":system.linux?"linux":"other"

var version = 0;
if (browser.ie) {
	var v1 = ua.match(/(?:msie\s([\w.]+))/);
	var v2 = ua.match(/(?:trident.*rv:([\w.]+))/);

	if (v1 && v2 && v1[1] && v2[1]) {
		version = Math.max(v1[1] * 1, v2[1] * 1);
	} else if (v1 && v1[1]) {
		version = v1[1] * 1;
	} else if (v2 && v2[1]) {
		version = v2[1] * 1;
	} else {
		version = 0;
	}
	browser.ie11Compat = document.documentMode == 11;
	browser.ie9Compat = document.documentMode == 9;
	browser.ie8 = !!document.documentMode;
	browser.ie8Compat = document.documentMode == 8;
	browser.ie7Compat = (version == 7 && !document.documentMode) || document.documentMode == 7;
	browser.ie6Compat = version < 7 || browser.quirks;
	browser.ie9above = version > 8;
	browser.ie9below = version < 9;
	browser.ie11above = version > 10;
	browser.ie11below = version < 11;
}

if (browser.firefox) {
	var geckoRelease = ua.match(/rv:([\d\.]+)/);
	if (geckoRelease) {
		geckoRelease = geckoRelease[1].split(".");
		version = geckoRelease[0] * 10000 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
	}
}
if(browser.edg){
	if (/edg\/([\d\.]+)/i.test(ua)) {
		version =  ua.match(/edg\/(\d+\.\d)/i)[1];
	}
}else if(browser.chrome){
	if (/chrome\/([\d\.]+)/i.test(ua)) {
		version =  ua.match(/chrome\/(\d+\.\d)/i)[1];
	}
}

// Opera 9.50+
if (browser.opera) version = parseFloat(opera.version());

// WebKit 522+ (Safari 3+)
if (browser.webkit) version = parseFloat(ua.match(/ applewebkit\/(\d+)/)[1]);

browser.version=version
browser.isCompatible= !browser.mobile && ((browser.ie && version >= 6) || (browser.gecko && version >= 10801) || (browser.opera && version >= 9.5) || (browser.air && version >= 1) || (browser.webkit && version >= 522) || false)

var isStorageSupport =is_storagesupport= localStorageSupported() //全局变量，判断是否支持
var supportsOrientationChange = "onorientationchange" in window, //是否开启手机横竖屏
	orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

var touch = is_mob ? "touchstart" : "mousedown"
var touchmove = is_mob ? "touchmove" : "mousemove"
var touchend = is_mob ? "touchend" : "mouseup"
var reqAnimationFrame = requestAnimationFrame = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function (callback) {
		setTimeout(callback, 1000 / 60);
	};
	
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




//获取Request
function get(sProp) {
	var re = new RegExp("[&,?]" + sProp + "=([^//&]*)", "i");
	var a = re.exec(document.location.search);
	return a == null?"":a[1];
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

function getData(name) {
	//注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
	if (isStorageSupport) {
		v = localStorage.getItem(name)
		if (v == undefined) {
			v = "";
		}
		return v;
	}else{
		console.log('not support getData')
	}
	return "";

}

function setData(name, cookievalue) {
	var date = new Date();
	date.setTime(date.getTime() + 365 * 24 * 3600 * 1000);
	if (isStorageSupport) {
		localStorage.setItem(name, cookievalue);
	}

}
var cookieBaseName = "alextu_"

function getCookie(name) {
	//注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
	name = cookieBaseName + name
	var _cookie = document.cookie;
	var firstchar = _cookie.indexOf(name + "=");
	if (firstchar != -1) {
		firstchar += name.length + 1;
		lastchar = _cookie.indexOf(";", firstchar);
		lastchar = lastchar == -1 ? _cookie.length : lastchar;
		return unescape(_cookie.substring(firstchar, lastchar));
	}
	return "";
}
function setCookie(name, value) {
	name = cookieBaseName + name
	var date = new Date();
	date.setTime(date.getTime() + 365 * 24 * 3600 * 1000);
	document.cookie = name + '=' + escape(value) + ';path=/;  expires=' + date.toGMTString()

}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	document.cookie = name + "=;path=/;expires=" + exp.toGMTString();
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

function getXY(e) {

	e = e.originalEvent || e

	var _x = 0,
		_y = 0,
		_cx = 0,
		_cy = 0,
		_e = false
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
		if (e.targetTouches || e.changedTouches || e.touches) {
			if (e.targetTouches[0] != undefined) {
				_e = e.targetTouches[0]
			} else if (e.changedTouches[0] != undefined) {
				_e = e.changedTouches[0]
			} else if (e.touches[0] != undefined) {
				_e = e.touches[0]
			}
		}
	}
	if (!_e) {
		_e = e
	}
	return {
		x: Math.floor(_e.pageX),
		y: Math.floor(_e.pageY),
		cx: Math.floor(_e.clientX),
		cy: Math.floor(_e.clientY)
	}
}

function newImg(src) {
	var obj = new Image();
	obj.src = src;
	obj.onload = function () {}
	return obj;
}

function urlencode(url) {
	return encodeURIComponent(url);
}

function urldecode(url) {
	return decodeURIComponent(url);
}
var log = {
	ini: function () {
		if ($("#log").length == 0) {
			$("body").append('<div id="log" style="position:fixed; top:0;z-index:999; padding:10px; background:#FFF; color:#000;"></div>')
		}
	},
	add: function () {
		v = Array.prototype.slice.apply(arguments);
		this.ini();
		$("#log").html(v.join(" ") + "<br/>" + $("#log").html());
	},
	val: function () {
		v = Array.prototype.slice.apply(arguments);
		this.ini();
		$("#log").html(v.join(" ") + "<br/>");
	}
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


function convertCanvasToImage(o) {
	var t = new Image;
	return t.src = o.toDataURL("image/png"), t
}

function convertCanvasToImgData(o) {

	return o.toDataURL("image/jpeg")
}
String.prototype.byteLength = function () {
	var b = 0;
	l = this.length;
	if (l) {
		for (var i = 0; i < l; i++) {
			if (this.charCodeAt(i) > 255) {
				b += 2;
			} else {
				b++;
			}
		}
		return b;
	} else {
		return 0;
	}
}
Array.prototype.indexOf = function (o) {
		for (var t = 0; t < this.length; t++)
			if (this[t] == o) return t;
		return -1
	},
	Array.prototype.remove = function (o) {
		var t = this.indexOf(o);
		t > -1 && this.splice(t, 1)
	};

function e(element) {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);

		if (arguments.length == 1)
			return element;

		elements.push(element);
	}
	return elements;
}

function at(id) {
	return e(id);
}
//创建元素
function ce(tagName) {
	return document.createElement(tagName);
}


window.onerror = function (message, url, line, column, error) {
	console.log('error::', message, url, line, column, error);
}


function newDate(dateStr) {
	var dateArr = dateStr.split(/[- : \/]/);
	var l = dateArr.length
	return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], l <= 3 ? 0 : dateArr[3], l <= 3 ? 0 : dateArr[4], l <= 3 ? 0 : dateArr[5]);
}

function year(t) {
	var nt = t ? newDate(t) : new Date()
	return nt.getFullYear();
}

function month(t) {
	var nt = t ? newDate(t) : new Date()
	return nt.getMonth() + 1;
}

function week(t) {
	var nt = t ? newDate(t) : new Date()
	return nt.getDay();
}

function day(t) {
	var nt = t ? newDate(t) : new Date()
	return nt.getDate();
}

function hour(t) {
	var nt = t ? newDate(t) : new Date()
	return nt.getHours();
}

function now() {
	var date = new Date();
	var year = date.getFullYear();
	var month = FormatNum(date.getMonth() + 1);
	var day = FormatNum(date.getDate());
	var hour = FormatNum(date.getHours(), 2);
	var min = FormatNum(date.getMinutes(), 2);
	var second = FormatNum(date.getSeconds(), 2)
	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
}

function getTime2Time(t) {
	time1 = new Date().getTime() / 1000;
	time2 = new Date(t).getTime() / 1000
	var time_ = time1 - time2;
	return time_;
}

function getLeftTime(endTime) {
	return -getTime2Time(newDate(endTime))

}

function getPassTime(startTime) {
	return getTime2Time(newDate(startTime))
}
//时间格式化
function format(time) {
	var time = parseInt(time);
	var d = parseInt((time / 3660 * 24) % 365);
	var h = parseInt((time / 3660) % 24);
	var m = parseInt((time / 60) % 60);
	var s = parseInt(time % 60);
	m = FormatNum(m, 2);
	s = FormatNum(s, 2);

	var t = m + ":" + s;
	(h || d || y) ? t = (h + ":" + t): t
	d ? t = (d + " " + t) : t
	return t
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
//12秒内提示一次，多次引用只显示一次
let ct=Math.floor(getData("ct")),nt=new Date().getTime()
if(nt>ct){
	console.log("%c— ATTUS™,13717810545 —%c ", "padding:8px 15px; color:#f2efe8; background-color:#070e1d; line-height:25px;", "padding:8px 5px 5px 0; color:#070e1d; ")
	setData("ct",nt+12000)
}

var ua = navigator.userAgent.toLowerCase()

var browser = {
	versions: function () {
		var u = navigator.userAgent, app = navigator.appVersion;
		return {         //移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}


var isStorageSupport = localStorageSupported() //全局变量，判断是否支持
var is_weixin = ua.match(/MicroMessenger/i) == "micromessenger" ? true : false
var is_weibo = ua.match(/Weibo/i) == "weibo" ? true : false
var is_eleme = ua.match(/Eleme/i) == "eleme" ? true : false
var is_iphone = ua.match(/iPhone|mac|iPod|iPad/i)
var is_mob = !isPc()
var is_pc = !is_mob
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
			console[func] = function () { };
	}
	if (!console.memory)
		console.memory = {};

}




//获取Request
function get(sProp) {
	var re = new RegExp("[&,?]" + sProp + "=([^//&]*)", "i");
	var a = re.exec(document.location.search);
	if (a == null) {
		return "";
	}
	return a[1];
};

function isPc() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}



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
	obj.onload = function () { }
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
	var b = 0; l = this.length;
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

Atu.ini = function () {
	var v = arguments
	cookieBaseName += v[0];
	this.evtUrl = v[1] ? v[1] : location.href;
	this.wxUrl = v[2] ? v[2] : "http://atuad.cn/wx/";

	this.openid = getCookie("openid");
	this.ua = ""
	this.site = ""
	//console.log(typeof wx)
	if ("undefined" == typeof wx) {
		$.loadFile("http://res.wx.qq.com/open/js/jweixin-1.4.0.js")

	}
}
Atu.iniUser = function (callback, callback2) {

	if (!this.openid) {
		var wx = get("wx")
		var d = {}
		if (wx) {

			d.wx = wx
			wxArr = wx.split("|")
			console.log(wxArr)
		}
		this.sendDataBack("ini", d, function (p) {

			if (p.openid) {
				callback && callback(p)
				Atu.openid = p.openid
				setCookie("openid", p.openid)
				//if(wx){ location.replace(Atu.evtUrl);}
			} else {
				if (!wx && Atu.tokenUrl) {
					location.replace(Atu.tokenUrl);
				}
			}
		})
	} else {

		callback2 && callback2(this.openid)
	}
}
Atu.act = Atu.sendDataBack = Atu.sendMsgBack = function (act, u, callback) {
	var d = u || {}
	d.act = typeof (act) == "object" ? act : { "act": act }
	d.openid = this.openid

	$.get(this.api, d, function (p) {
		callback && callback(p)
	}, "jsonp")

}
Atu.iniWx = function (s) {

	if (!this.wxUrl) {
		console.log("未设置wxUrl");
		return;
	}
	$.get(this.wxUrl, "", function (d) {
		wx.config({
			appId: d.appId,
			timestamp: d.timestamp,
			nonceStr: d.nonceStr,
			signature: d.signature,
			jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'updateAppMessageShareData', 'updateTimelineShareData', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'translateVoice', 'previewImage', 'openLocation'],
			openTagList: ['wx-open-launch-weapp', 'wx-open-launch-app']

		});
		wx.ready(function () {
			Atu.iniShare(s);
		});
		wx.error(function (res) {
			console.log("wxConfig Fail")
		});

	}, "jsonp")
}
Atu.iniShare = function (s) {
	//alert(s.title+":"+s.title2+":"+s.desc+":"+s.link+":"+s.imgUrl)
	wx.updateAppMessageShareData({
		title: s.title,
		desc: s.desc,
		link: s.link,
		imgUrl: s.imgUrl,
	}, function (res) { });
	wx.updateTimelineShareData({
		title: s.title2 || s.title,
		link: s.link,
		imgUrl: s.imgUrl,
	}, function (res) { });

	wx.onMenuShareAppMessage({
		title: s.title,
		desc: s.desc,
		link: s.link,
		imgUrl: s.imgUrl,
		success: function (res) { }
	});
	wx.onMenuShareTimeline({
		title: s.title2 || s.title,
		link: s.link,
		imgUrl: s.imgUrl,
		success: function (res) { }
	});

}
Atu.iniClick = function (site) {
	this.site = site
	this.ua = ua
	this.addClick()
}
Atu.addClick = function (str) {
	var d = {}
	d.url = location.href
	d.type = (!str || str == document.title) ? 0 : 1;
	d.title = str ? str : document.title
	d.site = this.site
	d.ua = this.ua

	$.get("//atuad.cn/tongji", d, function (d) {
		console.log("atu tongji inied")
	}, "jsonp")
}

window.onerror = function (message, url, line, column, error) {
	//$(".log").html(lineNumber+":"+errorMessage)
	console.log('log---onerror::::',message, url, line, column, error);
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
	return - getTime2Time(newDate(endTime))

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
	(h || d || y) ? t = (h + ":" + t) : t
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
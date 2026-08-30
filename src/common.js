/**
 * browser 浏览器类型检测，已通过chrome 93，ie 11
 */

const ua = navigator.userAgent.toLowerCase()
const up = navigator.platform.toLowerCase(); 
const browser = {
	ua,
	ie: ua.indexOf('trident')!== -1, //IE内核
	opera: !!window.opera && window.opera.version,
	webKit: ua.indexOf('applewebkit') !== -1, //苹果、谷歌内核
	mac: ua.indexOf("macintosh")!== -1,
	edge: ua.indexOf('edg') !== -1,
	gecko: ua.indexOf('gecko')!== -1  && ua.indexOf('khtml')== -1, //火狐内核
	mobile: !!ua.match(/applewebkit.*mobile.*/), //是否为移动终端
	ios: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
	SymbianOS: ua.indexOf('symbian')!== -1 ||ua.indexOf('symbianos')!== -1, 
	WindowsPhone: ua.indexOf('windows phone')!== -1, 
	weixin: ua.indexOf('micromessenger') !== -1,
	quirks: document.compatMode == "BackCompat",
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

const _bs=['presto','chrome','safari','firefox','android','linux','iPhone','iPad','iPod','alipay','xiaomi','redmi','vivo','oppo','honor','huawei','weibo','eleme','qq']
_bs.forEach(item => {
  window["is"+capitalizeFirstLetter(item)]=window["is_"+item.toLowerCase()]=browser[item]= browser[item.toLowerCase()]= ua.indexOf(item.toLowerCase())!== -1
});
browser.type=browser.ie ? "IE" : browser.opera ? "Opera" :  browser.edge ? "Edge" :
browser.weixin ? "Weixin" :browser.chrome ? "Chrome" : browser.safari ? "Safari" : "other";
browser.engine=browser.webKit?"Webkit":browser.gecko?"Gecko":browser.ie?"Trident":"other"

const isWeixin =  browser.weixin
const isPc  = !(browser.android||browser.iPhone||browser.iPad||browser.iPod||browser.SymbianOS||browser.WindowsPhone);
const isLocal=location.href.indexOf("localhost")>0
const is_weixin = isWeixin,is_pc = isPc,isMob  = !isPc,is_mob = isMob,is_local=isLocal

const system = {win: up.indexOf("win") == 0, mac: up.indexOf("mac") == 0, linux: up.indexOf("linux") == 0, xll: false, ipad:isIpad }; 
system.type=system.win?"Win":system.mac?"Mac":system.ipad?"Ipad":browser.android?"Android":system.linux?"linux":"other"

let version = 0;
if (browser.ie) {
	const v1 = ua.match(/(?:msie\s([\w.]+))/);
	const v2 = ua.match(/(?:trident.*rv:([\w.]+))/);

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
	let geckoRelease = ua.match(/rv:([\d\.]+)/);
	if (geckoRelease) {
		geckoRelease = geckoRelease[1].split(".");
		version = geckoRelease[0] * 10000 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
	}
}
let match;
if(browser.edg){
	if (/edg\/([\d\.]+)/i.test(ua)) {
		match =  ua.match(/edg\/(\d+\.\d)/i);
    if (match) version = match[1];
	}
}else if(browser.chrome){
	if (/chrome\/([\d\.]+)/i.test(ua)) {
		match =  ua.match(/chrome\/(\d+\.\d)/i);
    if (match) version = match[1];
	}
}

// Opera 9.50+
if (browser.opera) version = parseFloat(opera.version);

// WebKit 522+ (Safari 3+)
if (browser.webkit){
  	match =  ua.match(/ applewebkit\/(\d+)/);
    if (match) version = parseFloat(match[1]);
};

browser.version=version
browser.isCompatible= !browser.mobile && ((browser.ie && version >= 6) || (browser.gecko && version >= 10801) || (browser.opera && version >= 9.5) || (browser.air && version >= 1) || (browser.webkit && version >= 522) || false)

const isStorageSupport = localStorageSupported() //全局变量，判断是否支持
const is_storagesupport=isStorageSupport
const supportsOrientationChange = "onorientationchange" in window, //是否开启手机横竖屏
	orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
  isTouchDevice=('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

const touch = isTouchDevice ? "touchstart" : "mousedown";
const touchmove = isTouchDevice ? "touchmove" : "mousemove";
const touchend = isTouchDevice ? "touchend" : "mouseup";

const reqAnimationFrame = requestAnimationFrame = window.requestAnimationFrame ||
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
	const console = window.console;

	const funcs = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
		'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
		'info', 'log', 'markTimeline', 'profile', 'profileEnd',
		'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'
	];
	for (let i = 0, l = funcs.length; i < l; i++) {
		const func = funcs[i];
		if (!console[func])
			console[func] = () => {};
	}
	if (!console.memory)
		console.memory = {};

}

function capitalizeFirstLetter(str) {
  return str.toLowerCase().replace(/\b[a-z]/g, function(match) { return match.toUpperCase();});
}
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
//获取Request
function get(sProp) {
	const re = new RegExp(`[?&]${sProp}=([^&]*)`, 'i');
	const a = re.exec(document.location.search);
	return a == null?"":decodeURIComponent(a[1]);
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
	return isStorageSupport ? localStorage.getItem(name) || '' : '';
}
function setData(name, cookievalue) {
	if (isStorageSupport) {
		localStorage.setItem(name, cookievalue);
	}
}
let cookieBaseName = "alextu_"

function getCookie(name) {
	//注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
	name = cookieBaseName + name
	const _cookie = document.cookie;
	let firstchar = _cookie.indexOf(name + "="),lastchar;
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
	const date = new Date();
	date.setTime(date.getTime() + 365 * 24 * 3600 * 1000);
	document.cookie = name + '=' + escape(value) + ';path=/;  expires=' + date.toGMTString()

}

function delCookie(name) {
	const exp = new Date();
	exp.setTime(exp.getTime() - 1);
	document.cookie = name + "=;path=/;expires=" + exp.toGMTString();
}

function RandArr(arr) {
	 return [...arr].sort(() => Math.random() - 0.5)
}
function arrRand(arr) { return RandArr(arr);}
function arrRemove(array,o) {
  let arr = [...array];
  let t = arr.indexOf(o);
	t > -1 && arr.splice(t, 1)
  return arr
}
function arrDelete(array,o) { return arrRemove(array,o);}

function getXY(e) {
	e = e.originalEvent || e
	let _e = false
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) || isTouchDevice) {
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
	let obj = new Image();
	obj.src = src;
	obj.onload = () => {}
	return obj;
}

function urlencode(url) {
	return encodeURIComponent(url);
}

function urldecode(url) {
	return decodeURIComponent(url);
}
const log = {
	ini () {
		if ($("#log").length == 0) {
			$("body").append('<div id="log" style="position:fixed; top:0;z-index:999; padding:10px; background:#FFF; color:#000;"></div>')
		}
	},
	add () {
		const v = Array.prototype.slice.apply(arguments);
		this.ini();
		$("#log").html(v.join(" ") + "<br/>" + $("#log").html());
	},
	val () {
		const v = Array.prototype.slice.apply(arguments);
		this.ini();
		$("#log").html(v.join(" ") + "<br/>");
	}
}

function getEvtUrl() {
	return location.href.substring(0, location.href.lastIndexOf('/') + 1);
}


function convertCanvasToImage(o) {
	const t = new Image();
	return t.src = o.toDataURL("image/png"), t
}

function convertCanvasToImgData(o) {

	return o.toDataURL("image/jpeg")
}

String.prototype.byteLength = function(){
  let len = 0;
  for (let i = 0; i < this.length; i++) {
    len += this.charCodeAt(i) > 255 ? 2 : 1;
  }
  return len;
}

String.prototype.startWith = function (str) {
  const reg = new RegExp("^" + str);
  return reg.test(this);
}
String.prototype.endWith = function (str) {
  const reg = new RegExp(str+"$");
  return reg.test(this);
}
Array.prototype.indexOf = function (o) {
	for (let t = 0; t < this.length; t++)
		if (this[t] == o) return t;
	return -1
},
Array.prototype.remove = function (o) {
	const t = this.indexOf(o);
	t > -1 && this.splice(t, 1)
};

function e(element) {
	const elements = [];
	for (let i = 0; i < arguments.length; i++) {
		let element = arguments[i];
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


window.onerror =  (message, url, line, column, error)=>{
	console.log('error::', message, url, line, column, error);
}

function timestamp(t=0){
  const s = String(t)
  if (s.length === 10) return +s * 1000
  if (s.length === 13) return +s
  if (s === '0') return Date.now()
  return ''
}
function newDate(dateStr='') {
  if(!dateStr){return new Date();}
  if(!isNaN(dateStr) ){
    const t=timestamp(dateStr)
    if(!t){  return ''}
    dateStr= now(t);
  }
  const dateArr = dateStr.split(/[- : \/]/);
  const l = dateArr.length
  return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], l <= 3 ? 0 : dateArr[3], l <= 3 ? 0 : dateArr[4], l <= 3 ? 0 : dateArr[5]);
  
}

function year(t='') {
	const nt = newDate(t) 
	return nt.getFullYear();
}

function month(t='') {
	const nt = newDate(t) 
	return nt.getMonth() + 1;
}

function week(t='') {
	const nt = newDate(t) 
	return nt.getDay();
}

function day(t='') {
	const nt = newDate(t) 
	return nt.getDate();
}

function hour(t='') {
	const nt = newDate(t) 
	return nt.getHours();
}

function now(t='') {
 
	const d = t?new Date(t):new Date()
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  return d.getFullYear() + '-'
    + pad(d.getMonth() + 1) + '-'
    + pad(d.getDate()) + ' '
    + pad(d.getHours()) + ':'
    + pad(d.getMinutes()) + ':'
    + pad(d.getSeconds());
}

function getTime2Time(t) {
	const time1 = new Date().getTime() / 1000;
	const time2 = new Date(t).getTime() / 1000
	const time_ = time1 - time2;
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
	time = parseInt(time);
	const d = parseInt((time / 3660 * 24) % 365);
	const h = parseInt((time / 3660) % 24);
	let m = parseInt((time / 60) % 60);
	let s = parseInt(time % 60);
	m = FormatNum(m, 2);
	s = FormatNum(s, 2);

	const t = m + ":" + s;
	h ? t = (h + ":" + t): t
	d ? t = (d + " " + t) : t
	return t
}

function Alexdate(t=0,split='') {

  if(t===''||t=='-'){
    split=t,t=0;
  }

	const sd = newDate(t),
	y = FormatNum(sd.getFullYear(), 4),
	m = FormatNum(sd.getMonth() + 1, 2),
	d = FormatNum(sd.getDate(), 2);

	return y + split + m + split + d;
}

function FormatNum(num, weishu) {
	let s = num.toString()
  while (str.length < weishu) {
    s = '0' + s;
  }
	return s;
}
function copy(txt){
  if($("#atuCopyInput").length==0){
      $("body").append('<textarea id="atuCopyInput" style="opacity: 0;position: absolute;"></textarea>')
  }
  $("#atuCopyInput").val(txt)
  $("#atuCopyInput")[0].select()
  console.log(document.execCommand('copy')?'复制成功':'复制失败')
}
function download(url, name) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(xhr.response);
    a.download = name || 'download';
    a.rel = 'noopener';
    a.target = '_blank';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  xhr.onerror = () => console.error('could not download file');
  xhr.send();
}

function click (node) {
  try {
      node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
      const evt = document.createEvent('MouseEvents')
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
          20, false, false, false, false, 0, null)
      node.dispatchEvent(evt)
  }
}

if(!window.Atu){window.Atu={}}
Atu.ini = function() {
	const v = arguments
	cookieBaseName += v[0];
	this.evtUrl = v[1] ? v[1] : location.href;
	this.wxUrl = v[2] ? v[2] : "//atuad.cn/wx/";

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
		const wx = get("wx")
		const d = {}
		if (wx) {

			d.wx = wx
			const wxArr = wx.split("|")
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
	const d = u || {}
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
	$.get(this.wxUrl, {curl:location.href}, function (d) {
		wx.config({
			appId: d.appId,
			timestamp: d.timestamp,
			nonceStr: d.nonceStr,
			signature: d.signature,
			jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareWeibo', 'updateAppMessageShareData', 'updateTimelineShareData', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd','uploadVoice','downloadVoice','translateVoice', 'chooseImage','getLocalImgData', 'previewImage','uploadImage','downloadImage', 'getNetworkType','getLocation','openLocation','closeWindow','scanQRCode','hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','openEnterpriseChat','openEnterpriseContact'],
			openTagList: ['wx-open-launch-weapp', 'wx-open-launch-app', 'wx-open-subscribe','wx-open-launch-profile']
		});
		wx.ready(() => {
			Atu.iniShare(s);
		});
		wx.error(function (res) {
			console.log("wxConfig Fail")
		});

	}, "jsonp")
}
Atu.iniShare = function (s) {
  const _d={title: s.title,desc: s.desc,link: s.link,imgUrl: s.imgUrl,success(res){ },cancel() { console.log('取消分享');}}
	wx.updateAppMessageShareData(_d);
	wx.onMenuShareAppMessage(_d);
  _d.title = s.title2 || s.title;
  wx.updateTimelineShareData(_d);
	wx.onMenuShareTimeline(_d);
}
Atu.iniClick = function (site) {
	this.site = site
	this.ua = ua
	this.addClick()
}
Atu.addClick = function (str) {
	const d = {}
	d.url = location.href
	d.type = (!str || str == document.title) ? 0 : 1;
	d.title = str ? str : document.title
	d.site = this.site
	d.ua = this.ua

	$.get("//atuad.cn/tongji", d, function (d) {
		console.log("atu tongji inied")
	}, "jsonp")
}

//12秒内提示一次，多次引用只显示一次
const _ct=Math.floor(getData("ct"))
const _nt=new Date().getTime()
if(_nt>_ct){
	console.log("%c— ATTUS™,13717810545,作品 —%c ", "padding:8px 15px; color:#f2efe8; background-color:#070e1d; line-height:25px;", "padding:8px 5px 5px 0; color:#070e1d; ")
	setData("ct",_nt+12000)
}
/* 
	Alex.TU http://www.alextu.com
	2016.8.23 Beijing.China
	QQ:93411338
	Mobile:13717810545
*/


var ua = navigator.userAgent.toLowerCase()
 

var isStorageSupport=localStorageSupported()  //全局变量，判断是否支持
var is_weixn=ua.match(/MicroMessenger/i)=="micromessenger"?true:false
var is_weibo=ua.match(/Weibo/i)=="weibo"?true:false
var is_iphone=ua.match(/iPhone|mac|iPod|iPad/i)
var isMob=!isPc()
var supportsOrientationChange = "onorientationchange" in window, //是否开启手机横竖屏
	orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";   

var touch=isMob?"touchstart":"click"
	//touch="click"
;(function($) {
	$.fn.extend({
		inputIni:function(){
			
			$(this).val($(this).attr("iniV"))
			$(this).focus(function(){
				v=$(this).attr("iniV")
				if($(this).val()==v){$(this).val("")}
				
				$(this).addClass("on")
			})
			$(this).focusout(function(){
				if($(this).val()==""){
						$(this).val($(this).attr("rData"))
				}
			})
		}
	})

})(jQuery);



//创建空console对象，避免JS报错  
if(!window.console){  
    window.console = {};  
var console = window.console;  

var funcs = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml',  
             'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',  
             'info', 'log', 'markTimeline', 'profile', 'profileEnd',  
             'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];  
for(var i=0,l=funcs.length;i<l;i++) {  
    var func = funcs[i];  
    if(!console[func])  
        console[func] = function(){};  
}  
if(!console.memory)  
    console.memory = {};  

}




function at(id){
	return(document.getElementById(id));	
}
var SoundLoad=[],SoundA=[]
var Sound = {
  isPlay: false,
  path:"sound/",
  ini:function(v){this.path=v},
  lastUrl:"",
  load:function(url,loop){
	 if($(".sound").length==0){
		 $("body").append("<div class='sound' style='display:none'></div>")
	 }
	 loopStr=loop?"loop":""
	 if($("#"+url).length==0){
		SoundLoad[url]=0
		SoundA.push(url)
		$(".sound").append('<audio src="'+this.path+'/'+url+'.mp3" id="'+url+'"  '+loopStr+' style="display:none" ></audio>') 
	 } 
	 this.get(url).onloadedmetadata = function() {
		console.log(url+":加载完")
		SoundLoad[url]=1
	 };
  },
  loadTm:function(url,loop){
	 this.load(url,loop)
	
	 this.get(url).onloadedmetadata = function() {
		console.log(url+":加载完")
		SoundLoad[url]=1
		loadTMNum++;
	 };
  },
  get:function(v){return document.getElementById(v);},
  play: function(url){ 
   // if(!Sound.isPlay){return;}
	
  	console.log("play",url)
  	this.get(url).play();
	 for(j=1;j<=10;j++){
		 this.iniVolume(url,j/10,32*j)
	 }
   
	
	Sound.isPlay=true;
	Sound.lastUrl=url
  },
  stop: function(url){ 
  	  this.get(url).pause();
 	
	 this.get(url).currentTime = 0;
 	 Sound.isPlay=false;
	 
  },
  pause:function(url){
	 
	  if(Sound.isPlay){
		  for(i=0;i<SoundA.length;i++){
			  for(j=10;j>=0;j--){
				  this.iniVolume(SoundA[i],j/10,32*(10-j))
			  }
				 
		  } 
	  	 Sound.isPlay=false;
	  }else{
		  
		  this.play(url)
		 // Sound.isPlay=true;
	  }

  },setVolume:function(url,v){
	  this.get(url).volume=v
	  if(v==0){
		   this.get(url).pause();
	  }
	  //console.log("setVolume",url,v)
	  
  },iniVolume:function(url,v,t){
	
	  _t=this
	  setTimeout(function(){
		_t.setVolume(url,v)  
	  },t)
  }
};


//获取Request
function request(sProp){  
  var re = new RegExp("[&,?]"+sProp + "=([^//&]*)", "i");  
  var a = re.exec(document.location.search);  
  if (a == null){return "";  }
  return a[1];
};
function isPc(){
<!-- 
	//平台、设备和操作系统 
	var system = {win: false, mac: false, xll: false, ipad:false }; 
	//检测平台 
	var p = navigator.platform; 
	system.win = p.indexOf("Win") == 0; 
	system.mac = p.indexOf("Mac") == 0; 
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0); 
	system.ipad = (ua.match(/iPad/i) != null)?true:false; 
	//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面 
	if (system.win || system.mac || system.xll||system.ipad) { 
		return true;
	} else { 
	   return false;
	} 
--> 	
};


(function(a) {
	//实现对图片，script,css的加载，2015.12.12
        a.loadFile = function(b, c) {
			
			//b load Img ,c funciton
            if ("string" == typeof b) {  b = new Array(b); }
			c = a.extend({}, a.fn.loadFile.defaults, c instanceof Function ? {all: c}: c);
            var d = new Array;
            a.each(b,function(index, file) {
				
				var att = file.split('.');
				var ext = att[att.length - 1].toLowerCase();
				var isCSS = ext == "css";
				var isJS = ext == "js";
				var isIMG = ext == "jpg"||ext == "jpeg"||ext == "png"||ext == "gif";

				if(isIMG){
					var g = new Image;
					a(g).bind("load error",function(e) {
						d.push(g);
						a.checkLoad(b,c,d);
						a(this).unbind("load error")
					});
					
               		g.src = file
				}
				if(isCSS||isJS){
					var tag = isCSS ? "link" : "script";
					var attr = isCSS ? " type='text/css' rel='stylesheet' ":"";
					var link =(isCSS ? "href" : "src")+"='" + file + "'";
					if ($(tag + "[" + link + "]").length == 0){
						$("head").append("<" + tag + attr + link + "></" + tag + ">");
					}
					d.push(file);
					a.checkLoad(b,c,d);
				}
            })
        };
		a.checkLoad=function(b,c,d){
			
			if (c.each instanceof Function) {
				c.each.call() 
			}
			if (d.length >= b.length && c.all instanceof Function) {
				c.all.call()
			}
		};
        a.fn.loadFile = function(b) { a.loadFile(this, b); return this };

        a.fn.loadFile.defaults = {each: null,all: null}
})(jQuery);

function localStorageSupported() {

  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch(e){
    return false;
  }
  
}


function getCookie(cookiename){ 
//注：只有数字型或者字符型，没有Boolean,空为false,有值哪怕是false都为true
   if(isStorageSupport){ 
 	  v=localStorage.getItem(cookiename)
	  if(v==undefined){v="";}
	  return v;
   }
	var _cookie = document.cookie;
	var firstchar = _cookie.indexOf(cookiename);	 
	if (firstchar != -1) {
		firstchar += cookiename.length + 1; 
		lastchar = _cookie.indexOf(";", firstchar);
		lastchar =lastchar == -1? _cookie.length:lastchar;
		return unescape(_cookie.substring(firstchar, lastchar));
	} 
	return ""; 
   
} 
function setCookie(cookiename, cookievalue)
{ 
var date = new Date();
   date.setTime(date.getTime() + 365*24* 3600 * 1000);
   if(isStorageSupport){ 
		localStorage.setItem(cookiename,cookievalue);
   }	
   document.cookie = cookiename + '=' + escape(cookievalue)+ '; expires=' + date.toGMTString()
	
}


function sendMsgBack(act,callBack){
	console.log("sendMsgBack");
	var _p={}

	if(typeof(act) == "object"){
		_p=act
	}else{
		_p={"act":act}
	} ; 
	
	$.get(evtUrl+"gateway.php?t="+Math.random(),_p,function(d){ 
		
		callBack(d);
	},"json")
}
function RandArr(arr) { 
	 num=arr.length
	var temp_array = new Array(); 
	for (var index in arr) { 
		temp_array.push(arr[index]); 
	} 
	var return_array = new Array(); 
	for (var i = 0; i< num; i++)
	{
	
		if (temp_array.length>=0) { 
		
			var arrIndex = Math.floor(Math.random()*temp_array.length); 
			return_array[i] = temp_array[arrIndex]; 
			temp_array.splice(arrIndex, 1); 
		}else{ 
			break; 
		} 
	} 
	return return_array; 
}
function getXY(e){
	var _x=0,_y=0
	//console.log(navigator.userAgent)
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)){
		
		if(e.targetTouches || e.changedTouches || e.touches){
		
			if(e.targetTouches[0] != undefined){
			
				_y = e.targetTouches[0].pageY
				_x = e.targetTouches[0].pageX;
			}else if(e.changedTouches[0] != undefined){
			
				_y= e.changedTouches[0].pageY
				_x= e.changedTouches[0].pageX;
			}else if(e.touches[0] != undefined){
				
				_y=e.touches[0].pageY
				_x=e.touches[0].pageX
			}
		}else{
				
			_y=e.pageY
			_x=e.pageX	
		}
	}else{
		_y=e.pageY
		_x=e.pageX
	}
	
	return {x:Math.floor(_x),y:Math.floor(_y)}
}



function Alexdate(){
	var sd=new Date()
	y=FormatNum(sd.getFullYear(),4);
	m=FormatNum(sd.getMonth()+1,2);
	d=FormatNum(sd.getDate(),2);
	return y+""+m+""+d;
}

function FormatNum(num,weishu){
	
	s=num.toString()
	for(i=s.length;i<weishu;i++){s="0"+s;} 
	
	return s;
}




function isPhoneOrMobile(s){
	patrn=/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(14[5-8]\d{8}$)|(15\d{9}$)|(17[0-1]\d{8}$)|(17[6-8]\d{8}$)|(18\d{9}$)/
	if(!patrn.exec(s)) return false ;
	return true 
}
function isMobile(s){
	var patrn=/^0{0,1}(13[0-9]|14(5|7|9)|15([0-3]|[5-9])|(17([0-1]|[6-8]))|(18[0-9]))+\d{8}$/
	return patrn.test(s)
}  
function isEmail(s){

  var patrn=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if(!patrn.exec(s))  return false ;
  return true 
}
function isTime(s){
  var patrn=/^([\d]{4}-[\d]{1,2}-[\d]{1,2})|([\d]{4}-[\d]{1,2}-[\d]{1,2}\s[\d]{1,2}:[\d]{1,2}:[\d]{1,2})$/;
  if(!patrn.exec(s))  return false ;
  return true 	
}
function isQQ(s){
 var patrn=/^[1-9][0-9]{4,10}$/;
  if(!patrn.exec(s))  return false ;
  return true 
}
window.onerror =function(errorMessage, scriptURI, lineNumber) {
	//alert(lineNumber+":"+errorMessage)
}

function getRotate(obj){
	var ele = $(obj).get(0);
	var groups = window.getComputedStyle(ele).transform.match(/(?:[^,]+,){5}s*([^,]+),s*([^,]+)/);
	var angle;
	if (groups) {
	 var numbers = groups.slice(1).map(function(n) { return Number(n); });
	 angle = Math.atan(numbers[1] / numbers[0]) / Math.PI * 180 + (numbers[0] < 0 ? 180 : 0);
	 if (angle < 0) {
	 angle += 360;
	}
	} else {
	 angle = 0;
	}
	return angle;

}
 var ani={
	"zdIni":function(obj,v,t){
		
		if(!canZD){
			v="translate(0,0)"
			$(obj).css({"transform":v,"-webkit-transform":v,"-ms-transform":v,"-moz-transform":v,"-o-transform":v})
			
		}else{
			setTimeout(function(){
				$(obj).css({"transform":v,"-webkit-transform":v,"-ms-transform":v,"-moz-transform":v,"-o-transform":v})
			},t)
		}
	},"zd":function	(obj,fd){
		if(!canZD){return}
		var v="translate(0,0)",_t=this,dt=50
		_t.zdIni(obj,v,0)
		
		_t.zdIni(obj,v.replace("0,0",fd+"px,0"),dt)
		_t.zdIni(obj,v.replace("0,0","0,"+fd+"px"),2*dt)
		_t.zdIni(obj,v.replace("0,0","-"+fd+"px,0"),3*dt)
		_t.zdIni(obj,v.replace("0,0","0,-"+fd+"px"),4*dt)
		_t.zdIni(obj,v.replace("0,0",fd+"px,0"),5*dt)
		_t.zdIni(obj,v.replace("0,0","0,"+fd+"px"),6*dt)
		_t.zdIni(obj,v.replace("0,0","-"+fd+"px,0"),7*dt)
		_t.zdIni(obj,v.replace("0,0","0,-"+fd+"px"),8*dt)

		r=Math.random()*1+0.4
		
		setTimeout(function(){_t.zd(obj,fd)},r*1000)
		
	},iniBgArr:[],iniBgT:[],
	  iniBgMovie:function(obj,x,num,fps,isSpecial){
		  _l=this
		  j= _l.iniBgArr[obj]
		  j=j==undefined?0: j%num
		 $(obj).css({"background-position":-x*j+"px 0"})
		  _l.iniBgArr[obj]=j+1;
		   
		  nfps=fps
		  if((j+1) % num==0 && isSpecial==true){
			 nfps=Math.floor(Math.random()*3000)+ fps
			
		 }
		  _l.iniBgT[obj]=setTimeout(function(){
			
			 _l.iniBgMovie(obj,x,num,fps,isSpecial)
		 },nfps)
	},iniImgArr:[],iniImgT:[],
	  iniImgMovie:function(obj,num,fps){
		  _l=this
		  j= _l.iniImgArr[obj]
		  j=j==undefined?0: j%num
		 
		 $(obj +" img").hide().eq(j).show()
		  _l.iniImgArr[obj]=j+1;
		 _l.iniImgT[obj]=setTimeout(function(){
			
			 _l.iniImgMovie(obj,num,fps)
		 },fps)
	},setImg:function(obj,path,type,width,height,num){
		for(i=0;i<num;i++){
			$(obj).append('<img src="'+path+'/'+i+'.'+type+'" width="'+width+'" height="'+height+'"/>')
		}
		$(obj+" img").hide().eq(0).show()
	},clearMovie:function(arr){
		 _l=this
		for(i=0;i<arr.length;i++){
			if( _l.iniBgT[arr[i]]){clearTimeout( _l.iniBgT[arr[i]])}
			if( _l.iniImgT[arr[i]]){clearTimeout( _l.iniImgT[arr[i]])}
		}
	}
}
function newImg(src){
	var obj = new Image();
	obj.src = src;
	obj.onload=function(){}
	return obj;
}


function encodeUrl(url){
	return encodeURIComponent(url);
}

var log={
	add:function(v){
		$(".log").html(v+"<br/>")	
	}	
}

function getEvtUrl(){
	var v = window.location.href,u=v.split("/"),s="";
	for(i=0;i<u.length-1;i++){
		s+=u[i]+"/"
	}
	return s;
}

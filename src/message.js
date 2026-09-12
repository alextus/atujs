(function (a) {

	a.tip = function (msg) {
		if ($(".tipBox").length == 0) {
			$("body").append('<div class="tipBox"></div>')
      if(isPc){$("body").addClass("isPc");}
		}
		$(".tipBox").append('<div class="tip">' + msg + '</div>').show()
		setTimeout(function () {
			$(".tipBox").html("").hide()
		}, 2000)
	};
	a.alert = function (msg, tag1, fun1, tag2, fun2) {
		if ($(".alertBox").length == 0) {
			$("body").append('<div class="alertBox hide"><div class="msg"><div class="msgTitle"><p>msg</p></div><div class="msgTool"></div></div></div>')
      if(isPc){$("body").addClass("isPc");}
    }
    if(arguments.length == 2 && typeof tag1 == "function"){
        fun1 = tag1;
        tag1 = undefined;
    }
    if((arguments.length == 1 && typeof msg == "object") || (arguments.length == 2 && typeof tag1 == "object")){
      let obj=arguments.length == 1?msg:tag1;
       if(obj.ok){fun1 = obj.ok;}
       if(obj.cancel){fun2 = obj.cancel;}
       if(obj.content){msg=obj.content;}
       if(obj.oktxt){tag1 = obj.oktxt;}
       if(obj.canceltxt){tag2 = obj.canceltxt;}
    }
    if(arguments.length == 3 && typeof tag1 == "function" && typeof fun1 == "function"){
        fun2 = fun1;
        fun1 = tag1;
        tag1 = '确定';
        tag2 = '取消';
    }
		let hideAlertBox = function () { $(".alertBox").hide(); }
		if (fun1 == undefined) { fun1 = hideAlertBox; }else{
        const originalfun1 = fun1;
        fun1 = function() {originalfun1.apply(this, arguments); hideAlertBox();};
    }
		if (fun2 == undefined) { fun2 = hideAlertBox; }else{
      const originalfun2 = fun2;
      fun2 = function() {originalfun2.apply(this, arguments); hideAlertBox();};
    }
		if (tag1 == undefined && tag2 == undefined) { tag1 = "确定" }
		if (tag2 == undefined) {
			$(".msgTool").addClass("msgTn1").html('<a href="javascript:;">' + tag1 + '</a>')
			$(".alertBox .msgTool a").on(touch, fun1)
		} else {
			$(".msgTool").addClass("msgTn2").html('<a href="javascript:;">' + tag2 + '</a><a href="javascript:;">' + tag1 + '</a>')
			$(".alertBox .msgTool a").eq(0).on(touch, fun2)
			$(".alertBox .msgTool a").eq(1).on(touch, fun1)
		}
		$(".alertBox .msgTitle p").html(msg)
		$(".alertBox").show()
	};
  a.showLoading = function (msg='') {
    if ($(".atu-loading").length == 0) {
      $("body").append('<div class="atu-loading hide"><div></div><p>'+msg+'</div>')
    }else{
      $(".atu-loading p").html(msg);
    }
    $(".atu-loading").show();
  };
  a.hideLoading = function () {
    $(".atu-loading").hide();

  }
	a.fn.tip = function (msg) {
		a.tip(msg);
		return this
	};
	a.fn.alert = function (msg) {
		a.alert(msg);
		return this
	};
})(Atu);

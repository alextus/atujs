(function (a) {

	a.tip = function (msg) {
		if ($(".tipBox").length == 0) {
			$("body").append('<div class="tipBox"></div>')
		}
		$(".tipBox").append('<div class="tip">' + msg + '</div>').show()
		setTimeout(function () {
			$(".tipBox").html("").hide()
		}, 2000)
	};
	a.alert = function (msg, tag1, fun1, tag2, fun2) {
		if ($(".alertBox").length == 0) {
			$("body").append('<div class="alertBox hide"><div class="msg"><div class="msgTitle"><p>msg</p></div><div class="msgTool"></div></div></div>')
		}
		hideAlertBox = function () { $(".alertBox").hide(); }
		if (fun1 == undefined) { fun1 = hideAlertBox; }
		if (fun2 == undefined) { fun2 = hideAlertBox; }
		if (tag1 == undefined && tag2 == undefined) { tag1 = "确定" }
		if (tag1 != undefined && tag2 == undefined) {
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
	a.fn.tip = function (b) {
		a.tip(msg);
		return this
	};
	a.fn.alert = function (b) {
		a.alert(msg);
		return this
	};
})(Atu);

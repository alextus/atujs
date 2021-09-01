(function ($) {
	$.fn.tabSwitch = function (options) {
		var defaultVal = {
			tabName: 'a',//tab 标签页
			tabActiveClass: 'active',
			tabContent: 'ul',
			tabType: 'click',  // click , mouseenter , mouseleave , mouseout , mouseover 
			tabIs: true,
		};
		if (arguments.length >= 2) {
			var type = arguments.length == 3 && arguments[2] == 1 ? "mouseenter" : "click"
			options = { tabName: arguments[0], tabContent: arguments[1], tabType: type }

		}
		var obj = $.extend(defaultVal, options);  // 合并参数
		return this.each(function () {
			var selObject = $(this);//获取当前对象
			var selTabName = selObject.find(obj.tabName);//获取当前对象下的tab标签
			var selTabContent = selObject.find(obj.tabContent);//获取当前对象下的tab标签内容
			selTabName.bind(obj.tabType, function () {
				selTabName.removeClass(obj.tabActiveClass);
				$(this).addClass(obj.tabActiveClass);
				selTabContent.hide();
				selTabContent.eq(selTabName.index(this)).show();
			});
			if (obj.tabIs) { selTabName.eq(0).trigger(obj.tabType); }
		});
	}
})(Atu);
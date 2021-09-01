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
})(Atu);
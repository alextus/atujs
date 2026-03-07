
!function(a, b, c, d) {
  var e = a(b);
  a.fn.lazyload = function(f) {
      function g() {
          var b = 0;
          i.each(function() {
              var c = a(this);
            
              if (a.abovethetop(this, j) || a.leftofbegin(this, j));
              else if (a.belowthefold(this, j) || a.rightoffold(this, j)) {
                  if (++b > j.failure_limit) return ! 1
              } else{
                  c.trigger("appear"),
                  b = 0
              }
             
          })
      }
      var h, i = this,
      j = {
          threshold: 0,
          failure_limit: 0,
          event: "scroll",
          effect: "show",
          container: b,
          data_attribute: "original",
          data_err: "err",
          appear: null,
          load: null,
          placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      };
      return f && (d !== f.failurelimit && (f.failure_limit = f.failurelimit, delete f.failurelimit), d !== f.effectspeed && (f.effect_speed = f.effectspeed, delete f.effectspeed), a.extend(j, f)),
      h = j.container === d || j.container === b ? e: a(j.container),
      0 === j.event.indexOf("scroll") && h.bind(j.event,function() {
          return g()
      }),
      this.each(function() {
          var b = this,
          c = a(b);
          b.loaded = !1,
          (c.attr("src") === d || c.attr("src") === !1) && c.is("img") && c.attr("src", j.placeholder),
    
  
          c.one("appear",function() {

              if (!this.loaded) {
                  if (j.appear) {
                      var d = i.length;
                      j.appear.call(b, d, j)
                  }
                  let nImg=a("<img />")
                  nImg.attr("src", c.data(j.data_attribute))
                  nImg.bind("load",function() {
                      var d = c.data(j.data_attribute);
                      c.is("img") ? c.attr("src", d) : c.css("background-image", "url('" + d + "')"),
        
                      c[j.effect](j.effect_speed),
                      c.css({"background-color":"#fff"}),
                      b.loaded = !0;
                      var e = a.grep(i, function(a) {  return ! a.loaded });
                      if (i = a(e), j.load) {
                          j.load.call(b, i.length, j)
                      }
                  })
                  nImg.bind("error",function() {
                      if(!c.data(j.data_err)){return;}
                      var d = c.data(j.data_err);
                      c.is("img") ? c.attr("src", d) : c.css("background-image", "url('" + d + "')"),
        
                      c[j.effect](j.effect_speed),
                      b.loaded = !0;
                      var e = a.grep(i, function(a) {  return ! a.loaded });
                      if (i = a(e), j.load) {
                          j.load.call(b, i.length, j)
                      }
                  })
              }
          }),
          0 !== j.event.indexOf("scroll") && c.bind(j.event,function() {
              b.loaded || c.trigger("appear")
          })
      }),
      e.bind("resize",function() {
          g()
      }),
      /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && e.bind("pageshow",function(b) {
          b.originalEvent && b.originalEvent.persisted && i.each(function() {
              a(this).trigger("appear")
          })
      }),
      a(c).ready(function() {
          g()
      }),
      this
  },
  a.belowthefold = function(c, f) {
      var g;
      return g = f.container === d || f.container === b ? (b.innerHeight ? b.innerHeight: e.height()) + e.scrollTop() : a(f.container).offset().top + a(f.container).height(),
      g <= a(c).offset().top - f.threshold
  },
  a.rightoffold = function(c, f) {
      var g;
      return g = f.container === d || f.container === b ? e.width() + e.scrollLeft() : a(f.container).offset().left + a(f.container).width(),
      g <= a(c).offset().left - f.threshold
  },
  a.abovethetop = function(c, f) {
      var g;
      return g = f.container === d || f.container === b ? e.scrollTop() : a(f.container).offset().top,
      g >= a(c).offset().top + f.threshold + a(c).height()
  },
  a.leftofbegin = function(c, f) {
      var g;
      return g = f.container === d || f.container === b ? e.scrollLeft() : a(f.container).offset().left,
      g >= a(c).offset().left + f.threshold + a(c).width()
  },
  a.inviewport = function(b, c) {
      return ! (a.rightoffold(b, c) || a.leftofbegin(b, c) || a.belowthefold(b, c) || a.abovethetop(b, c))
  }

} (window.Atu?window.Atu:jQuery, window, document);
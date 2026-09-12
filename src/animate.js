(function ($, undefined) {
  var prefix = "",
    eventPrefix,
    vendors = { Webkit: "webkit", Moz: "", O: "o" },
    testEl = document.createElement("div"),
    supportedTransforms =/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty,
    transitionDuration,
    transitionTiming,
    transitionDelay,
    animationName,
    animationDuration,
    animationTiming,
    animationDelay,
    cssReset = {},
    _attrs = [
      "",
      "x",
      "y",
      "z",
      "scale",
      "scaleX",
      "scaleY",
      "scaleZ",
      "rotate",
      "rotateX",
      "rotateY",
      "rotateZ",
    ];

  function dasherize(str) {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  function normalizeEvent(name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase();
  }

  if (testEl.style.transform === undefined)
    $.each(vendors, function (vendor, event) {
      if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
        prefix = "-" + vendor.toLowerCase() + "-";
        eventPrefix = event;
        return false;
      }
    });

  transform = prefix + "transform";
  cssReset[(transitionProperty = prefix + "transition-property")] =
    cssReset[(transitionDuration = prefix + "transition-duration")] =
    cssReset[(transitionDelay = prefix + "transition-delay")] =
    cssReset[(transitionTiming = prefix + "transition-timing-function")] =
    cssReset[(animationName = prefix + "animation-name")] =
    cssReset[(animationDuration = prefix + "animation-duration")] =
    cssReset[(animationDelay = prefix + "animation-delay")] =
    cssReset[(animationTiming = prefix + "animation-timing-function")] ="";

  $.fx = {
    off:eventPrefix === undefined &&testEl.style.transitionProperty === undefined,
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent("TransitionEnd"),
    animationEnd: normalizeEvent("AnimationEnd"),
  };

  $.fn.animate = function (properties, duration, ease, callback, delay) {
    console.log("animate", properties, duration, ease, callback, delay);
    if ($.isFunction(duration))
      (callback = duration), (ease = undefined), (duration = undefined);
    if ($.isFunction(ease)) (callback = ease), (ease = undefined);
    if ($.isPlainObject(duration))
      (ease = duration.easing),
        (callback = duration.complete),
        (delay = duration.delay),
        (duration = duration.duration);
    if (duration) duration =(typeof duration == "number"? duration: $.fx.speeds[duration] || $.fx.speeds._default) / 1000;
    if (delay) delay = parseFloat(delay) / 1000;
    return this.anim(properties, duration, ease, callback, delay);
  };
  $.fn.animateTo = function (properties, duration, ease, callback, delay) {
    return this.animate(properties, duration, ease, callback, delay);
  };
  $.fn.animateFrom = function (
    properties0,
    properties,
    duration,
    ease,
    callback,
    delay,
  ) {
    if (typeof properties0 == "string") {
      properties0 = cssString2Object(properties0);
    }
    this.css(properties0);
    return this.animate(properties, duration, ease, callback, delay);
  };

  $.fn.anim = function (properties, duration, ease, callback, delay) {
    this.preAnim(properties);

    var key,nkey,nval,cssValues = {},cssProperties,transforms = {},
      that = this,
      wrappedCallback,
      endEvent = $.fx.transitionEnd,
      fired = false;

    if (duration === undefined) duration = $.fx.speeds._default / 1000;
    if (delay === undefined) delay = 0;
    if ($.fx.off) duration = 0;
    if (typeof properties == "string" && properties.indexOf(":") == -1) {
      //animation 动画模式

      cssValues[animationName] = properties;
      cssValues[animationDuration] = duration + "s";
      cssValues[animationDelay] = delay + "s";
      cssValues[animationTiming] = cssEase(ease) || "linear";
      endEvent = $.fx.animationEnd;
    } else {
      if (typeof properties == "string") {
        properties = cssString2Object(properties);
      }
      cssProperties = this.data("properties")? this.data("properties").split(","): [];

      for (key in properties) {
        nkey = key;
        if (nkey == "scrollTop") {
          properties.ease = ease;
          properties.delay = delay;
          properties.onComplete = callback;
          return $.fn.tween.call(this, properties, duration);
        }
        
        if (key == "x" ||key == "y" ||key == "z" ||supportedTransforms.test(key)) {
          nkey = "transform";
          let unit=getTransformUnit(key)
          transforms[getTransformKey(key)] =properties[key].toString().replace(unit, "") + unit;
          nval = cssTransformObject2String(transforms);
        } else {
          nkey = dasherize(key);
          nval = properties[key];
        }
       
        cssValues[nkey] = nval;
        if (cssProperties.indexOf(nkey) == -1) {
            cssProperties.push(nkey);
         }
      }
    }
     
    if (duration > 0 && typeof properties === "object") {
      cssValues[transitionProperty] = cssProperties.join(", ");
      this.data("properties", cssProperties.join(","));
      cssValues[transitionDuration] = duration + "s";
      cssValues[transitionDelay] = delay + "s";
      cssValues[transitionTiming] = cssEase(ease) || "linear";
    }
  
    wrappedCallback = function (event) {
      if (typeof event !== "undefined") {
        if (event.target !== event.currentTarget) return;
        $(event.target).unbind(endEvent, wrappedCallback);
      } else $(this).unbind(endEvent, wrappedCallback);

      fired = true;
      $(this).css(cssReset);
      callback && callback.call(this);
    };
    if (duration >= 0) {
      this.unbind(endEvent).bind(endEvent, wrappedCallback);
      setTimeout(function () {
        if (fired) return;
        that.each(function () {
          wrappedCallback.call(this);
        });
      }, (duration + delay) * 1000 + 25);
    }
    this.size() && this.get(0).clientLeft;
    this.css(cssValues);

    return this;
  };
  //获取唯一Key
  function getKeys(obj1, obj2 = {}) {
    var result = [];
    var exclude = ["ease", "delay", "onComplete", "callback"];
    for (var key in obj1) {
      if (exclude.indexOf(key) === -1 && result.indexOf(key) === -1) {
        result.push(key);
      }
    }
    for (var key in obj2) {
      if (exclude.indexOf(key) === -1 && result.indexOf(key) === -1) {
        result.push(key);
      }
    }
    return result;
  }

  $.fn.tween = function (properties, properties2, duration) {
    console.log('tween',properties, properties2, duration)
    let _this = this,
      ease = "linear",
      delay = 0,
      stepI = 0,
     startProperties = {},goProperties={},
      onComplete = function () {},
      keys = [];
    let attrs = {},attrStart = 0,attrEnd = 0;

    if (!duration) {
      duration = properties2;
      goProperties = properties;

      keys = getKeys(properties);
      for(let i in keys) {
        if(keys[i] == "scrollTop") {
          startProperties[keys[i]] =_this.scrollTop();
        }else{
          startProperties[keys[i]] = $(_this).css(getTransformKey(keys[i]))||0;
        }
      }
       
    } else {
      startProperties = properties;
      goProperties = properties2;
      keys = getKeys(properties,properties2);

      let cssValues = {};

      for (let i in keys) {
        let key = keys[i];
        let val=startProperties[key]||0;
        if (key == "scrollTop") {
          _this.scrollTop(val);
        } else {
          cssValues[key] = val;
        }
        startProperties[key] = val;
        this.css(cssValues);
      }
    }
    if (goProperties.ease) ease = goProperties.ease;
    if (goProperties.delay) delay = goProperties.delay;
    if (goProperties.onComplete) onComplete = goProperties.onComplete;
    if (goProperties.callback) onComplete = goProperties.callback;

    if (duration > 100) duration = duration / 1000;
      let stepNum = Math.floor(duration * 60);

      if (stepNum < 1)  stepNum = 1;

    for (let key in goProperties) {
      if(key=='ease'||key=='delay'||key=='onComplete')continue;


        attrs[key] = [];
        if (key == "scrollTop") {
          attrStart = startProperties.scrollTop;
          attrEnd = goProperties.scrollTop;
        } else {
          //css属性
          if (_attrs.indexOf(key) > 0) {
            attrStart = startProperties[key].toString().replace(getTransformUnit(key), "");
            attrEnd = goProperties[key].toString().replace(getTransformUnit(key), "");
          } else {
            //console.log(key,startProperties,startProperties[key])
            attrStart = startProperties[key].toString().replace(getTransformUnit(key), "");
            attrEnd = goProperties[key].toString().replace(getTransformUnit(key), "");
          }
          //console.log(key,attrStart,attrEnd)
        }
        for (let i = 0; i < stepNum - 1; i++) {
          attrs[key].push(easeFun(ease, attrStart, attrEnd, stepNum, i));
        }
   
   
        attrs[key].push(attrEnd);
      }
      

    function update(stepI) {
      reqAnimationFrame(function () {
        for (let key in goProperties) {
           if(key=='ease'||key=='delay'||key=='onComplete')continue;
          //key=key.toLowerCase()
          if (key == "scrollTop") {
            _this.scrollTop(attrs[key][stepI]);
          } else {
           
            if (_attrs.indexOf(key) > 0) {
              let trans = getElementTransforms(_this[0]);
              trans[getTransformKey(key)] =
                attrs[key][stepI] + getTransformUnit(key);
              _this.css("transform", cssTransformObject2String(trans));
            } else {
               if (key == "autoAlpha") {
                 attrs[key][stepI] == 0? _this.css("visibility", "hidden"): _this.css("visibility", "visible");
                 nkey = "opacity";
               } else {
                 nkey = key;
               }
              //console.log(stepI,key,attrs[key],attrs[key][stepI])
              _this.css(nkey, attrs[key][stepI]);
            }
          }
        }
        if (stepI < stepNum - 1) {
          stepI++;
          update(stepI);
        } else {
          onComplete();
        }
      });
    }
    delay
      ? setTimeout(function () {
          update(0);
        }, delay * 1000)
      : update(0);
  };

  var origShow = $.fn.show,
    origHide = $.fn.hide,
    origToggle = $.fn.toggle;

  function anim(el, speed, opacity, scale, callback) {
    if (typeof speed == "function" && !callback)
      (callback = speed), (speed = undefined);
    var props = { opacity: opacity };
    if (scale) {
      props.scale = scale;
      el.css($.fx.cssPrefix + "transform-origin", "0 0");
    }
    return el.animate(props, speed, null, callback);
  }

  function hide(el, speed, scale, callback) {
    return anim(el, speed, 0, scale, function () {
      origHide.call($(this));
      callback && callback.call(this);
    });
  }

  $.fn.show = function (speed, callback) {
    origShow.call(this);
    if (speed === undefined) speed = 0;
    else this.css("opacity", 0);

    return this.length > 10
      ? this.css({ opacity: 1, display: "block" })
      : anim(this, speed, 1, "1,1", callback);
  };

  $.fn.hide = function (speed, callback) {
    if (speed === undefined) return origHide.call(this);
    else
      return this.length > 10
        ? this.css({ opacity: 0, display: "none" })
        : hide(this, speed, "0,0", callback);
  };

  $.fn.toggle = function (speed, callback) {
    if (speed === undefined || typeof speed == "boolean")
      return origToggle.call(this, speed);
    else
      return this.each(function () {
        var el = $(this);
        el[el.css("display") == "none" ? "show" : "hide"](speed, callback);
      });
  };

  $.fn.fadeTo = function (speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback);
  };

  $.fn.fadeIn = function (speed, callback) {
    var target = this.css("opacity");
    if (target > 0) this.css("opacity", 0);
    else target = 1;
    return origShow.call(this).fadeTo(speed, target, callback);
  };

  $.fn.fadeOut = function (speed, callback) {
    return hide(this, speed, null, callback);
  };

  $.fn.fadeToggle = function (speed, callback) {
    return this.each(function () {
      var el = $(this);
      el[el.css("opacity") == 0 || el.css("display") == "none"
          ? "fadeIn": "fadeOut"
      ](speed, callback);
    });
  };
  $.fn.preAnim = function (props) {
    if (!props) return;
    const $el = $(this);
    for (let key in props) {
      $el.css(getTransformKey(key), $el.css(key));
    }
  };

  testEl = null;
})(Atu);

var penner = (function () {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = {};
  var functionEasings = {
    linear: function () {
      return function (t) {return t;};
    },
    Sine: function () {
      return function (t) {return 1 - Math.cos((t * Math.PI) / 2);};
    },
    Circ: function () {
      return function (t) {return 1 - Math.sqrt(1 - t * t);};
    },
    Back: function () {
      return function (t) {return t * t * (3 * t - 2);};
    },
    Bounce: function () {
      return function (t) {
        var pow2,
          b = 4;
        while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}
        return (
          1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
        );
      };
    },
    Elastic: function (amplitude, period) {
      if (amplitude === void 0) amplitude = 1;
      if (period === void 0) period = 0.5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, 0.1, 2);
      return function (t) {
        return t === 0 || t === 1
          ? t
          : -a *
              Math.pow(2, 10 * (t - 1)) *
              Math.sin(
                ((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) *
                  (Math.PI * 2)) /
                  p,
              );
      };
    },
  };

  var baseEasings = ["Quad", "Cubic", "Quart", "Quint", "Expo"];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () {
      return function (t) {
        return Math.pow(t, i + 2);
      };
    };
  });

  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases[name] = easeIn;
    eases[name + "In"] = eases[name + "easeIn"] = easeIn;
    eases[name + "Out"] = eases[name + "easeOut"] = function (a, b) {
      return function (t) {
        return 1 - easeIn(a, b)(1 - t);
      };
    };
    eases[name + "InOut"] = eases[name + "easeInOut"] = function (a, b) {
      return function (t) {
        return t < 0.5
          ? easeIn(a, b)(t * 2) / 2
          : 1 - easeIn(a, b)(t * -2 + 2) / 2;
      };
    };
    eases[name + "OutIn"] = function (a, b) {
      return function (t) {
        return t < 0.5
          ? (1 - easeIn(a, b)(1 - t * 2)) / 2
          : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
      };
    };
  });
  return eases;
})();
function cssEase(ease) {
  if (!ease) ease = "linear";
  switch (ease) {
    case "linear": return "cubic-bezier(0.0, 0.0, 1.0, 1.0)";
    case "QuadIn": return "cubic-bezier(0.11, 0.00, 0.90, 0.35)";
    case "QuadOut": return "cubic-bezier(0.10, 0.65, 0.35, 0.90)";
    case "QuadInOut": return "cubic-bezier(0.45, 0.00, 0.55, 1.00)";

    case "CubicIn": return "cubic-bezier(0.32, 0.00, 0.68, 0.00)";
    case "CubicOut": return "cubic-bezier(0.32, 1.00, 0.68, 1.00)";
    case "CubicInOut": return "cubic-bezier(0.65, 0.00, 0.35, 1.00)";
    case "QuartIn": return "cubic-bezier(0.50, 0.00, 0.75, 0.00)";

    case "QuartOut": return "cubic-bezier(0.25, 1.00, 0.50, 1.00)";
    case "QuartInOut": return "cubic-bezier(0.75, 0.00, 0.25, 1.00)";

    // Quint
    case "QuintIn": return "cubic-bezier(0.64, 0.00, 0.78, 0.00)";
    case "QuintOut": return "cubic-bezier(0.22, 1.00, 0.36, 1.00)";
    case "QuintInOut": return "cubic-bezier(0.83, 0.00, 0.17, 1.00)";

    // Expo
    case "ExpoIn": return "cubic-bezier(0.70, 0.00, 0.84, 0.00)";
    case "ExpoOut": return "cubic-bezier(0.16, 1.00, 0.30, 1.00)";
    case "ExpoInOut": return "cubic-bezier(0.86, 0.00, 0.14, 1.00)";

    // Sine
    case "SineIn": return "cubic-bezier(0.12, 0.00, 0.39, 0.00)";
    case "SineOut": return "cubic-bezier(0.61, 1.00, 0.88, 1.00)";
    case "SineInOut": return "cubic-bezier(0.37, 0.00, 0.63, 1.00)";

    // Circ
    case "CircIn": return "cubic-bezier(0.55, 0.00, 1.00, 0.45)";
    case "CircOut": return "cubic-bezier(0.00, 0.55, 0.45, 1.00)";
    case "CircInOut": return "cubic-bezier(0.85, 0.00, 0.15, 1.00)";

    // Back (标准安全值)
    case "BackIn": return "cubic-bezier(0.36, 0.00, 0.66, -0.56)";
    case "BackOut": return "cubic-bezier(0.34, 1.56, 0.64, 1.00)";
    case "BackInOut": return "cubic-bezier(0.68, -0.55, 0.27, 1.55)";

    default:  return ease;
  }
}

function easeFun(ease, s, e, d, t) {
  //s startVal,e endVal,d step t stepI 0~step
  ease = !ease ? "linear" : ease.replace(".ease", "ease");

  let a = t / d,
    b = s * 1,
    c = e - s;

  if (ease in penner) {
    return b + c * penner[ease]()(a);
  } else {
    return b + c * a;
  }
}
function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
function cssString2Object(cssString) {
  const cssObject = {};
  const cssProperties = cssString.split(";");
  cssProperties.forEach((property) => {
    if (property.trim() !== "") {
      const [key, value] = property.split(":");
      cssObject[key.trim()] = value.trim();
    }
  });
  return cssObject;
}
function cssObject2String(obj) {
  let cssString = "";
  for (let key in obj) {
    cssString += key + ":" + obj[key] + ";";
  }
  return cssString;
}
function cssTransformObject2String(transforms) {
  let str = "";
  for (let key in transforms) {
    str += key + "(" + transforms[key] + ") ";
  }
  return str.trim();
}
function getTransformKey(key) {
  let nkey = key;
  if (nkey == "x") {
    nkey = "translateX";
  }
  if (nkey == "y") {
    nkey = "translateY";
  }
  if (nkey == "z") {
    nkey = "translateZ";
  }
  if (nkey == "autoAlpha") {
    nkey = "opacity";
  }
  
  return nkey;
}
function getTransformUnit(key) {
  if (key == "scale" || key == "scaleX" || key == "scaleY" || key == "scaleZ") return "";
  return key == "rotate" ||key == "rotateX" ||key == "rotateY" ||key == "rotateZ"? "deg": "px";
}
const TRANSFORM_REG = /(\w+)\(([^)]*)\)/g;
function getElementTransforms(el) {
  var str = el.style.transform || el.style.webkitTransform || "";
  var transforms = {};
  var m;
  while ((m = TRANSFORM_REG.exec(str))) {
    transforms[m[1]] = m[2];
  }
  return transforms;
}

var Tween = {};
Tween.to = function (el, duration, properties) {
  $(el).tween(properties, duration);
};
Tween.fromTo = function (el, duration, properties, properties2) {
   $(el).tween(properties,properties2, duration );
};

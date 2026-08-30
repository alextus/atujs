(function ($) {
  let jsonpID = 0
  const  document = window.document,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = "application/json",
    htmlType = "text/html",
    blankRE = /^\s*$/,
    originAnchor = document.createElement("a"),
    encode = encodeURIComponent;

  originAnchor.href = window.location.href;

  function triggerAndReturn(context, eventName, data) {
    let event = $.Event(eventName);
    $(context).trigger(event, data);
    return !event.isDefaultPrevented();
  }

  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global)
      return triggerAndReturn(context || document, eventName, data);
  }
  $.active = 0;

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0)
      triggerGlobal(settings, null, "ajaxStart");
  }

  function ajaxStop(settings) {
    if (settings.global && !--$.active)
      triggerGlobal(settings, null, "ajaxStop");
  }

  function ajaxBeforeSend(xhr, settings) {
    let context = settings.context;
    if (
      settings.beforeSend.call(context, xhr, settings) === false ||
      triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) ===
        false
    )
      return false;

    triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
  }

  function ajaxSuccess(data, xhr, settings, deferred) {
    let context = settings.context,
      status = "success";
    settings.success.call(context, data, status, xhr);
    deferred && deferred.resolveWith(context, [data, status, xhr]);
    triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
    ajaxComplete(status, xhr, settings);
  }

  function ajaxError(error, type, xhr, settings, deferred) {
    let context = settings.context;
    settings.error.call(context, xhr, type, error);
    deferred && deferred.rejectWith(context, [xhr, type, error]);
    triggerGlobal(settings, context, "ajaxError", [
      xhr,
      settings,
      error || type,
    ]);
    ajaxComplete(type, xhr, settings);
  }

  function ajaxComplete(status, xhr, settings) {
    let context = settings.context;
    settings.complete.call(context, xhr, status);
    triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
    ajaxStop(settings);
  }

  function empty() {}

  $.ajaxJSONP = function (options, deferred) {
    if (!("type" in options)) return $.ajax(options);

    let _callbackName = options.jsonpCallback,
      callbackName =
        ($.isFunction(_callbackName) ? _callbackName() : _callbackName) ||
        "jsonp" + ++jsonpID,
      script = document.createElement("script"),
      originalCallback = window[callbackName],
      responseData,
      abort = function (errorType) {
        $(script).triggerHandler("error", errorType || "abort");
      },
      xhr = { abort: abort },
      abortTimeout;

    deferred && deferred.promise(xhr);

    $(script).on("load error", function (e, errorType) {
      clearTimeout(abortTimeout);
      $(script).off().remove();
      try { delete window[callbackName]; } catch (e) {}

      if (e.type == "error" || !responseData) {
        ajaxError(null, errorType || "error", xhr, options, deferred);
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred);
      }

      window[callbackName] = originalCallback;
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0]);

      originalCallback = responseData = undefined;
    });

    if (ajaxBeforeSend(xhr, options) === false) {
      abort("abort");
      return xhr;
    }

    window[callbackName] = function () {
      responseData = arguments;
    };
    script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName);
    document.head.appendChild(script);

    if (options.timeout > 0)
      abortTimeout = setTimeout(function () {
        abort("timeout");
      }, options.timeout);

    return xhr;
  };

  $.ajaxSettings = {
    type: "GET",
    beforeSend: empty,
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    global: true,
    xhr: function () {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script:
        "text/javascript, application/javascript, application/x-javascript",
      json: jsonType,
      xml: "application/xml, text/xml",
      html: htmlType,
      text: "text/plain",
    },
    crossDomain: false,
    timeout: 0,
    processData: true,
    cache: true,
  };

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(";", 2)[0];
    return (
      (mime &&
        (mime == htmlType
          ? "html"
          : mime == jsonType
          ? "json"
          : scriptTypeRE.test(mime)
          ? "script"
          : xmlTypeRE.test(mime) && "xml")) ||
      "text"
    );
  }

  function appendQuery(url, query) {
    if (query == "") return url;
    return (url + "&" + query).replace(/[&?]{1,2}/, "?");
  }

  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional);
    if (options.data && (!options.type || options.type.toUpperCase() == "GET"))
      (options.url = appendQuery(options.url, options.data)),
        (options.data = undefined);
  }

  $.ajax = function (options) {
    let settings = $.extend({}, options || {}),
      deferred = $.Deferred && $.Deferred(),
      urlAnchor;
    for (let key in $.ajaxSettings)
      if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];

    ajaxStart(settings);

    if (!settings.crossDomain) {
      urlAnchor = document.createElement("a");
      urlAnchor.href = settings.url;
      settings.crossDomain = originAnchor.origin !== urlAnchor.origin;
    }

    if (!settings.url) settings.url = window.location.toString();
    serializeData(settings);

    let dataType = settings.dataType,
      hasPlaceholder = /\?.+=\?/.test(settings.url);
    if (hasPlaceholder) dataType = "jsonp";

    if (
      settings.cache === false ||
      ((!options || options.cache !== true) &&
        ("script" == dataType || "jsonp" == dataType))
    )
      settings.url = appendQuery(settings.url, "_=" + Date.now());

    if ("jsonp" == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(
          settings.url,
          settings.jsonp
            ? settings.jsonp + "=?"
            : settings.jsonp === false
            ? ""
            : "callback=?",
        );
      return $.ajaxJSONP(settings, deferred);
    }

    let mime = settings.accepts[dataType],headers = {},
      setHeader = function (name, value) {
        let key = name.toLowerCase();
        if (!headers[key]) {
          headers[key] = [name, value];
        } else {
          headers[key][1] += ", " + value; 
        }
      },
      protocol = /^([\w-]+:)\/\//.test(settings.url)? RegExp.$1: window.location.protocol,
      xhr = settings.xhr(),
      nativeSetHeader = xhr.setRequestHeader,
      abortTimeout;

    deferred && deferred.promise(xhr);

    if (!settings.crossDomain) setHeader("X-Requested-With", "XMLHttpRequest");
    setHeader("Accept", mime || "*/*");
    if ((mime = settings.mimeType || mime)) {
      if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
      xhr.overrideMimeType && xhr.overrideMimeType(mime);
    }
    if (
      settings.contentType ||
      (settings.contentType !== false &&
        settings.data &&
        settings.type.toUpperCase() != "GET")
    )
      setHeader(
        "Content-Type",
        settings.contentType || "application/x-www-form-urlencoded",
      );

    if (settings.headers)
      for (let name in settings.headers) setHeader(name, settings.headers[name]);
    xhr.setRequestHeader = setHeader;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout);
        let result,
          error = false;
        if (
          (xhr.status >= 200 && xhr.status < 300) ||
          xhr.status === 304 ||
          (xhr.status === 0 && protocol == "file:")
        ) {
          dataType =dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type"));
          result = xhr.responseText;

          try {
            if (dataType == "script") (1, eval)(result);
            else if (dataType == "xml") result = xhr.responseXML;
            else if (dataType == "json"){
              if (blankRE.test(result)) {
                result = null;
              } else {
                try {
                  result = JSON.parse(result);
                } catch (e) {
                  result = null; 
                }
              }
            }
          } catch (e) {
            error = e;
          }

          if (error) ajaxError(error, "parsererror", xhr, settings, deferred);
          else ajaxSuccess(result, xhr, settings, deferred);
        } else {
          ajaxError(xhr.statusText || null,xhr.status ? "error" : "abort",xhr,settings,deferred);
        }
      }
    };

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort();
      ajaxError(null, "abort", xhr, settings, deferred);
      return xhr;
    }

    if (settings.xhrFields)
      for (let name in settings.xhrFields) xhr[name] = settings.xhrFields[name];

    let async = "async" in settings ? settings.async : true;
    xhr.open(settings.type,settings.url,async,settings.username,settings.password);

    for (let name in headers) nativeSetHeader.apply(xhr, headers[name]);

    if (settings.timeout > 0)
      abortTimeout = setTimeout(function () {
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, "timeout", xhr, settings, deferred)
      }, settings.timeout);

    xhr.send(settings.data ? settings.data : null);
    return xhr;
  };

  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data))
      (dataType = success), (success = data), (data = undefined);
    if (!$.isFunction(success)) (dataType = success), (success = undefined);
    return {url: url,data: data,success: success,dataType: dataType,};
  }

  $.get = function (/* url, data, success, dataType */) {
    return $.ajax(parseArguments.apply(null, arguments));
  };

  $.post = function (/* url, data, success, dataType */) {
    let options = parseArguments.apply(null, arguments);
    options.type = "POST";
    return $.ajax(options);
  };

  $.getJSON = function (/* url, data, success */) {
    let options = parseArguments.apply(null, arguments);
    options.dataType = "json";
    return $.ajax(options);
  };

  $.fn.load = function (url, data, success) {
    if (!this.length) return this;
    let self = this,parts = url.split(/\s/),selector,
      options = parseArguments(url, data, success),
      callback = options.success;
    if (parts.length > 1) (options.url = parts[0]), (selector = parts[1]);
    options.success = function (response) {
      self.html(selector? $("<div>").html(response.replace(rscript, "")).find(selector): response,);
      callback && callback.apply(self, arguments);
    };
    $.ajax(options);
    return this;
  };
})(Atu);

(function ($) {
  function serialize(params, obj, traditional, scope) {
    let type,
      array = $.isArray(obj),
      hash = $.isPlainObject(obj);
    $.each(obj, function (key, value) {
      type = $.type(value);
      if (scope)
        key = traditional? scope: scope +"[" +(hash || type == "object" || type == "array" ? key : "") +"]";
      if (!scope && array) params.add(value.name, value.value);
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key);
      else params.add(key, value);
    });
  }

  $.param = function (obj, traditional) {
    let params = [];
    params.add = function (key, value) {
      if ($.isFunction(value)) value = value();
      if (value == null) value = "";
      this.push(encode(key) + "=" + encode(value));
    };
    serialize(params, obj, traditional);
    return params.join("&").replace(/%20/g, "+");
  };

  $.Deferred = function () {
    let state = "pending",resolveCtx,rejectCtx,resolveArgs,rejectArgs;
    const doneList = [],failList = [],finallyList = [],deferred = {};
    function _handler(list, checkState) {
      return function (fn) {
        if (typeof fn !== "function") return this;
        list.push(fn);
        if (state === checkState ||(checkState === "any" && state !== "pending")) {
          state === "resolved"?fn.apply(resolveCtx, resolveArgs):fn.apply(rejectCtx, rejectArgs); 
        }
        return this;
      };
    }
    deferred.done = _handler(doneList, "resolved");
    deferred.fail = _handler(failList, "rejected");
    deferred.finally = _handler(finallyList, "any");
    deferred.catch = deferred.fail;
    deferred.then = function (onSuccess, onFail) {
      const newDefer = $.Deferred();
      function handle(callback, isSuccess) {
        return function () {
          try {
            const err = arguments[2] || arguments[1];

            if (isSuccess) {
              if (typeof callback !== "function") {
                return newDefer.resolveWith(this, arguments);
              }
              const res = callback.apply(this, arguments);
              console.log("res", res, isSuccess);
              if (res && typeof res.promise === "function") {
                res.promise().done(newDefer.resolve).fail(newDefer.reject);
              } else {
                newDefer.resolveWith(this, [res]);
              }
            } else {
              console.log("catch2,", err);
              newDefer.rejectWith(this, [err]);
            }
          } catch (e) {
            console.log("catch1,", e);
            newDefer.rejectWith(newDefer, [e]);
          }
        };
      }
      this.done(handle(onSuccess, true));
      this.fail(handle(onFail, false));
      return newDefer.promise();
    };
    function triggerFinal(stateName, callbackList, context, args) {
      if (state !== "pending") return;
      state = stateName;
      if (stateName === "resolved") {
        resolveCtx = context;
        resolveArgs = args;
      } else {
        rejectCtx = context;
        rejectArgs = args;
      }
      callbackList.forEach((f) => f.apply(context, args));
      finallyList.forEach((f) => f.apply(context, args));
    }
    deferred.resolveWith = function (context, args) {
      triggerFinal("resolved", doneList, context, args);
    };
    deferred.rejectWith = function (context, args) {
      triggerFinal("rejected", failList, context, args);
    };
    deferred.resolve = function () {
      return this.resolveWith(this, arguments);
    };
    deferred.reject = function () {
      return this.rejectWith(this, arguments);
    };
    deferred.promise = function (obj) {
      const p = obj || {};
      p.done = deferred.done;
      p.fail = deferred.fail;
      p.then = deferred.then;
      p.catch = deferred.catch;
      p.finally = deferred.finally;
      return p;
    };
    return deferred;
  };
})(Atu);
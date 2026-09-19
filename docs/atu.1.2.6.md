# build/atu.1.2.6.js 说明文档

> 本文描述的是 **构建产物** `build/atu.1.2.6.js`。
> 源码在 `src/`，**不要直接编辑 `build/` 下的任何文件**，改源码后跑 `gulp` 重新生成。

---

## 1. 文件身份

| 项 | 值 |
| --- | --- |
| 文件名 | `atu.1.2.6.js`（3 段版本号） |
| 文件头声明版本 | `v1.2.6.7`（文件第 18 行） |
| 构建日期 | 2026.09.12 |
| 体积 / 行数 | 约 77 KB / 20 行 |
| 压缩方式 | uglify，`mangle:false` + `compress:false`（变量名保留，但压成超长行，不便阅读调试） |
| 语法 | ES6（未经过 Babel） |
| 生成命令 | `gulp`（即 `gulp.task('default')`） |

### 两套版本号（3 段别名机制）

`version.txt` 存 4 段版本（当前 `1.2.6.7`），`shortVersion` 取前 3 段（`1.2.6`）。
`default` 构建时会先 +1，生成 4 段文件 `atu.1.2.6.7.js`，再用同一份内容覆盖 3 段别名 `atu.1.2.6.js`。

因此：

- `atu.1.2.6.js` 是滚动更新的别名，永远指向最新一次构建；
- 它内部的文件头仍写着 `version:v1.2.6.7`，文件名版本与文件头版本不一致是设计使然，不是错误；
- 需要锁定版本时请引用 4 段文件名，不要用 3 段别名。

### 同一次构建产出的 8 个文件

| 文件 | 说明 |
| --- | --- |
| `atu.1.2.6.7.js` | 4 段，ES6，未压缩 |
| `atu.1.2.6.7.min.js` | 4 段，ES6，压缩 |
| `atu.1.2.6.7.es5.js` | 4 段，Babel 转 ES5，未压缩 |
| `atu.1.2.6.7.es5.min.js` | 4 段，Babel 转 ES5，压缩 |
| `atu.1.2.6.js` | 本文文件，第 1 项的 3 段别名 |
| `atu.1.2.6.min.js` | 第 2 项的 3 段别名 |
| `atu.1.2.6.es5.js` | 第 3 项的 3 段别名 |
| `atu.1.2.6.es5.min.js` | 第 4 项的 3 段别名 |

其中 `atu.1.2.6.js` 与 `atu.1.2.6.min.js` 会在构建结束后被自动复制到站点目录 `../atui/js/`（`copyTask`）。

---

## 2. 源码构成

产物 = 以下 7 个文件按顺序 concat 而成（`gulpfile.js` 的 `paths.scripts`）：

| # | 源文件 | 职责 |
| --- | --- | --- |
| 1 | `src/atu.js` | 核心：选择器、DOM 遍历与操作、属性、样式、尺寸（Zepto 风格） |
| 2 | `src/event.js` | 事件绑定/解绑/委托、手势（滑动、长按、滚动停止） |
| 3 | `src/ajax.js` | XHR、JSONP、快捷请求方法 |
| 4 | `src/animate.js` | CSS 动画、Tween 补间 |
| 5 | `src/loadFile.js` | 按扩展名加载 img / css / js |
| 6 | `src/message.js` | tip / alert / loading 弹层 |
| 7 | `src/common.js` | 浏览器环境判断、时间日期、存储、业务扩展 `Atu.*` |

**不在这个产物里**的文件（需单独引入，由 `gulp build:atu` 生成到 `build/atu/`）：

- `src/plugin/` 下的 `tabSwitch.js`、`upload.js`、`markdown.js`、`anime.js`、`chinese.js`、`data.bank.js`、`autoheight.js`
- `src/es.polyfill.js`

---

## 3. 全局导出

`src/atu.js` 末尾的导出语句：

```js
window.Atu = window.jQuery = Atu
window.$ === undefined && (window.$ = Atu);
```

- `window.Atu`：核心对象，既是函数（可直接 `Atu('div')`）也是命名空间。
- `window.jQuery`：无条件赋值为 `Atu`。
- `window.$`：仅当未被占用时才赋值。若页面已引入其它库占用了 `$`，Atu 不会覆盖它，此时请用 `Atu` 调用。
- `$.atu`：内部工具集（`matches` / `qsa` / `fragment` / `Z` / `uniq` / `deserializeValue` 等）。

此外 `src/common.js` 会在 `window` 上直接挂一批全局函数与常量（见 4.8 / 4.9 / 4.12）。

---

## 4. API 参考

> `$` 与 `Atu` 是同一个对象，下文统一写作 `$`。

### 4.1 静态工具方法

| 方法 | 说明 |
| --- | --- |
| `$.extend(target, ...)` | 合并对象到 target |
| `$.parseJSON(str)` | `JSON.parse` 的别名，仅当 `window.JSON` 存在时挂载 |
| `$.contains(parent, node)` | 判断节点包含关系 |
| `$.type(obj)` | 类型判断 |
| `$.isFunction` `$.isWindow` `$.isArray` `$.isPlainObject` `$.isEmptyObject` `$.isNumber` `$.isString` | 各类类型判断 |
| `$.isTel` `$.isMobile` `$.isUrl` `$.isEmail` `$.isIdcard` `$.isQQ` | 格式校验：固话 / 手机 / URL / 邮箱 / 身份证 / QQ。`$.isIdcard`（`src/atu.js:306`）已是真正的 18 位校验（含校验位），但 `build/atu.1.2.6.js` 是旧构建、仍是错误正则，详见第 6 节第 10 条 |
| `$.inArray(elem, array, i)` | 返回索引，未找到返回 -1 |
| `$.param(obj, traditional)` | 序列化为查询字符串，定义在 `src/ajax.js` |
| `$.Deferred()` | 轻量 Promise（done / fail / then / catch / finally / promise），定义在 `src/ajax.js`，`$.ajax` 内部使用 |
| `$.camelCase(str)` | 中划线转驼峰 |
| `$.trim(str)` | 去除首尾空格 |
| `$.map` `$.each` `$.grep` | 映射 / 遍历 / 过滤 |
| `$.debug` | 调试开关，默认 0 |
| `$.log(...)` | 调试日志输出，配合 `$.debug` |
| `$.atu` | 内部工具集 |

### 4.2 实例方法（DOM，挂在 `$.fn`）

**集合与遍历**：`map` `slice` `get` `toArray` `size` `each` `filter` `add` `not` `has` `eq` `first` `last` `index` `pluck`

**查找**：`find` `closest` `parent` `parents` `children` `contents` `siblings` `prev` `next`

**文档结构修改**：`append` `prepend` `after` `before` `empty` `remove` `clone` `replaceWith` `wrap` `wrapAll` `wrapInner` `unwrap`

**属性与内容**：`attr` `removeAttr` `prop` `removeProp` `data` `val` `html` `htmls` `outHtml` `text`

**样式与尺寸**：`css` `styleValue` `width` `height` `innerWidth` `innerHeight` `outerWidth` `outerHeight` `originWidth` `originHeight` `offset` `position` `offsetParent` `scale` `autoHeight`

尺寸方法由 `['width','height']` 循环动态生成，语义与标准 Zepto 有差异，注意以下几点：

- `width()` / `height()` 取值走 `offset()`，即 `offsetWidth` / `offsetHeight`（**含 padding 与 border**），不是 content-box；元素 `display:none` 时会临时 `show()` 测量再 `hide()`。
- `innerWidth()` / `innerHeight()` = `width()` 减去两侧 padding。
- `outerWidth()` / `outerHeight()` = 原生 `offsetWidth` / `offsetHeight`（含 padding 与 border，不受 transform 影响）；**只有传 `true` 才会再加 margin**。
- `originWidth()` / `originHeight()` = 克隆节点、以 `display:block` 插入 body 后测量，用于取隐藏或变形元素的原始尺寸。

**显隐**：`show` `hide` `toggle` `isVisible`

> `show` / `hide` / `toggle` 会被 `animate.js` 覆盖，支持传入速度参数做动画（见 4.5）。

**滚动**：`scrollTop(value)` `scrollLeft(value)`

**就绪**：`ready(callback)`

### 4.3 事件（`src/event.js`）

| 方法 | 说明 |
| --- | --- |
| `$(el).on(event, selector, data, callback, one)` | 绑定，支持委托 |
| `$(el).off(event, selector, callback)` | 解绑 |
| `bind` `unbind` `one` | 传统绑定方式 |
| `delegate` `undelegate` `live` `die` | 事件委托，含旧式别名 |
| `trigger(event, args)` `triggerHandler(event, args)` | 手动触发 |
| `change()` | 触发 change |
| `touch(fn)` `touchmove(fn)` `touchend(fn)` | 绑定触摸或鼠标对应事件 |
| `touchLeft(fn)` `touchRight(fn)` `touchUp(fn)` `touchDown(fn)` | 滑动手势识别 |
| `longPress(fn, trsTime)` | 长按监听，trsTime 为阈值 |
| `scrollEnd(fn)` | 滚动停止监听 |
| `$.proxy(fn, context)` | 绑定 this |
| `$.Event(type, props)` | 构造事件对象 |
| `$.event.add` `$.event.remove` | 底层事件注册入口 |

### 4.4 Ajax（`src/ajax.js`）

| 方法 | 说明 |
| --- | --- |
| `$.ajax(options)` | 完整请求 |
| `$.get(url, data, success, dataType)` | GET 快捷方法 |
| `$.post(url, data, success, dataType)` | POST 快捷方法 |
| `$.getJSON(url, data, success)` | 取 JSON |
| `$.ajaxJSONP(options, deferred)` | JSONP |
| `$(el).load(url, data, success)` | 加载 HTML 并注入元素 |
| `$.ajaxSettings` | 全局默认配置 |
| `$.active` | 当前活跃请求数 |

`$.ajaxSettings` 默认值：type 为 GET，beforeSend / success / error / complete 为空函数，context 为 null，global 为 true，xhr 返回 `new XMLHttpRequest()`，accepts 含 script / json / xml / html / text，crossDomain 为 false，timeout 为 0，processData 为 true，cache 为 true。

### 4.5 动画与补间（`src/animate.js`）

| 方法 | 说明 |
| --- | --- |
| `$(el).animate(properties, duration, ease, callback, delay)` | CSS 属性动画 |
| `$(el).animateTo(properties, duration, ease, callback, delay)` | 动画到目标值 |
| `$(el).animateFrom(properties, duration, ease, callback, delay)` | 从起始值动画 |
| `$(el).anim(properties, duration, ease, callback, delay)` | 动画别名 |
| `$(el).tween(properties, properties2, duration)` | 补间，支持 from 到 to |
| `$(el).preAnim(props)` | 动画预处理 |
| `$(el).show(speed, callback)` `hide` `toggle` | 覆盖核心显隐，带动画 |
| `$(el).fadeTo(speed, opacity, callback)` | 过渡到指定透明度 |
| `$(el).fadeIn(speed, callback)` `fadeOut` `fadeToggle` | 渐显渐隐 |
| `Tween.to(el, duration, properties)` | 全局补间 |
| `Tween.fromTo(el, duration, properties, properties2)` | 全局补间，from 到 to |

ease 支持 CSS cubic-bezier 字符串，例如：

```js
$('#box').animate({ width: 200, opacity: 0.5 }, 1200, 'cubic-bezier(0.68, -0.55, 0.27, 1.55)')
```

### 4.6 资源加载（`src/loadFile.js`）

```js
$.loadFile(files, options)   // files 可为字符串或数组
```

按扩展名自动分派：jpg / jpeg / png / gif 走 Image 预载，css 插入 link 标签，js 插入 script 标签；已存在同 URL 的节点会跳过重复插入。
options 会与 `$.fn.loadFile.defaults` 合并，直接传函数等价于传 all 回调。

### 4.7 弹层（`src/message.js`）

| 方法 | 说明 |
| --- | --- |
| `$.tip(msg)` | 轻提示，2 秒后自动清空隐藏 |
| `$.alert(msg, tag1, fun1, tag2, fun2)` | 确认框 |
| `$.showLoading(msg)` | 显示 loading，msg 默认为空 |
| `$.hideLoading()` | 隐藏 loading |

`$.alert` 参数灵活，三种写法都支持：

```js
$.alert('内容', '确定', fn)                                   // 位置参数
$.alert('内容', { content, ok, cancel, oktxt, canceltxt })     // 对象参数
$.alert('内容', fn1, fn2)                                      // 两个回调，自动补确定与取消
```

> 弹层依赖 `atu.css` 中的 `.tipBox` / `.alertBox` 样式，单独引 JS 不会有效果。
> 这两个方法挂在 `Atu` 上，因为 `$` 与 `Atu` 同对象，写作 `$.tip` 等价。

### 4.8 环境判断（`src/common.js`，全局）

| 名称 | 说明 |
| --- | --- |
| `browser` | 浏览器与内核对象：ua、ie、opera、webKit、mac、edge、gecko、mobile、ios、SymbianOS、WindowsPhone、weixin、quirks、language，以及派生出的 type、engine |
| `isWeixin` / `is_weixin` | 是否微信内置浏览器 |
| `isPc` / `is_pc` | 是否 PC |
| `isMob` / `is_mob` | 是否移动端，等于非 isPc |
| `isLocal` / `is_local` | 是否 localhost |
| `system` | 操作系统：win、mac、linux、xll、ipad，以及 type |
| `is` 系列 | 对 presto、chrome、safari、firefox、android、linux、iPhone、iPad、iPod、alipay、xiaomi、redmi、vivo、oppo、honor、huawei、weibo、eleme、qq 逐个生成，如 isChrome、is_weibo |
| `touch` / `touchmove` / `touchend` | 事件名常量，触屏设备为 touchstart / touchmove / touchend，否则为 mousedown / mousemove / mouseup |

### 4.9 时间日期（全局函数）

`timestamp(t)` `newDate(t)` `year(t)` `month(t)` `week(t)` `day(t)` `hour(t)` `now(t)`

`getTime2Time(t)` `getLeftTime(endTime)` `getPassTime(startTime)` `format(time)`

`Alexdate(t, split)` `FormatNum(num, weishu)`

### 4.10 存储（全局函数）

| 函数 | 说明 |
| --- | --- |
| `getData(name)` / `setData(name, value)` | localStorage 读写 |
| `getCookie(name)` / `setCookie(name, value)` / `delCookie(name)` | Cookie 读写删 |
| `localStorageSupported()` | 检测 localStorage 可用性 |

### 4.11 业务扩展 `Atu.*`（`src/common.js`）

| 方法 | 说明 |
| --- | --- |
| `Atu.ini()` | 初始化 |
| `Atu.iniUser(callback, callback2)` | 初始化用户信息 |
| `Atu.act(act, u, callback)` | 行为上报，别名 `Atu.sendDataBack` 与 `Atu.sendMsgBack`，三者同一函数 |
| `Atu.iniWx(s)` | 微信 JS-SDK 初始化，内置 jsApiList |
| `Atu.iniShare(s)` | 分享配置 |
| `Atu.iniClick(site)` | 点击统计初始化 |
| `Atu.addClick(str)` | 点击上报 |
| `Atu.openid` | 由 iniUser 写入的 openid |

### 4.12 其它全局工具函数

| 函数 | 说明 |
| --- | --- |
| `trim(str)` | 去空格，与 `$.trim` 并存 |
| `get(sProp)` | 取 URL 查询参数 |
| `capitalizeFirstLetter(str)` | 首字母大写 |
| `getXY(e)` | 取事件或元素坐标 |
| `newImg(src)` | 创建图片对象 |
| `urlencode(url)` / `urldecode(url)` | URL 编解码 |
| `getEvtUrl()` | 取事件相关 URL |
| `convertCanvasToImage(o)` / `convertCanvasToImgData(o)` | Canvas 转换 |
| `e(element)` / `at(id)` / `ce(tagName)` | 取元素 / 按 id 取 / 创建元素 |
| `copy(txt)` | 复制文本到剪贴板 |
| `download(url, name)` | 触发下载 |
| `click(node)` | 模拟点击 |
| `arrRand(arr)` / `RandArr(arr)` | 数组乱序，返回打乱后的**新数组**，不改动原数组 |
| `arrRemove(array, o)` / `arrDelete(array, o)` | 从数组移除，同样是返回新数组，不影响原数组 |

### 4.13 内部可引用函数（`src/atu.js` 闭包私有工具）

`src/atu.js` 的 `var Atu = (function () { ... })()` 里还定义了一批**没有暴露到 `window`** 的工具函数。它们是给 `src/atu.js` 自己用的——`$.fn` 上的方法、`atu.*`、以及所有内部函数都在同一个闭包里，可以直接写裸名调用。

例如 `src/atu.js:792` 的 `scale` 里就直接用：

```js
scale: function () {
  ...
  isString(arguments[1]) ? pxy = arguments[1] : i2 = 1;
```

#### 三级作用域

| 使用场景 | 能怎么写 |
| --- | --- |
| `src/atu.js` 闭包内（含 `$.fn` 上所有方法、所有内部函数） | `isString(x)` 直接裸名调用 |
| 其它 src 文件（`event.js` / `ajax.js` / `animate.js` …） | 只能 `$.isString(x)`，且仅限已挂到 `$` 上的；其余需在该文件 IIFE 内自行定义 |
| 页面脚本 | 同上，只能走 `$`，未挂载的完全拿不到 |

原因是构建只是**文本 concat**（`gulpfile.js` 的 `paths.scripts`），各 src 文件是彼此独立的 IIFE，作用域不会合并。典型例子：`src/event.js` 原来自己又定义了一份 `isString`，因为拿不到 `atu.js` 闭包里的那份——现已改为 `isString = $.isString`，与紧邻的 `isFunction = $.isFunction` 写法统一。

#### 已挂到 `$` 上的（闭包内外都能用）

`type` `isFunction` `isWindow` `isArray` `isPlainObject` `isEmptyObject` `isNumber` `isString` `camelCase`（= 内部的 `camelize`）`trim` `contains` `map` `each` `grep` `inArray`

> 注意 `$.extend(target, ...)` 与内部 `extend(target, source, deep)` 签名不同：公开版支持 `[deep]` 首参和多源合并，内部版只处理单个 source。

#### 仅闭包内可见的（页面与其它 src 文件拿不到）

| 函数 | 定义位置 | 说明 |
| --- | --- | --- |
| `isDocument(obj)` | `src/atu.js:71` | 判断 document 节点 |
| `isObject(obj)` | `:72` | `type(obj) == "object"` |
| `likeArray(obj)` | `:78` | 只看 `length` 是否为 number |
| `compact(array)` | `:82` | 去掉 `null` / `undefined` 项 |
| `flatten(array)` | `:83` | 摊平一层，依赖 `$.fn.concat`，运行时才求值 |
| `uniq(array)` | `:93` | 数组去重，同时挂在 `$.atu.uniq` |
| `dasherize(str)` | `:86` | 驼峰转中划线，供 `maybeAddPx` 查 `cssNumber` |
| `classRE(name)` | `:95` | 生成并缓存 class 匹配正则 |
| `maybeAddPx(name, value)` | `:100` | 数字自动补 `px`，`cssNumber` 里的属性除外 |
| `defaultDisplay(nodeName)` | `:104` | 取标签默认 display，**会真的往 body 插节点测量**，有副作用（结果缓存在 `elementDisplay`） |
| `children(element)` | `:117` | 取元素子节点集合 |
| `extend(target, source, deep)` | `:184` | 内部合并，见上方说明 |
| `filtered(nodes, selector)` | `:222` | `selector` 为空则直接包 `$(nodes)`，否则过滤 |
| `funcArg(context, arg, idx, payload)` | `:236` | `arg` 是函数就调用取值，否则原样返回 |
| `setAttribute(node, name, value)` | `:240` | `value == null` 时改为 `removeAttribute` |
| `className(node, value)` | `:244` | class 读写，**兼容 SVG**（`className.baseVal`） |
| `deserializeValue(value)` | `:252` | `"true"` / `"false"` / `"null"` / 数字 / JSON 字符串还原，失败返回原值；同时挂在 `$.atu.deserializeValue` |
| `parseTransform(transformStr)` | `:920` | 解析 `matrix()` / `matrix3d()`，返回含 translate / scale / rotate 的对象 |
| `traverseNode(node, fun)` | `:955` | 递归遍历节点树并对每个节点执行 `fun` |

闭包内还有一批共享变量同样可直接用：`emptyArray` `concat` `filter` `slice` `classCache` `elementDisplay` `cssNumber` `propMap` `containers` `tempParent` `fragmentRE` `singleTagRE` `tagExpanderRE` `rootNodeRE` `simpleSelectorRE` `methodAttributes` `adjacencyOperators`。

#### `atu` 对象（经 `$.atu` 对外可见）

`src/atu.js` 末尾 `$.atu = atu`（`:1008`），所以下面这些虽然主要供内部使用，页面里通过 `$.atu.xxx` 也能调到：

| 成员 | 定义位置 | 说明 |
| --- | --- | --- |
| `$.atu.matches(element, selector)` | `:45` | 元素是否匹配选择器，带多前缀兼容与降级实现 |
| `$.atu.qsa(element, selector)` | `:205` | 查询选择器，对简单 id / class / tag 走 `getElementById` 等快路径 |
| `$.atu.fragment(html, name, properties)` | `:123` | HTML 字符串转 DOM 片段，含 table 系容器修正 |
| `$.atu.Z(dom, selector)` | `:148` | 构造 Atu 实例（改写 `dom.__proto__` 指向 `$.fn`） |
| `$.atu.isZ(object)` | `:154` | 判断是否 Atu 实例 |
| `$.atu.init(selector, context)` | `:157` | `$()` 的真正入口 |
| `$.atu.uniq(array)` | `:1006` | 同内部 `uniq` |
| `$.atu.deserializeValue(value)` | `:1007` | 同内部 `deserializeValue` |

#### 三个容易踩的坑

1. **提升只对 `function` 声明生效。** 上表里的 `function xxx()` 在定义**之前**也能调用（函数声明整体提升）；但 `camelize`(`:84`)、`uniq`(`:93`)、`isArray`(`:43`) 是 `var` 赋值，只有声明被提升、赋值没有，在各自赋值行之前调用会得到 `undefined`。
2. **`key` 是闭包级共享变量**（`:3`）。`extend()` 里用 `for (key in source)` 会改写它，不要在依赖 `key` 的地方嵌套调用 `extend`。
3. **不要在页面里写裸名。** 页面脚本不在该闭包内，`isString('a')` 会直接 `ReferenceError`；必须写 `$.isString('a')`，且仅对"已挂到 `$`"的那批有效。

---

## 5. 使用示例

```html
<script src="atu.1.2.6.min.js"></script>
<script>
  // 选择器与 DOM
  $('.nav a').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active')
  })

  // 动画
  $('#box').animate({ width: 200, opacity: 0.5 }, 1200, 'cubic-bezier(.66,.1,1,.41)')

  // 手势
  $('#slider').touchLeft(function () { console.log('左滑') })

  // 请求
  $.get('/api/user', { id: 1 }, function (res) { console.log(res) })

  // 弹层
  $.tip('保存成功')
  $.alert('确认删除？', '删除', function () { $.tip('已删除') }, '取消')

  // 环境
  if (isWeixin) { console.log('微信内打开') }

  // 时间
  console.log(format(getPassTime('1982-12-19')))
</script>
```

---

## 6. 注意事项与已知坑

1. **不要手改 `build/`**。改 `src/` 后跑 `gulp`；跑一次 `version.txt` 会 +1，并覆盖 3 段别名与 `../atui/js/` 下的两个文件。
2. **3 段别名会被覆盖**。`atu.1.2.6.js` 每次构建都被最新内容覆盖，不能用于版本锁定；要锁定请用 4 段文件名。
3. **文件名版本与文件头版本不一致**（`1.2.6` vs `v1.2.6.7`），这是 3 段别名机制导致的，属正常现象。
4. **`window.jQuery` 会被无条件覆盖**。`window.Atu = window.jQuery = Atu` 会把已有的 jQuery 引用替换掉；若页面同时用 jQuery，注意引入顺序与冲突。
5. **本文件是 ES6 版，不做语法降级**。需要兼容 IE11 请用 `atu.1.2.6.es5.js`（Babel 转译）；但 `src/es.polyfill.js` 不在产物内，ES5 版仍可能缺少 Promise 等内置对象，需自行补 polyfill。
6. **移动项目专用**，文件头明确声明不兼容 IE6、8、9、10。
7. **`src/plugin/` 不在本产物内**。`tabSwitch`、`upload`、`markdown`、`anime`、`chinese`、`data.bank`、`autoheight` 需单独引入 `build/atu/` 下的对应文件。特别注意 `tabSwitch` 只在插件里，核心产物没有。
8. **`$.fn.pause` 并不存在**。`test/atu.test.html` 里检查的 `pause` 实际只匹配到微信 jsApiList 字符串中的 `pauseVoice`，该项会显示不支持。
9. **`test/index.html` 当前是坏的**。它引用 `../build/atu.1.1.8.min.js`，而 `build/` 里只有 1.2.4 及之后的版本，该引用 404，页面里用到的 `tabSwitch`、`anim2` 也都不在核心产物中。
10. **`build/atu.1.2.6.js` 里的 `$.isIdcard` 仍然是错的（旧构建）**。源码 `src/atu.js:306` 已经改成真正的 18 位身份证校验（格式正则 + 校验位），但当前 `build/` 下这一版还没有重新生成，所以页面里 `$.isIdcard('13800138000')` 仍返回 `true`、真实身份证号返回 `false`，测试页该项显示不通过。**跑一次 `gulp` 重新构建后即可通过。**
11. **尺寸方法必须在节点挂载后调用**。`offset()` 基于 `getBoundingClientRect()`，且对未挂载节点只返回 `{top:0,left:0}`（没有 width / height），所以游离节点上 `width()` 恒为 `undefined`。另外 `width()` 受 transform 影响，而 `outerWidth()` 走 `offsetWidth` 不受影响。
12. **`$.param` 与 `$.Deferred` 是存在的**，都定义在 `src/ajax.js`：`$.param` 用于序列化请求参数，`$.Deferred` 供 `$.ajax` 内部返回 deferred 对象。旧版说明曾误记为"本项目没有"，实际可以直接用。

---

## 7. 配套测试页

`test/1.2.6/index.html` 是本文的配套功能测试，用例按本文的章节编号分组（第一组到第十二组）：

- 覆盖第 3 节的全局导出、第 4.1～4.12 节的全部 API；
- 第 4.13 节的内部函数不参与测试：它们是闭包私有成员，页面里拿不到，无法断言；
- 支持异步用例（`animate()` 回调）与"跳过"状态（`file://` 下 Cookie 不可用时）；
- DOM 与尺寸类用例会把节点挂到页面离屏沙箱 `#__atu_host` 再测，规避第 11 条的坑；
- **不设"反向用例"组**。已知缺陷只记录在本文第 6 节，不再写成"断言缺陷必须存在"的用例——否则缺陷一旦被修好，用例反而从绿变红。

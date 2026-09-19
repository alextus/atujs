
最新版本  1.2.6
# 1.2.6  之后每年一个版本，默认分es6和es5两个版本

	2026-03-18 $("..").show/hide()  元素过多时性能骤降 fix
  2026-04-13 $.get(),$.post() 等支持then,fail
  2026-09-12 删除Array.prototype.indexOf
  2026-09-19
    #.css() 优化 
    $.isIdcard bug fix
    animate.js 中dasherize 函数复用$.dasherize
    common.js中的trim 函数复用$.trim
    function dasherize(str) {
      return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    精简函数写法：$.scrollTop().$.scrollLeft(),year(),month(),week(),day(),hour(),now()
    精简事件写法  touchLeft,touchRight,touchUp,touchDown,优化事件写法 longPress\ScrollEnd
    删除ie浏览器版本检测


# 1.2.5 2025.08.15
  fix get()函数无法识别?url=pdf/xxx.pdf 情况
  fix $.alert("msg",fun1,fun2) 没有按钮2
  fix copy函数，支持\n

# 1.2.4 2025.05.15
  新增$.isVisible,$.parents,$.styleValue
  新增属性originWidth,originHeight
  loadFile优化更新，支持文件带?参数
  $.alert函数优化更新,自适应参数
  String 方法 startWith(str),endWith(str)
  Array 方法remove(o)
  Atu.iniShare 代码优化
# 1.2.3
  新增 $.debug $.log  debug为ture是输出log,否则不输出log
  isTel更新，手机号精确化
  新增事件 scrollend和longPress
  动画机制优化  CSS动画
  新增 showLoading,hideLoading
  函数RandArr更新
  新增函数arrRand,arrRemove,arrDelete
  Arrray属性remove删除
  新增函数copy,download
# 1.2.2
  新增htmls 包含自身标签的html
  outHtml优化更新
  新增aoutHeight
  动画机制更新
  borwser优化
  新增函数capitalizeFirstLetter
  时间函数优化更新
# 1.2.1
  两个发布版本都过滤注释，只是min会压缩变量
  新增string.replaceAll
      isTouchDevice
      $.touch, $.touchmove, $.touchend


  新增 $.isString $(id).scale()
# 1.2.0
  新增isUrl,isIdcard
  $.touchLeft,$.touchRight,$.touchUp,$.touchDown
  easeFun
# 1.1.9
  http://atuad.cn->atuad.cn
  wx新增getLocation
# 1.1.8
  新增 $.isEmptyObject,$.parseJson,$.splice,wrap,wrapAll,wrapInner,unwrap,removeProp,tween
       
## 1.1.8.2 20220530 新增change事件  
## 1.1.8.1 3秒内仅console.log(版本信息)一次
# 1.1.7
  $.isMobile更新，添加14，15，17，18，19段
  新增 $.replaceWith $.tabSwitch 及 $.longPress
  更新 a.alert,Atu.act,format()
  新增 console(),e(),at(id),ce(tagName),year(),month(),week(),day(),hour(),now(),getLeftTime(),getPassTime()
# 1.1.6
  重新格式化
  新增 $.tip
  更新 $.alert
  删除layer

# 1.1.5
  wx新增openTagList['wx-open-louch-weap','wx-open-lounch-app']
# 1.1.4
  新增console.log提示
  APP.ini->Atu.ini
  新增Atu.iniClick、Atu.addClick
      
# 1.1.3
  删除 SoundLoad,getRotate,ani
  wx新增previewImage
  新增函数format

项目创建于 2016/12/26，基于zepto
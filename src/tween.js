// TweenMax精简化
var Tween = {}
Tween.to = function (el, duration, properties) {
	let delay=properties.delay?properties.delay:0
	let ease=properties.ease?properties.ease:0
  let p=['width','height',"top","left"]
	$(el).tween(properties,duration,properties)
}
Tween.fromTo = function (el, duration, properties, properties2) {

}
/**
 * 
 *   TweenMax.to($(".question .questionT .pic"), 0.4, {
						autoAlpha: 0
						 autoAlpha: 1,
								x: 0,
								delay: 0.1
				})
				 TweenMax.fromTo($(".shareEndWu"),1,{scale:0.7},{scale:1,ease:"Elastic.easeInOut"})
				 TweenMax.fromTo($(".shareEndTag2"),0.6,{x:_gd*320,y:100},{x:0,y:0,delay:0.6})
					 x: 0,
				y: 0,
				autoAlpha: 1,
				scale: 1 * (isIphoneX ? 1 : 0.86)
 */

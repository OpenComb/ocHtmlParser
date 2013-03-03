require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementObjs = require("./ElementObjs.js") ;
	var HtmlSource = require("./HtmlSource.js") ;

	function ParseContext(html,firstState)
	{
		this.source = new HtmlSource(html) ;
		this.currentState = firstState ;

		this.elements = [] ;
		this.currentElement = null ;
		this.currentTagElement = null ;
		this.currentTagState = null ;

		this.elements = [] ;
	}


//	ParseContext.prototype.__defineGetter__("currentElement",function(){
//		return this._currentElement ;
//	}) ;
//	ParseContext.prototype.__defineSetter__("currentElement",function(ele){
//		this.elements.push(ele) ;
//		this._currentElement = ele ;
//	}) ;

	return ParseContext ;

//----------------------------------------------------
});

var ElementObjs = require("./ElementObjs.js") ;
var HtmlSource = require("./HtmlSource.js") ;
var StateTag = require("./StateTag.js") ;
var ParseError = require("./ParseError.js") ;

var Stack = function Stack(){
	this._stack = [] ;
}
Stack.prototype.putin = function(obj){
	this._stack.unshift(obj) ;
}
Stack.prototype.getout = function(){
	return this._stack.shift() ;
}
Stack.prototype.top = function(){
	return this._stack[0] ;
}
Stack.prototype.isEmpty = function(){
	return this._stack.length<1 ;
}


var ParseContext = module.exports = function ParseContext(html,firstState)
{
	this.source = new HtmlSource(html) ;

	this._currentElement = null ;
	this.currentTagElement = null ;
	this._currentState = firstState ;
	this.currentTagState = null ;
	this.uncloseNodes = new Stack() ;

	this.rootNode = new ElementObjs.ElementNode(null,null) ;
	this.uncloseNodes.putin(this.rootNode) ;

	this.nodeId = 0 ;


	this.__defineGetter__("currentElement",function(){
		return this._currentElement ;
	}) ;
	this.__defineSetter__("currentElement",function(ele){
		if( ele && ele.constructor==ElementObjs.ElementTag )
		{
			this.currentTagElement = ele ;
		}
		this._currentElement = ele ;
	}) ;

	this.__defineGetter__("currentState",function(){
		return this._currentState ;
	}) ;
	this.__defineSetter__("currentState",function(state){
		if( state.constructor===StateTag )
		{
			this.currentTagState = state ;
		}
		this._currentState = state ;
	}) ;
}

ParseContext.prototype.addChildToCurrentNode = function(eleChild){
	var parentNode = this.uncloseNodes.top() ;
	if(!parentNode)
	{
		throw new ParseError("组装Html Element Dom时遇到错误：无法定位节点的上级。",[],this,eleChild) ;
	}
	parentNode.appendChild(eleChild) ;
}


/**
 * !! 如果 element 的长度为 0 ， 则返回 -1
 */
ParseContext.prototype.endOfCurrentElement = function(){
	return this.currentElement.from+this.currentElement.length-1 ;
}

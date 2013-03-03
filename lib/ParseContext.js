require('seajs') ;

define(function(require){
//----------------------------------------------------

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


	var ParseContext = function ParseContext(html,firstState)
	{
		this.source = new HtmlSource(html) ;

		this.elements = [] ;
		this._currentElement = null ;
		this.currentTagElement = null ;
		this._currentState = firstState ;
		this.currentTagState = null ;
		this.uncloseNodes = new Stack() ;

		this.rootNode = new ElementObjs.ElementNode(null,null) ;
		this.uncloseNodes.putin(this.rootNode) ;

		this.elements = [] ;
	}

	ParseContext.prototype.addChildToCurrentNode = function(eleChild){
		var parentNode = this.uncloseNodes.top() ;
		if(!parentNode)
		{
			throw new ParseError("组装Html Element Dom时遇到错误：无法定位节点的上级。",[],this,eleChild) ;
		}
		parentNode.children.push(eleChild) ;
	}

	ParseContext.prototype.__defineGetter__("currentElement",function(){
		return this._currentElement ;
	}) ;
	ParseContext.prototype.__defineSetter__("currentElement",function(ele){
		if( ele && ele.constructor==ElementObjs.ElementTag )
		{
			this.currentTagElement = ele ;
		}
		this._currentElement = ele ;
	}) ;

	ParseContext.prototype.__defineGetter__("currentState",function(){
		return this._currentState ;
	}) ;
	ParseContext.prototype.__defineSetter__("currentState",function(state){
		if( state.constructor===StateTag )
		{
			this.currentTagState = state ;
		}
		this._currentState = state ;
	}) ;

	return ParseContext ;

//----------------------------------------------------
});
require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementText = function ElementText(source,from,raw){
		this.type = this.constructor.name ;
		this.source = source ;
		this.from = from ;
		this.raw = raw ;
	}

	ElementText.prototype.__defineGetter__("text",function(){
		return this.raw ;
	}) ;
	ElementText.prototype.__defineSetter__("text",function(val){
		this.raw = val ;
	}) ;



	//----------------------------
	var ElementTag = function ElementTag(source,from,tagName){
		this.type = this.constructor.name ;
		this.source = source ;
		this.from = from ;
		this.tagName = tagName ;
		this.tail = false ;

		this.attributes = [] ;
		this.namedAttributes = {} ;
		this.unamedAttributes = [] ;
		this.single = false ;
		this.rawSlash = "" ;
		this.tail = false ;
	}

	ElementTag.prototype.addAttribute = function (attr){
		this.attributes.push(attr) ;

		if( attr.name!==null )
		{
			this.namedAttributes[attr.name] = attr ;
		}
		else
		{
			this.unamedAttributes.push(attr) ;
		}
	}



	//----------------------------
	var ElementAttribute = function ElementAttribute(name,text){
		this.type = this.constructor.name ;
		this.name = name ;
		this.text = text ;
		this.boundaryChar = "" ;
		this.whitespace = "" ;
	}
	ElementAttribute.prototype.type = "ElementAttribute" ;
	ElementAttribute.prototype.source = null ;
	ElementAttribute.prototype.from = null ;
	ElementAttribute.prototype.raw = null ;
	ElementAttribute.prototype.text = null ;





	//----------------------------
	var ElementNode = function ElementNode(headTag,tailTag){
		this.type = this.constructor.name ;
		this.headTag = headTag ;
		this.tailTag = tailTag ;
		this.children = [] ;
	}

	ElementNode.prototype.appendChild = function(child){
		if(!child){
			throw new Error("传入了无效的字符到 ElementNode::appendChild() 方法："+typeof(child)) ;
		}
		this.children.push(child) ;
	}

	ElementNode.prototype.__defineGetter__("tagName",function(){
		return this.headTag? this.headTag.tagName: null ;
	}) ;

//	ElementNode.prototype.type = "ElementNode" ;
//	ElementNode.prototype.headTag = null ;
//	ElementNode.prototype.tailTag = null ;
//	ElementNode.prototype.children = [] ;

	var ElementComment = function ElementComment(source,from,raw){
		this.type = this.constructor.name ;
		this.source = source ;
		this.from = from ;
		this.raw = raw ;
		this.text = raw.substr(4,raw.length-7) ;
	}



	return {
		"ElementText" : ElementText
		, "ElementTag" : ElementTag
		, "ElementAttribute": ElementAttribute
		, "ElementNode": ElementNode
		, "ElementComment": ElementComment
	} ;

//----------------------------------------------------
}) ;


require('seajs') ;

define(function(require){
//----------------------------------------------------

	var Elements = require("./ElementObjs.js") ;
	var ParseError = require("./ParseError.js") ;

	function StateTag(){
		this.name = arguments.callee.name ;
		this.beChangingStates = [] ;
	}
	StateTag.prototype.beChangingStates = [] ;


	StateTag.prototype.emptyTags = {
		area: 1
		, base: 1
		, basefont: 1
		, br: 1
		, col: 1
		, hr: 1
		, img: 1
		, input: 1
		, isindex: 1
		, link: 1
		, meta: 1
		, param: 1
		, embed: 1
		, "!--": 1
		, "!doctype": 1
	} ;

	StateTag.prototype.examineStart = function(ctx)
	{
		var fromPos = ctx.source.seek ;

		if( ctx.source.read(1)!=="<" )
		{
			return false ;
		}

		ctx.source.seek ++ ;

		// 尾标签
		var isTail = false ;
		if( ctx.source.read(1)=="/" )
		{
			ctx.source.seek ++ ;
			var isTail = true ;
		}

		var tagName = StateTag.parseTagName(ctx.source) ;
		if(!tagName)
		{
			ctx.source.seek-= 1 ;
			return false ;
		}

		// create tag element
		var eleTag = new Elements.ElementTag(ctx.source,fromPos,tagName) ;
		eleTag.tail = isTail ;
		ctx.elements.push(eleTag) ;

		var lowTagName = tagName.toLowerCase() ;
		if( (lowTagName in this.emptyTags) && this.emptyTags[lowTagName] )
		{
			eleTag.single = true ;
		}

		//
		return eleTag ;
	}
	StateTag.prototype.examineEnd = function(ctx){

		var oriPos = ctx.source.seek ;

		ctx.source.until(/[^\s]/g) ;
		var char = ctx.source.read(1,true) ;

		if( char==='>' )
		{
			// nothing todo
		}

		else if(char==="/")
		{
			ctx.source.until(/[^\s]/g) ;
			var char = ctx.source.read(1,true) ;

			if(char!=">")
			{
				ctx.source.seek -- ;
				throw new require("./ParseError.js")("分析html标签属性的时候，标签内的”/“后必须跟”>“结束标签",[],ctx) ;
			}

			// 斜线
			ctx.currentElement.rawSlash = ctx.source.substr( oriPos, ctx.source.seek-oriPos ) ;
			ctx.currentElement.single = true ;
		}
		else
		{
			ctx.source.seek = oriPos ;
			return false ;
		}

		// 原始数据
		ctx.currentElement.raw = ctx.source.substr( ctx.currentElement.from, ctx.source.seek-ctx.currentElement.from ) ;


		// close node -------
		this.processNode(ctx) ;


		return true ;
	}

	StateTag.prototype.processNode = function(ctx){

		var tag = ctx.currentElement ;

		// 尾标签
		if( tag.tail )
		{
			var eleNode = ctx.uncloseNodes.top() ;
			if(!eleNode||!eleNode.tagName)
			{
				throw new ParseError("闭合节点标签时发生错误，尾标签前任何头标签。",[],ctx) ;
			}
			if( tag.tagName.toLowerCase() != eleNode.tagName.toLowerCase() )
			{
				throw new ParseError("闭合节点标签时发生错误，尾标签和头标签不匹配。",[],ctx,eleNode.head) ;
			}

			ctx.uncloseNodes.getout() ;
			eleNode.tailTag = tag ;
		}

		// 头标签
		else
		{
			// create node element
			var eleNode = new Elements.ElementNode(tag,null) ;
			ctx.addChildToCurrentNode(eleNode) ;

			// 成对标签
			if(!tag.single)
			{
				ctx.uncloseNodes.putin(eleNode) ;
			}
		}



	}

	StateTag.parseTagName = function(source){

		var tagName = source.until(/[\s>\/"']/g) ;
		if(!tagName.length)
		{
			return null ;
		}

		return tagName ;
	}

	return StateTag ;

//----------------------------------------------------
}) ;
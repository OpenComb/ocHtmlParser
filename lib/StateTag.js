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
	StateTag.prototype.regexpTagName = /^<\/?[\w!:#\-]+/ ;

	StateTag.prototype.examineStart = function(ctx)
	{
		var chars = ctx.source.read(3) ;
		var b = this.regexpTagName.test(chars) ;
		return b ;
	}

	StateTag.prototype.start = function(ctx){

		var eleTag = new Elements.ElementTag(ctx.source,ctx.source.seek,null) ;

		ctx.source.seek ++ ; // 跳过开始的"<"

		var char = ctx.source.read(1) ;

		// 尾标签
		if( char=="/" )
		{
			ctx.source.seek ++ ;
			eleTag.tail = true ;
		}
		else
		{
			eleTag.tail = false ;
		}

		// tag name
		eleTag.tagName = StateTag.parseTagName(ctx.source) ;
		if(eleTag.tagName===null)
		{
			throw new ParseError("无法找到标签名称",[],ctx) ;
		}

		var lowTagName = eleTag.tagName.toLowerCase() ;
		if( (lowTagName in this.emptyTags) && this.emptyTags[lowTagName] )
		{
			eleTag.single = true ;
		}

		//
		return eleTag ;
	}

	StateTag.prototype.examineEnd = function(ctx){

		if( ctx.source.isEnd() )
		{
			throw new ParseError("分析HTML时遇到错误，文档结束时标签尚未结束:%s",[ctx.currentElement.tagName],ctx) ;
		}

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
				ctx.source.seek = oriPos ;
				return false ;
			}

			// 斜线
			ctx.currentElement.rawSlash = ctx.source.substr( oriPos, ctx.source.seek-oriPos-1 ) ;
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
				throw new ParseError(
					"闭合节点标签时发生错误，头标签(%s)和尾标签(%s)不匹配。"
					, [eleNode.tagName,tag.tagName]
					, ctx
					, eleNode.head
				) ;
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
			eleNode.id = ctx.nodeId ++ ;

			// 成对标签
			if(!tag.single)
			{
				ctx.uncloseNodes.putin(eleNode) ;
			}
		}

		return true ;
	}

	StateTag.prototype.end = function(ctx){}

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
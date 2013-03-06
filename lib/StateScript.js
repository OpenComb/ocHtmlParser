require('seajs') ;

define(function(require){
//----------------------------------------------------

	var Elements = require("./ElementObjs.js") ;

	function StateScript(){
		this.name = arguments.callee.name ;
		this.beChangingStates = [] ;
	}
	StateScript.prototype.beChangingStates = [] ;

	StateScript.prototype.scriptTags = {
		script: 1
	} ;

	StateScript.prototype.examineStart = function(ctx){

		if( ctx.source.isEnd() || !ctx.currentElement || ctx.currentElement.constructor!=Elements.ElementTag )
		{
			return false ;
		}

		if( ctx.currentElement.tail ){
			return false ;
		}

		// script 标签
		var tagName = ctx.currentElement.tagName.toLowerCase() ;
		if( (tagName in this.scriptTags) && this.scriptTags[tagName] )
		{
			return true ;
		}

		return false ;
	}

	StateScript.prototype.start = function(ctx){
		return new Elements.ElementText(ctx.source,ctx.source.seek,"") ;
	}

	StateScript.prototype.examineEnd = function(ctx){

		if(ctx.source.isEnd())
		{
			return true ;
		}

		var tagName = ctx.currentTagElement.tagName ;
		var oriSeek = ctx.source.seek ;

		//  "/*","//", 引号, </tag>
		var regexp = new RegExp("(/\\*|//|[\"']|<\\s*/("+tagName+")\\s*>)","ig") ;
		var chars = ctx.source.untilReturnMatch(regexp) ;

		// 单行注释
		if(chars=="//"){
			var nl = ctx.source.untilReturnMatch(/[\r\n]+/g) ;
			ctx.source.seek+= nl.length ;
			return false ;
		}

		// 多行注释
		else if(chars=="/*"){
			ctx.source.untilReturnMatch(/\*\//g) ;
			ctx.source.seek+= 2 ;
			return false ;
		}

		// 字符串
		else if(chars=="'"||chars=='"'){
			ctx.source.untilQuoteEnd() ;
			return false ;
		}

		// 转义字符
		else if(chars=="\\"){
			// 跳过下一个字符
			ctx.source.seek ++ ;
			return false ;
		}

		// 总算遇到一个标签了
		else if(chars.charAt(0)=="<"){
			var res = chars.match(/<\s*\/\s*([^>]+?)\s*>/) ;
			if( res[1].toLowerCase()===tagName.toLowerCase() )
			{
				return true ;
			}
			else
			{
				ctx.source.seek+= tagName.length ;
				return false ;
			}
		}

		else{
			var pos = ctx.source.position(ctx.source.seek) ;
			throw new Error("what's this:"+chars+" ; line:"+pos.line+", char:"+pos.char) ;
		}
	}

	StateScript.prototype.end = function(ctx){
		ctx.currentElement.raw = ctx.source.substr( ctx.currentElement.from, ctx.source.seek-ctx.currentElement.from ) ;
		ctx.addChildToCurrentNode(ctx.currentElement) ;

		return ;
	}

	return StateScript ;

//----------------------------------------------------
}) ;
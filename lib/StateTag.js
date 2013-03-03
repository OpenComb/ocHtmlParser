require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementTag = require("./ElementObjs.js").ElementTag ;

	function StateTag(){

	}
	StateTag.prototype.beChangingStates = [] ;


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

		var eleTag = new ElementTag(ctx.source,fromPos,tagName) ;
		eleTag.tail = isTail ;
		ctx.elements.push(eleTag) ;

		//
		return eleTag ;
	}
	StateTag.prototype.examineEnd = function(ctx){

		var oriPos = ctx.source.seek ;

		ctx.source.until(/[^\s]/) ;
		var char = ctx.source.read(1,true) ;

		if( char==='>' )
		{
			// nothing todo
		}

		else if(char==="/")
		{
			ctx.source.until(/[^\s]/) ;
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

		return true ;
	}

	StateTag.parseTagName = function(source){

		var tagName = source.until(/[\s>\/"']/) ;
		if(!tagName.length)
		{
			return null ;
		}

		return tagName ;
	}

	return StateTag ;

//----------------------------------------------------
}) ;
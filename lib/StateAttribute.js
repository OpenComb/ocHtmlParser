require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementObjs = require("./ElementObjs.js") ;

	function StateAttribute(){
		this.name = arguments.callee.name ;
		this.beChangingStates = [] ;
	}
	StateAttribute.prototype.beChangingStates = [] ;

	StateAttribute.prototype.examineStart = function(ctx){

		var oriSeek = ctx.source.seek ;
		var firstChar = ctx.source.untilReturnMatch(/[^\s]/g) ;
		ctx.source.seek = oriSeek ;

		// 标签结束
		return firstChar!="/" && firstChar!=">" ;
	}

	StateAttribute.prototype.start = function(ctx){

		// create attribute element object
		var attr = new ElementObjs.ElementAttribute(null,null) ;
		attr.source = ctx.source ;
		attr.from = ctx.source.seek ;

		var firstChar = ctx.source.untilReturnMatch(/[^\s]/g) ;

		attr.whitespace = ctx.source.substr(attr.from,ctx.source.seek-attr.from) ;

		// 不能以 = 开头
		if( firstChar=="=" )
		{
			throw new require("./ParseError.js")("分析html标签属性的时候，遇到意外的字符：%s",[firstChar],ctx) ;
		}

		// 无属性名称
		else if(firstChar=="'" || firstChar=='"'){
			// nothing todo ...
		}
		else
		{
			var chars = ctx.source.until(/[=\s>\/]/g) ;

			// 具名属性
			if( ctx.source.read(1) == "=" )
			{
				attr.name = chars ;

				// 指针越过”=“
				ctx.source.seek ++ ;
			}

			// 匿名属性
			else
			{
				// is over
				attr.text = new ElementObjs.ElementText(ctx.source,attr.from,chars) ;
				return attr ;
			}
		}

		// 属性值 -------
		attr.text = new ElementObjs.ElementText(ctx.source,ctx.source.seek,"") ;

		var quoteRange = ctx.source.untilQuoteEnd() ;
		attr.boundaryChar = quoteRange.boundaryChar ;
		attr.text.raw = ctx.source.substr(quoteRange.start,quoteRange.length) ;

		return attr ;
	}

	StateAttribute.prototype.examineEnd = function(ctx){
		return true ;
	}


	StateAttribute.prototype.end = function(ctx){
		ctx.currentTagElement.addAttribute(ctx.currentElement) ;
		ctx.currentElement = ctx.currentTagElement ;
		return ctx.currentTagState ;
	}

	return StateAttribute ;

//----------------------------------------------------
}) ;
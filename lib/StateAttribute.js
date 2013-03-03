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

		ctx.source.until(/[^\s]/g) ;
		var firstChar = ctx.source.read(1) ;

		// 标签结束
		if(firstChar=="/" || firstChar==">"){
			ctx.source.seek = oriSeek ;
			return false ;
		}

		// create attribute element object
		var attr = new ElementObjs.ElementAttribute(null,null) ;
		attr.source = ctx.source ;
		attr.from = oriSeek ;

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
			var chars = ctx.source.until(/[=\s>]/g) ;

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
				attr.text = chars ;
				return attr ;
			}
		}

		// 属性值 -------
		var quoteRange = ctx.source.untilQuoteEnd() ;
		attr.boundaryChar = quoteRange.boundaryChar ;
		attr.text = ctx.source.substr(quoteRange.start,quoteRange.length) ;

		return attr ;
	}



	StateAttribute.prototype.examineEnd = function(ctx){
		ctx.currentTagElement.addAttribute(ctx.currentElement) ;
		ctx.currentElement = ctx.currentTagElement ;
		return ctx.currentTagState ;
	}

	return StateAttribute ;

//----------------------------------------------------
}) ;
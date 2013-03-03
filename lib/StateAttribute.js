require('seajs') ;

var NOQUOTE_BOUNDARY_CHAR = "\\s>" ;

define(function(require){
//----------------------------------------------------

	var ElementObjs = require("./ElementObjs.js") ;

	function StateAttribute(){
	}
	StateAttribute.prototype.beChangingStates = [] ;

	StateAttribute.prototype.examineStart = function(ctx){

		var oriSeek = ctx.source.seek ;

		ctx.source.until(/[^\s]/) ;
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
			var chars = ctx.source.until(/[=\s>]/) ;

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

		// 分析属性值 -------
		var boundaryChar = ctx.source.read(1) ;
		if( boundaryChar!="'" && boundaryChar!='"' )
		{
			boundaryChar = NOQUOTE_BOUNDARY_CHAR ;
		}
		else
		{
			attr.boundaryChar = boundaryChar ;

			// 跳过引号
			ctx.source.seek ++ ;
		}

		attr.text = "" ;

		for(
			var char=ctx.source.read(1,true);
			char!==null && !char.match(boundaryChar) ;
			char=ctx.source.read(1,true)
		){
			attr.text+= char ;

			// 处理转义
			if( char=="\\" && boundaryChar!=NOQUOTE_BOUNDARY_CHAR ){
				attr.text+= ctx.source.read(1,true) ;
			}
		}

		if(char===null)
		{
			throw new require("./ParseError.js")("分析html标签属性的时候，遇到了意外的文档结束",[],ctx) ;
		}

		// 后退 空白分隔符
		if( boundaryChar==NOQUOTE_BOUNDARY_CHAR )
		{
			ctc.source.seek -- ;
		}

		attr.raw = ctx.source.substr( oriSeek, ctx.source.seek-oriSeek ) ;

		ctx.cuurentTagElement = ctx.currentElement ;
		ctx.cuurentTagState = ctx.currentState ;

		return attr ;
	}



	StateAttribute.prototype.examineEnd = function(ctx){
		ctx.cuurentTagElement.addAttribute(ctx.currentElement) ;
		ctx.currentElement = ctx.cuurentTagElement ;
		return ctx.cuurentTagState ;
	}

	return StateAttribute ;

//----------------------------------------------------
}) ;
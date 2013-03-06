require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ParseError = function ParseError(msg,argvs,ctx,refElement){
		this.msg = msg + " [行:%d,字符:%d]" ;

		var posInfo = ctx.source.position() ;
		this.argvs = (argvs || []).concat( posInfo.line, posInfo.char ) ;

		if(refElement)
		{
			this.msg+= " ; 相关位置 [行:%d,字符:%d]" ;
			posInfo = ctx.source.position(refElement.from) ;
			this.argvs.push( posInfo.line, posInfo.char ) ;
		}

		this.source = ctx.source ;
		this.seek = ctx.source.seek ;
		this.refElement = refElement||null ;
		this.stack = (new Error()).stack ;
	}

	var util = require("util") ;
	util.inherits(ParseError,Error) ;

	ParseError.prototype.toString = function(){
		return util.format.apply( null, [this.msg].concat(this.argvs) ) ;
	}

	return ParseError ;

//----------------------------------------------------
}) ;
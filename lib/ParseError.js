require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ParseError = function ParseError(msg,argvs,ctx,refElement){
		this.msg = msg ;
		this.argvs = argvs || [] ;
		this.source = ctx.source ;
		this.seek = ctx.source.seek ;
		this.refElement = refElement||null ;
	}

	ParseError.prototype.toString = function(){
		return this.msg ;
	}

//----------------------------------------------------
}) ;
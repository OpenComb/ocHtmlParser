require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ParseError = function ParseError(msg,argvs,ctx){
		this.msg = msg ;
		this.argvs = argvs || [] ;
		this.source = ctx.source ;
		this.seek = ctx.source.seek ;
	}

//----------------------------------------------------
}) ;
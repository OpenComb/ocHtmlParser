
var ParseError = module.exports = function ParseError(msg,argvs,ctx,refElement){
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

ParseError.prototype.toString = function(){
	var util = require("util") ;
	return util.format.apply( null, [this.msg].concat(this.argvs) ) ;
}

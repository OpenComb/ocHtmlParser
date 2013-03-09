var StateDefault = module.exports = function StateDefault(){
	this.name = arguments.callee.name ;
	this.beChangingStates = [] ;
}
StateDefault.prototype.beChangingStates = [] ;

StateDefault.prototype.examineStart = function(ctx){
	return !ctx.source.isEnd() ;
}
StateDefault.prototype.start = function(ctx){
}
StateDefault.prototype.examineEnd = function(ctx){
	return ctx.source.isEnd() ;
}
StateDefault.prototype.end = function(ctx){
}


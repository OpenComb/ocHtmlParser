var ElementText = require("./ElementObjs.js").ElementText

var StateText = module.exports = function StateText(){
	this.name = arguments.callee.name ;
	this.beChangingStates = [] ;
}
StateText.prototype.beChangingStates = [] ;

StateText.prototype.examineStart = function(ctx){
	return !ctx.source.isEnd() ;
}

StateText.prototype.start = function(ctx){
	return new ElementText(ctx.source,ctx.source.seek,"") ;
}

StateText.prototype.examineEnd = function(ctx){
	return ctx.source.isEnd() ;
}

StateText.prototype.end = function(ctx){
	ctx.currentElement.raw = ctx.source.substr( ctx.currentElement.from, ctx.source.seek-ctx.currentElement.from ) ;
	ctx.addChildToCurrentNode(ctx.currentElement) ;
}

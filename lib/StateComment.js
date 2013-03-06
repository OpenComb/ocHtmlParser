require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementComment = require("./ElementObjs.js").ElementComment

	var StateComment = function StateComment(){
		this.name = arguments.callee.name ;
		this.beChangingStates = [] ;
	}
	StateComment.prototype.beChangingStates = [] ;

	StateComment.prototype.examineStart = function(ctx){
		if(ctx.source.isEnd())
		{
			return false ;
		}

		return ctx.source.read(4)=="<!--" ;
	}

	StateComment.prototype.start = function(ctx){
		var ele = new ElementComment(ctx.source,ctx.source.seek,"") ;
		ctx.addChildToCurrentNode(ele) ;

		return ele ;
	}

	StateComment.prototype.examineEnd = function(ctx){
		return ctx.source.read(3)=="-->" ;
	}

	StateComment.prototype.end = function(ctx){
		ctx.source.seek+= 3 ;
		ctx.currentElement.raw = ctx.source.substr(ctx.currentElement.from,ctx.source.seek-ctx.currentElement.from) ;
	}

	return StateComment ;

//----------------------------------------------------
}) ;
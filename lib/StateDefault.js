require('seajs') ;

define(function(require){
//----------------------------------------------------

	function StateDefault(){
		this.name = arguments.callee.name ;
		this.beChangingStates = [] ;
	}
	StateDefault.prototype.beChangingStates = [] ;

	StateDefault.prototype.examineStart = function(ctx){
		return !ctx.source.isEnd() ;
	}
	StateDefault.prototype.examineEnd = function(ctx){
		return ctx.source.isEnd() ;
	}

	return StateDefault ;

//----------------------------------------------------
}) ;
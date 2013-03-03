require('seajs') ;

define(function(require){
//----------------------------------------------------

	function StateDefault(){

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
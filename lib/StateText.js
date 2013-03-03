require('seajs') ;

define(function(require){
//----------------------------------------------------

	var ElementText = require("./ElementObjs.js").ElementText

	function StateText(){

	}
	StateText.prototype.beChangingStates = [] ;

	StateText.prototype.examineStart = function(ctx){
		if(ctx.source.isEnd())
		{
			return false ;
		}

		var ele = new ElementText(ctx.source,ctx.source.seek,"") ;
		ctx.elements.push(ele) ;

		return ele ;
	}

	StateText.prototype.examineEnd = function(ctx){

		if(ctx.source.isEnd())
		{
			return true ;
		}

		var oriSeek = ctx.source.seek ;
		var char = ctx.source.read(1,true) ;

		if(char=="<" && require("./StateTag.js").parseTagName(ctx.source)!==null)
		{
			ctx.source.seek = oriSeek ;
			return true ;
		}
		else
		{
			ctx.currentElement.raw+= char ;
			return false ;
		}
	}

	return StateText ;

//----------------------------------------------------
}) ;
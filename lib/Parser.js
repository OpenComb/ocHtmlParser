require('seajs') ;

define(function(require){
//----------------------------------------------------

	var StateText = require("./StateText.js") ;
	var StateTag = require("./StateTag.js") ;
	var StateAttributes = require("./StateAttribute.js") ;
	var StateDefault = require("./StateDefault.js") ;
	var ParseContext = require("./ParseContext.js") ;

	function Parser(){
		// parse state factory ------
		var aStateText = new StateText ;
		var aStateTag = new StateTag ;
		var aStateAttributes = new StateAttributes ;
		var aStateDefault = new StateDefault ;

		aStateTag.beChangingStates.push(aStateAttributes) ;
		aStateText.beChangingStates.push(aStateTag) ;
		aStateDefault.beChangingStates.push(aStateTag,aStateText) ;

		this.defaultState = aStateDefault ;
	}

	Parser.prototype.parseSync = function(html){

		var ctx = new ParseContext(html.toString(),this.defaultState) ;

		while( !ctx.source.isEnd() )
		{
			var ended = ctx.currentState.examineEnd(ctx) ;
			if(ended===true)
			{
				ctx.currentState = this.defaultState ;
			}
			else if(ended!==false)
			{
				ctx.currentState = ended ;
			}

			// exmaine state changing
			console.log(ctx.source.position(ctx.source.seek)) ;
			for(var i=0;i<ctx.currentState.beChangingStates.length;i++)
			{
				var state = ctx.currentState.beChangingStates[i] ;

				// bingo!  is changing
				var newEle = state.examineStart(ctx) ;
				if( newEle )
				{
					ctx.currentElement = newEle ;
					ctx.currentState =  state ;

					break ;
				}
			}
		}

		console.log(ctx.elements) ;
	}


	return Parser ;

//----------------------------------------------------
}) ;
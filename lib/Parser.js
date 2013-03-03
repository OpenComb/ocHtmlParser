require('seajs') ;

define(function(require){
//----------------------------------------------------

	var StateText = require("./StateText.js") ;
	var StateTag = require("./StateTag.js") ;
	var StateAttributes = require("./StateAttribute.js") ;
	var StateScript = require("./StateScript.js") ;
	var StateDefault = require("./StateDefault.js") ;
	var ParseContext = require("./ParseContext.js") ;
	var ParseError = require("./ParseError.js") ;

	function Parser(){
		// parse state factory ------
		var aStateText = new StateText ;
		var aStateTag = new StateTag ;
		var aStateAttributes = new StateAttributes ;
		var aStateScript = new StateScript ;
		var aStateDefault = new StateDefault ;

		aStateTag.beChangingStates.push(aStateAttributes) ;
		aStateText.beChangingStates.push(aStateTag) ;
		aStateDefault.beChangingStates.push(aStateTag,aStateScript,aStateText) ;

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
				if(ended===undefined){
					throw new Error(ctx.currentState.constructor.name+"::examineEnd()方法返回了无效的对象:undefined") ;
				}
				ctx.currentState = ended ;
			}

			// exmaine state changing
			// console.log(ctx.source.position(ctx.source.seek)) ;
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

		var node = ctx.uncloseNodes.getout() ;
		if(!ctx.uncloseNodes.isEmpty() || node!==ctx.rootNode){
			throw new ParseError("分析HTML文档时发生了错误，遇到未闭合的标签: %s",[node.tagName],ctx,node) ;
		}

		// console.log("over") ;
	}


	return Parser ;

//----------------------------------------------------
}) ;
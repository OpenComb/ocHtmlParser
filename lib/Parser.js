
var ParseContext = require("./ParseContext.js") ;
var ParseError = require("./ParseError.js") ;

var Parser = module.exports = function Parser(){}

Parser.prototype.parseSync = function(html){

	var ctx = new ParseContext(html.toString(),this.defaultState) ;
	var parser = this ;

	while( !ctx.source.isEnd() )
	{
		// exmaine state changing
		// console.log(ctx.source.position(ctx.source.seek)) ;
		(function(){

			// first of all, examine has new state chanaged ?
			for(var i=0;i<ctx.currentState.beChangingStates.length;i++)
			{
				var state = ctx.currentState.beChangingStates[i] ;

				// bingo!  is changing
				if( state.examineStart(ctx) )
				{
					// end pre state
					ctx.currentState.end(ctx) ;

					// switch new state
					var newEle = state.start(ctx) ;
					if(newEle){
						ctx.currentElement = newEle
					}
					ctx.currentState =  state ;

					return ;
				}
			}

			// then examine has current state has ended ?
			if( ctx.currentState.examineEnd(ctx) )
			{
				var nextState = ctx.currentState.end(ctx) ;
				ctx.currentState = nextState || parser.defaultState ;

				return ;
			}

			// at last, move seek forward
			ctx.source.seek ++ ;

		}) ()
	}

	ctx.currentState.end(ctx) ;

	var node = ctx.uncloseNodes.getout() ;
	if(!ctx.uncloseNodes.isEmpty() || node!==ctx.rootNode){
		throw new ParseError("分析HTML文档时发生了错误，遇到未闭合的标签: %s",[node.tagName],ctx,node) ;
	}

	return ctx.rootNode ;
}


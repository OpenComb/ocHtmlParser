require('seajs') ;

define(function(require){
//----------------------------------------------------

	var StateText = require("./StateText.js") ;
	var StateTag = require("./StateTag.js") ;
	var StateAttribute = require("./StateAttribute.js") ;
	var StateScript = require("./StateScript.js") ;
	var StateDefault = require("./StateDefault.js") ;
	var ParseContext = require("./ParseContext.js") ;
	var ParseError = require("./ParseError.js") ;

	function Parser(){}

	Parser.factoryConfigs = {

		html: {
			stateMachines: {
				"StateTag": {
					"class": StateTag
					, "beChangingStates": ["StateAttribute"]
					, properties: {
						emptyTags: {
							area: 1
							, base: 1
							, basefont: 1
							, br: 1
							, col: 1
							, hr: 1
							, img: 1
							, input: 1
							, isindex: 1
							, link: 1
							, meta: 1
							, param: 1
							, embed: 1
							, "!--": 1
							, "!doctype": 1
						}
					}
				}

				, "StateAttribute": {
					"class": StateAttribute
					, "beChangingStates": []
					, properties: {}
				}

				, "StateText": {
					"class": StateText
					, "beChangingStates": ["StateTag"]
					, properties: {}
				}

				, "StateScript": {
					"class": StateScript
					, "beChangingStates": []
					, properties: {}
				}

				, "StateDefault": {
					"class": StateDefault
					, "beChangingStates": ["StateTag","StateScript","StateText"]
					, properties: {}
				}
			}
			, defaultMachineName: "StateDefault"
		}

	}

	Parser.htmlParser = function(){
		return Parser.create(Parser.factoryConfigs.html) ;
	}
	Parser.create = function(config){
		var states = {} ;
		var createState = function(name){
			if(!(name in states))
			{
				states[name] = new config.stateMachines[name].class ;
				for(var i=0;i<config.stateMachines[name].beChangingStates.length;i++){
					var changingState = arguments.callee( config.stateMachines[name].beChangingStates[i] ) ;
					states[name].beChangingStates.push(changingState) ;
				}
			}
			return states[name] ;
		}

		var aParser = new Parser() ;
		aParser.defaultState = createState(config.defaultMachineName) ;
		return aParser ;
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

		return ctx.rootNode ;
	}


	return Parser ;

//----------------------------------------------------
}) ;
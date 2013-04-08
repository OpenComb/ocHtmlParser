
var StateText = require("./StateText.js") ;
var StateTag = require("./StateTag.js") ;
var StateAttribute = require("./StateAttribute.js") ;
var StateScript = require("./StateScript.js") ;
var StateComment = require("./StateComment.js") ;
var StateDefault = require("./StateDefault.js") ;

var Parser = require("./Parser.js") ;
var Class = require("occlass") ;

var Factory = module.exports = Class.extend(

	{// 动态成员 ------------

	}

	, {// 静态成员 ------------
		configs: {

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
						, "beChangingStates": ["StateComment","StateTag"]
						, properties: {}
					}

					, "StateScript": {
						"class": StateScript
						, "beChangingStates": []
						, properties: {}
					}

					, "StateDefault": {
						"class": StateDefault
						, "beChangingStates": ["StateComment","StateTag","StateScript","StateText"]
						, properties: {}
					}

					, "StateComment": {
						"class": StateComment
						, "beChangingStates": []
						, properties: {}
					}
				}
				, defaultMachineName: "StateDefault"
			}
		}

		, htmlParser: function(){
			return Factory.create( Factory.configs.html ) ;
		}

		, create: function(config){
			var states = {} ;
			var factory = this ;
			var createState = function(name){
				if(!(name in states))
				{
					var stateConfig = config.stateMachines[name] ;
					states[name] = new stateConfig.class ;
					for(var i=0;i<stateConfig.beChangingStates.length;i++){
						var changingState = arguments.callee( stateConfig.beChangingStates[i] ) ;
						states[name].beChangingStates.push(changingState) ;
					}
					Class.cloneObject(states[name],config.stateMachines[name].properties) ;
				}
				return states[name] ;
			}

			var aParser = new Parser() ;
			aParser.defaultState = createState(config.defaultMachineName) ;
			return aParser ;
		}

		, cloneConfig : function(config){
			var newConfig = {
				stateMachines: {}
				, defaultMachineName: config.defaultMachineName
			}

			for(var name in config.stateMachines){
				var state = {
					"class": config.stateMachines[name].class
					, "beChangingStates": []
					, "properties": {}
				}
				Class.cloneObject(state.beChangingStates,config.stateMachines[name].beChangingStates) ;
				Class.cloneObject(state.properties,config.stateMachines[name].properties) ;
				newConfig.stateMachines[name] = state ;
			}

			return newConfig ;
		}
	}
) ;

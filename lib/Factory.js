require('seajs') ;
define(function(require){
//----------------------------------------------------

	var StateText = require("./StateText.js") ;
	var StateTag = require("./StateTag.js") ;
	var StateAttribute = require("./StateAttribute.js") ;
	var StateScript = require("./StateScript.js") ;
	var StateComment = require("./StateComment.js") ;
	var StateDefault = require("./StateDefault.js") ;

	var Parser = require("./Parser.js") ;
	var Class = require("ocClass.js") ;

	var Factory = Class.extend(

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
				var createState = function(name){
					if(!(name in states))
					{
						var stateConfig = config.stateMachines[name] ;
						states[name] = new stateConfig.class ;
						for(var i=0;i<stateConfig.beChangingStates.length;i++){
							var changingState = arguments.callee( stateConfig.beChangingStates[i] ) ;
							states[name].beChangingStates.push(changingState) ;
						}
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
					cloneObject(state.beChangingStates,config.stateMachines[name].beChangingStates) ;
					cloneObject(state.properties,config.stateMachines[name].properties) ;
					newConfig.stateMachines[name] = state ;
				}

				return newConfig ;
			}
		}
	) ;

	return Factory ;
//
//	var Factory = function Factory(){}
//
//	Factory.configs = {
//
//		html: {
//			stateMachines: {
//				"StateTag": {
//					"class": StateTag
//					, "beChangingStates": ["StateAttribute"]
//					, properties: {
//						emptyTags: {
//							area: 1
//							, base: 1
//							, basefont: 1
//							, br: 1
//							, col: 1
//							, hr: 1
//							, img: 1
//							, input: 1
//							, isindex: 1
//							, link: 1
//							, meta: 1
//							, param: 1
//							, embed: 1
//							, "!--": 1
//							, "!doctype": 1
//						}
//					}
//				}
//
//				, "StateAttribute": {
//					"class": StateAttribute
//					, "beChangingStates": []
//					, properties: {}
//				}
//
//				, "StateText": {
//					"class": StateText
//					, "beChangingStates": ["StateTag"]
//					, properties: {}
//				}
//
//				, "StateScript": {
//					"class": StateScript
//					, "beChangingStates": []
//					, properties: {}
//				}
//
//				, "StateDefault": {
//					"class": StateDefault
//					, "beChangingStates": ["StateTag","StateScript","StateText"]
//					, properties: {}
//				}
//			}
//			, defaultMachineName: "StateDefault"
//		}
//
//	}
//
//	Factory.htmlParser = function(){
//		return Factory.create( Factory.configs.html ) ;
//	}
//
//	Factory.create = function(config){
//		var states = {} ;
//		var createState = function(name){
//			if(!(name in states))
//			{
//				var stateConfig = config.stateMachines[name] ;
//				states[name] = new stateConfig.class ;
//				for(var i=0;i<stateConfig.beChangingStates.length;i++){
//					var changingState = arguments.callee( stateConfig.beChangingStates[i] ) ;
//					states[name].beChangingStates.push(changingState) ;
//				}
//			}
//			return states[name] ;
//		}
//
//		var aParser = new Parser() ;
//		aParser.defaultState = createState(config.defaultMachineName) ;
//		return aParser ;
//	}
//
////	var cloneObject = function cloneObject(newObj,srcObj){
////
////		var cloneProps = function(newObj,srcObj,propName){
////
////			if( typeof(srcObj[propName])=='object' )
////			{
////				newObj[propName] = srcObj[propName].constructor===Array? []: {} ;
////				cloneObject( newObj[propName], srcObj[propName] ) ;
////			}
////			else
////			{
////				newObj[propName] = srcObj[propName] ;
////			}
////		}
////
////		if( srcObj.constructor === Array )
////		{
////			for(var i=0; i<srcObj.length; i++)
////			{
////				cloneProps(newObj,srcObj,i) ;
////			}
////		}
////		else
////		{
////			for(var k in srcObj)
////			{
////				cloneProps(newObj,srcObj,k) ;
////			}
////		}
////	}
//
//	Factory.cloneConfig = function(config){
//		var newConfig = {
//			stateMachines: {}
//			, defaultMachineName: config.defaultMachineName
//		}
//
//		for(var name in config.stateMachines){
//			var state = {
//				"class": config.stateMachines[name].class
//				, "beChangingStates": []
//				, "properties": {}
//			}
//			cloneObject(state.beChangingStates,config.stateMachines[name].beChangingStates) ;
//			cloneObject(state.properties,config.stateMachines[name].properties) ;
//			newConfig.stateMachines[name] = state ;
//		}
//
//		return newConfig ;
//	}
//
//
//	return Factory ;
//----------------------------------------------------
});

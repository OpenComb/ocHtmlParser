require('seajs') ;

define(function(require){

	var Parser = require("../") ;

	require("fs").readFile(__dirname+"/templates/css-zen-garden.html",function(err,bff){

		if(err){
			throw new Error(err) ;
		}

		var parser = Parser.htmlParser() ;
		var objTree = parser.parseSync(bff) ;

		console.log(objTree) ;

	})



}) ;



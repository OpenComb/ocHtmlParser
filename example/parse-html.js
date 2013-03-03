require('seajs') ;

define(function(require){

	var Parser = require("../lib/Parser.js") ;

	require("fs").readFile(__dirname+"/templates/css-zen-garden.html",function(err,bff){

		if(err){
			throw new Error(err) ;
		}

		var parser = Parser.htmlParser() ;
		parser.parseSync(bff) ;

	})



}) ;



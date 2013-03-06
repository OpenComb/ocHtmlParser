require('seajs') ;

define(function(require){

	var ParserFactory = require("../") ;

	require("fs").readFile(__dirname+"/templates/css-zen-garden.html",function(err,bff){

		if(err){
			throw new Error(err) ;
		}

		var parser = ParserFactory.htmlParser() ;
		try{
			var objTree = parser.parseSync(bff) ;
		}catch(e){
			console.log(e.stack) ;
			console.log(e.toString()) ;
		}

		console.log(objTree) ;

	})



}) ;



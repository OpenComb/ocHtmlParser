require('seajs') ;

define(function(require){
//----------------------------------------------------

	function HtmlSource(html){
		this.html = html ;
		this.seek = 0 ;
	}
	HtmlSource.NOQUOTE_BOUNDARY_CHAR = /[=\s>\/]/g ;
	HtmlSource.BOUNDARY_CHAR_PATTERN = {
		"'": /'/g
		, '"': /"/g
	}

	HtmlSource.prototype.read = function(length,forwadSeekPos){

		if(this.isEnd()){
			return null ;
		}

		length = length===undefined? 1: length ;

		if(forwadSeekPos)
		{
			var char = this.html.substr(this.seek,length) ;
			this.seek+= length ;
			return char ;
		}
		else
		{
			return this.html.substr(this.seek,length) ;
		}
	}

	HtmlSource.prototype.line = function(seek){

	}

	HtmlSource.prototype.isEnd = function(seek){
		return this.html.length <= (seek===undefined? this.seek: seek) ;
	}

	HtmlSource.prototype.until = function(regexp){

		if(!regexp.global )
		{
			throw new Error("HtmlSource::until()的参数 regexp ，属性 global 必须为 true") ;
		}

		regexp.lastIndex = this.seek ;

		var res = regexp.exec(this.html) ;
		if(res===null){
			return "" ;
		}
		else
		{
			var oriSeek = this.seek ;
			this.seek = res.index ;
			return this.html.substr(oriSeek,res.index-oriSeek) ;
		}
	}
	HtmlSource.prototype.untilReturnMatch = function(regexp){

		if(!regexp.global )
		{
			throw new Error("HtmlSource::untilReturnMatch()的参数 regexp ，属性 global 必须为 true") ;
		}

		regexp.lastIndex = this.seek ;
		var res = regexp.exec(this.html) ;
		if(res===null){
			return "" ;
		}
		else
		{
			this.seek = res.index ;
			return res[0] ;
		}
	}

	HtmlSource.prototype.untilQuoteEnd = function(returnRange){

		var range = {
			start: 0
			, length: 0
			, boundaryChar: ""
		}

		var boundaryChar = this.read(1) ;
		if( boundaryChar!="'" && boundaryChar!='"' )
		{
			boundaryChar = HtmlSource.NOQUOTE_BOUNDARY_CHAR ;
		}
		else
		{
			// 跳过引号
			this.seek ++ ;
			range.boundaryChar = boundaryChar ;
			boundaryChar = HtmlSource.BOUNDARY_CHAR_PATTERN[boundaryChar] ;
		}

		range.start = this.seek ;
		this.untilReturnMatch(boundaryChar) ;
		range.length = this.seek - range.start ;

		// 跳过引号
		if( range.boundaryChar!==null )
		{
			this.seek ++ ;
		}

		return range ;
	}

	HtmlSource.prototype.substr = function(from,length){
		return this.html.substr(from,length) ;
	}

	HtmlSource.prototype.position = function(seek){
		var beforeString = this.html.substr(0,seek+1) ;

		// 统一换行符
		beforeString = beforeString.replace(/\r\n/,"\n") ;
		beforeString = beforeString.replace(/\r/,"\n") ;
		// 删除行尾的\n
		beforeString = beforeString.replace(/\n$/,"") ;

		var res = beforeString.match(/\n/g) ;
		var line = res===null? 1: res.length+1 ;
		var lastNlIdx = beforeString.lastIndexOf("\n") ;

		return {
			"line": line
			, "char": lastNlIdx>=0? (beforeString.length-lastNlIdx-1): beforeString.length
		}

	}

	return HtmlSource ;

//----------------------------------------------------
}) ;
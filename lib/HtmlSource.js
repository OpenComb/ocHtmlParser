require('seajs') ;

define(function(require){
//----------------------------------------------------

	function HtmlSource(html){
		this.html = html ;
		this.seek = 0 ;
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
		var str = "" ;

		while( !this.isEnd() ){
			var char = this.read(1,true) ;
			if( regexp.test(char) )
			{
				this.seek -- ;
				break ;
			}

			str+= char ;
		}

		return str ;
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
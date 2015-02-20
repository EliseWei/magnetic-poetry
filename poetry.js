	var z = 1000;
	var d = document;
	var b = d.getElementsByTagName('body')[0];
	var sRadius = 150;
	var wordList = ['effulgent','miasma','plethora','diaphanous','precipitously','chagrin','pragmatic','rectitude','harbinger','unanimous','impetus','clarion','thus'];
	var wordFreq = 15;
	
	var LEX_URL = "lexicon.js";
	var LEX_TAG_URL = "lexicon_tags.js";
	
	initPanel();

	function initPanel(){
		b.style.paddingTop = "0px !important";
		var styleString = "#optPanel{background:#cdf;width:100%;z-index:10000;position:fixed;left:0px;padding:5px 0;font-family:Arial;" +
			"text-align:center;color:#000}#optInner{background:#fff;width:770px;padding:10px 20px;margin:0px auto;"+
			"text-align:left;overflow:auto}#optInner h3{font-size:20px;font-weight:bold;margin:0 0 5px;text-transform:"+
			"uppercase}#optPanel p{margin:0;position:absolute;width:100%;padding-top:.4em} #optPanel p a{color:#0090FF}"+
			"#optInner ul{width:360px; margin:0 40px 0 10px;padding-left:10px;float:left;list-style:disc}#optInner ul.options{width:320px;"+
			"list-style:none;padding-left:0;margin:0}ul#options{margin-bottom:8px}#optInner input{margin:"+
			"0px 5px 0px 0px;font-size:12px;float:none;position:static}#optInner input#sRadius{width:40px}#optInner "+
			"button{float:left;font-size:16px;padding:.3em}#optToggle,#optHide{display:none;font-size:20px;width:20px;font-weight"+
			":bold;text-decoration:none;float:left;position:relative;line-height:1em}#optHide{float:right;margin-right:20px}";
		insertStyleSheet(styleString);
		var o = d.createElement('div');
		o.id = "optPanel";
		o.innerHTML = "<p>&nbsp;</p><a href='#' id='optToggle'>+</a><a href='#' id='optHide'>x</a>";
		var oI = d.createElement('div');
		oI.id = "optInner";
		var formHtml = "<h3>Magnetic Poetry</h3>"+
		"<ul><li><strong>Alt+click</strong> - Scatter a clear "+
		"area around your cursor</li>"+
		"<li><strong>S+click+drag</strong> - Select an area of multiple elements</li>"+
		"<li><strong>S</strong> - Clear existing multi-select area</li>"+
		"</ul><ul class='options' style='width:300px;'><li>Scatter radius (50-300): <input id='sRadius' name='sRadius' type='text' value='" + 
		sRadius + "' min='50' max='300'>pixels</li></ul><ul class='options' id='options'>" +
		"<li><input id='randWds' name='randCheck' type='checkbox'>Insert random words</li>";
		if(getInternetExplorerVersion() < 0) {
			formHtml += "<li><input id='posYes' name='posCheck' type='checkbox'>Parts of speech coloring</li>";
		};
		formHtml += "</ul><button id='createBtn' onclick='createMag();'>Make it so!</button>";
		oI.innerHTML = formHtml;
		o.appendChild(oI);
		b.insertBefore(o,b.firstChild);
	};
	function createMag(){
		var styleString = "div.mag{display:inline-block;width:auto !important;margin:0 !important;padding:0 !important;"+
			"position:relative} div.mag em{display:block;visibility:hidden;padding:0 .2em;border:solid 1px #000}" + 
			"div.mag span{background-color:#fff;border:solid 1px #999 !important;padding:0 .2em;white-space:nowrap;" +
			"color:#000 !important; display:inline-block;cursor:pointer;position:absolute;left:0px;top:0px}div.mag span.J,"+
			"div.mag span.R{background:#ddf}div.mag span.N, div.mag span.P{background:#fed}div.mag span.V, div.mag span.M{background:#dfd}";
		insertStyleSheet(styleString);
		var waitDiv = d.createElement('div');
		waitDiv.id = "waitMsg";
		waitDiv.style.display = "inline-block";
		waitDiv.style.padding = ".4em";
		waitDiv.innerHTML = "One moment...";
		d.getElementById('optInner').appendChild(waitDiv);
		if(d.getElementById('posYes') && d.getElementById('posYes').checked) {
			loadLexFiles();
		}else{
			panelControls();
			parseText(b);
		};
	};
	function parseText(p){
		if(p.id != "optPanel"){
			p.style.backgroundColor = "transparent";
			p.style.backgroundImage = "none";
			p.style.overflow = "visible";
			p.style.border = "0";
			var c = p.childNodes;
			var nC = c.length;
			for(var i=0;i<nC;i++){
				if(c[i].nodeType == "3" && c[i].textContent.replace(/^[\s]+|[\s]+$|\t+|\r+|\n+|\0+/,"").length > 1){
					var nS = c[i].nextSibling;
					if(nS){
						var sW = d.createElement("div");
						sW.style.display = "inline";
					};
					var w = c[i].textContent.split(/\s/);
					// Inserting random words
					if (d.getElementById('randWds').checked) {
						var toIns = Math.floor(w.length/wordFreq);
						for (var z = 0; z <= toIns; z++){
							var indIns = Math.floor(Math.random() * w.length);
							var indWord = Math.floor(Math.random() * wordList.length);
							w.splice(indIns,0,wordList[indWord]);
						};
					}
					c[i].textContent = "";
					for(var j=0;j<w.length;j++){
						var pReg = /[\.\,\"\:\;\?\!\@]+/;
						var nwReg = /[^A-z0-9\'\-\u2019\u2013]+/g;
						if(w[j].search(pReg) != -1 && w[j].match(pReg).length < w[j].length){
							var nW = new Array;
							var t = w[j];
							var tS = t.search(pReg);
							var tML = t.match(pReg)[0].length;
							var l = 0;
							while(tS >= 0 && tML != t.length){
								if(tS == 0){nW[l] = t.substr(0,tML);t = t.substr(tML);}
								else{nW[l] = t.substr(0,tS).replace(nwReg,'');t = t.substr(tS);};
								l++;
								tS = t.search(pReg);
								if(tS<0){nW[l] = t.replace(nwReg,''); break};
								tML = t.match(pReg)[0].length;
								if(tML == t.length){nW[l] = t; break};
							};
							for(var k=0;k<nW.length;k++){
								if(nS){sW.appendChild(magWrap(nW[k]))}
	 							else{p.appendChild(magWrap(nW[k]));};
							};
						}else{
							w[j]=w[j].replace(nwReg,'');
							if(w[j].length>0){
								if(nS){sW.appendChild(magWrap(w[j]))}
	 							else{p.appendChild(magWrap(w[j]));};
							};
						};
					};
					if(nS){p.replaceChild(sW,c[i]);};
				}else if (c[i].nodeType == "1" && c[i].nodeName.toLowerCase() == "img"){
					var iStr = "<img ";
					var q = 0;
					for(q=0;q<c[i].attributes.length;q++){
						iStr += c[i].attributes[q].name + "='" + c[i].attributes[q].value + "' ";
					}
					iStr += "/>";
					p.replaceChild(magWrap(iStr),c[i]);
				}else if (c[i].nodeType == "1" && c[i].nodeName.toLowerCase() != "script"){
					parseText(c[i]);
				};
			};
		};
	};
	function magWrap(content,tag){
		var dW = d.createElement("div");
 		dW.className = "mag";
 		var h = d.createElement("em");
 		h.innerHTML = content;
 		var m = d.createElement("span");
 		m.innerHTML = content;
 		if(pL && lTM) {
	 		var wA = new Array(content);
	 		var taggedWord = new POSTagger().tag(wA);
	 		m.className = taggedWord[0][1].charAt(0);
	 	};
 		m.onmousedown = mClickStartHandler;
 		m.onmouseup = function(ev){
 			if(this.onmousemove) this.onmousemove = null;
			stopEvents(ev);
 		};

 		dW.appendChild(h);
 		dW.appendChild(m);
 		return dW;
	};
	function mClickStartHandler(ev){
		if (!ev) var ev = window.event;
		if(ev.altKey){scatter;return false;};

		var mS = this;
		mS.style.zIndex = z;

		var xDisp = getPos(mS.parentNode).x + .5*(mS.offsetWidth);
		var yDisp = getPos(mS.parentNode).y + .5*(mS.offsetHeight);

		d.onmousemove = function(e){
			posx = eventRealXY(e).x;
			posy = eventRealXY(e).y;
			mS.style.left = posx - xDisp + "px";
			mS.style.top = posy - yDisp + "px";
		};
		z++;
		this.onmouseup = function(ev){
			if(d.onmousemove) d.onmousemove = null;
			stopEvents(ev);
		};
		stopEvents(ev);
	};
	function scatter(ev){
		if (isNum(d.getElementById('sRadius').value)) {
			sRadius = Math.max(50,d.getElementById('sRadius').value);
			sRadius = Math.min(300,sRadius);
		} else {
			d.getElementById('sRadius').value = 150;
			sRadius = 150;
		};
		if (!ev) var ev = window.event;
		var cEvent = {x:null,y:null,radius:sRadius};
			cEvent.x = (ev.pageX || ev.clientX);
			cEvent.y = (ev.pageY || ev.clientY);
		var magnets = d.getElementsByClassName("mag");
		for(var i=0;i<magnets.length;i++){
			var mTM = magnets[i].childNodes[1];
			if(Math.min(Math.abs(getPos(mTM).x - cEvent.x),Math.abs(getPos(mTM).y - cEvent.y)) < 1.2*cEvent.radius)
			{
				var mD = toMove(mTM,cEvent);
				if(mD){
					if(mD.yDiff == 0) mD.yDiff = 1;
					var toGo = cEvent.radius - mD.dist;
					var slope = mD.xDiff/mD.yDiff;
					var yToGo = Math.ceil(Math.sqrt(Math.pow(toGo,2)/(Math.pow(slope,2) + 1)));
					if(mD.yDiff < 0) yToGo = yToGo*(-1);
					var xToGo = Math.ceil(Math.abs(yToGo*slope));
					if(mD.xDiff < 0) xToGo = xToGo*(-1);

					mTM.style.left = mTM.offsetLeft - xToGo +"px";
					mTM.style.top = mTM.offsetTop - yToGo +"px";
					mTM.style.zIndex = z;
				};
			};
		};
		stopEvents(ev);
	};
	function toMove(elem,cEvent){
		var ptNW = {xDiff:null,yDiff:null,dist:null};
		var ptSE = {xDiff:null,yDiff:null,dist:null};

		ptNW.xDiff = cEvent.x - getPos(elem).x;
		ptNW.yDiff = cEvent.y - getPos(elem).y;
		ptNW.dist  = Math.sqrt(Math.pow(ptNW.xDiff,2) + Math.pow(ptNW.yDiff,2));

		ptSE.xDiff = ptNW.xDiff + elem.offsetWidth;
		ptSE.yDiff = ptNW.yDiff + elem.offsetHeight;
		ptSE.dist  = Math.sqrt(Math.pow(ptSE.xDiff,2) + Math.pow(ptSE.yDiff,2));

		if(Math.min(ptSE.dist,ptNW.dist) < cEvent.radius){
			if(ptSE.dist < ptNW.dist){return ptSE;}
			else{return ptNW;}
		};
		return null;
	};

	var h = d.createElement('div');
	h.style.position = 'absolute';
	h.style.opacity = .3;
	h.style.filter = 'alpha(opacity=30)';
	b.appendChild(h);
	var selectBox = {nwX: null,nwY: null,seX: null,seY: null};
	var slctdMags = [];
	function multiSelect(ev){
		if (!ev) var ev = window.event;
		h.style.border = '2px solid #66aacc';
		h.style.backgroundColor = '#99ddff';
		h.style.zIndex = z + 1;
		h.style.left = eventRealXY(ev).x + 'px';
		h.style.top = eventRealXY(ev).y + 'px';
		var xDiff, yDiff;
		slctdMags = [];
		d.onmousemove = function(e){
			xDiff = eventRealXY(e).x - eventRealXY(ev).x;
			yDiff = eventRealXY(e).y - eventRealXY(ev).y;
			h.style.width = Math.abs(xDiff) + "px";
			h.style.height = Math.abs(yDiff) + "px";
			if(xDiff<0) h.style.left = eventRealXY(ev).x + xDiff + 'px';
			if(yDiff<0) h.style.top = eventRealXY(ev).y + yDiff + 'px';
		};
		d.onmouseup = function(ev){
			selectBox.nwX = getPos(h).x;
			selectBox.nwY = getPos(h).y;
			selectBox.seX = getPos(h).x + Math.abs(xDiff);
			selectBox.seY = getPos(h).y + Math.abs(yDiff);
			var magnet = {nwX: null,nwY: null,seX: null,seY: null};
			var magDivs = d.getElementsByClassName("mag");
			for(var j=0;j<magDivs.length;j++){
				var mTM = magDivs[j].childNodes[1];
				magnet.nwX = getPos(mTM).x;
				magnet.nwY = getPos(mTM).y;
				magnet.seX = getPos(mTM).x + mTM.offsetWidth;
				magnet.seY = getPos(mTM).y + mTM.offsetHeight;
				if (magnet.nwX < selectBox.seX && magnet.seX > selectBox.nwX &&
					magnet.nwY < selectBox.seY && magnet.seY > selectBox.nwY){
					mTM.className += " mSelected";
					slctdMags.push(mTM);
				}else{mTM.className = mTM.className.replace("mSelected","");}
			};
			if(this.onmousemove) this.onmousemove = null;
			stopEvents(ev);
		};
		stopEvents(ev);
	};
// Global event binding
	d.onkeydown = function(ev){
		if(!ev) var ev = window.event;
		if(ev.keyCode) var code = ev.keyCode;
		var character = String.fromCharCode(code);
		if(character.toLowerCase() === "s" && !this.onmousedown){
			h.style.width = "0px";
			h.style.height = "0px";
			h.style.border = '0px';
			d.onmousedown = multiSelect;
		}else if(code == 18 && !this.onclick){
			d.onclick = scatter;
		}
	};
	d.onkeyup = function(ev){
		if(d.onclick) d.onclick = null;
		if(d.onmousedown) d.onmousedown = null;
	};
	h.onmousedown = function(ev){
		var xOffSet = getPos(h).x - eventRealXY(ev).x;
		var yOffSet = getPos(h).y - eventRealXY(ev).y;
		var startPos = [];
		for(var k=0;k<slctdMags.length;k++){
			var temp = {x:null,y:null};
			temp.x = slctdMags[k].offsetLeft;
			temp.y = slctdMags[k].offsetTop;
			startPos.push(temp);
		};
		if(ev.pageX || ev.pageY){
			h.onmousemove = function(e){
				h.style.left = e.pageX + xOffSet + 'px';
				h.style.top = e.pageY + yOffSet + 'px';
				xMov = e.pageX - ev.pageX;
				yMov = e.pageY - ev.pageY;
				
				for(var j=0;j<slctdMags.length;j++){
					slctdMags[j].style.left = startPos[j].x + xMov + "px";
					slctdMags[j].style.top = startPos[j].y + yMov + "px";
				}
			};
		}else if(ev.clientX || ev.clientY){
			h.onmousemove = function(e){
				h.style.left = e.clientX+ d.body.scrollLeft + d.documentElement.scrollLeft + xOffSet + 'px';
				h.style.top = e.clientY + d.body.scrollTop + d.documentElement.scrollTop + yOffSet + 'px';
				xMov = e.clientX - ev.clientX;
				yMov = e.clientY - ev.clientY;
				
				for(var j=0;j<slctdMags.length;j++){
					slctdMags[j].style.left = startPos[j].x + xMov + "px";
					slctdMags[j].style.top = startPos[j].y + yMov + "px";
				}
			};
		}
		d.onmouseup = function(ev){
			if(h.onmousemove) h.onmousemove = null;
			stopEvents(ev);
		};
	}
// Utility functions 
	function panelControls() {
		var optInner = d.getElementById('optInner');
		var toggle = d.getElementById('optToggle');
		var optHide = d.getElementById('optHide');

		if(d.getElementById('options')){
			d.getElementById('options').style.display = "none";
		};
		if(d.getElementById('waitMsg')){
			d.getElementById('waitMsg').style.display = "none";
		};
		d.getElementById('createBtn').style.display = "none";
		optInner.style.display = "none";
		toggle.style.display = "block";
		optHide.style.display = "block";
		toggle.onclick = function() {
			if(optInner.style.display === "none"){
				optInner.style.display = "block";
				toggle.innerHTML = "-";
			}else{
				optInner.style.display = "none";
				toggle.innerHTML = "+";
			};
			return false;
		};
		optHide.onclick = function() {
			d.getElementById('optPanel').style.display = "none";
			return false;
		};
		if(!isNum(d.getElementById('sRadius').value)){
			d.getElementById('sRadius').value = 150;
		};
	};
	function insertStyleSheet(cssString){
		var styleNode = d.createElement('style');
		styleNode.type = "text/css";
		// browser detection (based on prototype.js)
		if(!!(window.attachEvent && !window.opera)) {
			styleNode.styleSheet.cssText = cssString;
		}else{
			var styleText = d.createTextNode(cssString);
			styleNode.appendChild(styleText);
		}
		d.getElementsByTagName('head')[0].appendChild(styleNode);
	}
	function getPos(el) {
	    for (var lx=0, ly=0;
	         el != null;
	         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
	    return {x: lx,y: ly};
	}
	function stopEvents(ev){
		//For IE
		ev.cancelBubble = true;
		ev.returnValue = false;

		//e.stopPropagation works only in Firefox.
		if (ev.stopPropagation) {
			ev.stopPropagation();
			ev.preventDefault();
		}
	};
	function eventRealXY(ev){
		if (ev.pageX || ev.pageY){
			return {x:ev.pageX,y:ev.pageY};
		}else{
			var xVal = ev.clientX + d.body.scrollLeft + d.documentElement.scrollLeft;
			var yVal = ev.clientY + d.body.scrollTop + d.documentElement.scrollTop;
			return {x:xVal,y:yVal};
		}
	};
	function isNum(val){
		var numTest = /^\d+$/;
		return numTest.test(val);
	};

	var pL = {}, lTM;
	function loadLexFiles(){
		var jsCode = d.createElement('script');
		var jsCode2 = d.createElement('script');
		jsCode.setAttribute('src', LEX_TAG_URL);
		jsCode2.setAttribute('src', LEX_URL);
		b.appendChild(jsCode);
		b.appendChild(jsCode2);
	};
	function lexTags(LEXICON_TAG_MAP) {
		lTM = LEXICON_TAG_MAP;
		console.log('tags ok');
	};
	function lex(POSTAGGER_LEXICON) {
		pL = POSTAGGER_LEXICON;
		console.log('lex ok');
		if(lTM){
			panelControls();
			parseText(b);
		};
	};
	function getInternetExplorerVersion()
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	{
	  var rv = -1; // Return value assumes failure.
	  if (navigator.appName == 'Microsoft Internet Explorer')
	  {
	    var ua = navigator.userAgent;
	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	    if (re.exec(ua) != null)
	      rv = parseFloat( RegExp.$1 );
	  }
	  return rv;
	}
/*!
 * jsPOS
 *
 * Copyright 2010, Percy Wegmann
 * Licensed under the LGPLv3 license
 * http://www.opensource.org/licenses/lgpl-3.0.html
 * 
 * Enhanced by Toby Rahilly to use a compressed lexicon format as of version 0.2.
 */

function POSTagger(){
    this.lexicon = pL;
    this.tagsMap = lTM;
}

/**
 * Indicates whether or not this string starts with the specified string.
 * @param {Object} string
 */
String.prototype.startsWith = function(string){
    if (!string) 
        return false;
    return this.indexOf(string) == 0;
}

/**
 * Indicates whether or not this string ends with the specified string.
 * @param {Object} string
 */
String.prototype.endsWith = function(string){
    if (!string || string.length > this.length) 
        return false;
    return this.indexOf(string) == this.length - string.length;
}

POSTagger.prototype.wordInLexicon = function(word){
    var ss = this.lexicon[word];
    if (ss != null) 
        return true;
    // 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
    if (!ss) 
        ss = this.lexicon[word.toLowerCase()];
    if (ss) 
        return true;
    return false;
}

POSTagger.prototype.tag = function(words){
    var ret = new Array(words.length);
    for (var i = 0, size = words.length; i < size; i++) {
        var ss = this.lexicon[words[i]];
        // 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
        if (!ss) 
            ss = this.lexicon[words[i].toLowerCase()];
        if (!ss && words[i].length == 1) 
            ret[i] = words[i] + "^";
        if (!ss) 
            ret[i] = "NN";
        else 
            ret[i] = this.tagsMap[ss][0];
    }
	
	/**
     * Apply transformational rules
     **/
    for (var i = 0; i < words.length; i++) {
        word = ret[i];
		//  rule 1: DT, {VBD | VBP} --> DT, NN
        if (i > 0 && ret[i - 1] == "DT") {
            if (word == "VBD" ||
            word == "VBP" ||
            word == "VB") {
                ret[i] = "NN";
            }
        }
        // rule 2: convert a noun to a number (CD) if "." appears in the word
        if (word.startsWith("N")) {
			if (words[i].indexOf(".") > -1) {
                ret[i] = "CD";
            }
			// Attempt to convert into a number
            if (parseFloat(words[i]))
                ret[i] = "CD";
        }
        // rule 3: convert a noun to a past participle if words[i] ends with "ed"
        if (ret[i].startsWith("N") && words[i].endsWith("ed")) 
            ret[i] = "VBN";
        // rule 4: convert any type to adverb if it ends in "ly";
        if (words[i].endsWith("ly")) 
            ret[i] = "RB";
        // rule 5: convert a common noun (NN or NNS) to a adjective if it ends with "al"
        if (ret[i].startsWith("NN") && word.endsWith("al")) 
            ret[i] = i, "JJ";
        // rule 6: convert a noun to a verb if the preceding work is "would"
        if (i > 0 && ret[i].startsWith("NN") && words[i - 1].toLowerCase() == "would") 
            ret[i] = "VB";
        // rule 7: if a word has been categorized as a common noun and it ends with "s",
        //         then set its type to plural common noun (NNS)
        if (ret[i] == "NN" && words[i].endsWith("s")) 
            ret[i] = "NNS";
        // rule 8: convert a common noun to a present participle verb (i.e., a gerund)
        if (ret[i].startsWith("NN") && words[i].endsWith("ing")) 
            ret[i] = "VBG";
    }
	var result = new Array();
	for (i in words) {
		result[i] = [words[i], ret[i]];
	}
    return result;
}

POSTagger.prototype.prettyPrint = function(taggedWords) {
	for (i in taggedWords) {
        print(taggedWords[i][0] + "(" + taggedWords[i][1] + ")");
    }
}

//print(new POSTagger().tag(["i", "went", "to", "the", "store", "to", "buy", "5.2", "gallons", "of", "milk"]));
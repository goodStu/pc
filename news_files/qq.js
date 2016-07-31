
var qq = {
	$ : function(objName){
		if(document.getElementById){
			return document.getElementById(objName)
		}else{
			return document.all.objName
		}
	},
	isIE : navigator.appVersion.indexOf("MSIE")!=-1?true:false,
	ie6 : navigator.appVersion.indexOf('MSIE 6.0') != -1 ? true : false,
	addEvent : function(obj,eventType,func){
	  if(obj.addEventListener){
	    obj.addEventListener(eventType,func,false)
	  }else{
	    obj.attachEvent('on'+eventType,func);
	  }
	},
	delEvent : function(obj,eventType,func){
	  if(obj.removeEventListener){
	    obj.removeEventListener(eventType,func,false)
	  }else{
	    obj.detachEvent('on'+eventType,func);
	  }
	},
	readStyle: function(obj,name){
		if(obj.style[name]){
			return name.style[name]
		}else if(obj.currentStyle){
				return obj.currentStyle[name]
		}else if(document.defaultView&&document.defaultView.getComputedStyle){
				var d=document.defaultView.getComputedStyle(obj,null);
				return d.getPropertyValue(name)
		}else{
				return null
				}
		},
	style : {
		setOpacity : function(obj,opacity){
			if(typeof(obj.style.opacity) != 'undefined'){
				obj.style.opacity = opacity;
			}else{
				obj.style.filter = 'Alpha(Opacity=' + (opacity*100) + ')';
			};
		}
	},
	extend : {
		show : function(obj,time){
			if(obj.readyStyle(obj,'display') == 'none'){
				obj.style.display = 'block';
			};
			qq.style.display(obj,0);
			time = time || 200;
			var opacity = 0,step = time / 20;
			clearTimeout(obj.showT);
			obj.showT = setTimeout(function(){
				if(opacity >= 1) return;
				opacity +=1/step;
				qq.style.setOpacity(obj,opacity);
				obj.showT = setTimeout(arguments.callee,20);
			},20);
		},
		hide : function(obj,time){
			time = time || 200;
			qq.style.setOpacity(obj,1);
			var opacity = 1,step = time / 20;
			clearTimeout(obj.showT);
			obj.showT = setTimeout(function(){
				if(opacity <= 0){
					obj.style.display = 'none';	
					qq.style.setOpacity(obj,opacity);
					return;
				};
				opacity -= 1/step;
				obj.showT = setTimeout(arguments.callee,20);
			},20);
		},
		actPX : function(obj,key,start,end,speed,endFn,u){
      if(typeof(u) == 'undefined'){u = 'px'};
      clearTimeout(obj['_extend_actPX' + key.replace(/\-\.\=/,'_') + '_timeOut']);
      if(start > end){
        speed = - Math.abs(speed);
      }else{
        speed = Math.abs(speed);
      };
      var now = start;
      var length = end - start;
      obj['_extend_actPX' + key.replace(/\-\.\=/,'_') + '_timeOut'] = setTimeout(function(){
        now += speed;
        //debugger;
        var space = end - now;
        if(start < end){
          if(space < length/3){
            speed = Math.ceil(space/3);
          };
          if(space <= 0){ //end
            obj[key] = end + u;
            if(endFn){endFn()};
            return;
          };
        }else{
          if(space > length/3){
            speed = Math.floor(space/3);
          };
          if(space >= 0){ //end
            obj[key] = end + u;
            if(endFn){endFn()};
            return;
          };
        };
        
        obj[key] = now + u;
        obj['_extend_actPX' + key.replace(/\-\.\=/,'_') + '_timeOut'] = setTimeout(arguments.callee,20);
        
      },20);
    }
	}
}

var list = {
  //new : [],
  toolStatus : 1,
  init : function(){
    this.toolbar.init();
  }
} 

list.toolbar = {
  height : 35,
  autoHide : false,
  _bodyHeight : 0,
  _bodyWidth : 0,
  status : 'show',
  status1Width : 348,
  status2Width : 576,
  init : function(){
    var tempThis = this;
    qq.$('check_btn').onclick = function(){
      tempThis.openTool();
    };
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    qq.$('iBody').style.overflowY = 'scroll';
    qq.$('iBody').style.overflowX = 'hidden';
    qq.$('iBody').style.paddingBottom = '0';
    qq.$('iBody').style.marginBottom = '36px';
    
    this._resetHeight();
    window.onresize = function(){
      tempThis._resetHeight();
    };
    this.changeCheckBox(this.autoHide);
    if(this.autoHide == true){ 
      this.hide(true);
    };
    qq.$('autoHideToolBar').onclick = function(){
      tempThis.changeCheckBox();
      return false;
    };
    qq.addEvent(document,'mousemove',function(e){
      tempThis.mousemove(e);
    });
    qq.addEvent(qq.$('iBody'),'scroll',function(){
      tempThis.scrollTop();
    });
	qq.addEvent(window,'resize',function(){
		
      this._bodyWidth = document.body.offsetWidth;
	  if(this._bodyWidth > 960){
      	//qq.$('goTop').style.left = this._bodyWidth / 2 + 'px';
	  }
    });
      
  },
  openTool : function(){
    var start = qq.$('check_list').offsetWidth,end;
    if(this.toolStatus == 2){
      this.toolStatus = 1;
      end = this.status1Width;
      qq.$('check_btn').className = 'check-btn';
    }else{
      this.toolStatus = 2;
      end = this.status2Width;
      qq.$('check_btn').className = 'check-btn open';
    }
    qq.extend.actPX(qq.$('check_list').style,'width',start,end,50);
  },
  _resetHeight : function(fouce){
    if(this._bodyHeight == document.body.offsetHeight && !fouce){
      return;
    };
    this._bodyHeight = document.body.offsetHeight;
    this._bodyWidth = document.body.offsetWidth;
    qq.$('iBody').style.height = this._bodyHeight - this.height + 'px';
    //qq.$('goTop').style.left = this._bodyWidth / 2 + 'px';

  },
  changeCheckBox : function(status){
    if(status !== true && status !== false){
      status = !this.autoHide;
      this.autoHide = status;
     // list.saveCookie();
    }
    this.autoHide = status;
    qq.$('autoHideToolBar').className = status ? 'check checked' : 'check';
  },
  show : function(noAct){
    this.status = 'show'; 
    this.height = 35;
    if(noAct){
      qq.$('Toolbar').style.bottom = '0';
      qq.$('iBody').style.height = this._bodyHeight - 35 + 'px';
    }else{
      qq.extend.actPX(qq.$('Toolbar').style,'bottom',-30,0,6);
      qq.extend.actPX(qq.$('iBody').style,'height',qq.$('iBody').offsetHeight,this._bodyHeight - this.height ,6)
    }
  },
  hide : function(noAct){
    this.status = 'hide';
    this.height =  5;
    if(noAct){
      qq.$('Toolbar').style.bottom = '-31px';
      qq.$('iBody').style.height = this._bodyHeight - 5 + 'px';
    }else{
      qq.extend.actPX(qq.$('Toolbar').style,'bottom',0,-30,6);
      qq.extend.actPX(qq.$('iBody').style,'height',qq.$('iBody').offsetHeight,this._bodyHeight - this.height,6);
    }
  },
  mousemove : function(e){
   if(this.autoHide === false) return;
   e = window.event ? event : e;
   var mouseY = e.clientY;
   var hotArae;
   if(this.status == 'hide'){
     hotArea = 10;
   }else{
     hotArea =  50;
   };
   if(this._bodyHeight - mouseY < hotArea){
     if(this.status == 'show') {return;};
     this.show();
   };
   if(this._bodyHeight - mouseY > hotArea){
     if(this.status == 'hide') {return;};
     this.hide();
   }
  },
  scrollTop :function(){
    /*var _this = qq.$('iBody');
    var _that = qq.$('goTop');
    
    if(_this.scrollTop == 0){
      //_that.style.display = 'none';
    }else{
     if(this._bodyWidth > 960){
        //_that.style.display = 'block';
        _that.onclick = function(){
			qq.$('iBody').scrollTop = '0px';
       }
      }
    }*/
  } 
}

//日历控件
function GCalendar(u, s, r) {
    this.container = u;
    this.callback;
    this.isStatic;
    this.isStaticTarget = "_self";
    this.isStaticPath;
    this.clientDate = s ? s: new Date();
    this.startDate = r ? r: new Date();
    this.limitStartDate = new Date(2004, 12 - 1, 1);
    var d = this;
    var l = function(b) {
        return document.getElementById(b)
    };
    var p = function(x, b) {
        function w(A, B) {
            function D(E, G, F) {
                if (!E || typeof F != "string") {
                    return
                }
                G = G ? G: "";
                F = F ? F: "";
                E.style[G] = F;
                return E
            }
            if (!B) {
                return
            }
            if (typeof B == "string") {
                var z = /\s?([a-z\-]*)\:\s?([^;]*);?/gi,
                C;
                while ((C = z.exec(B)) != null) {
                    D(A, C[1], C[2])
                }
            } else {
                if (typeof B == "object") {
                    for (var y in B) {
                        D(A, y, B[y])
                    }
                }
            }
        }
        var v = document.createElement(x.tag || "div"),
        c = v.setAttribute ? true: false;
        for (var a in x) {
            if (a == "tag" || a == "children" || a == "cn" || a == "html" || a == "style" || typeof x[a] == "function") {
                continue
            }
            if (a == "cls") {
                v.className = x.cls
            } else {
                if (c) {
                    v.setAttribute(a, x[a])
                } else {
                    v[a] = x[a]
                }
            }
        }
        if (x.html) {
            v.innerHTML = x.html
        }
        w(v, x.style);
        if (b) {
            b.appendChild(v)
        }
        return v
    };
    var k = function(v) {
        var v = Math.random;
        var c = parseInt;
        return Number(new Date()).toString().substring(0, 9) + c(10 * v()) + c(10 * v())
    };
    var m = k();
    var j = this.clientDate;
    var e = j.getFullYear();
    var n = j.getMonth() + 1;
    var t = j.getDate();
    var q = this.startDate;
    var f = q.getFullYear();
    var g = q.getMonth() + 1;
    var h = q.getDate();
    var o = new Date(f, g - 1, 1).getDay();
    var i = new Date(f, g, 0).getDate();
    this.cur_year = f;
    this.cur_month = g;
    this.cur_date = q.getDate();
    this.weekDay = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];
    this.build = function(F) {
        var B = new Date(f, g - 1, 1);
        var v = B.getDay();
        var y = new Array(v > 0 ? v: 0);
        var x = new Date(f, g, 0).getDate();
        var w = new Array();
        var D = 0;
        var G = "";
        for (var A = 1; A <= i; A++) {
            y.push(A)
        }
        var b = this.parseCalendarHeader();
        var z = this.parseCalendarWeekDay();
        var E = this.parseCalendarDayList(y, B);
        var C = p({
            id: "_CalendarHeader_" + m,
            cls: "CalendarHead"
        });
        C.appendChild(b);
        var c = p({
            id: "_CalendarCon_" + m,
            cls: "CalendarCon"
        });
        c.appendChild(z);
        c.appendChild(E);
        this.container.appendChild(C);
        this.container.appendChild(c);
        B = v = y = x = w = D = b = z = E = C = c = null
    };
    this.updateDate = function(c) {
        if (c == 0) {
            return
        }
        var v = new Date(this.cur_year, this.cur_month - 1 + c, 1);
        var b = new Array(v.getDay() > 0 ? v.getDay() : 0);
        var w = v.getFullYear();
        var y = v.getMonth() + 1;
        var z = new Date(this.cur_year, this.cur_month + c, 0).getDate();
        for (var a = 1; a <= z; a++) {
            b.push(a)
        }
        this.cur_year = w;
        this.cur_month = y;
        var x = this.parseCalendarDayList(b, v);
        l("_CalendarYear_").innerHTML = "<h3>" + w + "\u5e74" + y + "\u6708</h3>";
        l("_CalendarDayList_" + m).innerHTML = "";
        l("_CalendarDayList_" + m).appendChild(x);
        tmp = v = z = b = x = null
    };
    this.replaceDate2isStaticPath = function(w, v, y) {
        var x = this.isStaticPath;
        x = x.replace(/\$Y/g, w);
        x = x.replace(/\$M/g, v);
        x = x.replace(/\$D/g, y);		
        return x
    };
    this.parseCalendarHeader = function(M, L, K) {
        var z = p({
            tag: "table",
            width: "222",
            border: "0",
            align: "center",
            cellspacing: "0",
            cellpadding: "0"
        });
        var v = p({
            tag: "tbody"
        });
        var w = p({
            tag: "tr"
        });
        w.setAttribute("valign", "top");
        var H = "&lt;";
        var C = "&gt;";
        var A = f + "\u5e74" + g + "\u6708";
        var G = [24, 19, 136, 24, 19];
        var x = ["&lt;&lt;", "&lt;", A, "&gt;", "&gt;&gt;"];
        var J = ["\u4e0a\u4e00\u5e74", "\u4e0a\u4e00\u6708", "", "\u4e0b\u4e00\u6708", "\u4e0b\u4e00\u5e74"];
        var D = ["btn", "btn", "", "btn", "btn"];
        var F = [ - 12, -1, 0, 1, 12];
        var B, N, y;
        function E(O, c) {
            return function() {
                if (F[O] != 0) {
                    c.updateDate(F[O])
                }
            }
        }
        for (var I = 0; I < 5; I++) {
            B = p({
                tag: "td"
            });
            B.setAttribute("width", G[I]);
            B.setAttribute("title", J[I]);
            N = "a";
            if (I == 2) {
                N = "h3";
                B.setAttribute("id", "_CalendarYear_");
                B.setAttribute("align", "center")
            }
            y = p({
                tag: N,
                href: "javascript:void(0)"
            });
            if (y.attachEvent) {
                y.attachEvent("onclick", E(I, d))
            } else {
                if (y.addEventListener) {
                    y.addEventListener("click", E(I, d), false)
                }
            }
            y.innerHTML = x[I];
            y.className = D[I];
            B.appendChild(y);
            w.appendChild(B)
        }
        v.appendChild(w);
        z.appendChild(v);
        v = w = H = C = A = B = N = y = null;
        return z
    };
    this.parseCalendarWeekDay = function() {
        var x = this.weekDay;
        var y = p({
            tag: "table",
            width: "226",
            border: "0",
            align: "center",
            cellspacing: "2",
            cellpadding: "0"
        });
        var b = p({
            tag: "tbody"
        });
        var w = p({
            tag: "tr"
        });
        var a, v;
        for (var c = 0; c < x.length; c++) {
            a = "";
            if (c == 0) {
                a = "sunday"
            }
            if (c == x.length - 1) {
                a = "saturday"
            }
            v = p({
                tag: "th",
                html: x[c],
                cls: a
            });
            w.appendChild(v)
        }
        b.appendChild(w);
        y.appendChild(b);
        x = a = b = w = v = null;
        return y
    };
    this.parseCalendarDayList = function(N, L) {
        var K = N;
        var O = L;
        var I = 0;
        var A = O.getFullYear();
        var M = O.getMonth() + 1;
        var H = O.getDay() + 1;
        var C = p({
            id: "_CalendarDayList_" + m
        });
        var y = p({
            tag: "table",
            width: "226",
            border: "0",
            align: "center",
            cellspacing: "2",
            cellpadding: "0"
        });
        var c = p({
            tag: "tbody"
        });
        var w, v, z, x;
        var J, D;
        function B(y, m, d, P) {
            return function() {
                if (typeof P.callback == "function") {
                    P.callback(y, m, d)
                }
            }
        }
        for (var G = 0; G < 6; G++) {
            v = p({
                tag: "tr"
            });
            for (var E = 0; E < 7; E++) {
                J = K[I++];
                z = p({
                    tag: "td"
                });
                if (J == h && this.cur_year == f && this.cur_month == g) {
                    x = p({
                        tag: "em",
                        html: this.cur_date,
                        cls: "today"
                    })
                } else {
                    if (!J) {
                        x = p({
                            tag: ""
                        })
                    } else {
                        var D = new Date(A, M - 1, J);
                        if (D <= this.clientDate && D >= this.limitStartDate) {
                            var F = "javascript:void(0)";
                            if (this.isStatic) {
                                F = this.replaceDate2isStaticPath(A, (M < 10 ? ("0" + M) : M), (J < 10 ? ("0" + J) : J))
                            } else {
                                F = "###";
                            }
                            x = p({
                                tag: "a",
                                html: J,
                                href: F,
                                target: this.isStaticTarget
                            });
                            if (!this.isStatic) {
                                if (x.attachEvent) {
                                    x.attachEvent("onclick", B(A, (M < 10 ? ("0" + M) : M), (J < 10 ? ("0" + J) : J), d))
                                } else {
                                    if (x.addEventListener) {
                                        x.addEventListener("click", B(A, (M < 10 ? ("0" + M) : M), (J < 10 ? ("0" + J) : J), d), false)
                                    }
                                }
                            }
                        } else {
                            x = p({
                                tag: "span",
                                html: J
                            })
                        }
                    }
                }
                z.appendChild(x);
                v.appendChild(z)
            }
            c.appendChild(v)
        }
        y.appendChild(c);
        C.appendChild(y);
        return C
    };
	this.callback = function(y, m, d){
		var x = this.isStaticPath;
        x = x.replace(/\$Y/g, y);
        x = x.replace(/\$M/g, m);
        x = x.replace(/\$D/g, d);		
		x = x.replace(/\$O/g, G.paraElement.mod);
		x = x.replace(/\$C/g, G.paraElement.cata);
		window.location = x;
	}
    this.onclick = function(b) {}
};


var baseTools=function(){}
baseTools.getCookieVal=function(offset){
	var endstr=document.cookie.indexOf(";",offset);
	if(endstr==-1)endstr=document.cookie.length;
	return unescape(document.cookie.substring(offset,endstr));
}
baseTools.getCookie=function(name){
	var arg=name+"=",alen=arg.length,clen=document.cookie.length;
	var i=0;
	while(i<clen){
		var j=i+alen;
		if(document.cookie.substring(i,j)==arg)return baseTools.getCookieVal(j);
		i=document.cookie.indexOf(" ",i)+1;
		if(i==0)break;
	}
	return "";
};

baseTools.setCookie=function(name,value){
	var argv=arguments;
	var argc=argv.length;
	var date = new Date();
	date.setTime(date.getTime()+31536000);
	var expires=(2<argc)?argv[2]:date;
	var path="/";
	var domain=null;
	var secure=false;
	document.cookie=name+"="+escape(value)+((expires==null)?"":("; expires="+expires.toGMTString()))+((path==null)?"":("; path="+path))+((domain==null)?"":("; domain="+domain))+((secure==true)?"; secure":"");
};

(function(){
	var global = {};	
	global.getParameter=function(a){
		var b,c,d,e="",f,g,h=/[^\u4E00-\u9FA5\w\s]/g,i,j;
		b=window.location.href.replace(/&amp;/g,"&");
		d=(c=b.indexOf("?"))>-1?c:b.indexOf("#");
		if(a!=null&&d>-1){
			b=b.substring(d+1);
			b=b.replace(/#/g,"&");
			c=b.split("&");
			for(d=0;d<c.length;d++){
				var f,g;
				f=c[d].split("=")[0];
				g=c[d].substring(c[d].indexOf("=")+1);
				try{
					i=j="";
					i=decodeURIComponent(f);
					j=decodeURIComponent(g);
					f=h.test(i)?f:i;
					g=h.test(j)?g:j;
				}catch(ex){}
				f=f.indexOf("%u")>-1?unescape(f):f;
				g=g.indexOf("%u")>-1?unescape(g):g;
				if(f==a){e=g}
			}
		}
		return e
	}
	global.showArtList = function(responseText){
		try{
			eval("var json = "+responseText);
			if(json.response.code == "0"){
				qq.$("artContainer").innerHTML = json.data.article_info;
				qq.$("totalPage").value = json.data.count;
				G.gotoPage(json.data.page);
			}
			else if(json.response.code == "2"){
				qq.$("totalPage").value = 1;
				G.gotoPage(1);
				qq.$("artContainer").innerHTML = '<div class="article-tips">该日期没有文章！</div>';
			}
			else{
				qq.$("totalPage").value = 1;
				G.gotoPage(1);
				qq.$("artContainer").innerHTML = '<div class="article-tips">文章加载失败！</div>';
			}
		}
		catch (e){
		}		
	}
	global.gotoPage = function(num){
		var totalnum = parseInt(qq.$("totalPage").value);
		var prevpageEl = '<a href="#" class="f12" onclick="prevPage();">&lt;上一页</a>';
		var nextpageEl = '<a href="#" class="f12" onclick="nextPage();">下一页&gt;</a>';
		var beginEl = '';
		var endEl = '';
		var beginnum = 1;		
		var endnum = totalnum + 1;
		var pageitemEl = '';
		if(num == 1){
			prevpageEl = '<span class="na">&lt;上一页</span>';							
		}
		if(num >= totalnum){
			nextpageEl = '<span class="na">下一页&gt;</span>';
		}
		if(totalnum<=6){
			beginnum = 1;
			endnum = totalnum+1;
		}
		else{
			if(num<4){		
				endnum = 6;
				endEl = '<span class="ellipsis">...</span><a href="#" onclick="gotoPage('+totalnum+');">'+totalnum+'</a>';			
			}else if(num>totalnum-3){			
				beginnum = totalnum-4;
				beginEl = '<a href="#" onclick="gotoPage(1);">1</a><span class="ellipsis">...</span>';						
			}
			else{
				beginnum = num-2;
				endnum = num+3;
				beginEl = '<a href="#" onclick="gotoPage(1);">1</a><span class="ellipsis">...</span>';			
				endEl = '<span class="ellipsis">...</span><a href="#" onclick="gotoPage('+totalnum+');">'+totalnum+'</a>';			
			}
		}
		for(var i=beginnum; i<endnum; i++){
			if(i == num) pageitemEl += '<strong>'+i+'</strong>';
			else pageitemEl += '<a href="#" onclick="gotoPage(' + i + ');">' + i + '</a>';
		}

		qq.$("pageArea").innerHTML = [prevpageEl , beginEl , pageitemEl , endEl , nextpageEl].join('');
	}

	global.refreshData = function(){
		qq.$("artContainer").innerHTML = '<div class="loading">正在查询请稍候……</div>';
		var data = "&cata=" + G.paraElement.cata + "&site=" + G.paraElement.site + "&date=" + G.paraElement.date + "&page=" + G.paraElement.page + "&mode=" + G.paraElement.mod + "&of=json";
		var articleAjax = new Ajax("../interface/roll.php?" + Math.random() + data,null , G.showArtList);
		articleAjax.Open();
	}

	global.InitCataList = function(responseText){
		try{
			eval("var json = "+responseText);
			if(json.response.code == "0"){
				var catalist = G.paraElement.cata.split(",");
				var catalen = catalist.length;
				if( G.paraElement.cata!="" && catalen>0 )	
					qq.$("check_list").innerHTML = '<a href="#" class="check" id="catacheck_all" onclick="ChangeCataAll();" >全部</a>';
				else 
					qq.$("check_list").innerHTML = '<a href="#" class="check checked" id="catacheck_all" onclick="ChangeCataAll();">全部</a>';
				
				for( var i=0; i<json.data.length && i<10; i++ ){					
					var cataEl = '<a href="#" onclick="ChangeCata(' + i + ');" class="check" id="catacheck_' + i + '">' + json.data[i].c + '</a>';					
					var temp = {};
					temp.ename = json.data[i].e;
					temp.cname = json.data[i].c;
					temp.checked = '0';
					for( var j=0; j<catalen; j++ ){
						if(catalist[j] == temp.ename) {
							temp.checked = '1';
							cataEl = '<a href="#" onclick="ChangeCata(' + i + ');" class="check checked" id="catacheck_' + i + '">' + json.data[i].c + '</a>';		
							break;
						}
					}
					G.allCataList.push(temp);

					qq.$("check_list").innerHTML += cataEl;
				}
			}
			else alert(json.response.msg);
		}
		catch (e){
		}
	}
	global.requestCataList = function(){
		var data = "&site=" + G.paraElement.site;
		var articleAjax = new Ajax("../interface/catalog.php?" + Math.random() + data,null , G.InitCataList);
		articleAjax.Open();
	}
	window["G"] = global;
}) ();

function Ajax(url, data, handler) {
	this.Url = url;
	this.Data = data;
	this.Handler = handler;
	this.Async = (arguments.length > 4)?arguments[4]:true;
	this.errorHandler = null;
	if(arguments.length > 3&& arguments[3])
		this.errorHandler = arguments[3];
	else
		this.errorHandler = null;

    this.AjaxObj = this.GetAjaxObject();

	var CoreObj = this.AjaxObj;
	var SrcObj = this;
    this.AjaxObj.onreadystatechange = function() {
		if(CoreObj.readyState == 4 ){
			if(CoreObj.status == 200)
				if(SrcObj.Handler != null)		SrcObj.Handler(CoreObj.responseText);
			else
				if(SrcObj.errorHandler != null)		SrcObj.errorHandler();
		}
	}
}
Ajax.prototype.Open = function(){
	this.AjaxObj.open('GET', this.Url, this.Async);
	this.AjaxObj.send();
} 
Ajax.prototype.Send = function() {
	this.AjaxObj.open('POST', this.Url, this.Async);
	this.AjaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if(arguments.length > 0)
		this.AjaxObj.send(arguments[0]);
	else
		this.AjaxObj.send(this.Data);
}
Ajax.prototype.GetAjaxObject = function() {
    var ajaxObj = null;
    try {
		ajaxObj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            ajaxObj = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
	        ajaxObj = new XMLHttpRequest();
        }
    }
    return ajaxObj;
}

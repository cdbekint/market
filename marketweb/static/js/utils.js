export default {
  name: 'util',
  parseParam: function (param, key, encode) {
    if (param == null) return ''

    var paramStr = ''
    var t = typeof (param)
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += this.parseParam(param[i], k, encode)
      }
    }
    return paramStr
  },
  setCookie: function (name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  delCookie: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  randomString: function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  getURLParam: function (paramName) {
    this.paramValue = "";
    this.isFound = false;
    if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
      this.arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&");
      this.i = 0;
      while (this.i < this.arrSource.length && !this.isFound) {
        if (this.arrSource[this.i].indexOf("=") > 0) {
          if (this.arrSource[this.i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
            this.paramValue = this.arrSource[this.i].split("=")[1];
            this.isFound = true;
          }
        }
        this.i++;
      }
    }
    return this.paramValue;
  },
  getStringParam: function (strParamName, strParamString) {
    var strReturn = "";
    var strHref = strParamString.toUpperCase();
    var bFound = false;

    var cmpstring = strParamName.toUpperCase() + "=";
    var cmplen = cmpstring.length;

    var strQueryString = strHref;
    var aQueryString = strQueryString.split("&");
    for (var iParam = 0; iParam < aQueryString.length; iParam++) {
      if (aQueryString[iParam].substr(0, cmplen) == cmpstring) {
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        bFound = true;
        break;
      }

    }
    if (bFound == false) return null;
    return strReturn;
  },
  sliceStr: function (target, len, text) {
    if (target == '' || target == void 0) return;
    len = len == void 0 ? 4 : len;
    text = text == void 0 ? ".." : text;
    return target.length > len ?
      target.slice(0, len) + text : String(target);
  },
  getQuery: function (hash) {
    if (hash == void 0) hash = location.hash;

    var queryArr = hash.slice(hash.indexOf("?") + 1).split("&");
    var res = {};

    queryArr.forEach(function (item) {
      var temp = item.split("=");
      res[temp[0]] = temp[1];
    });
    return res;
  },
  escapeToHtml: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
  noEscapeHtml: function (str) {
    return str.replace(/(\&|\&)gt;/g, ">").replace(/(\&|\&)lt;/g, "<").replace(/(\&|\&)quot;/g, "\"")
  },
  ArraySort: function (array, field, reverse) {
    if (array.length < 2 || !field || typeof array[0] !== "object") return array;
    if (typeof array[0][field] === "number") {
      array.sort(function (x, y) {
        return x[field] - y[field]
      });
    }
    if (typeof array[0][field] === "string") {
      array.sort(function (x, y) {
        return x[field].localeCompare(y[field])
      });
    }
    if (reverse) {
      array.reverse();
    }
    return array;
  },
  changeDateToTime(date) {
    var newDate = new Date(date).toJSON();
    var index = newDate.indexOf("T");
    return newDate.slice(0, index)
  },
  getFormatDate(a, b) {
    //a 时间
    //b 返回类型  b=1 月+日 +时分秒
    var date = null;
    if (a) {
      date = new Date(a);
    } else {
      date = new Date();
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var Hours = date.getHours();
    var Minut = date.getMinutes();
    var Second = date.getSeconds();
    if (Second >= 0 && Second <= 9) {
      Second = "0" + Second;
    }
    if (Minut >= 0 && Minut <= 9) {
      Minut = "0" + Minut;
    }
    if (Hours >= 0 && Hours <= 9) {
      Hours = "0" + Hours;
    }

    var currentdate = ""
    if (b == 1) {
      currentdate = month + seperator1 + strDate +
        " " + Hours + seperator2 + Minut +
        seperator2 + Second;
    } else {
      currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + Hours + seperator2 + Minut +
        seperator2 + Second;
    }

    return currentdate;
  },
  getDate(a, b) {
    var date;
    if(a){
      date=new Date(a)
    }else{
        date=new Date()
    }
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    Y = Y < 10 ? "0" + Y : Y;
    M = M < 10 ? "0" + M : M;
    D = D < 10 ? "0" + D : D;
    if (b == 1) {
      return Y;
    } else if (b == 2) {
      return Y + "-" + M;
    } else if (b == 3) {
      return M + "-" + D;
    } else if (b == 4) {
      return M + "/" + D;
    } else if (b == 5) {
      return M;
    } else if (b == 6) {
      return D
    } else {
      return Y + "-" + M + "-" + D;
    }

  }
}

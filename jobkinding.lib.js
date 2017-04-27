(function ($) {

    var version = "1.0.1";
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var rtirm = new RegExp("^" + whitespace + "+|" + whitespace + "+$", 'g');
    var identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+";
    var attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
    // Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]";
    var content = "\\{((?:\\\\.|[^\\\\}])*)\\}";

    var html = whitespace + "*((#|\\.)?" + identifier + ")*(" + attributes + ")*" + "(" + content + ")?" + whitespace + "*(?:\\*(\\d+\\.)?\\d+)?" + whitespace + "*";

    $.jreg = {
        version: version,
        bool: /^(true|false)$/,
        tirm: rtirm,
        int: /^(\d+)$/,
        float: /^(\d+\.)?\d+$/,
        html: new RegExp("^(" + html + "[+>]" + whitespace + "*)*" + html + "$"),
        date: {
            Y: /(y+)/, //年
            M: /(M+)/, //月份
            D: /(d+)/, //日
            H: /(H+)/, //小时（24小时制）
            h: /(h+)/, //小时（12小时制）
            m: /(m+)/, //分
            s: /(s+)/, //秒
            f: /(f+)/ //毫秒
        }
    };

    var support = {};
    var cssPrefix = ["Webkit", "Moz", "ms"];
    $.lib = {
        version: version,
        max: function () {
            var r = arguments[0] || 0;
            if ($.isArray(r)) {
                return this.max.apply(this, r);
            }
            for (var i = arguments.length - 1; i > 0; i--) {
                if (r < arguments[i]) r = +arguments[i];
            }
            return r;
        },
        min: function () {
            var r = arguments[0] || 0;
            if ($.isArray(r)) {
                return this.min.apply(this, r);
            }
            for (var i = arguments.length - 1; i > 0; i--) {
                if (r > arguments[i]) r = +arguments[i];
            }
            return r;
        },
        sum: function () {
            var r = arguments[0] || 0;
            if ($.isArray(r)) {
                return this.sum.apply(this, r);
            }
            for (var i = arguments.length - 1; i > 0; i--) {
                r += +arguments[i];
            }
            return r;
        },
        avg: function () {
            var r = arguments[0] || 0;
            if ($.isArray(r)) {
                return this.sum.apply(this, r) / r.length;
            }
            return this.sum.apply(this, arguments) / arguments.length;
        },
        date: function (date) {
            var type = $.type(date);
            if (type === "date") {
                return date;
            }
            if (type === "string") {
                date = Date.parse(date);
            }
            if (type === "number" || type === "string") {
                return date === date ? new Date(date) : new Date();
            }
            return new Date();
        },
        day: function (date) {
            return this.date(date).getDate();
        },
        week: function (date) { //$.lib.week(date[ ,isWeekOfMonth])
            date = this.date(date);
            return Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
        },
        weekYear: function (date) {
            date = this.date(date);
            var date2 = new Date(date.getFullYear(), 0, 1);
            var day = Math.round((date.valueOf() - date2.valueOf()) / 86400000);
            return Math.ceil((day + date2.getDay()) / 7);
        },
        month: function (date) {
            return this.date(date).getMonth() + 1;
        },
        year: function (date) {
            return this.date(date).getFullYear();
        },
        dayCount: function (month, year) {
            if (month == 2) {
                return this.isLeapYear(year) ? 29 : 28;
            }
            return (month % 2 == 0 ? month < 7 : month > 8) ? 30 : 31;
        },
        isEmpty: function (data) { //data ==>{string|array}
            return data == null || data.length === 0;
        },
        isLeapYear: function (year) {
            return (year % 400 == 0) || (year % 4 == 0) && (year % 100 > 0);
        },
        isElement: function (element, tag) {
            return !!(element && element.nodeType === 1) && (!tag || tag === "*" || element.nodeType === tag);
        },
        formatTimer: function (date, fmt) { //date ==>{string|number|date},fmt ==>{string}==>(yyyy-MM-dd HH:mm:ss.fff|yyyy-MM-dd hh:mm:ss.fff)
            date = this.date(date);
            fmt = fmt || "yyyy-MM-dd";
            var C = {
                M: date.getMonth() + 1,
                D: date.getDate(),
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            };
            C.h = C.H % 12 || 12;
            if ($.jreg.date.Y.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ('' + date.getFullYear()).substring(4 - RegExp.$1.length));
            }
            for (var A in C) {
                if ($.jreg.date[A].test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? C[A] : ('00' + C[A]).slice(-2));
            }
            if ($.jreg.date.f.test(fmt)) {
                C.f = date.getMilliseconds();
                fmt = fmt.replace(RegExp.$1, (('000' + C.f).substr(('' + C.f).length, RegExp.$1.length) + '00').substr(0, 3));
            }
            return fmt;
        },
        formatNumber: function (number, fmt) { //number ==>{number|string},fmt ==>{number|string|function|array|object}
            number = number || 0;
            var type = $.type(fmt);
            if (type === "array") {
                $.each(fmt, function (fmt2) {
                    number = $.lib.formatNumber(number, fmt2);
                });
                return number;
            }
            if (type === "function") {
                return $.lib.formatNumber(fmt(number));
            }
            number = parseFloat(number);
            if (type === "object") {
                if (fmt.digits) {
                    number = $.lib.formatNumber(number, +fmt.digits >>> 0);
                }
                if (fmt.radix && (!fmt.format || $.type(number = $.lib.formatNumber(number, fmt.format)) === "number")) {
                    number = number.toString(+fmt.radix >>> 0);
                }
                return number;
            }
            if (type === "number" || $.jreg.float.test(fmt)) {
                return Math.round(number * Math.pow(10, +fmt)) / Math.pow(10, +fmt);
            }
            if (type === "string" && (fmt == "#" || fmt == "$")) {
                var arr = ('' + number + '').split('.'),
                    int = arr[0],
                    digits = arr[1] || "00";
                for (var i = int.length - 3; i > 0; i -= 3) {
                    int = int.slice(0, i) + "," + int.slice(i);
                }
                if (digits.length > 2) {
                    digits = $.lib.formatNumber("0." + digits, 2);
                } else {
                    digits = +("0." + digits);
                }
                digits = digits > 0 ? (digits + "00").substr(2, 2) : "00";
                return int + "." + digits;
            }
            return number;
        },
        formatString: function (string) { //string==>{string}
            if (string && arguments.length > 1) {
                for (var i = 1, len = arguments.length; i < len; i++) {
                    string = string.replace(new RegExp("\\{" + (i - 1) + "\\}", "gm"), arguments[i]);
                }
            }
            return string;
        },
        formatMatchString: function (string, data, match, showMatchStr) { //string ==> {string},data ==>{array|object},match ==>{regExp},showMatchStr ==>{boolean}
            return string.replace((match || /\{([^}]+)\}/g), function (match, key) {
                return (key in data) ? data[key] : (showMatchStr ? match : "");
            });
        },
        toQueryString: function (object, eq, spl) { //object ==> {object}, [eq, spl] ==>{string}
            eq = eq || "=";
            var key, results = [];
            for (key in object) {
                results.push(key + eq + escape($.trim(object[key])));
            }
            return results.join(spl || "&");
        },
        queryObject: function (urlStr, eq, spl) { //[urlStr, eq, spl] ==>{string}
            urlStr = urlStr || document.location.search || document.location.url || $.ajaxSettings.url;
            var urlParams = urlStr.substr(urlStr.indexOf("?") + 1).split(spl || "&");
            eq = eq || "=";
            var k, i = 0, r = {};
            for (var len = urlParams.length; i < len; i++) {
                k = urlParams[i].split(eq);
                if ($.jreg.bool.test(r[k[0]] = $.trim(unescape(unescape(unescape(k[1])))))) {
                    r[k[0]] = r[k[0]] === "true";
                } else if ($.jreg.float.test(r[k[0]])) {
                    r[k[0]] = +r[k[0]];
                }
            }
            return r;
        },
        destroyObject: function (object, deep) {
            if (object == null) return null;
            var i, val;
            for (i in object) {
                val = object[i];
                if (deep) {
                    if (val.destroy) {
                        val.destroy();
                    } else {
                        if ($.isPlainObject(val)) {
                            $.lib.destroyObject(val, deep);
                        }
                    }
                }
                val = object[i] = null;
            }
            return object = null;
        }
    };

    var emptyStyle = document.createElement("div").style;
    $.lib.support = function (prop) {
        prop = $.camelCase(prop);
        if (prop in support) {
            return support[prop];
        }
        var name, i = 0,
            propV2 = prop.slice(0).toUpperCase() + prop.slice(1);
        if (prop in emptyStyle) {
            return prop;
        }
        while (name = cssPrefix[i++]) {
            if ((name = (name + propV2)) in emptyStyle) {
                return support[prop] = name;
            }
        }
        return null;
    };

    var multiObj = {
        "ATTR": true,
        "CLASS": true
    };
    var rrelation = new RegExp("^" + whitespace + "*([+>])");
    var xsingleTag = function () {
        var i = -2, r = [];
        while (arguments[i += 2]) {
            r.push(arguments[i] + '="' + (arguments[i + 1] || "") + '"');
        }
        return r.join(" ");
    };

    var rsingleTag = /^(area|br|col|embed|hr|img|input|link|meta|param)$/gi;
    var rmatchObj = {
        TAG: new RegExp("^" + whitespace + "*(" + identifier + ")"),
        ID: new RegExp("^" + whitespace + "*#(" + identifier + ")"),
        CLASS: new RegExp("^" + whitespace + "*\\.(" + identifier + ")")
    };
    var rattr = new RegExp("^" + whitespace + "*" + attributes);
    var rcontent = new RegExp("^" + whitespace + "*" + content);
    var rmulti = new RegExp("^" + whitespace + "*\\*((\\d+\\.)?\\d+)");

    $.lib.singleTag = {
        input: function (value) {
            return xsingleTag("value", value);
        },
        col: function (value) {
            return xsingleTag("width", value);
        },
        img: function (value) {
            return xsingleTag("src", value);
        },
        link: function (value) {
            return xsingleTag("href", value);
        },
        meta: function (value) {
            return xsingleTag("content", value);
        },
        param: function (value) {
            value = value.split(":");
            return xsingleTag("name", value[0], "value", value.pop());
        },
        _default: function (value, tag) {
            return xsingleTag("title", value);
        }
    };

    $.lib.html = function (selector) {
        if (!selector) return "";
        if (selector.nodeType || typeof selector !== "string" || !$.jreg.html.test(selector)) {
            return selector;
        }
        var key, rel, match, matched = true, newSelector = selector, htmlObj = { TAG: "div" };
        while (matched) {
            matched = null;
            for (key in rmatchObj) {
                while (match = rmatchObj[key].exec(newSelector)) {
                    matched = match[0];
                    if (multiObj[key]) {
                        htmlObj[key] = htmlObj[key] || [];
                        htmlObj[key].push(match[1]);
                    } else {
                        htmlObj[key] = match[1];
                    }
                    newSelector = newSelector.replace(rmatchObj[key], "");
                }
            }
        }
        while (match = rattr.exec(newSelector)) {
            htmlObj["ATTR"] = htmlObj["ATTR"] || [];
            if (match[2] == "|=" || match[2] == "^=") {
                match[1] += "-data";
            }
            if (match[2] == "$=") {
                match[1] = "data-" + match[1];
            }
            htmlObj["ATTR"].push(match[1] + '="' + match[3] + '"');

            newSelector = newSelector.replace(rattr, "");
        }
        if (match = rcontent.exec(newSelector)) {
            htmlObj["CONTENT"] = match[1];
            newSelector = newSelector.replace(rcontent, "");
        }
        if (match = rmulti.exec(newSelector)) {
            htmlObj["MULTI"] = match[1];
            newSelector = newSelector.replace(rmulti, "");
        }
        if (newSelector && !(rel = rrelation.exec(newSelector))) {
            return selector;
        }
        if (rel = rel && rel[1]) {
            newSelector = newSelector.replace(rrelation, "");
        }
        var htmls = [htmlObj["TAG"]];
        for (key in htmlObj) {
            if (multiObj[key]) {
                htmlObj[key] = htmlObj[key].join(" ");
            }
            switch (key) {
                case "ID":
                case "CLASS":
                    htmls.push(key.toLowerCase() + '="' + htmlObj[key] + '"');
                    break;
                case "ATTR":
                    htmls.push(htmlObj[key]);
                    break;
                case "CONTENT":
                    if (!(matched = !rsingleTag.test(htmlObj["TAG"]))) {
                        htmls.push(($.lib.singleTag[htmlObj["TAG"]] || $.lib.singleTag._default)(htmlObj["CONTENT"], htmlObj["TAG"], htmlObj));
                    }
                    break;
            }

        }
        htmls = ["<", htmls.join(" "), matched ? ">" : "/>"];
        if (matched) {
            htmls.push(htmlObj["CONTENT"]);
        }
        if (rel == ">") {
            htmls.push($.lib.html(newSelector));
        }
        if (matched || matched == null && !rsingleTag.test(htmlObj["TAG"])) {
            htmls.push("</", htmlObj["TAG"], ">");
        }

        key = 0;
        match = +htmlObj["MULTI"] || 1;
        htmlObj = htmls.join('');
        htmls = [];

        while (key < match) {
            htmls.push(htmlObj.replace("$", ++key));
        }
        if (rel == "+") {
            htmls.push($.lib.html(newSelector));
        }
        return htmls.join('');
    };

    var ua = navigator.userAgent.toLowerCase();
    //var ua = "mozilla/5.0 (compatible; msie 10.0; windows nt 6.1; wow64; trident/6.0; slcc2; .net clr 2.0.50727; .net clr 3.5.30729; .net clr 3.0.30729; .net4.0c; .net4.0e; infopath.3)"; //ie
    //var ua = "mozilla/5.0 (windows nt 6.1; wow64; rv:50.0) gecko/20100101 firefox/50.0"; //firefox
    //var ua = "mozilla/5.0 (windows nt 6.1; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/54.0.2840.99 safari/537.36"; //chrome
    var rsys = /\b(windows|win32|macintosh|mac os x|adobeair|linux|unix)\b/;
    var rkernel = /\b(opera|chrome|webkit|safari|msie|firefox|gecko)\b(\s*(version|rv:|\/)*(\d+(\.\d+)*))?/g;
    ua.replace(rsys, function (match, value) {
        var object = {
            isWindowSys: "win",
            isMacSys: "mac",
            isAirSys: "air",
            isUnixSys: "unix",
            isLinuxSys: "linux"
        };
        for (var i in object) {
            $.lib[i] = value.indexOf(object[i]) > -1;
        }
    });
    ua.replace(rkernel, function (match, type, all, rv, version) { //match:匹配内容,type:内核类型,all:匹配符以及版本号,rv:匹配符,version:版本号
        $.lib["is" + type.charAt(0).toUpperCase() + type.slice(1) + "Kern"] =
            $.lib["is" + type.charAt(0).toUpperCase() + type.slice(1) + "Bro"] = version || true;
    });
    if ($.lib.isSafariKern) {
        if (/applewebkit\/4/.test(ua)) {
            $.lib["isSafariKern"] = 2;
        }
    }
    if ($.lib.isChromeBro) {
        $.lib.isSafariBro = false;
    }

    if ($.lib.isChromeBro || $.lib.isSafariBro || $.lib.isMsieBro) {
        $.lib.isFirefoxBro = false;
    }

    $.lib.isWebkitBro = $.lib.isGeckoBro = false; //修复

    $.lib.isBrowse32Bit = navigator.platform == "Win32"; //是否为32位浏览器

    $.lib.isCompatMode = document.compatMode == "CSS1Compat"; //是否处于兼容性模式

    return $.lib;

})(jobKinding);

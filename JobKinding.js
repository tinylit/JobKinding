(function(window) {
  var version = "1.1.1";

  var arr = [];
  var push = arr.push;
  var slice = arr.slice;
  var concat = arr.concat;
  var indexOf = arr.indexOf || function(item, i) {
    var len = this.length || -1;
    i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }

  var support = {};
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;

  var isArraylike = function(data) {
    var len, type;
    return !(!data || data.window === data) && ((len = data.length) && data.nodeType === 1 || ((type = kimiCriss.type(data)) === "array") || type === "string" || (type !== "function") && (len === 0 || typeof len === "number" && len > 0 && (len - 1) in data));
  };
  var kimiCriss = function(selector, context) {
    return new kimiCriss.fn.init(selector, context);
  };

  kimiCriss.fn = {
    version: version,
    constructor: kimiCriss,
    selector: "",
    length: 0,
    eq: function(i) {
      i = i ? i < 0 ? +i + this.length : +i : 0;
      return this.pushStack((i in this) ? [this[i]] : []);
    },
    get: function(i) {
      return i == null ? this.toArray() : this[i < 0 ? +i + this.length : i];
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    push: push,
    sort: arr.sort,
    indexOf: function(elem, i) {
      if (elem) {
        var type = kimiCriss.type(elem);
        if (type === "string") {
          var kimi = kimiCriss(elem);
          if (kimi.length > 1) {
            type = "function";
            elem = function(elem) {
              return indexOf.call(kimi, elem, i) > -1;
            };
          } else {
            elem = kimi[0];
          }
        }
        if (type === "function") {
          for (i = +i || 0; i < this.length; i++) {
            if (elem(this[i], i)) {
              return i;
            }
          }
        } else {
          return indexOf.call(this, elem, i);
        }
      }
      return -1;
    },
    slice: function() {
      return this.pushStack(slice.apply(this, arguments));
    },
    toArray: function() {
      return slice.call(this);
    }
  };
  var root;
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  kimiCriss.fn.init = function(selector, context) {
    if (!selector) {
      return this;
    }
    var elem, match;
    if (typeof selector === "string") {
      if (selector.charAt(0) === "<" && selector.charAt(-1) === ">" && selector.length >= 3) {
        match = [null, selector, null];
      } else {
        match = rquickExpr.exec(selector);
      }
      if (match && (match[1] || !context)) {
        if (match[1]) {
          context = context && context instanceof kimiCriss ? context[0] : document;
          kimiCriss.merge(this, kimiCriss.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
          if (rsingleTag.test(match[1]) && kimiCriss.isPlainObject(context)) {
            for (match in context) {
              if (kimiCriss.isFunction(this[match])) {
                this[match](context[match]);
              } else {
                this.attr(match, context[match]);
              }
            }
          }
        } else {
          elem = document.getElementById(match[2]);
          if (elem && elem.parentNode) {
            if (elem.id !== match[2]) {
              return root.find(selector);
            }
            this[0] = elem;
            this.length = 1;
          }
          this.context = document;
          this.selector = selector;
          return this;
        }
      }
      if (!context || context.version) {
        return (context || root).find(selector);
      }
      return this.constructor(context).find(selector);
    }
    if (selector.nodeType) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }
    if (kimiCriss.isFunction(selector)) {
      return root.ready(selector);
    }
    if ("selector" in selector) {
      this.selector = selector.selector;
      this.context = selector.context;
    } else {
      this.selector = selector;
      this.context = context;
    }
    return kimiCriss.makeArray(selector, this);
  }
  kimiCriss.fn.init.prototype = kimiCriss.fn;

  var
    extendCallbak = function(value) {
      return value;
    },
    improveCallbak = function(value, key, options) {
      return options[key] == null ? value : options[key];
    };
  kimiCriss.extension = function(args, callback) {
    var isArray, key, value, isTraverse = false,
      configs, options, i = 1,
      len = args.length,
      target = args[0],
      type = kimiCriss.type(target);
    if (type === "boolean") {
      isTraverse = target;
      target = args[i++] || {};
      type = kimiCriss.type(target);
    }
    if (!(type === "object" || type === "function" || type === "array")) {
      target = {};
    }
    if (i === len) {
      target = this;
      i--;
    }
    var setConfigs = function(key) {
      value = options[key];
      configs = target[key];
      if (!(value === configs || value === undefined)) {
        if (value && isTraverse && (kimiCriss.isPlainObject(value) || (isArray = kimiCriss.isArray(value)))) {
          target[key] = kimiCriss.extension([isTraverse, configs || (isArray ? [] : {}), value], callback);
          isArray = false;
        } else {
          if (!callback || (configs = callback(value, key, target)) !== undefined) {
            target[key] = configs;
          }
        }
      }
    };
    for (; i < len; i++) {
      if ((options = args[i]) != null) {
        if (type === "array") {
          for (var j = 0, length = options.length; j < length; j++) {
            setConfigs(j);
          }
        } else {
          for (key in options) {
            setConfigs(key);
          }
        }
      }
    }
    return target;
  };
  kimiCriss.fn.extend = kimiCriss.extend = function() {
    return kimiCriss.extension.call(this, arguments, extendCallbak);
  };
  kimiCriss.fn.improve = kimiCriss.improve = function() {
    return kimiCriss.extension.call(this, arguments, extendCallbak);
  };

  kimiCriss.type = function(obj) {
    return obj == null ? String(obj) : typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
  };

  kimiCriss.extend({
    each: function(data, iterator, context) {
      if (iterator) {
        var i = 0;
        if (isArraylike(data)) {
          for (var len = data.length; i < len; i++) {
            if (iterator.call(context || data, data[i], i, data) === false) {
              break;
            }
          }
        } else {
          for (i in data) {
            if (iterator.call(context || data, data[i], i, data) === false) {
              break;
            }
          }
        }
      }
      return data;
    },
    map: function(data, iterator, arg) {
      var arr = [];
      if (iterator) {
        var i = 0,
          value;
        if (isArraylike(data)) {
          for (var len = data.length; i < len; i++) {
            value = iterator.call(data, data[i], i, arg);
            if (value != null) {
              arr[arr.length] = value;
            }
          }
        } else {
          for (i in data) {
            value = iterator.call(data, data[i], i, arg);
            if (value != null) {
              arr[arr.length] = value;
            }
          }
        }
      }
      return concat.apply([], arr);
    }
  });

  kimiCriss.each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"], function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase();
  });

  var
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    fcamelCase = function(all, letter) {
      return letter.toUpperCase();
    };
  kimiCriss.extend({
    trim: function(str) {
      return str == null ? "" : str.replace(rtrim, '');
    },
    camelCase: function(str) {
      return str == null ? "" : String(str).replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    },
    htmlPrefilter: function(html) {
      return html.replace(rxhtmlTag, "<$1></$2>");
    }
  });

  kimiCriss.extend({
    error: function(msg) {
      throw new Error(msg);
    },
    syntaxError: window.SyntaxError ? function(msg) {
      throw new SyntaxError("Unrecognized expression: " + msg);
    } : function(msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    }
  });

  kimiCriss.extend({
    grep: function(array, callback, inv) {
      if (callback) {
        var val, arr = [];
        if (array) {
          inv = !!inv;
          for (var i = 0, len = array.length; i < len; i++) {
            val = !!callback(array[i], i);
            if (val !== inv) {
              arr.push(array[i]);
            }
          }
        }
        return arr;
      }
      return array;
    },
    merge: function(arr, arr2) {
      arr = arr || [];
      if (arr2) {
        var
          i = 0,
          len = arr.length,
          len2 = arr2.length;
        if (typeof len2 === "number") {
          while (i < len2) {
            arr[len++] = arr2[i++];
          }
        } else {
          while (arr2[i] !== undefined) {
            arr[len++] = arr2[i++];
          }
        }
        arr.length = len;
      }
      return arr;
    },
    makeArray: function(arr, results) {
      results = results || [];
      if (arr != null) {
        if (isArraylike(arr)) {
          kimiCriss.merge(results, typeof arr === "string" ? [arr] : arr);
        } else {
          push.call(results, arr);
        }
      }
      return results;
    },
    indexOfArray: function(item, arr, i) {
      return arr == null ? -1 : indexOf.call(arr, item, i);
    }
  });

  kimiCriss.extend({
    isNumber: function(num) {
      return isFinite(num) && !isNaN(parseFloat(num));
    },
    isString: function(str) {
      return kimiCriss.type(str) === "string";
    },
    isWindow: function(window) {
      return window.window === window;
    },
    isFunction: function(fn) {
      return kimiCriss.type(fn) === "function";
    },
    isArray: Array.isArray || function(arr) {
      return kimiCriss.type(arr) === "array";
    },
    isEmptyObject: function(obj) {
      var i;
      for (i in obj) {
        return false;
      }
      return true;
    },
    isPlainObject: function(obj) {
      if (!obj || kimiCriss.type(obj) !== "object" || obj.nodeType || kimiCriss.isWindow(obj)) {
        return false;
      }

      try {
        if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
          return false;
        }
      } catch (e) {
        return false;
      }

      var key;
      for (key in obj) {}

      return key === undefined || hasOwn.call(obj, key);
    }
  });

  kimiCriss.extend({
    nodeName: function(elem, tag) {
      return elem && elem.nodeName && (!tag || tag === "*" || elem.nodeName.toLowerCase() === tag.toLowerCase());
    }
  });

  kimiCriss.extend({
    propHooks: {
      tabIndex: {
        get: function(elem) {
          var attr = elem.getAttributeNode("tabindex");
          return attr && attr.specified ? parseInt(attr.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
        }
      }
    },
    propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      "for": "htmlFor",
      "class": "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },
    attrHooks: {
      type: {
        set: function(elem, value) {
          if (!support.radioValue && value === "radio" && kimiCriss.nodeName(elem, "input")) {
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }
      }
    }
  });

  var getStyles = function(elem) {
    var view = elem.ownerDocument.defaultView;
    if (!view || !view.opener) {
      view = window;
    }
    return view.getComputedStyle(elem);
  };
  var rmargin = (/^margin/);
  var rnumnonpx = /^((\d+\.)?\d+)(?!px)[a-z%]+$/i;

  function curCSS(elem, name, computed) {
    var width, minWidth, maxWidth, val,
      style = elem.style;
    computed = computed || getStyles(elem);
    if (computed) {
      val = computed.getPropertyValue(name) || computed[name];
      if (val === "" && !kimiCriss.contains(elem.ownerDocument, elem)) {
        val = kimiCriss.style(elem, name);
      }
      if (rnumnonpx.test(val) && rmargin.test(name)) {

        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        style.minWidth = style.maxWidth = style.width = val;
        val = computed.width;
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    return val !== undefined ? ret + "" : ret;
  }

  kimiCriss.extend({
    cssHooks: {
      opacity: {
        get: function(elem, computed) {
          if (computed) {
            var val = curCSS(elem, "opacity");
            return val === "" ? "1" : val;
          }
        }
      }
    },
    cssNumber: {
      "animationIterationCount": true,
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },
    cssProps: {
      "float": "cssFloat"
    }
  });

  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  kimiCriss.each(["height", "width"], function(name) {
    kimiCriss.cssHooks[name] = {
      get: function(elem, computed, extra) {
        if (computed) {
          var val = elem["offset" + name.charAt(0).toUperCase() + name.slice(1)];
          if (val <= 0 || val == null) {
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
              val = elem.style[name];
            }
            if (rnumnonpx.test(val)) {
              return val;
            }
            val = parseFloat(val) || 0;
          }
          return val;
        }
      }
    };
  });

  var whitespace = "[\\x20\\t\\r\\n\\f]";
  var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
  var rbooleans = new RegExp("^(?:" + booleans + ")$", "i");
  (function(support) {
    function assert(fn, tag) {
      var el = document.createElement(tag || "fieldset");
      try {
        return !!fn(el);
      } catch (e) {
        return false;
      } finally {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = null;
      }
    }
    support.getElementsByTagName = assert(function(el) {
      el.appendChild(document.createComment(""));
      return !el.getElementsByTagName("*").length;
    });

    var rnative = /^[^{]+\{\s*\[native code/;
    support.getElementsByClassName = rnative.test(document.getElementsByClassName);

    var expando = "tag" + (+new Date());
    var docElem = document.documentElement;
    support.getElementById = assert(function(el) {
      docElem.appendChild(el).id = expando;
      return !document.getElementsByName || !document.getElementsByName(expando).length;
    });

    assert(function(input) {
      var select = document.createElement("select"),
        option = select.appendChild(document.createElement("option"));

      input.type = "checkbox";
      support.checkOn = input.value !== "";
      support.optionSelected = option.selected;
    }, "input");

    assert(function(input) {
      input = document.createElement("input");
      input.value = "t";
      input.type = "radio";
      support.radioValue = input.value === "t";
    }, "input");

    assert(function(div) {
      var fragment = document.createDocumentFragment(),
        input = document.createElement("input");
      div = fragment.appendChild(div);
      input.setAttribute("type", "radio");
      input.setAttribute("checked", "checked");
      input.setAttribute("name", "t");

      div.appendChild(input);
      support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
      div.innerHTML = "<textarea>x</textarea>";
      support.cloneChecked = !div.cloneNode(true).lastChild.defaultValue;

    }, "div");

    assert(function(div) {
      div.style.cssText = "top:1px;float:left;opacity:.5";
      support.style = /top/.test(div.getAttribute("style"));
      support.opacity = /^0.5/.test(div.style.opacity);

      support.cloneEvent = true;
      if (div.attachEvent) {
        support.cloneEvent = false;
        div.attachEvent("onclick", function() {
          support.cloneEvent = true;
        });
        div.cloneNode(true).click();
      }

      div.style.backgroundClip = "content-box";
      div.cloneNode(true).style.backgroundClip = "";
      support.clearCloneStyle = div.style.backgroundClip === "content-box";

    }, "div");

    assert(function(div) {
      div.innerHTML = "  ";
      support.leadingWhitespace = div.firstChild.nodeType === 3;
    }, "div")

    support.html5Clone = assert(function(nav) {
      return nav.cloneNode(true).outerHTML !== "<:nav></:nav>";
    }, "nav");

    if (assert(function(input) {
        input.setAttribute("value", "");
        return input.getAttribute("value") === "";
      }, "input")) {
      kimiCriss.attrHooks["value"] = {
        get: function(elem) {
          if (elem.nodeName.toLowerCase() === "input") {
            return elem.defaultValue;
          }
        }
      };
    }

    var matches;
    var rbuggyQSA = [];
    var rbuggyMatches = [];
    if ((support.qsa = rnative.test(document.querySelectorAll))) {
      assert(function(el) {
        docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" +
          "<select id='" + expando + "-\r\\' msallowcapture=''>" +
          "<option selected=''></option></select>";
        if (el.querySelectorAll("[msallowcapture^='']").length) {
          rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
        }
        if (!el.querySelectorAll("[selected]").length) {
          rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
        }
        if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
          rbuggyQSA.push("~=");
        }

        if (!el.querySelectorAll(":checked").length) {
          rbuggyQSA.push(":checked");
        }
        if (!el.querySelectorAll("a#" + expando + "+*").length) {
          rbuggyQSA.push(".#.+[+~]");
        }
      });

      assert(function(el) {
        el.innerHTML = "<a href='' disabled='disabled'></a>" +
          "<select disabled='disabled'><option/></select>";
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        el.appendChild(input).setAttribute("name", "D");
        if (el.querySelectorAll("[name=d]").length) {
          rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
        }
        if (el.querySelectorAll(":enabled").length !== 2) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        docElem.appendChild(el).disabled = true;
        if (el.querySelectorAll(":disabled").length !== 2) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        el.querySelectorAll("*,:x");
        rbuggyQSA.push(",.*:");
      });
    }

    if ((support.matchesSelector = rnative.test((matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
      assert(function(el) {
        support.disconnectedMatch = matches.call(el, "*");
        matches.call(el, "[s!='']:x");
        rbuggyMatches.push("!=", pseudos);
      });
    }
    rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

    var hasCompare = rnative.test(docElem.compareDocumentPosition);

    var contains = hasCompare || rnative.test(docElem.contains) ?
      function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
          bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (
          adown.contains ?
          adown.contains(bup) :
          a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
        ));
      } : function(a, b) {
        if (b) {
          while ((b = b.parentNode)) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      };

    function siblingCheck(a, b) {
      var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

      if (diff) {
        return diff;
      }
      if (cur) {
        while ((cur = cur.nextSibling)) {
          if (cur === b) {
            return -1;
          }
        }
      }
      return a ? 1 : -1;
    }

    var hasDuplicate;
    var sortOrder = function(a, b) {
      if (a === b) {
        hasDuplicate = true;
      }
      return 0;
    };
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.sortDetached = assert(function(el) {
      return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
    });
    support.detectDuplicates = !!hasDuplicate;
    sortOrder = hasCompare ?
      function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
          return compare;
        }
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
        if (compare & 1 ||
          (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
          if (a === document || a.ownerDocument === document && contains(document, a)) {
            return -1;
          }
          if (b === document || b.ownerDocument === document && contains(document, b)) {
            return 1;
          }
          return sortInput ? (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) : 0;
        }

        return compare & 4 ? -1 : 1;

      } : function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }

        var cur,
          i = 0,
          aup = a.parentNode,
          bup = b.parentNode,
          ap = [a],
          bp = [b];
        if (!aup || !bup) {
          return a === document ? -1 :
            b === document ? 1 :
            aup ? -1 :
            bup ? 1 :
            sortInput ?
            (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
            0;
        } else if (aup === bup) {
          return siblingCheck(a, b);
        }
        cur = a;
        while ((cur = cur.parentNode)) {
          ap.unshift(cur);
        }
        cur = b;
        while ((cur = cur.parentNode)) {
          bp.unshift(cur);
        }
        while (ap[i] === bp[i]) {
          i++;
        }

        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === document ? -1 : bp[i] === document ? 1 : 0;
      };

    var push_native = push;
    var push = push_native;
    try {
      push.apply((arr = slice.call(document.childNodes)), document.childNodes);
      arr[document.childNodes.length].nodeType;
    } catch (e) {
      push = {
        apply: arr.length ?
          function(target, els) {
            push_native.apply(target, slice.call(els));
          } : function(target, els) {
            var node, i = 0,
              l = target.length;
            while ((node = els[i++])) {
              target[l++] = node;
            }
            target.length = l;
          }
      };
    }

    kimiCriss.uniqueSort = function(results) {
      var elem,
        duplicates = [],
        j = 0,
        i = 0;
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        while ((elem = results[i++])) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      sortInput = null;
      return results;
    };

    kimiCriss.contains = contains;

    function createCache() {
      var keys = [];

      function cache(key, value) {
        if (keys.push(key) > 50) {
          delete cache[keys.shift()];
        }
        return (cache[key] = value);
      }
      return cache;
    }
    var
      classCache = createCache(),
      tokenCache = createCache(),
      compilerCache = createCache();

    var
      characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      identifier = characterEncoding.replace("w", "w#"),
      attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
      // Operator (capture 2)
      "*([*^$|!~]?=)" + whitespace +
      // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
      "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
      "*\\]",

      pseudos = ":(" + identifier + ")(?:\\((" +
      // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
      // 1. quoted (capture 3; capture 4 or capture 5)
      "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
      // 2. simple (capture 6)
      "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
      // 3. anything else (capture 2)
      ".*" +
      ")\\)|)",
      rwhitespace = new RegExp(whitespace + "+", "g"),
      rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

      rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
      rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

      rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

      rpseudo = new RegExp(pseudos),
      ridentifier = new RegExp("^" + identifier + "$"),

      matchExpr = {
        "ID": new RegExp("^#(" + identifier + ")"),
        "CLASS": new RegExp("^\\.(" + identifier + ")"),
        "TAG": new RegExp("^(" + identifier + "|[*])"),
        "ATTR": new RegExp("^" + attributes),
        "PSEUDO": new RegExp("^" + pseudos),
        "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
          "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
          "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
        "bool": rbooleans,
        "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
          whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
      },
      rinputs = /^(?:input|select|textarea|button)$/i,
      rheader = /^h\d$/i,
      rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      rsibling = /[+~]/,
      runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
      funescape = function(_, escaped, escapedWhitespace) {
        var high = "0x" + escaped - 0x10000;
        return high !== high || escapedWhitespace ?
          escaped :
          high < 0 ?
          String.fromCharCode(high + 0x10000) :
          String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
      },
      rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      fcssescape = function(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "\uFFFD";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      },
      addCombinator = function(matcher, combinator, base) {
        var dir = combinator.dir,
          skip = combinator.next,
          key = skip || dir,
          checkNonElements = base && key === "parentNode";

        return combinator.first ? function(elem, context) {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              return matcher(elem, context);
            }
          }
          return false;
        } : function(elem, context) {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (skip && skip === elem.nodeName.toLowerCase()) {
                elem = elem[dir] || elem;
              } else {
                if (matcher(elem, context)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
      },
      disabledAncestor = addCombinator(function(elem) {
        return elem.disabled === true && ("form" in elem || "label" in elem);
      }, {
        dir: "parentNode",
        next: "legend"
      });
    var toSelector = kimiCriss.toSelector = function(tokens) {
      var i = 0,
        len = tokens.length,
        selector = "";
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    var makeFunction = function(fn) {
      return function() {
        return fn;
      };
    };
    var Expr = kimiCriss.selectors = {
      match: matchExpr,
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        "ATTR": function(match) {
          match[1] = match[1].replace(runescape, funescape);
          match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }

          return match.slice(0, 4);
        },

        "CHILD": function(match) {
          match[1] = match[1].toLowerCase();

          if (match[1].slice(0, 3) === "nth") {
            if (!match[3]) {
              kimiCriss.syntaxError(match[0]);
            }
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +((match[7] + match[8]) || match[3] === "odd");
          } else if (match[3]) {
            kimiCriss.syntaxError(match[0]);
          }
          return match;
        },

        "PSEUDO": function(match) {
          var excess, unquoted = !match[6] && match[2];
          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || "";
          } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }
          return match.slice(0, 3);
        }
      },
      filter: {

        "TAG": function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === "*" ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },

        "CLASS": function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
          });
        },

        "ATTR": function(name, operator, check) {
          return function(elem) {
            var result = kimiCriss.attr(elem, name);

            if (result == null) {
              return operator === "!=";
            }
            if (!operator) {
              return true;
            }

            result += "";

            return operator === "=" ? result === check :
              operator === "!=" ? result !== check :
              operator === "^=" ? check && result.indexOf(check) === 0 :
              operator === "*=" ? check && result.indexOf(check) > -1 :
              operator === "$=" ? check && result.slice(-check.length) === check :
              operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :
              operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
              false;
          };
        },

        "CHILD": function(type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
            forward = type.slice(-4) !== "last",
            ofType = what === "of-type";

          return first === 1 && last === 0 ? function(elem) {
            return !!elem.parentNode;
          } : function(elem, context, xml) {
            var node, nodeIndex, start,
              dir = simple !== forward ? "nextSibling" : "previousSibling",
              parent = elem.parentNode,
              name = ofType && elem.nodeName.toLowerCase(),
              useCache = !xml && !ofType,
              diff = false;

            if (parent) {
              if (simple) {
                while (dir) {
                  node = elem;
                  while ((node = node[dir])) {
                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                      return false;
                    }
                  }
                  start = dir = type === "only" && !start && "nextSibling";
                }
                return true;
              }

              start = [forward ? parent.firstChild : parent.lastChild];
              if (forward && useCache) {
                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    break;
                  }
                }

              } else {
                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                  if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                    if (node === elem) {
                      break;
                    }
                  }
                }
              }
              diff -= last;
              return diff === first || (diff % first === 0 && diff / first >= 0);
            }
          };
        },

        "PSEUDO": function(pseudo, argument) {
          return (Expr.pseudos[pseudo] || kimiCriss.syntaxError("unsupported pseudo: " + pseudo))(argument);
        }
      },
      pseudos: {
        "not": function(selector) {
          var matcher = compile(selector.replace(rtrim, "$1"));
          return function(elem) {
            return matcher([elem]).length == 0;
          }
        },

        "has": function(selector) {
          return function(elem) {
            return kimiCriss.expr(selector, elem).length > 0;
          };
        },

        "contains": function(text) {
          text = text.replace(runescape, funescape);
          return function(elem) {
            return (elem.textContent || elem.innerText || kimiCriss.text(elem)).indexOf(text) > -1;
          };
        },
        "lang": function(lang) {
          if (!ridentifier.test(lang || "")) {
            kimiCriss.syntaxError("unsupported lang: " + lang);
          }
          lang = lang.replace(runescape, funescape).toLowerCase();
          return function(elem) {
            var elemLang;
            do {
              if (elemLang = elem.lang) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);
            return false;
          };
        },
        "target": makeFunction(function(elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        }),

        "root": makeFunction(function(elem) {
          return elem === docElem;
        }),

        "focus": makeFunction(function(elem) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        }),
        "enabled": createDisabledPseudo(false),
        "disabled": createDisabledPseudo(true),

        "checked": makeFunction(function(elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        }),

        "selected": makeFunction(function(elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        }),
        "empty": makeFunction(function(elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        }),
        "parent": makeFunction(function(elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return true;
            }
          }
          return false;
        }),
        "header": makeFunction(function(elem) {
          return rheader.test(elem.nodeName);
        }),

        "input": makeFunction(function(elem) {
          return rinputs.test(elem.nodeName);
        }),

        "button": makeFunction(function(elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        }),

        "text": makeFunction(function(elem) {
          var attr;
          return elem.nodeName.toLowerCase() === "input" && elem.type === "text";
        }),
        "first": makeFunction(function(arr) {
          return arr.slice(0, 1);
        }),

        "last": makeFunction(function(arr) {
          return arr.slice(-1);
        }),

        "eq": function(i) {
          i = +i;
          return function(arr, len) {
            i = i ? i < 0 ? i + len : i : 0;
            return arr.slice(i, i + 1);
          }
        },

        "even": makeFunction(function(arr, len) {
          var i = 0,
            r = [];
          for (; i < len; i += 2) {
            r.push(i);
          }
          return r;
        }),

        "odd": makeFunction(function(arr, len) {
          var i = 1,
            r = [];
          for (; i < len; i += 2) {
            r.push(i);
          }
          return r;
        }),

        "lt": function(i) {
          i = +i;
          return function(arr, len) {
            return arr.slice(0, i ? i < 0 ? i + len : i : 0);
          };
        },

        "gt": function(i) {
          i = +i;
          return function(arr, len) {
            return arr.slice(i ? i < 0 ? i + len : i : 0);
          };
        }
      }
    };

    Expr.filter["ID"] = function(id) {
      var attrId = id.replace(runescape, funescape);
      return function(elem) {
        return elem.getAttribute("id") === attrId;
      };
    };
    Expr.find["ID"] = function(id, context) {
      if (context.getElementById) {
        var elem = context.getElementById(id);
        return elem ? [elem] : [];
      }
    };
    Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
      if (context.getElementsByTagName) {
        return context.getElementsByTagName(tag);
      } else if (support.qsa) {
        return context.querySelectorAll(tag);
      }
    } : function(tag, context) {
      var elem,
        tmp = [],
        i = 0,
        results = context.getElementsByTagName(tag);
      if (tag === "*") {
        while ((elem = results[i++])) {
          if (elem.nodeType === 1) {
            tmp.push(elem);
          }
        }
        return tmp;
      }
      return results;
    };
    Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
      if (context.getElementsByClassName) {
        return context.getElementsByClassName(className);
      }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    var disabledAncestor = addCombinator(function(elem) {
      return elem.disabled === true && ("form" in elem || "label" in elem);
    }, {
      dir: "parentNode",
      next: "legend"
    });

    function createDisabledPseudo(disabled) {
      return makeFunction(function(elem) {
        if ("form" in elem) {
          if (elem.parentNode && elem.disabled === false) {
            if ("label" in elem) {
              if ("label" in elem.parentNode) {
                return elem.parentNode.disabled === disabled;
              } else {
                return elem.disabled === disabled;
              }
            }
            return elem.isDisabled === disabled || elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
          }
          return elem.disabled === disabled;
        } else if ("label" in elem) {
          return elem.disabled === disabled;
        }
        return false;
      });
    }

    function createInputPseudo(type) {
      return makeFunction(function(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      });
    }

    function createButtonPseudo(type) {
      return makeFunction(function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      });
    }
    for (i in {
        radio: true,
        checkbox: true,
        file: true,
        password: true,
        image: true
      }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
        submit: true,
        reset: true
      }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    var elementMatcher = function(matchers) {
      return matchers.length > 1 ? function(elem, context) {
        var i = 0,
          len = matchers.length;
        for (; i < len; i++) {
          if (!matchers[i](elem, context)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    var elementContexMatcher = function(matchers) {
      return matchers.length > 1 ? function(seed, context) {
        var i = 0,
          len = matchers.length;
        for (; i < len; i++) {
          seed = matchers[i](seed, context);
        }
        return seed;
      } : matchers[0];
    };
    var contextMatcherFromToken = function(matcher, contextMatcher) {
      return function(seed, context) {
        var elem, i = 0,
          r = [];
        while (elem = seed[i++]) {
          if (matcher(elem, context)) {
            r.push(elem);
          }
        }
        return contextMatcher ? contextMatcher(r, r.length) : r;
      };
    };
    var outermostContext;
    var matcherFromTokens = function(tokens) {
      var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[tokens[0].type],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,
        matchContext = addCombinator(function(elem) {
          return elem === checkContext;
        }, implicitRelative, true),
        matchAnyContext = addCombinator(function(elem) {
          return indexOf(checkContext, elem) > -1;
        }, implicitRelative, true),
        matchers = [function(elem, context) {
          var ret = (!leadingRelative && (context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context) : matchAnyContext(elem, context));
          checkContext = null;
          return ret;
        }],
        contextMatchers = [];

      for (; i < len; i++) {
        if ((matcher = Expr.relative[tokens[i].type])) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matchExpr.needsContext.test(tokens[i].value)) {
            contextMatchers.push(contextMatcherFromToken(elementMatcher(matchers), matcher));
            matchers = [];
          } else {
            matchers.push(matcher);
          }
        }
      }
      if (matchers.length) {
        contextMatchers.push(contextMatcherFromToken(elementMatcher(matchers)));
      }
      return elementContexMatcher(contextMatchers);
    };
    var tokenize = kimiCriss.tokenize = function(selector, parseOnly) {
      var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[selector];

      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }

      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;

      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push((tokens = []));
        }

        matched = false;
        if ((match = rcombinators.exec(soFar))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }

        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? kimiCriss.syntaxError(selector) : tokenCache(selector, groups).slice(0);
    };
    var matcherFromGroupMatchers = function(elementMatcher) {
      return function superMatcher(seed, context, results, outermost) {
        var contextBackup = outermostContext;
        var elems = seed || Expr.find["TAG"]("*", outermost),
          len = elems.length;
        if (outermost) {
          outermostContext = context === document || context || outermost;
        }
        var unmatched = elementMatcher(elems, context || document);
        if (results) {
          push.apply(results, unmatched);
          kimiCriss.uniqueSort(results);
        }
        if (outermost) {
          outermostContext = contextBackup;
        }
        return unmatched;
      };
    };
    var compile = kimiCriss.compile = function(selector, match) {
      var i, matchers = [],
        cached = compilerCache[selector];
      if (!cached) {
        if (!match) {
          match = tokenize(selector);
        }
        i = match.length;
        while (i--) {
          matchers.push(matcherFromTokens(match[i]));
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementContexMatcher(matchers)));
        cached.selector = selector;
      }
      return cached;
    };
    var testContext = function(context) {
      return context && context.getElementsByTagName && context;
    };

    kimiCriss.select = function(selector, context, results, seed) {
      results = results || [];
      var compiled = typeof selector === "function" ? selector : compile(selector)
      return compiled(seed, context, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
    };

    kimiCriss.expr = function(selector, context, results, seed) {
      var m, i, elem, nid, match, groups, newSelector,
        newContext = context && context.ownerDocument,
        nodeType = context ? context.nodeType : 9;

      results = results || [];
      if (!selector || typeof selector !== "string" || !(nodeType === 1 || nodeType === 9 || nodeType === 11)) {
        return results;
      }
      if (!seed) {
        context = context || document;
        if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
          if ((m = match[1])) {
            if (nodeType === 9) {
              if ((elem = context.getElementById(m))) {
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              }
            } else {
              if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            }
          } else if (match[2]) {
            push.apply(results, context.getElementsByTagName(selector));
            return results;
          } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
            push.apply(results, context.getElementsByClassName(m));
            return results;
          }
        }
        if (support.qsa && !compilerCache[selector] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          if (nodeType !== 1) {
            newContext = context;
            newSelector = selector;
          } else if (context.nodeName.toLowerCase() !== "object") {
            if ((nid = context.getAttribute("id"))) {
              nid = nid.replace(rcssescape, fcssescape);
            } else {
              context.setAttribute("id", (nid = expando));
            }
            groups = tokenize(selector);
            i = groups.length;
            while (i--) {
              groups[i] = "#" + nid + " " + toSelector(groups[i]);
            }
            newSelector = groups.join(",");
            newContext = rsibling.test(selector) && testContext(context.parentNode) ||
              context;
          }

          if (newSelector) {
            try {
              push.apply(results, newContext.querySelectorAll(newSelector));
              return results;
            } catch (qsaError) {} finally {
              if (nid === expando) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return kimiCriss.select(selector.replace(rtrim, "$1"), context, results, seed);
    };

    kimiCriss.matches = function(expr, elements) {
      return kimiCriss.expr(expr, null, null, elements);
    };

    kimiCriss.matchesSelector = function(elem, expr) {
      expr = expr.replace(rattributeQuotes, "='$1']");
      if (support.matchesSelector && !compilerCache[expr] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var r = matches.call(elem, expr);
          if (r || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
            return r;
          }
        } catch (e) {}
      }
      return kimiCriss.expr(expr, document, null, [elem]).length > 0;
    };

  })(support);

  var
    rclickable = /^(?:a|area)$/i,
    rnotwhite = (/[^\x20\t\r\n\f]+/g),
    rfocusable = /^(?:input|select|textarea|button|object)$/i;

  var boolHook = {
    set: function(elem, value, name) {
      if (value === false) {
        kimiCriss.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }
      return name;
    }
  };
  if (!support.optionSelected) {
    kimiCriss.propHooks.selected = {
      get: function(elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      },
      set: function(elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }
    };
  }
  kimiCriss.each([
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
  ], function(item) {
    kimiCriss.propFix[item.toLowerCase()] = item;
  });
  kimiCriss.extend({
    prop: function(elem, name, value) {
      var nodeType = elem && elem.nodeType;
      if (!elem || !name || nodeType === 2 || nodeType === 3 || nodeType === 8) {
        return;
      }
      var val, hooks;
      if (nodeType !== 1) {
        name = kimiCriss.propFix[name] || name;
        hooks = kimiCriss.propHooks[name];
      }
      if (arguments.length > 2) {
        if (hooks && "set" in hooks && (val = hooks.set(elem, value, name)) != null) {
          return val;
        }
        return (elem[name] = value);
      }
      if (hooks && "get" in hooks && (val = hooks.get(elem, name)) != null) {
        return val;
      }
      return elem[name];
    },
    removeProp: function(elem, value) {
      if (elem) {
        var i = 0,
          key, value = value && value.match(rnotwhite);
        while (key = value[i++]) {
          delete elem[kimiCriss.propFix[key] || key];
        }
      }
    },
    attr: function(elem, name, value) {
      var nodeType = elem && elem.nodeType;
      if (!elem || !name || nodeType === 2 || nodeType === 3 || nodeType === 8) {
        return;
      }
      if (elem.getAttribute == null) {
        return kimiCriss.prop.apply(this, arguments);
      }
      var val, hooks;
      if (nodeType !== 1) {
        hooks = kimiCriss.attrHooks[name.toLowerCase()] || rbooleans.test(name) && boolHook;
      }
      if (arguments.length > 2) {
        if (value == null) {
          return kimiCriss.removeAttr(elem, name);
        }
        if (hooks && "set" in hooks && (val = hooks.set(elem, value, name)) != null) {
          return val;
        }
        elem.setAttribute(name, value + "");
        return value;
      }
      if (hooks && "get" in hooks && (val = hooks.get(elem, name)) != null) {
        return val;
      }
      return elem.getAttribute(name);
    },
    removeAttr: function(elem, value) {
      if (elem && elem.nodeType === 1) {
        var i = 0,
          key, value = value && value.match(rnotwhite);
        while (key = value[i++]) {
          elem.removeAttribute(name);
        }
      }
    }
  });

  kimiCriss.text = function(elem) {
    var node, i = 0,
      returnVal = "",
      nodeType = elem && elem.nodeType;
    if (!elem) {
      return returnVal;
    }
    if (nodeType == null) {
      while (node = elem[i++]) {
        returnVal += kimiCriss.text(node);
      }
      return returnVal;
    }
    if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      if (typeof elem.textContent === "string") {
        returnVal = elem.textContent;
      } else {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          returnVal += kimiCriss.text(elem);
        }
      }
      return returnVal;
    }
    if (nodeType === 3 || nodeType === 4) {
      return elem.nodeValue;
    }
    return returnVal;
  };

  kimiCriss.valHooks = {
    option: {
      get: function(elem) {
        var val = kimiCriss.attr(elem, "value");
        return val == null ? kimiCriss.text(elem) : val;
      }
    },
    select: {
      get: function(elem) {
        var value, option, i,
          options = elem.options,
          index = elem.selectedIndex,
          one = elem.type === "select-one",
          values = one ? null : [],
          max = one ? index + 1 : options.length;

        if (index < 0) {
          i = max;
        } else {
          i = one ? index : 0;
        }
        for (; i < max; i++) {
          option = options[i];
          if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || !kimiCriss.nodeName(option.parentNode, "optgroup"))) {
            value = kimiCriss(option).val();
            if (one) {
              return value;
            }
            values.push(value);
          }
        }

        return values;
      },

      set: function(elem, value) {
        var optionSet, option,
          options = elem.options,
          values = kimiCriss.makeArray(value),
          i = options.length;

        while (i--) {
          option = options[i];
          if (option.selected = kimiCriss.indexOfArray(kimiCriss.valHooks.option.get(option), values) > -1) {
            optionSet = true;
          }
        }
        if (!optionSet) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  };

  kimiCriss.each(["radio", "checkbox"], function(item) {
    kimiCriss.valHooks[item] = {
      set: function(elem, value) {
        if (kimiCriss.isArray(value)) {
          return (elem.checked = kimiCriss.indexOfArray(kimiCriss(elem).val(), value) > -1);
        }
      }
    };
    if (!support.checkOn) {
      kimiCriss.valHooks[item].get = function(elem) {
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });

  var rreturn = /\r/g;
  var valGet = function(elem) {
    var val, hooks = hooks = kimiCriss.valHooks[elem.type] || kimiCriss.valHooks[elem.nodeName.toLowerCase()];
    if (hooks && ("get" in hooks) && (val = hooks.get(elem)) != null) {
      return val;
    }
    val = elem.value;
    if (typeof val === "string") {
      val = val.replace(rreturn, "");
    }
    return val == null ? "" : val;
  };
  var valSet = function(elem, value) {
    var hooks = kimiCriss.valHooks[elem.type] || kimiCriss.valHooks[elem.nodeName.toLowerCase()];
    if (!hooks || !("set" in hooks) || hooks.set(elem, value, "value") == null) {
      elem.value = value;
    }
  };
  var textSet = function(elem, value) {
    if (elem.nodeType === 1 || elem.nodeType === 9 || elem.nodeType === 11) {
      for (var node = elem.firstChild; node; node = node.nextSibling) {
        elem.removeChild(node);
      }
      elem.textContent = value;
    }
  };
  kimiCriss.fn.extend({
    each: function(callback) {
      return kimiCriss.each(this, function(elem, i) {
        return callback.call(elem, i, elem);
      });
    },
    map: function(callback) {
      return this.pushStack(kimiCriss.map(this, callback));
    },
    pushStack: function(arr) {
      var r = kimiCriss.merge(this.constructor(), arr);
      r.prevObject = this;
      r.context = this.context;
      return r;
    },
    access: function(key, value, chainable, fnGet, fnSet) {
      fnSet = fnSet || fnGet;
      var i = 0,
        len = this.length;
      if (kimiCriss.type(key) === "object") {
        for (i in key) {
          this.access(i, key[i], true, fnGet, fnSet);
        }
        return this;
      }
      if (chainable) {
        var raw = kimiCriss.isFunction(value);
        for (; i < len; i++) {
          if (key == null) {
            fnSet(this[i], raw ? value(this[i], i, fnGet(this[i])) : value);
          } else {
            fnSet(this[i], key, raw ? value(this[i], i, fnGet(this[i], key)) : value, key);
          }
        }
        return this;
      }
      if (len > 0) {
        return key == null ? fnGet(this[i]) : fnGet(this[i], key);
      }
    },
    val: function(value) {
      return this.access(null, value, arguments.length > 0, valGet, valSet);
    },
    text: function(value) {
      return this.access(null, value, arguments.length > 0, kimiCriss.text, textSet);
    },
    attr: function(name, value) {
      return this.access(name, value, arguments.length > 1, kimiCriss.attr);
    },
    removeAttr: function(value) {
      return this.each(function() {
        return kimiCriss.removeAttr(this, value);
      });
    },
    prop: function(name, value) {
      return this.access(name, value, arguments.length > 1, kimiCriss.prop);
    },
    removeProp: function(value) {
      return this.each(function() {
        return kimiCriss.removeProp(this, value);
      });
    }
  });

  var
    cssShow = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    cssNormalTransform = {
      letterSpacing: 0,
      fontWeight: 400
    },
    cssExpand = ["Top", "Right", "Bottom", "Left"],
    cssPrefixes = ["Webkit", "O", "Moz", "ms"];

  var emptyStyle = document.createElement("div").style;

  function vendorPropName(name) {
    if (name in emptyStyle) {
      return name;
    }
    var capName = name[0].toUpperCase() + name.slice(1),
      i = cssPrefixes.length;

    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in emptyStyle) {
        return name;
      }
    }
  }
  if (!support.opacity) {

    var
      ralpha = /alpha\([^)]*\)/i,
      ropacity = /opacity\s*=\s*([^)]*)/;

    kimiCriss.cssHooks.opacity = {
      get: function(elem, computed) {
        return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : "";
      },
      set: function(elem, value) {
        var style = elem.style,
          currentStyle = elem.currentStyle,
          opacity = kimiCriss.isNumber(value) ? "alpha(opacity=" + value * 100 + ")" : "",
          filter = currentStyle && currentStyle.filter || style.filter || "";
        style.zoom = 1;
        if ((value >= 1 || value === "") &&
          kimiCriss.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
          style.removeAttribute("filter");
          if (value === "" || currentStyle && !currentStyle.filter) {
            return;
          }
        }
        style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
      }
    };
  }

  var rcssNum = /^(?:([+-])=|)((\d+\.)?\d+)([a-z%]*)$/i;
  kimiCriss.extend({
    style: function(elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var val, type, hooks,
        origName = kimiCriss.camelCase(name),
        style = elem.style;

      name = kimiCriss.cssProps[origName] || (kimiCriss.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = kimiCriss.cssHooks[name] || kimiCriss.cssHooks[origName];

      if (value !== undefined) {
        type = typeof value;
        if (type === "string" && (val = rcssNum.exec(value)) && val[1]) {
          val = (val[1] + 1) * val[2] + kimiCriss.css(elem, name, true);
          type = "number";
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === "number") {
          value += val && val[3] || (kimiCriss.cssNumber[origName] ? "" : "px");
        }

        if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
          style[name] = "inherit";
        }

        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          style[name] = value;
        }

      } else {
        if (hooks && "get" in hooks && (val = hooks.get(elem, false, extra)) !== undefined) {
          return val;
        }
        return style[name];
      }
    },
    css: function(elem, name, extra, styles) {
      var val, num, hooks,
        origName = kimiCriss.camelCase(name);
      name = kimiCriss.cssProps[origName] || (kimiCriss.cssProps[origName] = vendorPropName(origName) || origName);
      hooks = kimiCriss.cssHooks[name] || kimiCriss.cssHooks[origName];
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
      }
      return val;
    }
  });

  var classCache = {};
  var classModel = function(value, model, toggle) {
    var isFunction = kimiCriss.isFunction(value);
    if (!(isFunction || typeof value === "string")) {
      return this;
    }
    return this.each(function(i) {
      var valueCur = value;
      if (!isFunction || typeof(valueCur = value.call(this, i, this.className, model)) === "string") {
        var matchArr = valueCur && valueCur.match(rnotwhite);

        var match, classNameOld, i = 0,
          className = classNameOld = this.className;
        while ((valueCur = matchArr[i++]) && ((match = classCache[valueCur] || (classCache[valueCur] = new RegExp("(^|" + whitespace + ")" + valueCur + "(" + whitespace + "|$)"))) && (((match = match.test(className)) === !model) || toggle))) {
          if (model || toggle && !match) {
            className += " " + valueCur;
          } else {
            className = className.replace(classCache[valueCur], " ");
          }
        }
        if (className !== classNameOld) {
          this.className = (className.match(rnotwhite) || []).join(" ");
        }
      }
    });
  };

  function defaultPrefilter(elem) {
    var tmp = elem.cloneNode(true);
    tmp.style.display = "";
    elem.parentNode.appendChild(tmp);
    var display = kimiCriss.css(tmp, "display");
    elem.parentNode.removeChild(tmp);
    if (display === "none") {
      display = "block";
    }
    return display;
  }

  function isHidden(elem) {
    return kimiCriss.css(elem, "display") === "none" || !kimiCriss.contains(elem.ownerDocument, elem);
  }
  kimiCriss.fn.extend({
    css: function(name, value) {
      return this.access(name, value, arguments.length > 1, function(elem, name) {
        if (kimiCriss.isArray(name)) {
          var map = {},
            styles = getStyles(elem);
          for (var i = 0, len = name.length; i < len; i++) {
            map[name[i]] = kimiCriss.css(elem, name[i], false, styles);
          }
          return map;
        }
        return kimiCriss.css(elem, name);
      }, kimiCriss.style);
    },
    show: function(value) {
      if (typeof value === "string") {
        return this.css("display", value);
      }
      var isFunction = value && kimiCriss.isFunction(value);
      return this.each(function(i) {
        return kimiCriss(this).css("display", isFunction ? value.call(this, i, this) : defaultPrefilter(this));
      });
    },
    hide: function() {
      return this.css("display", "none");
    },
    toggle: function(state, value) {
      if (typeof state === "boolean") {
        return state ? this.show(value) : this.hide();
      }
      return this.each(function() {
        return isHidden(this) ? kimiCriss(this).show(value) : kimiCriss(this).hide();
      });
    },

    addClass: function(value) {
      return classModel.call(this, value, true);
    },
    removeClass: function(value) {
      return classModel.call(this, value, false);
    },
    toggleClass: function(value, stateVal) {
      if (typeof stateVal === "boolean") {
        return classModel.call(this, value, stateVal);
      }
      return classModel.call(this, value, null, true);
    }
  });

  var rscriptTypeMasked = /^true\/(.*)/;
  var rscriptType = /^$|\/(?:java|ecma)script/i;
  var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }

  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }

  function DOMEval(code, doc) {
    doc = doc || document;
    var script = doc.createElement("script");
    script.text = code;
    doc.head.appendChild(script).parentNode.removeChild(script);
  }

  function manipulationTarget(elem, content) {
    if (kimiCriss.nodeName(elem, "table") && kimiCriss.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
      return elem.getElementsByTagName("tbody")[0] || elem;
    }
    return elem;
  }
  kimiCriss.fn.extend({
    domManip: function(args, callback) {
      args = concat.apply([], args);
      var node, first, length, fragment, scripts;
      var
        i = 0,
        len = this.length,
        value = args[0],
        xlen = len - 1,
        isFunction = kimiCriss.isFunction(value);
      if (isFunction || (len > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value))) {
        return this.each(function(index) {
          var self = kimiCriss(this);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback);
        });
      }
      if (len > 0) {
        fragment = kimiCriss.buildFragment(args, this[0].ownerDocument, false, this);
        first = fragment.firstChild;
        if (fragment.childNodes.length === 1) {
          fragment = first;
        }
        scripts = kimiCriss.each(getAll(fragment, "script"));
        length = scripts.length;
        if (first) {
          for (; i < len; i++) {
            node = fragment;
            if (i < xlen) {
              node = kimiCriss.clone(node, true, true);
              if (length) {
                kimiCriss.merge(scripts, getAll(node, "script"));
              }
            }
            callback.call(this[i], node, i);
          }
        }
        if (length) {
          var doc = scripts[scripts.length - 1].ownerDocument;
          kimiCriss.each(scripts, restoreScript);
          for (i = 0; i < length; i++) {
            node = scripts[i];
            if (rscriptType.test(node.type) && kimiCriss.contains(doc, node)) {
              if (node.src) {
                if (kimiCriss._evalUrl) {
                  kimiCriss._evalUrl(node.src);
                }
              } else {
                DOMEval(node.textContent.replace(rcleanScript, ""), doc);
              }
            }
          }
        }
      }
      return this;
    },
    append: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty: function() {
      return this.each(function() {
        if (this.nodeType === 1) {
          for (var elem = this.firstChild; elem; elem = elem.nextSibling) {
            this.removeChild(elem);
          }
          this.textContent = "";
        }
      });
    },
    html: function(value) {
      return this.access(null, value, arguments.length > 0, function(elem) {
        if (elem.nodeType === 1) {
          return elem.innerHTML;
        }
      }, function(elem, value) {
        return kimiCriss(elem).empty().append(value);
      });
    },
    replaceWith: function() {
      return this.domManip(arguments, function(elem) {
        var parent = this.parentNode;
        if (parent) {
          parent.replaceChild(elem, this);
        }
      });
    }
  });

  var
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
  kimiCriss.extend({
    parseJSON: window.JSON && window.JSON.parse || function(data) {
      if (data === null) {
        return data;
      }
      if (typeof data === "string") {
        data = kimiCriss.trim(data);
        if (data) {
          if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
            return (new Function("return " + data))();
          }
        }
      }
      kimiCriss.error("Invalid JSON: " + data);
    },
    parseXML: function(data) {
      var xml, tmp;
      if (!data || typeof data !== "string") {
        return null;
      }
      try {
        if (window.DOMParser) {
          tmp = new DOMParser();
          xml = tmp.parseFromString(data, "text/xml");
        } else {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        }
      } catch (e) {
        xml = undefined;
      }
      if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        kimiCriss.error("Invalid XML: " + data);
      }
      return xml;
    },
    parseHTML: function(data, context, keepScripts) {
      if (!data || typeof data !== "string") {
        return null;
      }
      if (typeof context === "boolean") {
        keepScripts = context;
        context = false;
      }
      context = context || document;

      var parsed = rsingleTag.exec(data),
        scripts = !keepScripts && [];
      if (parsed) {
        return [context.createElement(parsed[1])];
      }
      parsed = kimiCriss.buildFragment([data], context, scripts);
      if (scripts) {
        kimiCriss(scripts).remove();
      }
      return kimiCriss.merge([], parsed.childNodes);
    }
  });


  var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style|link)/i,
    rcheckableType = /^(?:checkbox|radio)$/i,
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /^$|\/(?:java|ecma)script/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

    wrapMap = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    },
    safeFragment = createSafeFragment(document),
    fragmentDiv = safeFragment.appendChild(document.createElement("div"));

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;

  function getAll(context, tag) {
    var elems, elem,
      i = 0,
      arr = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : null;

    if (!arr) {
      for (arr = [], elems = context.childNodes || context;
        (elem = elems[i]) != null; i++) {
        if (!tag || tag === "*" || kimiCriss.nodeName(elem, tag)) {
          arr.push(elem);
        } else {
          kimiCriss.merge(arr, getAll(elem, tag));
        }
      }
    }
    return !tag || tag === "*" || kimiCriss.nodeName(context, tag) ? kimiCriss.merge([context], arr) : arr;
  }

  function createSafeFragment(document) {
    var list = nodeNames.split("|"),
      safeFrag = document.createDocumentFragment();

    if (safeFrag.createElement) {
      while (list.length) {
        safeFrag.createElement(list.pop());
      }
    }
    return safeFrag;
  }

  kimiCriss.buildFragment = function(elems, context, scripts, selection) {
    var j, elem, contains,
      tmp, tag, tbody, wrap,
      l = elems.length,
      safe = createSafeFragment(context),
      nodes = [],
      i = 0;

    for (; i < l; i++) {
      elem = elems[i];
      if (elem || elem === 0) {
        if (kimiCriss.type(elem) === "object") {
          kimiCriss.merge(nodes, elem.nodeType ? [elem] : elem);
        } else if (!rhtml.test(elem)) {
          nodes.push(context.createTextNode(elem));
        } else {
          tmp = tmp || safe.appendChild(context.createElement("div"));
          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || wrapMap._default;

          tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
          j = wrap[0];
          while (j--) {
            tmp = tmp.lastChild;
          }
          if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
          }
          kimiCriss.merge(nodes, tmp.childNodes);
          tmp.textContent = "";
          while (tmp.firstChild) {
            tmp.removeChild(tmp.firstChild);
          }
          tmp = safe.lastChild;
        }
      }
    }
    if (tmp) {
      safe.removeChild(tmp);
    }

    i = 0;
    while ((elem = nodes[i++])) {
      if (selection && kimiCriss.indexOfArray(elem, selection) > -1) {
        continue;
      }
      contains = kimiCriss.contains(elem.ownerDocument, elem);
      tmp = getAll(safe.appendChild(elem), "script");
      if (scripts) {
        j = 0;
        while ((elem = tmp[j++])) {
          if (rscriptType.test(elem.type || "")) {
            scripts.push(elem);
          }
        }
      }
    }
    tmp = null;
    return safe;
  }

  var risSimple = /^.[^:#\[\.,]*$/;
  kimiCriss.filter = function(selector, elems, not) {
    if (kimiCriss.isFunction(selector)) {
      return kimiCriss.grep(elems, function(elem, i) {
        return !!selector.call(elem, i, elem);
      }, !!not);
    }
    if (selector.nodeType) {
      return kimiCriss.grep(elems, function(elem) {
        return (elem === selector) === !not;
      });
    }

    if (typeof selector !== "string") {
      return kimiCriss.grep(elems, function(elem) {
        return (indexOf.call(selector, elem) > -1) === !not;
      });
    }
    var elem = elems[0];
    if (not) {
      selector = ":not(" + selector + ")";
    }
    if (elems.length === 1 && elem.nodeType === 1) {
      return kimiCriss.matchesSelector(elem, selector) ? [elem] : [];
    }
    var results = kimiCriss.matches(selector, kimiCriss.grep(elems, function(elem) {
      return elem.nodeType === 1;
    }));
    return risSimple.test(selector) ? results : kimiCriss.grep(elems, function(elem) {
      return elem.nodeType === 1 && (indexOf.call(results, elem) > -1) === !not;
    });
  };

  kimiCriss.fn.extend({
    find: function(selector) {
      var i, ret,
        len = this.length,
        self = this;

      if (typeof selector !== "string") {
        return this.pushStack(kimiCriss(selector).filter(function() {
          for (i = 0; i < len; i++) {
            if (kimiCriss.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }

      ret = this.pushStack([]);

      for (i = 0; i < len; i++) {
        kimiCriss.expr(selector, self[i], ret);
      }
      return len > 1 ? kimiCriss.uniqueSort(ret) : ret;
    },
    filter: function(selector) {
      return this.pushStack(kimiCriss.filter(selector, this));
    },
    has: function(selector) {
      var selector = kimiCriss(selector, this),
        l = selector.length;
      return this.filter(function() {
        for (var i = 0; i < l; i++) {
          if (kimiCriss.contains(this, selector[i])) {
            return true;
          }
        }
      });
    },
    not: function(selector) {
      return this.pushStack(kimiCriss.filter(selector, this, true));
    },
    is: function(selector) {
      return kimiCriss.filter(selector, this).length > 0;
    }
  });

  root = kimiCriss(document);

  kimiCriss.extend({
    dataGuid: 1,
    expando: "data-kimi"
  });
  var dataGuid = 0;
  var dataEvt = {};
  var dataPriv = {
    receive: function(elem) {
      return elem.nodeType === 1 || elem.nodeType === 9 || !(+elem.nodeType);
    },
    has: function(elem) {
      return dataEvt[elem[kimiCriss.expando]];
    },
    get: function(elem, type) {
      return dataPriv.has(elem) && type && dataPriv.has(elem)[type];
    },
    set: function(elem, cache) {
      var dataId = elem[kimiCriss.expando];
      if (cache) {
        dataId = dataId || (elem[kimiCriss.expando] = ++dataGuid);
      } else if (dataId) {
        cache = dataEvt[dataId];
        if (cache && cache.handle && cache.events) {
          for (var type in cache.events) {
            kimiCriss.remove(elem, type, cache.handle);
            kimiCriss.del(cache.events, type);
          }
          kimiCriss.del(cache.events, "handle", "events");
        }
        cache = null;
      }
      return dataEvt[dataId] = cache;
    }
  };
  kimiCriss.event = {
    global: {},
    fix: {
      load: {
        noBubble: true
      },
      click: {
        trigger: function() {
          if (kimiCriss.nodeName(this, "input") && this.type === "checkbox" && this.click) {
            this.click();
            return false;
          }
        }
      },
      focus: {
        trigger: function() {
          if (this !== document.activeElement && this.focus) {
            try {
              this.focus();
              return false;
            } catch (e) {}
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === document.activeElement && this.blur) {
            try {
              this.blur();
              return false;
            } catch (e) {}
          }
        },
        delegateType: "focusout"
      },
      beforeunload: {
        postDispatch: function(event) {
          if (event.result !== undefined) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },
    add: function(elem, type, handle) {
      if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
      } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, handle);
      }
    },
    remove: function(elem, type, handle) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, handle, false);
      } else if (elem.detachEvent) {
        elem.detachEvent("on" + type, handle);
      }
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(event, original) {
        if (event.which == null) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(event, original) {
        var body, eventDoc, doc,
          button = original.button,
          fromElement = original.fromElement;
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }
        if (!event.relatedTarget && fromElement) {
          event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
        }
        if (!event.which && button !== undefined) {
          event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
        }

        return event;
      }
    },
    process: function(event) {
      event = kimiCriss.fix(event);

      var i, ret, handleObj, matched, j,
        handlerQueue = [],
        args = slice.call(arguments),
        handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
        fix = kimiCriss.event.fix[event.type] || {};
      args[0] = event;
      event.delegateTarget = this;

      if (fix.preDispatch && fix.preDispatch.call(this, event) === false) {
        return;
      }
      handlerQueue = kimiCriss.event.handlers.call(this, event, handlers);
      i = 0;
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;

        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          if (!event.namespace_reg || event.namespace_reg.test(handleObj.namespace)) {

            event.handleObj = handleObj;
            event.data = handleObj.data;

            ret = ((kimiCriss.event.fix[handleObj._type] || {}).handle || handleObj.handler).apply(matched.elem, args);

            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (fix.postDispatch) {
        fix.postDispatch.call(this, event);
      }

      return event.result;
    },
    handlers: function(event, handlers) {
      var sel, handleObj, matches, i,
        handlerQueue = [],
        delegateCount = handlers.delegateCount,
        cur = event.target;
      if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {

        for (; cur != this; cur = cur.parentNode || this) {

          if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector;
              if (matches[sel] === undefined) {
                matches[sel] = handleObj.needsContext ?
                  kimiCriss(sel, this).indexOf(cur) > -1 :
                  kimiCriss.expr(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matches
              });
            }
          }
        }
      }
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: this,
          handlers: handlers.slice(delegateCount)
        });
      }
      return handlerQueue;
    }
  };

  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();
    if (nodeName === "input" && rcheckableType.test(src.type)) {
      dest.checked = src.checked;
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }

  function cloneCopyEvent(src, dest) {
    var type, cache, handle, events;
    if ((cache = dataPriv.has(src)) && cache.handle && (events = cache.events)) {
      handle = function() {
        return kimiCriss.event.process.apply(handle.elem, arguments);
      };
      handle.elem = dest;
      for (type in events) {
        kimiCriss.event.add(dest, type, handle);
      }
      dataPriv.set(dest, {
        handle: handle,
        events: kimiCriss.extend({}, events, true)
      });
    }
    dest = null;
  }

  kimiCriss.clone = function(node, dataAndEvents, deepDataAndEvents) {
    var i, len, srcElements, destElements;
    var clone = elem.cloneNode(true);
    if (support.cloneChecked && (elem.nodeType === 1 || elem.nodeType === 11)) {
      destElements = getAll(clone);
      srcElements = getAll(elem);
      for (i = 0, l = srcElements.length; i < l; i++) {
        fixInput(srcElements[i], destElements[i]);
      }
    }
    if (dataAndEvents) {
      if (deepDataAndEvents) {
        srcElements = srcElements || getAll(elem);
        destElements = destElements || getAll(clone);
        for (i = 0, l = srcElements.length; i < l; i++) {
          cloneCopyEvent(srcElements[i], destElements[i]);
        }
      } else {
        cloneCopyEvent(elem, clone);
      }
    }
    return clone;
  };


  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  }
  kimiCriss.Event = function(src, props) {
    if (!(this instanceof kimiCriss.Event)) {
      return new kimiCriss.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
        src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;
    } else {
      this.type = src;
    }

    if (props) {
      kimiCriss.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || +(new Date());

    this[kimiCriss.expando] = true;
  };
  kimiCriss.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (!e) {
        return;
      }
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation: function() {
      var e = this.originalEvent;

      this.isPropagationStopped = returnTrue;
      if (!e) {
        return;
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    }
  };

  var
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click|dblclick/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

  kimiCriss.extend({
    del: function(data /* ,args*/ ) {
      var key, arr = slice.call(arguments, 1);
      if (data && arr.length > 0) {
        try {
          while (key = arr.shift()) {
            if (key in data) {
              delete data[key];
            }
          }
        } catch (e) {
          while (key = arr.shift()) {
            if (key in data) {
              data[key] = undefined;
            }
          }
        }
      }
    },
    on: function(elem, types, handler, data, selector) {
      if (!elem || !types || !handler || !dataPriv.receive(elem)) {
        return;
      }
      var handleObjIn;
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (!handler.dataGuid) {
        handler.dataGuid = kimiCriss.dataGuid++;
      }
      var cache = dataPriv.has(elem) || dataPriv.set(elem, {});
      var i, tmp, fix, type, _type, events, handlers, namespaces, handleObj, eventHandle,
        needsContext = selector && kimiCriss.selectors.match.needsContext.test(selector);
      if (!(events = cache.events)) {
        events = cache.events = {};
      }
      if (!(eventHandle = cache.handle)) {
        eventHandle = cache.handle = function() {
          return kimiCriss.event.process.apply(eventHandle.elem, arguments);
        };
        eventHandle.elem = elem;
      }
      types = types.match(rnotwhite) || [];
      i = types.length;
      while (i--) {
        tmp = rtypenamespace.exec(types[i]) || [];
        type = _type = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        fix = kimiCriss.event[type] || {};
        type = (selector ? fix.delegateType : fix.bindType) || type;
        fix = kimiCriss.event[type] || {};
        handleObj = kimiCriss.extend({
          data: data,
          type: type,
          _type: _type,
          handler: handler,
          selector: selector,
          dataGuid: handler.dataGuid,
          needsContext: needsContext,
          namespaces: namespaces.join(".")
        }, handleObjIn);
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (!fix.setup || fix.setup.call(elem, data, namespaces, eventHandle) === false) {
            kimiCriss.event.add(elem, type, eventHandle);
          }
        }
        if (fix.add) {
          fix.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        kimiCriss.event.global[type] = true;
      }
      elem = null;
    },
    off: function(elem, types, handler, selector, mappedTypes) {
      var events, cache = elem && dataPriv.get(elem);
      if (!cache || !(events = cache.events)) {
        return;
      }
      var i, j, tmp, fix, type, _type, count, handlers, namespaces, handleObj, eventHandle;
      types = types && types.match(rnotwhite) || [""];
      i = types.length;
      while (i--) {
        tmp = rtypenamespace.exec(types[i]) || [];
        type = _type = tmp[1];
        if (!type) {
          for (type in events) {
            kimiCriss.off(elem, type + types[i], handler, selector, mappedTypes);
          }
          continue;
        }
        namespaces = (tmp[2] || "").split(".").sort();
        fix = kimiCriss.event.fix[type] || {};
        type = (selector ? fix.delegateType : fix.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
        j = count = handlers.length;
        while (j--) {
          handleObj = handlers[j];

          if ((mappedTypes || _type === handleObj._type) &&
            (!handler || handler.dataGuid === handleObj.dataGuid) &&
            (!tmp || tmp.test(handleObj.namespace)) &&
            (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
            handlers.splice(j, 1);

            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (fix.remove) {
              fix.remove.call(elem, handleObj);
            }
          }
        }
        if (count && !handlers.length) {
          if (!fix.teardown || fix.teardown.call(elem, namespaces, cache.handle)) {
            kimiCriss.event.remove(elem, type, cache.handle);
          }
          kimiCriss.del(events, type);
        }
      }
      if (kimiCriss.isEmptyObject(events)) {
        dataPriv.set(elem);
      }
    },
    fix: function(event) {
      if (event[kimiCriss.expando]) {
        return event;
      }
      var i, prop, props,
        type = event.type,
        originalEvent = event,
        fixHook = kimiCriss.event.fixHooks[type];

      if (!fixHook) {
        kimiCriss.event.fixHooks[type] = fixHook =
          rmouseEvent.test(type) ? kimiCriss.event.mouseHooks :
          rkeyEvent.test(type) ? kimiCriss.event.keyHooks : {};
      }
      props = fixHook.props ? kimiCriss.event.props.concat(fixHook.props) : kimiCriss.event.props;

      event = new kimiCriss.Event(originalEvent);

      i = props.length;
      while (i--) {
        prop = props[i];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = originalEvent.srcElement || document;
      }
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      event.metaKey = !!event.metaKey;

      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    trigger: function(event, data, elem, onlyHandlers) {
      var handle, ontype, cur,
        bubbleType, fix, tmp, i,
        eventPath = [],
        type = hasOwn.call(event, "type") ? event.type : event,
        namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

      cur = tmp = elem = elem || document;

      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (type.indexOf(".") >= 0) {
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces = namespaces.sort();
      }

      ontype = type.indexOf(":") < 0 && "on" + type;

      event = event[kimiCriss.expando] ? event : new kimiCriss.Event(type, typeof event === "object" && event);

      event.isTrigger = true;
      event.namespace = namespaces.join(".");
      event.namespace_reg = event.namespace && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      event.targetEl = event.target;
      data = data == null ? [event] : kimiCriss.makeArray(data, [event]);
      fix = kimiCriss.event.fix[type] || {};
      if (!onlyHandlers && fix.trigger && fix.trigger.apply(elem, data) === false) {
        return;
      }

      if (onlyHandlers) {
        eventPath.push(cur);
      }

      if (!onlyHandlers && !fix.noBubble && !kimiCriss.isWindow(elem)) {
        bubbleType = fix.delegateType || type;
        for (cur = cur.parentNode; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }
      if (!onlyHandlers) {
        if ((!fix._default || fix._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && kimiCriss.nodeName(elem, "a")) && dataPriv.receive(elem)) {
          if (ontype && elem[type] && !kimiCriss.isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            try {
              elem[type]();
            } catch (e) {
              if (elem[type] == null) {
                eventPath.unshift(elem);
              }
            }

            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      i = 0;
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        event.type = i > 1 ? bubbleType : fix.bindType || type;
        handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && dataPriv.receive(cur) && handle.apply && handle.apply(cur, data) === false) {
          event.preventDefault();
        }
      }
    }
  });

  kimiCriss.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function(type) {
    kimiCriss.fn[type] = function(data, fn) {
      return arguments.length > 0 ?
        this.on(type, null, data, fn) :
        this.trigger(type);
    };
  });
  kimiCriss.fn.hover = function(fnOver, fnOut) {
    if (arguments.length === 1 && typeof fnOver === "string") {
      var _fnOver = fnOver;
      fnOver = function(e) {
        kimiCriss(this).toggleClass(_fnOver, e.type == "mouseenter");
      }
    }
    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
  };
  kimiCriss.fn.extend({
    on: function(types, selector, data, fn, /*INTERNAL*/ one) {
      var type, origFn;
      if (typeof types === "object") {
        if (typeof selector !== "string") {
          data = data || selector;
          selector = undefined;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }

      if (data == null && fn == null) {
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === "string") {
          fn = data;
          data = undefined;
        } else {
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }

      if (one === 1) {
        origFn = fn;
        fn = function(event) {
          kimiCriss.fn.off(event);
          return origFn.apply(this, arguments);
        };
        fn.dataGuid = origFn.dataGuid || (origFn.dataGuid = kimiCriss.dataGuid++);
      }
      return this.each(function() {
        kimiCriss.on(this, types, fn, data, selector);
      });
    },
    one: function(types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    off: function(types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        kimiCriss(types.delegateTarget).off(
          handleObj.namespace ? handleObj._type + "." + handleObj.namespace : handleObj._type,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if (typeof types === "object") {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function() {
        kimiCriss.off(this, types, fn, selector);
      });
    },

    bind: function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    },
    trigger: function(type, data) {
      return this.each(function() {
        kimiCriss.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      var elem = this[0];
      if (elem) {
        return kimiCriss.trigger(type, data, elem, true);
      }
    }
  });

  kimiCriss.extend({
    dir: function(elem, dir, until) {
      var matched = [],
        truncate = until !== undefined;
      while ((elem = elem[dir]) && elem.nodeType !== 9) {
        if (elem.nodeType === 1) {
          if (truncate && kimiCriss(elem).is(until)) {
            break;
          }
          matched.push(elem);
        }
      }
      return matched;
    },
    sibling: function(elem, dir) {
      while ((elem = elem[dir]) && elem.nodeType !== 1) {}
      return elem;
    },
    siblings: function(elem, exclude) {
      var matched = [];
      for (; elem; elem = elem.nextSibling) {
        if (elem.nodeType === 1 && elem !== exclude) {
          matched.push(elem);
        }
      }
      return matched;
    }
  });

  var rparentsprev = /^(?:parent|prev(?:All))/,
    guaranteedUnique = {
      children: true,
      contents: true,
      firstChild: true,
      lastChild: true,
      next: true,
      prev: true
    };
  kimiCriss.each({
    next: function(elem) {
      return kimiCriss.sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return kimiCriss.sibling(elem, "previousSibling");
    },
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    nextAll: function(elem, i, until) {
      return kimiCriss.dir(elem, "nextSibling", until);
    },
    prevAll: function(elem, i, until) {
      return kimiCriss.dir(elem, "previousSibling", until);
    },
    parentAll: function(elem, i, until) {
      return kimiCriss.dir(elem, "parentNode", until);
    },
    firstChild: function(elem) {
      return kimiCriss.sibling({
        nextSibling: elem.firstChild
      }, "nextSibling");
    },
    lastChild: function(elem) {
      return kimiCriss.sibling({
        previousSibling: elem.lastChild
      }, "previousSibling");
    },
    children: function(elem) {
      return kimiCriss.siblings(elem.firstChild);
    },
    contents: function(elem) {
      return elem.contentDocument || kimiCriss.merge([], elem.childNodes);
    }
  }, function(fn, name) {
    kimiCriss.fn[name] = function(selector, until) {
      var matched = kimiCriss.map(this, fn, until);
      if (selector && typeof selector === "string") {
        matched = kimiCriss.filter(selector, matched);
      }
      if (this.length > 1) {
        if (!guaranteedUnique[name]) {
          kimiCriss.uniqueSort(matched);
        }
        if (rparentsprev.test(name)) {
          matched.reverse();
        }
      }
      return this.pushStack(matched);
    };
  });


  var
    nonce = +(new Date()),
    location = window.location,
    rquery = (/\?/),
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (kimiCriss.isArray(obj)) {
      kimiCriss.each(obj, function(v, i) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v)
        } else {
          buildParams(prefix + "[" + (v != null && typeof v === "object" ? i : "") + "]", v, traditional, add)
        }
      })
    } else if (!traditional && kimiCriss.type(obj) === "object") {
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add)
      }
    } else {
      add(prefix, obj)
    }
  }

  kimiCriss.param = function(a, traditional) {
    var prefix, s = [],
      add = function(key, valueOrFunction) {
        var value = kimiCriss.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value)
      };
    if (kimiCriss.isArray(a) || (a.kimiCriss && !kimiCriss.isPlainObject(a))) {
      kimiCriss.each(a, function(v) {
        add(v.name, v.value);
      })
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join("&");
  };

  var
    r20 = /%20/g,
    rhash = /#.*$/,
    rantiCache = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    prefilters = {},
    transports = {},
    allTypes = "*/".concat("*"),
    originAnchor = document.createElement("a");
  originAnchor.href = location.href;

  function addToPrefiltersOrTransports(structure) {
    return function(dataTypeExpression, callback) {
      if (typeof dataTypeExpression !== "string") {
        callback = dataTypeExpression;
        dataTypeExpression = "*"
      }
      var dataType, i = 0,
        dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
      if (kimiCriss.isFunction(callback)) {
        while (dataType = dataTypes[i++]) {
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(callback)
          } else {
            (structure[dataType] = structure[dataType] || []).push(callback)
          }
        }
      }
    }
  }

  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {},
      seekingTransport = (structure === transports);

    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      kimiCriss.each(structure[dataType] || [], function(prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*")
  }

  function ajaxExtend(target, src) {
    var key, deep, flatOptions = kimiCriss.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key]
      }
    }
    if (deep) {
      kimiCriss.extend(true, target, deep);
    }
    return target;
  }

  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct, type, finalDataType, firstDataType, contents = s.contents,
      dataTypes = s.dataTypes;
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type")
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0]
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break
        }
        if (!firstDataType) {
          firstDataType = type
        }
      }
      finalDataType = finalDataType || firstDataType
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType)
      }
      return responses[finalDataType]
    }
  }

  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2, current, conv, tmp, prev, converters = {},
      dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv]
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType)
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === "*") {
          current = prev
        } else if (prev !== "*" && prev !== current) {
          conv = converters[prev + " " + current] || converters["* " + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(" ");
              if (tmp[1] === current) {
                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2]
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1])
                  }
                  break
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s.throwsErr) {
              response = conv(response);
            } else {
              try {
                response = conv(response)
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " + current
                }
              }
            }
          }
        }
      }
    }
    return {
      state: "success",
      data: response
    }
  }
  kimiCriss.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: originAnchor.href,
      type: "GET",
      isLocal: rlocalProtocol.test(location.protocol),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": true,
        "text json": kimiCriss.parseJSON,
        "text xml": kimiCriss.parseXML
      },
      flatOptions: {
        url: true,
        context: true
      }
    },
    ajaxSetup: function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, kimiCriss.ajaxSettings), settings) : ajaxExtend(kimiCriss.ajaxSettings, target)
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function(url, options) {
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }
      options = options || {};

      var
        transport,
        cacheURL,
        responseHeadersString,
        responseHeaders,
        timeoutTimer,
        urlAnchor,
        completed,
        fireGlobals,
        i,
        uncached,
        s = kimiCriss.ajaxSetup({}, options),
        callbackContext = s.context || s,
        globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? kimiCriss(callbackContext) : root,
        deferred = kimiCriss.Deferred(),
        completeDeferred = kimiCriss.Callbacks("once memory"),
        statusCode = s.statusCode || {},
        requestHeaders = {},
        requestHeadersNames = {},
        strAbort = "canceled",
        jqXHR = {
          readyState: 0,
          getResponseHeader: function(key) {
            var match;
            if (completed) {
              if (!responseHeaders) {
                responseHeaders = {};
                while ((match = rheaders.exec(responseHeadersString))) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match == null ? null : match;
          },
          getAllResponseHeaders: function() {
            return completed ? responseHeadersString : null;
          },
          setRequestHeader: function(name, value) {
            if (completed == null) {
              name = requestHeadersNames[name.toLowerCase()] =
                requestHeadersNames[name.toLowerCase()] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          overrideMimeType: function(type) {
            if (completed == null) {
              s.mimeType = type;
            }
            return this;
          },
          statusCode: function(map) {
            var code;
            if (map) {
              if (completed) {
                jqXHR.always(map[jqXHR.status]);
              } else {
                for (code in map) {
                  statusCode[code] = [statusCode[code], map[code]];
                }
              }
            }
            return this;
          },
          abort: function(statusText) {
            var finalText = statusText || strAbort;
            if (transport) {
              transport.abort(finalText);
            }
            done(0, finalText);
            return this;
          }
        };

      deferred.promise(jqXHR);
      s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = (s.dataType || "*").toLowerCase().match(rnotwhite) || [""];
      if (s.crossDomain == null) {
        urlAnchor = document.createElement("a");
        try {
          urlAnchor.href = s.url;
          urlAnchor.href = urlAnchor.href;
          s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
        } catch (e) {
          s.crossDomain = true;
        }
      }
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = kimiCriss.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (completed) {
        return jqXHR;
      }
      fireGlobals = s.global;
      if (fireGlobals && kimiCriss.active++ === 0) {
        root.trigger("ajaxStart");
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url.replace(rhash, "");
      if (!s.hasContent) {
        uncached = s.url.slice(cacheURL.length);
        if (s.data) {
          cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          s.data = uncached;
        }
        if (s.cache === false) {
          cacheURL = cacheURL.replace(rantiCache, "$1");
          uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + (nonce++) + uncached;
        }
        s.url = cacheURL + uncached;
      } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
        s.data = s.data.replace(r20, "+");
      }
      if (s.ifModified) {
        if (kimiCriss.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", kimiCriss.lastModified[cacheURL]);
        }
        if (kimiCriss.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", kimiCriss.etag[cacheURL]);
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader(
        "Accept",
        s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
      if (s.headers) {
        for (i in s.headers) {
          jqXHR.setRequestHeader(i, s.headers[i]);
        }
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {
        return jqXHR.abort();
      }

      strAbort = "abort";

      completeDeferred.add(s.complete);
      jqXHR.done(s.success);
      jqXHR.fail(s.error);
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done(-1, "No Transport");
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (completed) {
          return jqXHR;
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = window.setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout);
        }

        try {
          completed = false;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (completed) {
            throw e;
          }
          done(-1, e);
        }
      }

      function done(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
        if (completed) {
          return;
        }
        completed = true;
        if (timeoutTimer) {
          window.clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || "";
        jqXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = status >= 200 && status < 300 || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        response = ajaxConvert(s, response, jqXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if (modified) {
              kimiCriss.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if (modified) {
              kimiCriss.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";
          } else if (status === 304) {
            statusText = "notmodified";
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.unsolveWith(callbackContext, [jqXHR, statusText, error]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = undefined;

        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
        }
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
          if (!(--kimiCriss.active)) {
            root.trigger("ajaxStop");
          }
        }
      }

      return jqXHR;
    }
  });
  kimiCriss.each(["get", "post"], function(method) {
    kimiCriss[method] = function(url, data, callback, type) {
      if (kimiCriss.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined
      }
      return kimiCriss.ajax(kimiCriss.extend({
        url: url,
        type: method,
        dataType: type || "json",
        data: data,
        success: callback
      }, kimiCriss.isPlainObject(url) && url))
    }
  });
  kimiCriss._evalUrl = function(url) {
    return kimiCriss.ajax({
      url: url,
      type: "GET",
      dataType: "script",
      cache: true,
      async: false,
      global: false,
      throwsErr: true
    })
  };

  kimiCriss.ajaxSettings.xhr = function() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  };
  var
    xhrSuccessStatus = {
      0: 200,
      1223: 204
    },
    xhrSupported = kimiCriss.ajaxSettings.xhr();
  support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
  support.ajax = xhrSupported = !!xhrSupported;
  kimiCriss.ajaxTransport(function(options) {
    var callback, tryCallback, errorCallback;
    if (support.cors || xhrSupported && !options.crossDomain) {
      return {
        send: function(headers, complete) {
          var i, xhr = options.xhr();
          if (options.username) {
            xhr.open(options.type, options.url, options.async, options.username, options.password);
          } else {
            xhr.open(options.type, options.url, options.async);
          }
          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          }
          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }
          callback = function(type) {
            return function() {
              if (callback) {
                callback = tryCallback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
                if (type === "abort") {
                  return xhr.abort();
                }
                if (type === "error") {
                  if (typeof xhr.status === "number") {
                    return complete(xhr.status, xhr.statusText);
                  } else {
                    return complete(0, "error");
                  }
                }
                try {
                  var statusText, responses = {};
                  if ((!xhr.responseType || xhr.responseType === "text") && typeof xhr.responseText === "string") {
                    responses.text = xhr.responseText;
                  } else {
                    responses.binary = xhr.response;
                  }
                  try {
                    statusText = xhr.statusText;
                  } catch (e) {
                    statusText = "";
                  }
                  return complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, responses, xhr.getAllResponseHeaders());

                } catch (eMsg) {
                  return complete(-1, eMsg);
                }
              }
            }
          };
          xhr.onerror = errorCallback = callback("error");
          xhr.onload = tryCallback = callback();
          callback = callback("abort");
          if (xhr.onabort !== undefined) {
            xhr.onabort = callback;
          } else {
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                window.setTimeout(function() {
                  if (callback) {
                    tryCallback();
                  }
                })
              }
            }
          }
          try {
            xhr.send(options.hasContent && options.data || null)
          } catch (e) {
            if (callback) {
              throw e;
            }
          }
        },
        abort: function() {
          if (callback) {
            callback()
          }
        }
      }
    }
  });
  kimiCriss.ajaxPrefilter(function(s) {
    if (s.crossDomain) {
      s.contents.script = false;
    }
  });
  kimiCriss.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /\b(?:java|ecma)script\b/
    },
    converters: {
      "text script": function(text) {
        kimiCriss.globalEval(text);
        return text;
      }
    }
  });
  kimiCriss.ajaxPrefilter("script", function(s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });
  kimiCriss.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script, callback;
      return {
        send: function(_, complete) {
          script = kimiCriss("<script>").prop({
            charset: s.scriptCharset,
            src: s.url
          }).on("load error", callback = function(evt) {
            script.remove();
            callback = null;
            if (evt) {
              complete(evt.type === "error" ? 404 : 200, evt.type)
            }
          });
          (document.head || document.body).appendChild(script[0]);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      }
    }
  });
  var
    oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;
  kimiCriss.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || (_jschar_ + "_" + (nonce++));
      this[callback] = true;
      return callback;
    }
  });
  kimiCriss.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
    if (jsonProp || s.dataTypes[0] === "jsonp") {
      callbackName = s.jsonpCallback = kimiCriss.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
      }
      s.converters["script json"] = function() {
        if (!responseContainer) {
          kimiCriss.error(callbackName + " was not called");
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = "json";
      overwritten = window[callbackName];
      window[callbackName] = function() {
        responseContainer = arguments;
      };
      jqXHR.always(function() {
        if (overwritten === undefined) {
          kimiCriss(window).removeProp(callbackName);
        } else {
          window[callbackName] = overwritten;
        }
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          oldCallbacks.push(callbackName);
        }
        if (responseContainer && kimiCriss.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      return "script";
    }
  });
  kimiCriss.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(type) {
    kimiCriss.fn[type] = function(fn) {
      return this.bind(type, fn);
    };
  });

  var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)?Error$/;

  function createOptions(options) {
    var object = {};
    kimiCriss.each(options.match(rnotwhite), function(flag) {
      object[flag] = true;
    });
    return object;
  }

  kimiCriss.Callbacks = function(options) {
    options = kimiCriss.isString(options) ? createOptions(options) : kimiCriss.extend({}, options);
    var
      firing, memory, fired, locked, list = [],
      queue = [],
      firingIndex = -1,
      fire = function() {
        locked = options.once;
        fired = firing = true;
        for (; queue.length; firingIndex = -1) {
          memory = queue.shift();
          while (++firingIndex < list.length) {
            if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
              firingIndex = list.length;
              memory = false;
            }
          }
        }
        if (!options.memory) {
          memory = false;
        }

        firing = false;
        if (locked) {
          if (memory) {
            list = [];
          } else {
            list = "";
          }
        }
      },
      self = {
        add: function() {
          if (list) {
            if (memory && !firing) {
              firingIndex = list.length - 1;
              queue.push(memory);
            }(function add(args) {
              kimiCriss.each(args, function(arg) {
                if (kimiCriss.isFunction(arg)) {
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && !kimiCriss.isString(arg)) {
                  add(arg);
                }
              });
            })(arguments);
            if (memory && !firing) {
              fire();
            }
          }
          return this;
        },
        remove: function() {
          kimiCriss.each(arguments, function(arg) {
            var index;
            while ((index = kimiCriss.indexOfArray(arg, list, index)) > -1) {
              list.splice(index, 1);
              if (index <= firingIndex) {
                firingIndex--;
              }
            }
          });
          return this;
        },
        has: function(fn) {
          return fn ? kimiCriss.indexOfArray(fn, list) > -1 : list.length > 0;
        },
        empty: function() {
          if (list) {
            list = [];
          }
          return this;
        },
        disable: function() {
          locked = queue = [];
          list = memory = "";
          return this;
        },
        disabled: function() {
          return !list;
        },
        lock: function() {
          locked = queue = [];
          if (!memory && !firing) {
            list = memory = "";
          }
          return this;
        },
        locked: function() {
          return !!locked;
        },
        fireWith: function(context, args) {
          if (!locked) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            queue.push(args);
            if (!firing) {
              fire();
            }
          }
          return this;
        },
        fire: function() {
          self.fireWith(this, arguments);
          return this;
        },
        fired: function() {
          return !!fired;
        }
      };
    return self;
  };

  function Identity(v) {
    return v;
  }

  function Thrower(ex) {
    throw ex;
  }

  function adoptValue(value, resolve, unsolve) {
    var method;
    try {
      if (value && kimiCriss.isFunction((method = value.promise))) {
        method.call(value).done(resolve).fail(unsolve)
      } else if (value && kimiCriss.isFunction((method = value.then))) {
        method.call(value, resolve, unsolve)
      } else {
        resolve.call(undefined, value)
      }
    } catch (value) {
      unsolve.call(undefined, value)
    }
  }

  kimiCriss.extend({
    Deferred: function(callback) {
      var
        tuples = [
          ["solve", "progress", kimiCriss.Callbacks("memory"), kimiCriss.Callbacks("memory"), 2],
          ["resolve", "done", kimiCriss.Callbacks("once memory"), kimiCriss.Callbacks("once memory"), 0, "success"],
          ["unsolve", "fail", kimiCriss.Callbacks("once memory"), kimiCriss.Callbacks("once memory"), 1, "error"]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state;
          },
          always: function() {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          catchErr: function(fn) {
            return promise.then(null, fn);
          },
          then: function(onFulfilled, onRejected, onProgress) {
            var maxDepth = 0;

            function resolve(depth, deferred, handler, special) {
              return function() {
                var that = this,
                  args = arguments,
                  mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (kimiCriss.isFunction(then)) {
                      if (special) {
                        then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special))
                      } else {
                        maxDepth++;
                        then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.solveWith))
                      }
                    } else {
                      if (handler !== Identity) {
                        that = undefined;
                        args = [returned]
                      }(special || deferred.resolveWith)(that, args)
                    }
                  },
                  process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e) {
                      if (WebErrorHook) {
                        WebErrorHook(e, process.stackTrace);
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = undefined;
                          args = [e]
                        }
                        deferred.unsolveWith(that, args);
                      }
                    }
                  };
                if (depth) {
                  process()
                } else {
                  if (kimiCriss.Deferred.getStackHook) {
                    process.stackTrace = kimiCriss.Deferred.getStackHook();
                  }
                  window.setTimeout(process);
                }
              }
            }
            return kimiCriss.Deferred(function(newDefer) {
              tuples[0][3].add(resolve(0, newDefer, kimiCriss.isFunction(onProgress) ? onProgress : Identity, newDefer.solveWith));
              tuples[1][3].add(resolve(0, newDefer, kimiCriss.isFunction(onFulfilled) ? onFulfilled : Identity));
              tuples[2][3].add(resolve(0, newDefer, kimiCriss.isFunction(onRejected) ? onRejected : Thrower))
            }).promise();
          },
          promise: function(obj) {
            return obj != null ? kimiCriss.extend(obj, promise) : promise;
          }
        },
        deferred = {};
      kimiCriss.each(tuples, function(tuple, i) {
        var
          list = tuple[2],
          stateString = tuple[5];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString
          }, tuples[3 - i][2].disable, tuples[0][2].lock);
        }
        list.add(tuple[3].fire);
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (callback) {
        callback.call(deferred, deferred);
      }
      return deferred;
    },
    when: function(singleValue) {
      var
        remaining = arguments.length,
        i = remaining,
        resolveContexts = Array(i),
        resolveValues = slice.call(arguments),
        master = kimiCriss.Deferred(),
        updateFunc = function(i) {
          return function(value) {
            resolveContexts[i] = this;
            resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
            if (!(--remaining)) {
              master.resolveWith(resolveContexts, resolveValues)
            }
          }
        };
      if (remaining <= 1) {
        adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.unsolve);
        if (master.state() === "pending" || kimiCriss.isFunction(resolveValues[i] && resolveValues[i].then)) {
          return master.then()
        }
      }
      while (i--) {
        adoptValue(resolveValues[i], updateFunc(i), master.unsolve);
      }
      return master.promise();
    }
  });

  WebErrorHook = function(error, stack) {
    if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
      window.console.warn("Error: " + error.message, "\n" + error.stack, "\nStackTrace: " + (stack || "NULL."));
    }
  };
  kimiCriss.readyException = function(error) {
    window.setTimeout(function() {
      throw error;
    });
  };
  var readyList = kimiCriss.Deferred();
  kimiCriss.fn.ready = function(fn) {
    readyList.then(fn).catchErr(function(error) {
      kimiCriss.readyException(error);
    });
    return this;
  };
  kimiCriss.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function(hold) {
      if (hold) {
        kimiCriss.readyWait++;
      } else {
        kimiCriss.ready(true);
      }
    },
    ready: function(wait) {
      if (wait === true ? --kimiCriss.readyWait : kimiCriss.isReady) {
        return false;
      }
      kimiCriss.isReady = true;
      if (wait !== true && --kimiCriss.readyWait > 0) {
        return false;
      }
      readyList.resolveWith(document, [kimiCriss]);
      return true;
    }
  });
  kimiCriss.ready.then = readyList.then;

  function completed() {
    if (document.addEventListener) {
      document.removeEventListener("DOMContentLoaded", completed, false);
      window.removeEventListener("load", completed, false);

    } else {
      document.detachEvent("onreadystatechange", completed);
      window.detachEvent("onload", completed);
    }
    kimiCriss.ready();
  }
  if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    window.setTimeout(kimiCriss.ready);
  } else {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", completed, false);
      window.addEventListener("DOMContentLoaded", completed, false);
    } else {
      document.attachEvent("onreadystatechange", completed);
      window.attachEvent("onreadystatechange", completed);
    }
  }

  window.kimiCriss = window.$ = kimiCriss;

})(window);

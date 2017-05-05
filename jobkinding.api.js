(function ($) {
    var arr = [];
    var push = arr.push;
    var slice = arr.slice;
    var concat = arr.concat;
    var rnotwhite = (/[^\x20\t\r\n\f]+/g);
    var reg = /^((((ht|f)tps?:\/\/)(([\w-]+\.)*[\w-:]+\/))(([\w-]+\.)*[\w-]+\/)*)(?:.*)$/;

    var uri = reg.exec($.ajaxSettings.url);

    $.uri = uri[1];
    $.baseUri = uri[2];
    $.api = function (tag, selector, options) {
        if ($.api.control[tag]) {
            return new $.api.control[tag](tag, selector, options);
        }
        return new $.api.fn.init(tag, selector, options);
    }
    $.extend($.api, {
        isReady: true,
        readyWait: 0,
        uri: $.uri,
        control: {},
        baseUri: $.baseUri,
        baseConfigs: function (type, options) {
            if (arguments.length === 1) {
                options = type;
                type = null;
            }
            type = type || $.type(options);
            if (type === "string") {
                options = (function (o) {
                    $.each(options.match(rnotwhite), function (key) {
                        o[key] = true;
                    });
                    return o;
                })({});
            }
            if (type === "object" || type === "string") {
                var callbacks = {};
                if (type === "object") {
                    for (type in options) {
                        if (options[type] && $.isFunction(options[type])) {
                            callbacks[type] = options[type];
                        }
                    }
                }
                $.extend(options, {
                    baseConfigs: function (object, context) {
                        object = object || this;
                        context = context || this;
                        $.api.fn.baseConfigs(object, context);
                        for (var i in callbacks) {
                            object[i] = function () {
                                context.base = object.base;
                                var val = callbacks[i].apply(context, arguments);
                                context.base = object;
                                return val;
                            }
                        }
                        if (this.base) {
                            $.api.fn.baseConfigs(this.base.base = {}, this);
                        }
                        return object;
                    }
                });
            }
            return $.improve(options, $.api.fn);
        },
        init: function (tag, options) {
            var type = $.type(options);
            if (type === "function") {
                return $.api.control[tag] = options;
            }
            var init = function (tag, selector, options) {
                $.api.fn.init.call(this, tag, selector, options);
            }
            init.prototype = $.api.baseConfigs(type, options);
            return $.api.control[tag] = $.api.fn.control[tag] = init;
        }
    });
    $.api.fn = {
        enumState: {
            pending: 0,
            init: 1,
            render: 2,
            resolve: 4,
            commit: 8
        },
        control: {},
        constructor: $.api,
        baseConfigs: function (object, context) {
            object = object || this;
            context = context || this;
            object.init = function (tag) {
                context.document = $(context.selector, context.context).append(document.createElement(tag || "div"));
                context.$ = context.document.lastChild();
            };
            object.render = function () {
                if (context.tag) {
                    context.$.prop(context.tag, context);
                    context.$.addClass(context.tag.slice(0, 2).toLowerCase() + context.tag.slice(2));
                }
                if (!context.enabled) {
                    context.setEnabled(context.enabled);
                }
                if (!context.visible) {
                    context.hide();
                }
                if (context.css) {
                    context.$.css(context.css);
                }
                if (context.width) {
                    context.setWidth(context.width);
                }
                if (context.height) {
                    context.setHeight(context.height);
                }
                if (context.addClass) {
                    context.$.addClass(context.addClass);
                }
                if (context.border) {
                    if ($.lib.support("box-shadow")) {
                        context.$.addClass("shadow");
                    } else {
                        context.$.addClass("border");
                    }
                }
                if (context.focus) {
                    context.tryfocus();
                }
            };
            object.resolve = function () { };
            object.commit = function () {
                context.$.bind(context.on);
            };
            object.trigger = function (type, data) {
                context.$.trigger(type, data);
            };
            object.dynamic = function (options, document) {
                if (options == null || document == null || document.version == null) {
                    return context;
                }
                switch ($.type(options)) {
                    case "object":
                        if (options.nodeType) {
                            document.append(options);
                            break;
                        }
                        if (options.addClass) {
                            document.addClass(options.addClass);
                        }
                        var tag = options.tag;
                        if ($.type(tag) === "string") {
                            tag = tag.slice(0, 2).toLowerCase() + tag.slice(2);
                            if (typeof $[tag] === "function") {
                                $.api(tag, options.selector, options.options);
                            }
                        }
                        break;
                    case "function":
                        context.dynamic(options.call(context, document, context), document);
                        break;
                    case "array":
                        $.each(options, function (value) {
                            context.dynamic(value, document);
                        });
                        break;
                    case "number":
                        document.append('<div class="context-split" style="width:', options, 'px"></div>');
                        break;
                    case "string":
                        document.append($.lib.html(options));
                        break;
                    default:
                        document.append(window.document.createTextNode(String(options)));
                        break;
                }
                return context;
            };
            object.whenThen = function (state) {
                state = state || context.state || "pending";
                switch (state) {
                    case "pending": context.init();
                    case "init": context.render();
                    case "render": context.resolve();
                    case "resolve": context.commit();
                    case "commit": context.commit = "commit"; break;
                    default: $.syntaxError('Undefined state: ' + state + ', relevant methods '); break;
                }
            };
            object.destroy = function (v) {
                context.$.remove();
                context.base.base = $.api.destroy(context.base.base, false);
                context.base = $.api.destroy(context.base, false);
                $.api.destroy(context, v);
            };
            object.contains = function (el) {
                for (var i = 0, len = context.$.length; i < len; i++) {
                    if ($.contains(context.$.get(i), el)) {
                        return true;
                    }
                }
                return false;
            };
            object.hide = function () {
                context.setVisible(false);
            };
            object.show = function () {
                context.setVisible(true);
            };
            object.toggle = function (v) {
                if (typeof v === "boolean") {
                    return v ? context.show() : context.hide();
                }
                return context.toggle(!context.visible);
            };
            object.tryfocus = function () {
                try {
                    context.$.eq(0).focus();
                } catch (e) { }
            };
            object.setWidth = function (v) {
                if (!!(v = $.jreg.o2stylenumber.exec(v))) {
                    context.width = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                    context.$.width(v[0]);
                    return v;
                }
            };
            object.setHeight = function (v) {
                if (!!(v = $.jreg.o2stylenumber.exec(v))) {
                    context.height = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                    context.$.height(v[0]);
                    return v;
                }
            };
            object.setVisible = function (v) {
                if ($.jreg.bool.test(v)) {
                    context.$.toggleClass("hide", !(context.visible = (v === true || v === "true")));
                    return true;
                }
            };
            object.setEnabled = function (v) {
                if ($.jreg.bool.test(v)) {
                    context.$.attr("disabled", !(context.enabled = (v === true || v === "true")));
                    return true;
                }
            };
            return object;
        },
        init: function (tag, selector, options) {
            if ($.isString(options)) {
                options = (function (o) {
                    $.each(options.match(rnotwhite), function (key) {
                        o[key] = true;
                    });
                    return o;
                })({});
            }

            this.baseConfigs();

            this.baseConfigs(this.base = {}, this);

            this.tag = tag;

            this.enabled = true;
            this.visible = true;

            this.selector = selector;

            $.extend(true, this, options);

            this.state = "pending";
            if (this.init() === false) {
                if (this.enumState[this.state] < this.enumState["init"]) {
                    this.state = "init";
                }
            } else if (this.render() === false) {
                if (this.enumState[this.state] < this.enumState["render"]) {
                    this.state = "render";
                }
            } else if (this.resolve() === false) {
                if (this.enumState[this.state] < this.enumState["resolve"]) {
                    this.state = "resolve";
                }
            } else {
                this.commit();
                this.state = "commit";
            }
        }
    };
    $.api.fn.init.prototype = $.api.fn;

    var readyList = $.Deferred();
    var readyRegExp = navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/;
    function _load(tag, uri, base) {
        if (typeof tag === "boolean") {
            base = base == null ? uri : base;
            tag = null;
        }
        if (typeof uri === "boolean") {
            base = base == null ? uri : base;
            uri = null;
        }
        if (tag && tag.indexOf("/") > -1) {
            uri = uri || tag;
            tag = null;
        }
        var url = base ? $.api.baseUri : $.api.uri;
        if ($.isString(uri)) {
            if (uri.indexOf("~/") > -1) {
                url = $.api.baseUri;
                uri = uri.slice(2);
            }
            if (uri.indexOf("../") > -1) {
                var uriArr = url.split("/");
                while (uri.indexOf("../") > -1) {
                    uriArr.pop();
                    uri = uri.slice(3);
                }
                url = uriArr.join("/");
            }
            url += uri.replace(/^(\/)|(\/)$/g, "");
        }
        if (uri && uri.slice(-3) == ".js") {
            return url;
        }
        return url += $.lib.formatString("/jobkinding.{0}.js", tag.slice(0, 2).toLowerCase() + tag.slice(2));
    };
    function load(e) {
        var callbak = e.data, target = e.target || e.targetEl || e.currentTarget || e.srcElement;
        if (e.type === 'load' || target && readyRegExp.test(target.readyState)) {
            $.api.isReady = --$.api.readyWait < 1;
            $(target).off("load readystatechange");
            if (callbak && typeof callbak === "function") {
                callbak.apply(this, arguments);
            }
            if ($.api.isReady) {
                $(document).ready(function () {
                    readyList.resolveWith(document, [$]);
                });
            }
        }
    }
    $.extend($.api, {
        load: function (tag, uri, base) {
            if ($.isArray(tag)) {
                return $.each(tag, function (tag) {
                    $.api.load(tag);
                });
            }
            if ($.isPlainObject(tag)) {
                return $.each(tag, function (value, tag) {
                    $.api.load.apply(null, concat.call([tag], value));
                });
            }
            if ($.isString(tag)) {
                $._evalUrl(_load(tag, uri, base));
            }
        },
        loadV2: function (tag, uri, base, callbak) {
            if ($.isFunction(base)) {
                callbak = callbak || base;
                base = false;
            }
            if ($.isFunction(uri)) {
                callbak = callbak || uri;
                uri = null;
            }
            var readyWait = 0;
            if (callbak) {
                var _callbak = callbak;
                callbak = function () {
                    if (--readyWait < 1) {
                        tag = $.map(tag, function (tag) {
                            if (typeof tag === "string") {
                                return window[tag];
                            }
                        });
                        _callbak.apply(this, tag);
                    }
                }
            }
            $.each(tag = $.makeArray(tag, []), function (tag) {
                if (typeof tag === "string") {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = _load(tag, uri, base);
                    if (document.head) {
                        document.head.appendChild(script);
                    } else {
                        document.body.appendChild(script);
                    }
                    readyWait = readyWait + 1;
                    $.api.isReady = ++$.api.readyWait < 1;
                    $(script).on("load readystatechange", callbak, load);
                }
            });
        }
    });
    var ready = $.fn.ready;
    $.fn.ready = function (fn) {
        if ($.api.isReady) {
            return ready.apply(this, arguments);
        }
        return this.readyControl.apply(this, arguments);
    };
    $.readyControl = $.fn.readyControl = function () {
        var isDebugging, context = this;
        $.each(arguments, function (tag) {
            var type = $.type(tag);
            if (type === "boolean") {
                isDebugging = tag;
                return;
            }
            if (type === "function") {
                return $.api.isReady ? ready.call(context, tag) : readyList.then(tag).catchErr(function (error) {
                    $.readyException(error);
                });
            }
            return $.fn.ready(function () {
                return $.api[isDebugging ? "loadV2" : "load"][type === "array" ? "apply" : "call"](this, tag);
            });
        });
        return this;
    }

})(jobKinding);

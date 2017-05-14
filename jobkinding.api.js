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
        if (arguments.length === 2 && $.isPlainObject(selector)) {
            options = selector;
            selector = null;
        }
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
        zIndex: $.lib.year(),
        animation: $.lib.support("animation"),
        boxShadow: $.lib.support("box-shadow"),
        transition: $.lib.support("transition"),
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
                    baseConfigs: function (object, context, options) {
                        object = object || this;
                        context = context || this;
                        $.api.fn.baseConfigs(object, context);
                        $.each(callbacks, function (callback, type) {
                            object[type] = options && (type in options) ? function () {
                                context.base = object.base;
                                var val = callback.apply(context, arguments);
                                context.base = object;
                                return val;
                            } : context === object ? callback : object[type] || $.noop;
                        });
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
            return $.api.control[tag] = init;
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
        constructor: $.api,
        control: $.api.control,
        baseConfigs: function (object, context) {
            object = object || this;
            context = context || this;
            object.init = function (tag) {
                tag = tag || "div";
                if (context.selector) {
                    context.document = $(context.selector, context.context).append(document.createElement(tag));
                    context.$ = context.document.lastChild();
                } else {
                    context.$ = $(tag, context.context);
                }
            };
            object.render = function () {
                context.$.addClass("api");
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
                    if ($.api.boxShadow) {
                        context.$.addClass("box-shadow");
                    } else {
                        context.$.addClass("border");
                    }
                }
                if (context.focus) {
                    context.tryfocus();
                }
            };
            object.resolve = $.noop;
            object.commit = function () {
                context.$.bind(context.on);
            };
            object.trigger = function (type, data) {
                context.$.trigger(type, data);
            };
            object.contextCall = function (callback) {
                var args = concat.call([context], slice.call(arguments, 0));
                return function () {
                    return callback.apply(context, args);
                }
            };
            object.dynamic = function (options, document) {
                if (options == null || document == null) {
                    return null;
                }
                if (typeof document === "string") {
                    document = context.$.append($.lib.html(document)).find(document);
                } else if (document.version == null) {
                    return null;
                }
                if ($.isString(options)) {
                    options = { html: options };
                }

                var i, val;
                for (var i in options) {
                    val = options[i];
                    switch (i) {
                        case "html":
                            if ($.isArray(val)) {
                                $.each(val, function (html) {
                                    document.append($.lib.html(html));
                                });
                            } else {
                                document.append($.lib.html(val));
                            }
                            break;
                        case "on":
                            for (i in val) {
                                if (typeof val[i] === "function") {
                                    document.find(i).click(context.contextCall(val[i]));
                                } else {
                                    document.find(i).on(context.contextCall(val[i]));
                                }
                            }
                            break;
                        case "html2on":
                            for (i in val) {
                                document.append($.lib.html(i));
                                if (typeof val[i] === "function") {
                                    document.find(i).click(context.contextCall(val[i]));
                                } else {
                                    document.find(i).on(context.contextCall(val[i]));
                                }
                            }
                            break;
                        case "api":
                            if ($.isArray(val)) {
                                $.each(val, function (api) {
                                    $.api(api.tag, api.selector, api.options);
                                });
                            } else {
                                $.api(val.tag, val.selector, val.options);
                            }
                            break;
                        case "selector":
                            document.append($(options.selector));
                            break;
                        default:
                            $.api.error("Tag:" + context.tag + ";Fn:dynamic;Error:The method of type " + i + " is undefined.", "API");
                            break;
                    }
                }
                return document;
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
                if (!!(v = $.jreg.style.exec(v))) {
                    return context.$.width(context.width = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0);
                }
            };
            object.setHeight = function (v) {
                if (!!(v = $.jreg.style.exec(v))) {
                    return context.$.height(context.height = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0);
                }
            };
            object.setVisible = function (v) {
                if ($.jreg.bool.test(v)) {
                    context.$.toggleClass("hidden", !(context.visible = (v === true || v === "true")));
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

            this.baseConfigs(this.base = {}, this, options);

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
    $.extend($.api, {
        error: function (msg, type) {
            $(document.body).append($.lib.formatString('<div class="ui content font-danger-color border-warning-color"><label class="ui label extra border-danger-color towards-left">{0} Error</label>{1}</div>', type, msg));
        },
        _load: function (tag, uri, base) {
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
            if (uri && reg.test(uri)) {
                return uri;
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
                        uriArr.splice(-2, 1);
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
        },
        load: function (tag, uri, base, callbak) {
            if ($.isFunction(base)) {
                callbak = callbak || base;
                base = false;
            }
            if ($.isFunction(uri)) {
                callbak = callbak || uri;
                uri = null;
            }
            if ($.isArray(tag)) {
                return $.each(tag, function (tag) {
                    if ($.isArray(tag)) {
                        var i = tag.length;
                        $.api.load(tag[0], i > 0 ? tag[1] : uri, i > 1 ? tag[2] : base, i > 2 ? tag[3] : callbak);
                    } else {
                        $.api.load(tag, uri, base, callbak);
                    }
                });
            }
            if ($.isPlainObject(tag)) {
                return $.each(tag, function (value, tag) {
                    $.api.load.apply(null, concat.call([tag], value));
                });
            }
            if ($.isString(tag)) {
                $._evalUrl(uri = $.api._load(tag, uri, base), typeof callbak === "function" && function () {
                    callbak(uri, tag);
                }, function () {
                    $.api.error("Uri:" + uri, "Script");
                });
            }
        },
        loadV2: function (tag, uri, base, callbak) {
            var readyWait = 0;
            callbak = callbak || base || uri || tag;
            $.api.load(tag, uri, base, function (src) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = src;
                if (document.head) {
                    document.head.appendChild(script);
                } else {
                    document.body.appendChild(script);
                }
                readyWait = readyWait + 1;
                $.api.isReady = ++$.api.readyWait < 1;
                $(script).on("load readystatechange", typeof callbak === "function" && function () {
                    if (--readyWait === 0) {
                        callbak[$.isArray(tag) ? "apply" : "call"](tag);
                    }
                }, function (e) {
                    if (e.type === 'load' || readyRegExp.test(script.readyState)) {
                        $.api.isReady = --$.api.readyWait < 1;
                        $(script).off("load readystatechange");
                        if (e.data) {
                            e.data.apply(this, arguments);
                        }
                        if ($.api.isReady) {
                            $(document).ready(function () {
                                readyList.resolveWith(document, [$]);
                            });
                        }
                    }
                });
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
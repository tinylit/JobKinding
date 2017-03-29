(function (jschar) {
    var 
		arr = [],
		slice = arr.slice,
		concat = arr.concat;
    var rnotwhite = (/[^\x20\t\r\n\f]+/g);
    var x2Object = function (data, failCallbak) {
        if (data) {
            var type = jschar.type(data);
            if (type === "string") {
                var object = {};
                jschar.each(data.match(rnotwhite), function (value) {
                    object[value] = true;
                });
                return object;
            }
            if (type === "array") {
                return {
                    items: data
                };
            }
            return type === "object" ? data : failCallbak ? failCallbak(data, type) : {};
        }
        return {};
    };
    jschar.ui = function (tag, functionCallback, baseProp) { //注：只有defaultProp中的属性才会存储到生成控件的base属性中。
        jschar.ui.global[tag] = true;
        baseProp = x2Object(baseProp);
        jschar.ui[tag] = functionCallback;
        functionCallback.constructor = functionCallback;
        var _tag_ = tag.charAt(0).toLowerCase() + tag.slice(1);
        jschar.extend(true, functionCallback.prototype, baseProp);
        jschar.fn[_tag_] = function (options) {
            return this.each(function (element) {
                return jschar.ui[_tag_](element, options);
            });
        };
        return jschar.ui[_tag_] = function (element, options) {
            if (arguments.length === 1 && jschar.isPlainObject(element)) {
                options = element;
                element = null;
            }
            options = options || {};
            options.elememt = element || options.elememt;
            return jschar.ui.extend(tag === _tag_ ? new functionCallback(element, options) : new jschar.ui[tag](element, options), options, baseProp);
        };
    };
    jschar.ui.enumState = {
        pending: 0,
        init: 1,
        render: 2,
        resolve: 4,
        commit: 8
    };
    jschar.ui.extend = function (lyt, options, baseProp) {
        var _base_ = {
            init: function (tag) {
                lyt.document = lyt.document || document.body;
                lyt.elememt = $(lyt.elememt, lyt.document).get(0);
                if (lyt.elememt == null) {
                    lyt.elememt = lyt.document.appendChild(document.createElement(tag || "div"));
                }
                lyt.$ = $(lyt.elememt);
                lyt.document = lyt.elememt.parentNode;
            },
            render: function () {
                if (lyt.tag) {
                    lyt.elememt[lyt.tag] = lyt;
                    lyt.$.addClass(lyt.tag.slice(0, 1).toLowerCase() + lyt.tag.slice(1));
                }
                if (!lyt.enabled) {
                    lyt.setEnabled(lyt.enabled);
                }
                if (!lyt.visible) {
                    lyt.hide();
                }
                if (lyt.css) {
                    lyt.$.css(lyt.css);
                }
                if (lyt.width) {
                    lyt.setWidth(lyt.width);
                }
                if (lyt.height) {
                    lyt.setHeight(lyt.height);
                }
                if (lyt.addClass) {
                    lyt.$.addClass(lyt.addClass);
                }
                if (lyt.border) {
                    lyt.$.addClass("shadow");
                }
                if (lyt.focus) {
                    lyt.tryfocus();
                }
            },
            resolve: function () { },
            commit: function () {
                if (lyt.on) {
                    for (var key in lyt.on) {
                        lyt.bind(key, lyt.on[key]);
                    }
                }
            },
            bind: function (key, callbak) {
                lyt.$.bind(key, function () {
                    callbak.call(lyt, lyt);
                });
            },
            trigger: function (fn /*,..args*/) {
                if (fn && ($.isFunction(fn) ? fn : fn = lyt[fn])) {
                    if (arguments.length > 1) {
                        return fn.apply(lyt, concat.call([lyt], slice.call(arguments, 1)));
                    }
                    return fn.call(lyt, lyt);
                }
            },
            dynamic: function (options, document) {
                if (options == null || document == null || document.jschar == null) {
                    return lyt;
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
                                $[tag](options.elememt, $.extend(options.options, {
                                    parentEl: document.get(0)
                                }));
                            }
                        }
                        break;
                    case "function":
                        lyt.dynamic(options.call(lyt, document, lyt), document);
                        break;
                    case "array":
                        $.each(options, function (value) {
                            lyt.dynamic(value, document);
                        });
                        break;
                    case "number":
                        document.append('<div class="lyt-split" style="width:', options, 'px"></div>');
                        break;
                    case "string":
                        var match = $.reg.o2stylenumber.exec(options);
                        if (match && match[1]) {
                            document.append('<div class="lyt-split" style="width:' + (match[1] + (match[2] || "px")) + '"></div>');
                        } else {
                            document.append($.ui.dynamic(options));
                        }
                        break;
                    default:
                        document.append(window.document.createTextNode(options));
                        break;
                }
                return lyt;
            },
            whenThen: function (state) {
                state = state || lyt.state;
                switch (state) {
                    case "pending":
                        lyt.init();
                    case "init":
                        lyt.render();
                    case "render":
                        lyt.resolve();
                    case "resolve":
                        lyt.commit();
                    case "commit":
                        lyt.commit = "commit";
                        break;
                    default:
                        $.syntaxError('Undefined state: ' + state + ', relevant methods ');
                        break;
                }
            },
            destroy: function (v) {
                lyt.$.remove();
                lyt.base.base = $.ui.destroy(lyt.base.base, false);
                lyt.base = $.ui.destroy(lyt.base, false);
                $.ui.destroy(lyt, v);
            },
            contains: function (el) {
                return $.contains(lyt.elememt, el);
            },
            hide: function () {
                lyt.setVisible(false);
            },
            show: function () {
                lyt.setVisible(true);
            },
            toggle: function (v) {
                if (typeof v === "boolean") {
                    return v ? lyt.show() : lyt.hide();
                }
                return lyt.toggle(!lyt.visible);
            },
            tryfocus: function () {
                if (lyt.elememt.focus) {
                    try {
                        lyt.elememt.focus();
                    } catch (e) { }
                }
            },
            setWidth: function (v) {
                if (!!(v = $.reg.o2stylenumber.exec(v))) {
                    lyt.width = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                    lyt.$.width(v[0]);
                    return v;
                }
            },
            setHeight: function (v) {
                if (!!(v = $.reg.o2stylenumber.exec(v))) {
                    lyt.height = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                    lyt.$.height(v[0]);
                    return v;
                }
            },
            setVisible: function (v) {
                if ($.reg.bool.test(v)) {
                    lyt.$.toggleClass("hide", !(lyt.visible = (v === true || v === "true")));
                    return true;
                }
            },
            setEnabled: function (v) {
                if ($.reg.bool.test(v)) {
                    lyt.$.attr("disabled", !(lyt.enabled = (v === true || v === "true")));
                    return true;
                }
            }
        };
        $.extend(lyt, {
            visible: true,
            enabled: true
        });
        var key, type, base = {
            base: _base_
        };
        if (baseProp) {
            for (key in baseProp) {
                var value = lyt[key];
                switch (type = $.type(value)) {
                    case "function":
                        if (options && (key in options)) {
                            base[key] = function () {
                                lyt.base = _base_;
                                var val = value.apply(lyt, arguments);
                                lyt.base = base;
                                return val;
                            };
                        } else {
                            base[key] = _base_[key];
                        }
                        break;
                    case "array":
                    case "object":
                        base[key] = $.extand(true, type === "array" ? [] : {}, value);
                        break;
                    default:
                        base[key] = value;
                        break;
                }
            }
        }
        for (key in _base_) {
            base[key] = base[key] == null ? (lyt[key] = _base_[key]) : base[key];
        }
        $.extend(true, lyt, options);
        lyt.base = base;
        lyt.state = "pending";
        if (!lyt.init || lyt.init() === false) {
            if (jschar.ui.enumState[lyt.state] < jschar.ui.enumState["init"]) {
                lyt.state = "init";
            }
        } else if (lyt.render() === false) {
            if (jschar.ui.enumState[lyt.state] < jschar.ui.enumState["render"]) {
                lyt.state = "render";
            }
        } else if (!lyt.resolve || lyt.resolve() === false) {
            if (jschar.ui.enumState[lyt.state] < jschar.ui.enumState["resolve"]) {
                lyt.state = "resolve";
            }
        } else {
            if (lyt.commit) {
                lyt.commit();
            }
            lyt.state = "commit";
        }
        return lyt;
    };

    var readyList = jschar.Deferred();
    var readyRegExp = navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/;

    function load(event) {
        event = event || window.event || {};
        var target = event.targetEl || event.currentTarget || event.srcElement;
        if (event.type === 'load' || target && readyRegExp.test(target.readyState)) {
            if (jschar.ui.isReady = --jschar.ui.readyWait < 1) {
                jschar(document).ready(function () {
                    readyList.resolveWith(document, [jschar]);
                });
            }
        }
    }
    jschar.extend(jschar.ui, {
        global: {},
        readyWait: 0,
        isReady: true,
        init: function (tag) {
            if (jschar.isArray(tag)) {
                jschar.each(tag, jschar.ui.init);
            }
            if (jschar.isString(tag) && jschar.ui.global[tag] == null) {
                jschar.ui.global[tag] = false;
                jschar.ui[tag.charAt(0).toLowerCase() + tag.slice(1)] = function (element, options) {
                    if (jschar.ui.global[tag]) {
                        return jschar(element ? element.element || element : document.body).append('<span>控件【' + tag + '】加载错误.</span>');
                    }
                    jschar.ui._load(tag);
                    jschar.ui.global[tag] = true;
                    return jschar.ui[tag.charAt(0).toLowerCase() + tag.slice(1)].apply(this, arguments);
                };
            }
        },
        _load: function (src) {
            if (src in jschar.ui.global) {
                src = jschar.BaseDirectory + "jschar/js/ui/jschar.ui." + src.charAt(0).toLowerCase() + src.slice(1) + ".js";
            }
            jschar._evalUrl(src);
        },
        load: function (tag, callbak) {
            if (jschar.isArray(tag)) {
                jschar.each(tag, function (_tag_) {
                    jschar.ui.load(_tag_, callbak);
                });
            }
            if (jschar.isString(tag)) {
                if (tag in jschar.ui.global) {
                    tag = jschar.BaseDirectory + "jschar/js/ui/jschar.ui." + tag.charAt(0).toLowerCase() + tag.slice(1) + ".js";
                }
                jschar.ui.readyWait++;
                jschar.ui.isReady = false;
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = tag;
                if (document.head) {
                    document.head.appendChild(script);
                } else {
                    document.body.appendChild(script);
                }
                jschar(script).on("load readystatechange", callbak ? function (e) {
                    callbak.call(this, e, tag);
                } : load);
            }
        }
    });
    var ready = jschar.fn.ready;
    jschar.fn.ready = function (fn) {
        if (jschar.ui.isReady) {
            return ready.apply(this, arguments);
        }
        return this.readyControl(fn);
    };
    jschar.readyControl = jschar.fn.readyControl = function () {
        jschar.each(arguments, function (tag) {
            if (jschar.isFunction(tag)) {
                return readyList.then(tag).catchErr(function (error) {
                    jschar.readyException(error);
                });
            }
            return jschar.fn.ready(function () {
                jschar.ui.load(tag);
            });
        });
        return this;
    }
    jschar.ui.init(["Dialog"]);

})(jschar);
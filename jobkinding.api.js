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
            return new $.api.control[tag].apply(null, arguments);
        }
        return $.api.init.apply(null, arguments);
    }
    $.extend($.api, {
        isReady: false,
        uri: $.uri,
        baseUri: $.baseUri,
        control: {},
        load: function () { 
        
        },
        baseConfigs: function (tag, context) {
            var i, base = { tag: tag };
            for (i in $.api.base) {
                base[i] = function () {
                    return $.api.base[i].apply(context, arguments);
                }
            }
            return base.base = base;
        },
        init: function (tag, configs) {
            var type = $.type(configs);
            if (type === "function") {
                return $.api.control[tag] = configs;
            }
            if (type === "string") {
                configs = (function (o) {
                    $.each(configs.match(rnotwhite), function (key) {
                        o[key] = true;
                    });
                    return o;
                })({});
            }
            return $.api.control[tag] = function (tag, selector, options) {
                return $.api(tag, selector, options, configs);
            };
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
        baseConfigs: function (key, value, base) {
            base = base || this.base;
            if (key in base) {
                var lyt = this;
                base[key] = function () {
                    return value.apply(lyt, arguments);
                }
            }
        },
        init: function (tag, selector, options, configs) {

            var i = 0;

            this.visible = true;
            this.enabled = true;
            this.selector = selector;

            this.base = $.api.baseConfigs(tag, this);

            if (configs) {
                this.base.base = $.api.baseConfigs(tag, this);
                if (typeof configs === "string") {
                    for (var arr = configs.match(rnotwhite) || [], len = arr.length; i < len; i++) {
                        this[arr[i]] = this.base[arr[i]] = true;
                    }
                } else {
                    for (i in configs) {
                        this.baseConfigs(i, this.base[i], this.base);
                        this.baseConfigs(i, this[i]);
                        this[i] = configs[i];
                    }
                }
            }
            if (options) {
                if (typeof options === "string") {
                    for (var arr = options.match(rnotwhite) || [], len = arr.length; i < len; i++) {
                        this[arr[i]] = true;
                    }
                } else {
                    for (i in options) {
                        this.baseConfigs(i, this[i]);
                        this[i] = configs[i];
                    }
                }
            }

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
    $.api.fn.init.prototype = $.api.base = {
        init: function (tag) {
            this.document = $(this.selector, this.context).append(document.createElement(tag || "div"));
            this.$ = this.$.lastChild();
        },
        render: function () {
            if (this.tag) {
                this.$.prop(this.tag, this);
                this.$.addClass(this.tag.slice(0, 2).toLowerCase() + this.tag.slice(2));
            }
            if (!this.enabled) {
                this.setEnabled(this.enabled);
            }
            if (!this.visible) {
                this.hide();
            }
            if (this.css) {
                this.$.css(this.css);
            }
            if (this.width) {
                this.setWidth(this.width);
            }
            if (this.height) {
                this.setHeight(this.height);
            }
            if (this.addClass) {
                this.$.addClass(this.addClass);
            }
            if (this.border) {
                if ($.lib.support("box-shadow")) {
                    this.$.addClass("shadow");
                } else {
                    this.$.addClass("border");
                }
            }
            if (this.focus) {
                this.tryfocus();
            }
        },
        resolve: function () { },
        commit: function () {
            this.$.bind(this.on);
        },
        trigger: function (type, data) {
            this.$.trigger(type, data);
        },
        dynamic: function (options, document) {
            if (options == null || document == null || document.version == null) {
                return this;
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
                    this.dynamic(options.call(this, document, this), document);
                    break;
                case "array":
                    $.each(options, function (value) {
                        this.dynamic(value, document);
                    });
                    break;
                case "number":
                    document.append('<div class="this-split" style="width:', options, 'px"></div>');
                    break;
                case "string":
                    document.append($.lib.html(options));
                    break;
                default:
                    document.append(window.document.createTextNode(options));
                    break;
            }
            return this;
        },
        whenThen: function (state) {
            state = state || this.state;
            switch (state) {
                case "pending": this.init();
                case "init": this.render();
                case "render": this.resolve();
                case "resolve": this.commit();
                case "commit": this.commit = "commit"; break;
                default: $.syntaxError('Undefined state: ' + state + ', relevant methods '); break;
            }
        },
        destroy: function (v) {
            this.$.remove();
            this.base.base = $.ui.destroy(this.base.base, false);
            this.base = $.ui.destroy(this.base, false);
            $.ui.destroy(this, v);
        },
        contains: function (el) {
            for (var i = 0, len = this.$.length; i < len; i++) {
                if ($.contains(this.$.get(i), el)) {
                    return true;
                }
            }
            return false;
        },
        hide: function () {
            this.setVisible(false);
        },
        show: function () {
            this.setVisible(true);
        },
        toggle: function (v) {
            if (typeof v === "boolean") {
                return v ? this.show() : this.hide();
            }
            return this.toggle(!this.visible);
        },
        tryfocus: function () {
            try {
                this.$.eq(0).focus();
            } catch (e) { }
        },
        setWidth: function (v) {
            if (!!(v = $.reg.o2stylenumber.exec(v))) {
                this.width = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                this.$.width(v[0]);
                return v;
            }
        },
        setHeight: function (v) {
            if (!!(v = $.reg.o2stylenumber.exec(v))) {
                this.height = +v[1 * (!v[2] || v[2] == "px")] || v[0] || 0;
                this.$.height(v[0]);
                return v;
            }
        },
        setVisible: function (v) {
            if ($.reg.bool.test(v)) {
                this.$.toggleClass("hide", !(this.visible = (v === true || v === "true")));
                return true;
            }
        },
        setEnabled: function (v) {
            if ($.reg.bool.test(v)) {
                this.$.attr("disabled", !(this.enabled = (v === true || v === "true")));
                return true;
            }
        }
    };

    var ready = $.fn.ready;
    $.fn.ready = function (fn) {
        if ($.api.isReady) {
            return ready.apply(this, arguments);
        }
        return this.readyControl(fn);
    };
    $.readyControl = $.fn.readyControl = function () {
        $.each(arguments, function (tag) {
            if ($.isFunction(tag)) {
                return readyList.then(tag).catchErr(function (error) {
                    $.readyException(error);
                });
            }
            return $.fn.ready(function () {
                $.api.load(tag);
            });
        });
        return this;
    }
})(jobKinding);

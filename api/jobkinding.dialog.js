(function ($) {
    $.api.init("Dialog", {
        transition: "transition",
        init: function () {
            this.base.init("div");
            this.$.after('<div class="layer"></div>');
            this.layer = this.$.next();
        },
        render: function () {
            this.base.render();
            if (this.visible) {
                this.show();
            }
            if (this.isMax) {
                this.max();
            }
            if (this.transition && $.api.animation) {
                this.$.addClass(this.transition);
            }
        },
        setHeader: function (options) {
            this.T = this.dynamic(options, ".ui.header");
        },
        setContaiter: function (options) {
            this.Y = this.dynamic(options || {}, ".ui.contaiter");
        },
        setFooter: function (options) {
            this.V = this.dynamic(options, ".ui.footer");
        },
        resolve: function () {
            this.base.resolve();
            this.setHeader(this.header);
            this.setFooter(this.footer);
            this.setContaiter(this.contaiter);
        },
        drag: function (selector) {
            var that = this, map, element, obj = {};
            this.commonDrag(selector ? this.$.find(selector) : this.$, function (e) {
                element.css({ "top": obj.t - (obj.y - e.clientY), "left": obj.t - (obj.x - e.clientX) });
            }, function (e) {
                if (that.isMax) {
                    return false;
                }
                element = that.$.filter(function (elem) {
                    return elem === e.target || $.contains(elem, e.target);
                });
                obj.x = e.clientX;
                obj.y = e.clientY;
                map = element.css(["top", "left"]);
                obj.t = parseFloat(map.top);
                obj.l = parseFloat(map.left);
            });
        },
        show: function () {
            var that = this;
            this.base.show();
            this.layer.css("z-index", $.api.zIndex++);
            this.$.css("z-index", $.api.zIndex++);
            setTimeout(function () {
                that.$.addClass("transition-visible");
            }, 200)
        },
        hide: function () {
            this.base.hide();
            this.$.removeClass("transition-visible");
        },
        toggleScreen: function (v) {
            if (typeof v === "boolean") {
                return v ? this.max() : this.restore();
            }
            return this.isMax ? this.restore() : this.max();
        },
        max: function () {
            this.isMax = true;
            this.$.css({ height: "100%", width: "100%" });
        },
        restore: function () {
            this.isMax = false;
            this.setWidth(this.width);
            this.setHeight(this.height);
        },
        close: function (isClose) {
            if (isClose || this.isClose) {
                this.destroy();
            } else {
                this.hide();
            }
        }
    });
})(jobKinding);
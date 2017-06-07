(function ($) {
    $.api.init("Dialog", {
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
            if (this.transition) {
                this.$.addClass("transition");
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
        commit: function () {
            var that = this;
            this.layer.click(function () {
                if (that.isMax) {
                    return false;
                }
                that.$.addClass("pulse");
                setTimeout(function () {
                    that.$.removeClass("pulse");
                }, that.duration);
            });
        },
        drag: function (selector) {
            var that = this, i, map = this._dataSite = null, obj = {}, arr = ["top", "right", "bottom", "left"];
            this.commonDrag(selector ? this.$.find(selector) : this.$, function (e) {
                obj.horizontal = (obj.x - e.clientX);
                obj.vertical = (obj.y - e.clientY);
                obj.x = e.clientX;
                obj.y = e.clientY;

                map.top = map.top - obj.vertical;
                map.right = map.right + obj.horizontal;
                map.bottom = map.bottom + obj.vertical;
                map.left = map.left - obj.horizontal;

                that.$.css(map);

            }, function (e) {
                if (that.isMax) {
                    return false;
                }
                obj.x = e.clientX;
                obj.y = e.clientY;
                if (map == null) {
                    map = that._dataSite = that.$.css(arr);
                    for (i in map) {
                        map[i] = parseFloat(map[i]);
                    }
                }
            });
        },
        show: function () {
            var that = this;
            this.base.show();
            this.layer.css("z-index", $.api.zIndex++);
            this.$.css("z-index", $.api.zIndex++);
            setTimeout(function () {
                that.$.addClass("transition-visible");
            }, this.duration);
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
            this.$.css({ "height": "100%", "width": "100%", "top": 0, "right": 0, "bottom": 0, "left": 0 });
        },
        restore: function () {
            this.isMax = false;
            this.$.css(this._dataSite);
            this.setWidth(this.width);
            this.setHeight(this.height);
        },
        close: function (isClose) {
            if (isClose || isClose !== false && this.isClose) {
                this.destroy();
            } else {
                this.hide();
            }
        }
    });
})(jobKinding);
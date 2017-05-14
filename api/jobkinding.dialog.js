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
            if (this.transition && $.api.animation) {
                this.$.addClass(this.transition);
            }
        },
        resolve: function () {
            this.base.resolve();
            this.setHeader(this.header);
            this.setFooter(this.footer);
            this.setContaiter(this.contaiter);
        },
        show: function () {
            this.base.show();
            this.layer.css("z-index", $.api.zIndex++);
            this.$.css("z-index", $.api.zIndex++);
        },
        setHeader: function (options) {
            this.T = this.dynamic(options, ".ui.header");
        },
        setContaiter: function (options) {
            this.Y = this.dynamic(options || {}, ".ui.contaiter");
        },
        setFooter: function (options) {
            this.V = this.dynamic(options, ".ui.footer");
        }
    });
})(jobKinding);
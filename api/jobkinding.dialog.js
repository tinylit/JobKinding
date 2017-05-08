$.api.init("Dialog", {
    init: function () {
        this.base.init("div");
        this.$.after('<div class="layer"></div>');
    },
    resolve: function () {
        this.base.resolve();
        this.setHeader(this.header);
        this.setFooter(this.footer);
        this.setContaiter(this.contaiter);
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
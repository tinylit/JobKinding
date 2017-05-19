(function ($) {
    $.api.init("Taskbar", {
        init: function () {
            this.base.init("div");
        },
        render: function () {
            this.task = [];
            this.base.render();
            this.$.addClass("ui menu transition");
        },
        resolve: function () {
            this.base.resolve();
            this.dynamic({
                html2on: {
                    "i.fa-angle-double-up": function (that) {
                        that.show();
                    },
                    "i.fa-angle-double-down": function (that) {
                        that.hide();
                    }
                }
            }, this.$);
        },
        addTask: function (taskName, taskCallbak) {
            if (arguments.length === 1 && typeof taskName === "function") {
                taskCallbak = taskName;
                taskName = null;
            }
            var task = {
                name: taskName || "任务",
                click: taskCallbak
            };
            var that = this;
            task.$ = this.$.append('<div class="item">' + task.name + "</div>").lastChild();
            if (taskCallbak) {
                task.$.click(this.contextCall(taskCallbak));
            }
            this.task.push(task);
            return task;
        },
        removeTask: function (task) {
            var index = this.task.indexOf(task);
            if (index > -1) {
                this.task.splice(index, 1);
            }
            return index > -1;
        }
    });
})(jobKinding);

directory.EmployeeListView = Backbone.View.extend({

    tagName:'ul',

    className:'nav nav-list',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (employee) {
            self.$el.append(new directory.EmployeeListItemView({model:employee}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (employee) {
            this.$el.append(new directory.EmployeeListItemView({model:employee}).render().el);
        }, this);

        return this;
    }
});

directory.EmployeeListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        var data = _.clone(this.model.toJSON());
        data.id = this.model.get('id');
        this.$el.html(this.template(data));
        return this;
    }

});
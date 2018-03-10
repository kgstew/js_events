$f.models.Donkey = Backbone.Model.extend({
    defaults: {
        id: null,
        order: null,
        name: '',
        breed: null,
        habitat: null,
        image_url: null
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

    }

});

$f.collections.Donkeys = Backbone.Collection.extend({

    comparator: function(model) {
        return model.get('order');
    },

    initialize: function(models, options) {
        options = options || {};
        $.extend(this, options);

        var this_ = this;

        this.listenTo(this, 'model_updated', function(model) {
            this_.update_order(model);
        })
    },

    update_order: function(model) {
        console.log("updating order");
        var tmp_order = model.get('order');
        model.set({order: this.first().get('order')}, {silent: true});
        this.first().set({order: tmp_order}, {silent: true});
        this.sort();
        this.trigger('update_order', model)
    }
});
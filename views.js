$f.views.TitleNav = Backbone.Marionette.ItemView.extend({
    template: "#tpl_title_nav",

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);
    }

});

$f.views.MainLayout = Backbone.Marionette.Layout.extend({
    template: '#tpl_main_layout',

    collection: null,               // $f.collections.Donkeys

    regions:{
        r_donkey_list: '.r_donkey_list'
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);
    },

    onRender: function() {
        this.r_donkey_list.show(new $f.views.DonkeyList({
            collection: this.collection
        }))
    }
});

$f.views.DonkeyItem = Backbone.Marionette.ItemView.extend({
    template: '#tpl_donkey_item',
    model: null,                    // $f.models.Donkey
    tagName: 'tr',

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        console.log(this.model)
    }
});

$f.views.DonkeyList = Backbone.Marionette.CompositeView.extend({
    template: '#tpl_donkey_list',
    itemView: $f.views.DonkeyItem,
    itemViewContainer: '.donkey_rows',
    tagName: 'table',

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        console.log(this.collection)
    }
});
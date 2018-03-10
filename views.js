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
        r_donkey_intro: '.r_donkey_intro',
        r_donkey_list: '.r_donkey_list'
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);
    },

    onRender: function() {

        this.r_donkey_intro.show(new $f.views.DonkeyIntro());

        var donkey_list = new $f.views.DonkeyList({
            collection: this.collection
        });

        this.listenTo(donkey_list, '', function() {
             console.log("Updated Donkey List")
        });

        this.r_donkey_list.show(donkey_list)
    }
});

$f.views.DonkeyIntro = Backbone.Marionette.ItemView.extend({
    template: '#tpl_donkey_intro'
});

$f.views.DonkeyItem = Backbone.Marionette.ItemView.extend({
    template: '#tpl_donkey_item',
    model: null,                    // $f.models.Donkey
    tagName: 'tr',

    events: {
        'change input.name': 'name_changed',
        'change input.breed': 'breed_changed',
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        this.listenTo(this.model, 'change:name', function(model) {
            this.trigger('updated_name', model)
        })
    },

    name_changed: function(event) {
        console.log($(event.target).val());
        this.model.set('name', $(event.target).val());
    },

    breed_changed: function(event) {
        console.log($(event.target).val());
        this.model.set('breed', $(event.target).val());
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
    },

    itemEvents: function() {
        return {
            'updated_name': function(event, itemView, model) {
                alert('Our donkey changed it name to ' + model.get('name'))
            },
            'change': function(event, itemView, model) {
                console.log('A Donkey Changed')
            }
        }
    }
});
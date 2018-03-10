$f.views.TitleNav = Backbone.Marionette.ItemView.extend({
    template: "#tpl_title_nav",

    events: {
        'click button': function() {
            $f.application.vent.trigger('hee_haw');
        }
    },

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
        r_update_tracker: '.r_update_tracker',
        r_donkey_list: '.r_donkey_list'
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);


        this.listenTo($f.application.vent, 'hee_haw', this.render_hee_haw);

    },

    onRender: function() {

        var this_ = this;

        this.r_donkey_intro.show(new $f.views.DonkeyIntro());

        this.r_update_tracker.show(new $f.views.UpdateTrackerList());

        var donkey_list = new $f.views.DonkeyList({
            collection: this.collection
        });

        this.listenTo(donkey_list, 'donkey_updated', function(update_value) {
             this_.r_update_tracker.currentView.add_updated_item(update_value);
        });

        this.r_donkey_list.show(donkey_list)
    },

    render_hee_haw: function() {
        this.r_donkey_list.close();
        this.r_donkey_list.show(new $f.views.HeeHaw());
        this.listenTo(this.r_donkey_list.currentView, 'quiet_donkeys', this.render);
    }
});

$f.views.DonkeyIntro = Backbone.Marionette.ItemView.extend({
    template: '#tpl_donkey_intro'
});

$f.views.HeeHaw = Backbone.Marionette.ItemView.extend({
    template: '#tpl_hee_haw',
    className: 'hee_haw',

    triggers: {
        'click' : 'quiet_donkeys'
    }
});

$f.views.DonkeyItem = Backbone.Marionette.ItemView.extend({
    template: '#tpl_donkey_item',
    model: null,                    // $f.models.Donkey
    tagName: 'tr',

    events: {
        'change input.name': 'name_changed',
        'change input.breed': 'breed_changed',
        'change input.habitat': 'habitat_changed'
    },

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        var this_ = this;

        this.listenTo(this.model, 'change:name', function(model) {
            this_.trigger('updated_name', model);
        });

        this.listenTo(this.model, 'change:breed', function(model) {
            this_.trigger('updated_breed', model)
        });

        this.listenTo(this.model, 'change:habitat', function(model) {
            this_.trigger('updated_habitat', model)
        });

        this.listenTo(this.model, 'change', function(model) {
            this_.model.collection.trigger('model_updated', model);
        });
    },

    name_changed: function(event) {
        console.log($(event.target).val());
        this.model.set('name', $(event.target).val());
    },

    breed_changed: function(event) {
        console.log($(event.target).val());
        this.model.set('breed', $(event.target).val());
    },

    habitat_changed: function(event) {
        console.log($(event.target).val());
        this.model.set('habitat', $(event.target).val());
    }
});

$f.views.DonkeyList = Backbone.Marionette.CompositeView.extend({
    template: '#tpl_donkey_list',
    collection: null,               //$f.collections.Donkeys

    itemView: $f.views.DonkeyItem,
    itemViewContainer: '.donkey_rows',
    itemViewEventPrefix: 'jackass',
    tagName: 'table',

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        this.listenTo(this.collection, 'update_order', this.render);

        // If you use .on() make sure to call .off() in the onClose method
        this.on('jackass:updated_breed', function(event, model) {
            this.trigger('donkey_updated', {attribute: 'breed', value: model.get('breed')});
        })

    },

    itemEvents: function() {
        return {
            'updated_name': function(event, itemView, model) {
                this.trigger('donkey_updated', {attribute: 'name', value: model.get('name')});
            },
            'updated_habitat': function(event, itemView, model) {
                this.trigger('donkey_updated', {attribute: 'habitat', value: model.get('habitat')});
            },
            // This does not work, these events are itemview events and do not listen to model changes //
            'change': function(event, itemView, model) {
                console.log('A Donkey Changed')
            }
        }
    },

    onClose: function () {
        this.off('jackass:updated_breed');
    }
});

$f.views.UpdateItem = Backbone.Marionette.ItemView.extend({
    template: '#tpl_update_item',
    model: null,
    tagName: 'li',

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);
    },

    templateHelpers: function() {

        var attribute = this.model.get('attribute').charAt(0).toUpperCase() + this.model.get('attribute').slice(1);
        var value = this.model.get('value')

        return {
            attribute: attribute,
            value: value
        }
    },
});

$f.views.UpdateTrackerList = Backbone.Marionette.CollectionView.extend({
    collection: null,
    itemView: $f.views.UpdateItem,
    tagName: 'ul',

    initialize: function(options) {
        options = options || {};
        $.extend(this, options);

        this.collection = new Backbone.Collection(null, {});
    },

    /**
     * Accepts values in the form {attribute: <attribute>, value: <value>}
     *
     * @param update_value
     */
    add_updated_item: function(update_value) {
        this.collection.add(update_value, {at: 0});
    },

        /**
     * Need to add support for sorted collections
     * This allows us to add a new model into the collection and have
     * it render at the correct index
     *
     * http://stackoverflow.com/questions/11658668/the-best-way-to-sort-a-collection-in-a-compositeview
     *
     * @param collectionView
     * @param itemView
     * @param index
     */

    appendHtml: function(collectionView, itemView, index) {
        // Already sorted when buffering.
        if (collectionView.isBuffering) {
            return Backbone.Marionette.CollectionView.prototype.appendHtml.apply(this, arguments);
        }

        var childrenContainer = $(collectionView.childrenContainer || collectionView.el);
        var children = childrenContainer.children();
        if (children.size() === index) {
            childrenContainer.append(itemView.el);
        } else {
            childrenContainer.children().eq(index).before(itemView.el);
        }
    }
});
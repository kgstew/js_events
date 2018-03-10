$f.models.Donkey = Backbone.Model.extend({
   defaults: {
       id: null,
       name: '',
       breed: null,
       habitat: null,
       image_url: null
   }
});

$f.collections.Donkeys = Backbone.Collection.extend({
    initialize: function(models, options) {
        options = options || {};
        $.extend(this, options);
    }
});
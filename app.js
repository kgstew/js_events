if (!$f || $f == undefined) {
    var $f = {
        window: {
            app_router: null
        },
        models: {},
        collections: {},
        views: {}
    }
}

$f.BaseApp = Backbone.Marionette.Application.extend({

    constructor: function() {
        $f.BaseApp.__super__.constructor.apply(this, arguments);

        this.addRegions({
            content: '#content',
            navbar_filters: '#navbar_filters',
            title_nav: '#title_navbar',
            search_bar: '#search_bar',
            modal: '#modal'
        });
    },

    /**
     * Upon document ready, kick off our app!
     */
    kickoff: function() {
        var this_ = this;

        if (!this.Router) {
            throw 'Programmer Error: $f.web.BaseZenputApp kicked off without an app router.';
        }

        $(document).ready(function() {
            this_.on('initialize:after', function() {

                if (Backbone.history) {
                    Backbone.history.start();
                }
            });

            this_.addInitializer(function(options) {
                $f.window.app_router = new this_.Router();
            });

            this_.start();
        });
    }
});
$f.application = new $f.BaseApp();

$f.application.Router = Backbone.Marionette.AppRouter.extend({
    routes: {
        "id/:rdbms_id/scoring/id/:model_id": "load_scoring_formula_editor",
        "*actions": "default_route" // Backbone will try match the route above first
    },

    default_route: function () {
        $f.application.title_nav.show(new $f.views.TitleNav());

        $f.application.content.show(new $f.views.MainLayout({
            collection: this.generate_donkey_collection()
        }));
    },

    generate_donkey_collection: function() {

        var collection = new $f.collections.Donkeys([
            {id: 0, name:'Jack', breed: 'American Mammoth Jack', habitat: 'USA', image_url: 'images/american_mammoth_jack.jpg'},
            {id: 1, name:'Gillian', breed: 'Ane wallon', habitat: 'Belgium', image_url: 'images/ane_wallon.jpg'},
            {id: 2, name:'Dani', breed: 'Andalusian', habitat: 'Spain', image_url: 'images/andalusian.jpg'},
            {id: 3, name:'Bettina', breed: 'Asinara', habitat: 'Italy', image_url: 'images/asinara.jpg'},
            {id: 4, name:'Jeffery', breed: 'Poitou', habitat: 'France', image_url: 'images/poitou.jpg'}],
        {});

        return collection;
    }
});

$f.application.kickoff();
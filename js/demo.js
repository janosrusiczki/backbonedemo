var Movie = Backbone.Model.extend({
	validate: function (attrs) {
		if (!_.isString(attrs.title) || attrs.title.length === 0 ) {
			return "Don't be silly, a movie without a title!?";
		}
	}
});

var Movies = Backbone.Collection.extend({
	model: Movie,
	url: 'api/movies',
	display: function() {
		this.forEach(function(el) { console.log( el.get('title') ) });
	},
});

var movie = new Movie();

movie.on("error", function(model, error) {
  console.log(error);
});

var movies = new Movies();
// movies.fetch();

movie.set({ title: "Snatch!" });
movies.create({ title: "a" });

// movies.display();

var MovieView = Backbone.View.extend({
		tagName: "li",
		template: _.template($('#item-template').html()),
		initialize: function() {
			/*
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.render, this);
			*/
		},
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
      // (this.model.get('title'));
      return this;
		}
});

var AppView = Backbone.View.extend({
		el: $('#app'),
		initialize: function() {
			movies.bind('add', this.addOne, this);		
			movies.bind('reset', this.addAll, this);
			movies.bind('all', this.render, this);
			
			movies.fetch();
		},
		addOne: function(movie) {
			var movieView = new MovieView({model: movie});
			$("#movie-list").append(movieView.render().el);
		},
		addAll: function() {
			movies.each(this.addOne);
		},
		render: function() {
			console.log('Rendering AppView.');
		},
});

var app = new AppView();
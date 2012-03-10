var Movie = Backbone.Model.extend({
	validate: function(attributes) {
		if(attributes.title == "") {
			return "No title!?";
		}
	},
});

// Define our collection
var Movies = Backbone.Collection.extend({
	model: Movie,
	url: 'api/movies',
});

// Instantiate our collection
var movies = new Movies();

var MovieView = Backbone.View.extend({
	tagName: "li",
	template: _.template($('#item-template').html()),
	
	initialize: function() {
		this.model.bind('change', this.render, this); // When changing the associated model the view is re-rendered
		this.model.bind('destroy', this.remove, this); // [1] I'm talking about this bind
	},
	
	render: function() {
		console.log('Rendering MovieView.');
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	},
	
	events: {
		"click": "deleteMovie",
	},
	
	deleteMovie: function() {
		if(confirm('Are you sure that you want to delete ' + this.model.get('title') + '?')) {
			console.log('Destroying Movie: id = ' + this.model.id);
			this.model.destroy(); // will also trigger remove via the bind above [1]
		}
	},
	
	remove: function() {
		$(this.el).remove();
	}
});

var AppView = Backbone.View.extend({
	el: $('#app'),
	
	initialize: function() {
		console.log('Initializing AppView.');
	
		movies.bind('add', this.addOne, this);
		movies.bind('reset', this.addAll, this); // [2] I mean this binding
		
		movies.fetch(); // Will call Movies.fetch() -> Movies.reset() -> (via binding above [2]) -> AppView.addAll()
	},

	addOne: function(movie) {
		console.log('Adding a MovieView.');
		var movieView = new MovieView({ model: movie }); // Will create a MovieView
		$("#movie-list").append(movieView.render().el); // Will render and add the movieView
	},
	
	addAll: function() {
		console.log('Adding all MovieViews.');
		movies.each(this.addOne);
	},

	render: function() {
		console.log('Rendering AppView.');
	},

	events: {
		"click #add-movie": "addMovie",
	},

	addMovie: function() {
		var movie = new Movie({"title": $('#movie-title').val(), "year": $('#movie-year').val()});
		if(movie.isValid()) {
			movies.create(movie);
			$('#movie-title').val('');
			$('#movie-year').val('');
		};
	},
});

var app = new AppView(); // Will call AppView.initialize
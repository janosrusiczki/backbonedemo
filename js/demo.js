var Movie = Backbone.Model.extend({
	validate: function(attributes) {
		if(attributes.title == "" || attributes.year == "") {
			return "Please enter the movie's title and year.";
		}
	},
})

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
		this.model.bind('destroy', this.remove, this);
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
			this.model.destroy();
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
	
		movies.bind('add', this.addOne, this); // I mean this binding	
		movies.bind('reset', this.addAll, this);

		movies.fetch(); // Will call Movies.fetch() -> Movies.reset() -> (via binding above) -> AppView.addAll()
	},

	addAll: function() {
		console.log('Adding all MovieViews.');
		movies.each(this.addOne);
	},

	addOne: function(movie) {
		console.log('Adding a MovieView.');
		var movieView = new MovieView({model: movie}); // Will create a MovieView
		$("#movie-list").append(movieView.render().el); // Will render and add the movieView
	},

	render: function() {
		console.log('Rendering AppView.');
	},

	events: {
		"click #add-movie": "addMovie",
	},

	addMovie: function() {
		movies.create({"title": $('#movie-title').val(), "year": $('#movie-year').val()});
		$('#movie-title').val('');
		$('#movie-year').val('');
	},
});

var app = new AppView(); // Will call AppView.initialize
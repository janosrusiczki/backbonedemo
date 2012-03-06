var Movie = Backbone.Model.extend({
	validate: function (attrs) {
		if (!_.isString(attrs.title) || attrs.title.length === 0 ) {
			return "Don't be silly, a movie without a title!?";
		}
	}
});

var movie = new Movie();

movie.on("error", function(model, error) {
  console.log(error);
});

movie.set({ title: 12 });

movie.set({ title: "The Big Lebowski" })

console.log(movie.get("title"));
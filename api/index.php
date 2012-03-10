<?php

require 'Slim/Slim.php';
$app = new Slim();

$db = new SQLiteDatabase('../db/backbonedemo.sqlite');

/*
// create the movies table in case it's needed
$query = 'CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER)';
$db->query($query);
*/

$app->get('/', function () {
    echo 'Welcome to your awesome API!';
});

// get to the zeama! :)

$app->get('/movies', function () use($db) {
	$movies = array();

	$query = "SELECT * FROM movies";
	$result = $db->query($query);
	while($row = $result->fetch())
		$movies[] = array('id' => $row['id'], 'title' => $row['title'], 'year' => $row['year']);

	header("Content-Type: application/json");
    echo(json_encode($movies));

    exit();
});

$app->post('/movies', function () use ($app, $db) {
	// the JSON data is pulled right from the request body
	$request = json_decode($app->request()->getBody());

	$title = $request->title;
	$year = $request->year;
	
	$query = "INSERT INTO movies VALUES(null, '{$title}', {$year})";
	$db->query($query);

	// the next few lines are very important
	// otherwise id is not assigned to the model after a successful POST
	// and deletes and edits won't work without refetching everything
	header("Content-Type: application/json");	
	$record = array('id' => $db->lastInsertRowid());
	echo(json_encode($record));
		
    exit();
});

/*
// we don't need this for now
$app->put('/movies', function () {
    echo 'This is a PUT route';
});
*/

$app->delete('/movies/:id', function ($id) use ($db) {
	$query = "DELETE FROM movies WHERE id = $id";
	$db->query($query);
});

$app->run();
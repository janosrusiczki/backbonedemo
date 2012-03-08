<?php

try 
{
  $database = sqlite_open('../db/backbonedemo.sqlite');
}
catch(Exception $e) 
{
  die($error);
}

/*
$query = 'DROP TABLE movies';
if(!$database->queryExec($query, $error)) die($error);
$query = 'CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER)';
if(!$database->queryExec($query, $error)) die($error);
*/

require 'Slim/Slim.php';
$app = new Slim();

$app->get('/', function () {
    echo 'Welcome to your awesome API!';
});

// get to the zeama!

$app->get('/movies', function () use($database) {
		$movies = array();
	
		$query = "SELECT * FROM movies";
		if($result = sqlite_query($database, $query)) while($row = sqlite_fetch_array($result)) $movies[] = array('id' => $row['id'], 'title' => $row['title'], 'year' => $row['year']);
		else die($error);
		
		header("Content-Type: application/json");
    echo(json_encode($movies));

    exit();
});

$app->post('/movies', function () use ($app, $database) {
		$request = json_decode($app->request()->getBody());

		$title = $request->title;
		$year = $request->year;
		
    $query = "INSERT INTO movies VALUES(null, '{$title}', {$year})";
		sqlite_query($database, $query);
		
		$record = array('id' => sqlite_last_insert_rowid($database), 'title' => $title, 'year' => $year);
		
		header("Content-Type: application/json");
		echo(json_encode($record)); // very important, otherwise id is not assigned to the model
		
    exit();
});

$app->put('/movies', function () {
    echo 'This is a PUT route';
});

$app->delete('/movies/:id', function ($id) use ($database) {
		$query = "DELETE FROM movies WHERE id = $id";
		sqlite_query($database, $query);
});

$app->run();
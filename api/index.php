<?php

try 
{
  $database = new SQLiteDatabase('../db/backbonedemo.sqlite', 0666, $error);
}
catch(Exception $e) 
{
  die($error);
}

/*
$query = 'CREATE TABLE movies (title TEXT, year INTEGER)';
if(!$database->queryExec($query, $error)) die($error);
*/

require 'Slim/Slim.php';
$app = new Slim();

$app->get('/', function () {
    echo 'Welcome to your awesome API!';
});

// get to the zeama!

$app->get('/movies', function () use($database) {
		$query = "SELECT * FROM movies";
		if($result = $database->query($query, SQLITE_BOTH, $error))	while($row = $result->fetch()) $movies[] = array('title' => $row['title'], 'year' => $row['year']);
		else die($error);
		
		header("Content-Type: application/json");
    echo(json_encode($movies));
    exit();
});

$app->post('/movies', function () use ($app, $database) {
		$request_body = $app->request()->getBody();
		$request_decoded = json_decode($request_body);
		$title = $request_decoded->title;
		$year = $request_decoded->year;
    $query = "INSERT INTO movies VALUES('{$title}', {$year})";
    if(!$database->queryExec($query, $error))die($error);
});

$app->put('/movies', function () {
    echo 'This is a PUT route';
});

$app->delete('/movies', function () use ($app, $database) {
    // $query = "DELETE FROM movies WHERE id = $id";
});

$app->run();
<?php

require 'Slim/Slim.php';
$app = new Slim();

$app->get('/', function () {
    echo 'Welcome to your awesome API!';
});

// get to the zeama!

$app->get('/movies', function () {
		$movies = array(
			array(
				'title' => 'The Big Lebowski',
				'year' => '1998',
			),
			array(
				'title' => 'Pulp Fiction',
				'year' => '1994',
			),
			array(
				'title' => 'Trainspotting',
				'year' => '1996',
			),
		);
		header("Content-Type: application/json");
    echo(json_encode($movies));
    exit();
});

$app->post('/movies', function () {
    echo 'This is a POST route';
});

$app->put('/movies', function () {
    echo 'This is a PUT route';
});

$app->delete('/movies', function () {
    echo 'This is a DELETE route';
});

$app->run();
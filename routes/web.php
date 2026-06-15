<?php

use Illuminate\Support\Facades\Route;

// This handles the root path
Route::get('/', function () {
    return view('welcome');
});

// This handles every other path (e.g., /signin, /dashboard)
// It tells Laravel: "Whatever the path, just load the welcome view"
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
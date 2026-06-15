<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// routes/web.php

// This must be the last route in your file
Route::fallback(function () {
    return view('componenets/CompleteApplication'); // Replace 'app' with the name of your main blade file
});
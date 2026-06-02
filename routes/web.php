<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// routes/web.php

Route::view('/{path?}', 'welcome') // Replace 'app' with the name of your Blade view (e.g., 'welcome')
    ->where('path', '.*');
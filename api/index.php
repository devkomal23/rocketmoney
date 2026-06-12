<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Log to the Vercel standard output stream
error_log("--- LARAVEL BOOT START ---");// Require the Composer autoloader
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap the Laravel application
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Create and handle the HTTP request
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
<?php
// AT THE VERY TOP
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // ... existing code ...
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle($request = Illuminate\Http\Request::capture());
    $response->send();
    $kernel->terminate($request, $response);
} catch (\Throwable $e) {
    // THIS CATCHES THE CRASH AND PRINTS IT TO YOUR BROWSER
    echo "<h1>CRASHED:</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    echo "<h3>Stack Trace:</h3>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    exit;
}
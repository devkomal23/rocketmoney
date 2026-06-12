<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

// Create the application
$app = new Application(dirname(__DIR__));

// Manually bind the Kernel
$app->singleton(Kernel::class, App\Http\Kernel::class);

// CRITICAL: Manually register View and Routing providers
$app->register(Illuminate\View\ViewServiceProvider::class);
$app->register(Illuminate\Routing\RoutingServiceProvider::class);
$app->register(Illuminate\Events\EventServiceProvider::class);

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
);

$response->send();
$kernel->terminate($request, $response);
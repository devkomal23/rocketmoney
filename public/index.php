<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
$_ENV['APP_STORAGE'] = '/tmp';

require __DIR__.'/../vendor/autoload.php';

// 1. Boot the application
$app = require_once __DIR__.'/../bootstrap/app.php';

// 2. IMPORTANT: Register core Service Providers manually if they aren't loading
$app->register(Illuminate\View\ViewServiceProvider::class);
$app->register(Illuminate\Routing\RoutingServiceProvider::class);

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
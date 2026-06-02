<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\DashboardController; 
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\KYCController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/requestOtp', [AuthController::class, 'requestOtp']);
Route::post('/verifyOtp', [AuthController::class, 'verifyOtp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/complete-application', [AuthController::class, 'completeApplication']);
    Route::post('/update-mobile', [AuthController::class, 'updateMobile']);
    Route::get('/dashboard', [DashboardController::class, 'getDashboardData']);
    Route::get('/assessment', [DashboardController::class, 'getAssestment']);
    Route::post('/create-payment-order', [PaymentController::class, 'createOrder']);
    Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);
});
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::middleware('auth:sanctum')->post('/kyc/init', [KYCController::class, 'createVerificationSession']);
Route::post('/webhooks/stripe', [KYCController::class, 'handleStripe']);

Route::fallback(function () {
    return redirect('/'); 
});
Route::middleware('auth:sanctum')->get('/user/kyc-status', function (Request $request) {
    return response()->json(['kyc_status' => $request->user()->kyc_status]);
});


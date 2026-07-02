<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\DashboardController; 
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\KYCController;
use App\Http\Controllers\Api\DigiLockerController;
use App\Http\Controllers\ConsentController;
use App\Http\Controllers\SelfieController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PayUController;

Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        return 'Database connection is OK and Laravel is running';
    } catch (\Exception $e) {
        return 'Could not connect to database. Error: ' . $e->getMessage();
    }
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/requestOtp', [AuthController::class, 'requestOtp']);
Route::post('/verifyOtp', [AuthController::class, 'verifyOtp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/complete-application', [AuthController::class, 'completeApplication']);
    Route::post('/update-mobile', [AuthController::class, 'updateMobile']);
    Route::get('/assessment', [DashboardController::class, 'getAssestment']);
    Route::post('/create-payment-order', [PaymentController::class, 'createOrder']);
    Route::post('/verify-payment', [PaymentController::class, 'verifyPayment']);
});
Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'getDashboardData']);

Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::middleware('auth:sanctum')->post('/kyc/init', [KYCController::class, 'createVerificationSession']);
Route::post('/webhooks/stripe', [KYCController::class, 'handleStripe']);
Route::fallback(function () {
    return redirect('/'); 
});
Route::middleware('auth:sanctum')->get('/kyc/status', [KYCController::class, 'status']);
Route::get('/digilocker/auth', [DigiLockerController::class, 'redirectToDigiLocker']);
Route::get('/digilocker/redirect', [DigiLockerController::class, 'redirectToProvider']);
Route::get('/digilocker/callback', [DigiLockerController::class, 'handleCallback']);
Route::middleware('auth:sanctum')->post('/consent', [ConsentController::class, 'store']);
Route::middleware('auth:sanctum')->post('/upload-selfie', [SelfieController::class, 'upload']);
Route::middleware('auth:sanctum')->post('/verify-bank',[PaymentController::class,'verifyBank']);
Route::get('/download-loan/{id}', [LoanController::class, 'generatePdf']);
Route::post('/initiateUpiAutopay', [PayUController::class, 'initiateUpiAutopay']);
Route::post('/initiate-enach', [PaymentController::class, 'initiateEnach']);
Route::post('/create-subscription',[PaymentController::class,'createSubscription']);
Route::post('/api/razorpay/webhook', [PaymentController::class, 'handle']);

Route::get('/test-setu', [PaymentController::class, 'testSetu']);

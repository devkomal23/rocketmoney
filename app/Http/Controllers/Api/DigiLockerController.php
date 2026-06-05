<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DigiLockerController extends Controller
{
public function redirectToDigiLocker()
{
    try {
        $verifier = bin2hex(random_bytes(32));

session([
    'code_verifier' => $verifier
]);

$state = bin2hex(random_bytes(16));

$query = http_build_query([
    'client_id' => 'MNRNJVXE', // Sandbox test value from API Setu docs
    'redirect_uri' => config('services.digilocker.redirect_uri'),
    'response_type' => 'code',
    'state' => $state,
    'code_challenge' => $this->generateChallenge($verifier),
    'code_challenge_method' => 'S256'
]);

\Log::info('DigiLocker Config', [
    'client_id' => 'MNRNJVXE',
    'redirect_uri' => config('services.digilocker.redirect_uri'),
]);

$url = "https://dev-meripehchaan.dl6.in/public/oauth2/1/authorize?" . $query;

return response()->json([
    'success' =>true,
    'url' => $url
]);

        
    } catch (\Exception $e) {

        \Log::error('DigiLocker Auth Error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Unable to generate DigiLocker authorization URL',
            'error' => $e->getMessage()
        ], 500);
    }
}
    public function redirectToProvider()
{
    try {

       $verifier = bin2hex(random_bytes(32));

session([
    'code_verifier' => $verifier
]);

$state = bin2hex(random_bytes(16));

$query = http_build_query([
    'client_id' => 'MNRNJVXE', // Sandbox test value from API Setu docs
    'redirect_uri' => config('services.digilocker.redirect_uri'),
    'response_type' => 'code',
    'state' => $state,
    'code_challenge' => $this->generateChallenge($verifier),
    'code_challenge_method' => 'S256'
]);

\Log::info('DigiLocker Config', [
    'client_id' => 'MNRNJVXE',
    'redirect_uri' => config('services.digilocker.redirect_uri'),
]);

$url = "https://dev-meripehchaan.dl6.in/public/oauth2/1/authorize?" . $query;

return response()->json([
        'success' =>true,

    'url' => $url
]);
    } catch (\Exception $e) {

        \Log::error('DigiLocker Redirect Error', [
            'message' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

public function handleCallback(Request $request)
{
    try {

        $code = $request->query('code');
        $verifier = session('code_verifier');

        if (!$code) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization code not received'
            ], 400);
        }

        $response = Http::asForm()->post(
            'https://dev-meripehchaan.dl6.in/public/oauth2/1/token',
            [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => config('services.digilocker.redirect_uri'),
                'client_id' => config('services.digilocker.client_id'),
                'code_verifier' => $verifier,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $response->json()
        ]);

    } catch (\Exception $e) {

        \Log::error('DigiLocker Callback Error', [
            'message' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
    private function generateChallenge($verifier) {
        $hash = hash('sha256', $verifier, true);
        return strtr(base64_encode($hash), ['+' => '-', '/' => '_', '=' => '']);
    }
}

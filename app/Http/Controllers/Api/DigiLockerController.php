<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DigiLockerController extends Controller
{
    public function redirectToDigiLocker() {
        $url = "https://digilocker.partner.url/oauth/authorize?" . http_build_query([
            'client_id' => config('services.digilocker.client_id'),
            'response_type' => 'code',
            'redirect_uri' => config('services.digilocker.redirect_uri'),
            'state' => csrf_token(),
        ]);
        return response()->json(['url' => $url]);
    }


    public function redirectToProvider()
    {
        // Generate and store PKCE 'code_verifier' in session here
        $verifier = bin2hex(random_bytes(32)); 
        session(['code_verifier' => $verifier]);

        $query = http_build_query([
            'client_id' => config('services.digilocker.client_id'),
            'redirect_uri' => 'https://your-app.com/callback',
            'response_type' => 'code',
            'state' => bin2hex(random_bytes(16)),
            'code_challenge' => $this->generateChallenge($verifier),
            'code_challenge_method' => 'S256'
        ]);

        return redirect("https://dev-meripehchaan.dl6.in/public/oauth2/1/authorize?$query");
    }

    public function handleCallback(Request $request)
    {
        $code = $request->query('code');
        $verifier = session('code_verifier');

        // Exchange code for token
        $response = Http::asForm()->post('https://dev-meripehchaan.dl6.in/public/oauth2/1/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => 'https://your-app.com/callback',
            'client_id' => config('services.digilocker.client_id'),
            'code_verifier' => $verifier,
        ]);

        return $response->json(); // This contains your access_token
    }

    private function generateChallenge($verifier) {
        $hash = hash('sha256', $verifier, true);
        return strtr(base64_encode($hash), ['+' => '-', '/' => '_', '=' => '']);
    }
}

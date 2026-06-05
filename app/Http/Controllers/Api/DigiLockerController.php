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

    public function handleCallback(Request $request) {
        $code = $request->input('code');

        $response = Http::asForm()->post('https://digilocker.partner.url/oauth/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'client_id' => config('services.digilocker.client_id'),
            'client_secret' => config('services.digilocker.client_secret'),
            'redirect_uri' => config('services.digilocker.redirect_uri'),
        ]);

        $token = $response->json()['access_token'];

        $document = Http::withToken($token)->get('https://digilocker.partner.url/api/files/pan');

        return response()->json($document->json());
    }
}

<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Stripe\StripeClient;
use App\Models\User;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class KYCController extends Controller
{

    public function handleStripe(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            \Log::error('Invalid Stripe payload: ' . $e->getMessage());

            return response()->json([
                'error' => 'Invalid payload'
            ], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            \Log::error('Webhook signature verification failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Invalid signature'
            ], 400);
        }

        \Log::info('Stripe Webhook Received', [
            'event_type' => $event->type,
            'event_id'   => $event->id,
        ]);

        $session = $event->data->object;
        $userId = $session->metadata->user_id ?? null;

        if (!$userId) {
            \Log::warning('Stripe webhook missing user_id metadata');

            return response()->json([
                'message' => 'No user metadata'
            ], 200);
        }

        $user = User::find($userId);

        if (!$user) {
            \Log::warning("User not found for Stripe webhook. User ID: {$userId}");

            return response()->json([
                'message' => 'User not found'
            ], 200);
        }

        switch ($event->type) {

            case 'identity.verification_session.processing':

                $user->update([
                    'kyc_status' => 'pending'
                ]);

                \Log::info("KYC processing for User ID {$userId}");
                break;

            case 'identity.verification_session.verified':

                $user->update([
                    'kyc_status' => 'verified'
                ]);

                \Log::info("User ID {$userId} verified successfully.");
                break;

            case 'identity.verification_session.requires_input':

                $user->update([
                    'kyc_status' => 'rejected'
                ]);

                \Log::info("User ID {$userId} verification failed and requires new documents.");
                break;

            default:

                \Log::info('Unhandled Stripe event', [
                    'type' => $event->type
                ]);
                break;
        }

        return response()->json([
            'status' => 'success'
        ], 200);
    }

    public function status(Request $request)
    {
        return response()->json([
            'status' => $request->user()->kyc_status
        ]);
    }

    public function createVerificationSession(Request $request)
    {

        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));

        $session = $stripe->identity->verificationSessions->create([
            'type' => 'document',
            'metadata' => [
                'user_id' => $request->user()->id,
            ],
        ]);

        $request->user()->update([
            'kyc_status' => 'pending',
        ]);

        return response()->json([
            'client_secret' => $session->client_secret
        ]);
    }

    public function redirectToProvider()
    {
        $verifier = bin2hex(random_bytes(32));
        session(['code_verifier' => $verifier]);

        $query = http_build_query([
            'client_id' => config('services.digilocker.client_id'),
            'redirect_uri' => config('services.digilocker.redirect_uri'),
            'response_type' => 'code',
            'state' => bin2hex(random_bytes(16)),
            'code_challenge' => $this->generateChallenge($verifier),
            'code_challenge_method' => 'S256'
        ]);

        $url = "https://dev-meripehchaan.dl6.in/public/oauth2/1/authorize?$query";

        return response()->json([
            'url' => $url
        ]);
    }

    public function handleCallback(Request $request)
    {
        $code = $request->query('code');
        $verifier = session('code_verifier');

        $response = Http::asForm()->post('https://dev-meripehchaan.dl6.in/public/oauth2/1/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => 'https://your-app.com/callback',
            'client_id' => config('services.digilocker.client_id'),
            'code_verifier' => $verifier,
        ]);

        return $response->json(); 
    }

    private function generateChallenge($verifier) {
        $hash = hash('sha256', $verifier, true);
        return strtr(base64_encode($hash), ['+' => '-', '/' => '_', '=' => '']);
    }
}
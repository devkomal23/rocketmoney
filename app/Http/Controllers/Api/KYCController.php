<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Stripe\StripeClient;
use App\Models\User;

class KYCController extends Controller
{
public function createVerificationSession(Request $request)
    {
        $stripe = new StripeClient(env('STRIPE_SECRET_KEY'));

        $session = $stripe->identity->verificationSessions->create([
            'type' => 'document',
            'metadata' => [
                'user_id' => $request->user()->id, 
            ],
        ]);

        return response()->json(['client_secret' => $session->client_secret]);
    }

    public function handleStripe(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\ValueError | SignatureVerificationException $e) {
            \Log::error('Webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'identity.verification_session.verified') {
            $session = $event->data->object;
            $userId = $session->metadata->user_id ?? null;

            if ($userId) {
                $user = User::find($userId);
                if ($user) {
                    $user->update(['kyc_status' => 'verified']);
                    \Log::info("User ID {$userId} verified via Stripe.");
                }
            }
        }

        return response()->json(['status' => 'success'], 200);
    }
}

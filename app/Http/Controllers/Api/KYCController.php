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

        $session = $event->data->object;
        $userId = $session->metadata->user_id ?? null;

        if (!$userId) {
            return response()->json(['message' => 'No user metadata'], 200);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 200);
        }

        switch ($event->type) {
            case 'identity.verification_session.verified':
                $user->update(['kyc_status' => 'verified']);
                \Log::info("User ID {$userId} verified successfully via Stripe.");
                break;
                
            case 'identity.verification_session.requires_input':
                $user->update(['kyc_status' => 'rejected']);
                \Log::info("User ID {$userId} needs to provide new documents.");
                break;
                
            default:
                \Log::info("Received unhandled Stripe event type: " . $event->type);
                break;
        }

        return response()->json(['status' => 'success'], 200);
    }
}

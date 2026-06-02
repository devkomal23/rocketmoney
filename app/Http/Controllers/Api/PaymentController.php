<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment; 
use Razorpay\Api\Api;   

class PaymentController extends Controller
{
    
    public function createOrder(Request $request)
    {
        $user = $request->user();
        $amount = 49.00; // Your fee

        $api = new \Razorpay\Api\Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
        $order = $api->order->create(['amount' => $amount * 100, 'currency' => 'INR']);

        \App\Models\Payment::create([
            'user_id' => $user->id,
            'order_id' => 'temp_id',
            'amount' => $amount,
            'type' => 'assessment_fee',
            'status' => 'pending'
        ]);

        return response()->json(['order_id' => $order->id, 'amount' => $amount]);
    }

    public function verifyPayment(Request $request)
    {
        // 1. Logic to verify signature (CRITICAL for security)
        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $api->utility->verifyPaymentSignature($attributes);

            // 2. If valid, update the payment status
            $payment = Payment::where('order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update(['status' => 'paid']);
                return response()->json(['success' => true, 'message' => 'Payment verified']);
            }

            return response()->json(['success' => false, 'message' => 'Payment record not found'], 404);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 400);
        }
    }

}

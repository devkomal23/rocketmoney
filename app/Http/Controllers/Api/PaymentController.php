<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment; 
use Razorpay\Api\Api; 
use App\Models\Loans;
use Illuminate\Support\Facades\Http;   

class PaymentController extends Controller
{
    
    public function createOrder(Request $request)
    {
        $user = $request->user();
        $amount = 49.00; 

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


public function verifyBank(Request $request)
{
    $validated = $request->validate([
        'accNo' => 'required|string',
        'ifsc' => 'required|string',
        'name' =>'required |string',
        'bankName' => 'required |string'
    ]);

    
    $response = Http::withHeaders([
        'x-client-id'           => env('SETU_CLIENT_ID'),
        'x-client-secret'       => env('SETU_CLIENT_SECRET'),
        'x-product-instance-id' => env('SETU_INSTANCE_ID'),
        'Content-Type'          => 'application/json',
    ])->post('https://dg-sandbox.setu.co/api/verify/ban', [
        'accountNumber' => (string) $validated['accNo'],
        'ifsc'          => (string) $validated['ifsc'],
    ]);
    $loan = Loans::create([
            'user_id' => 1,
            'accNo'   => $request->accNo,
            'loan_amount' =>1000,
            'account_number'=> $validated['accNo'],
            'ifsc_code' =>$validated['ifsc'],
            'agreement_path' => 'loans/agreement_' . rand() . '.pdf',
            'full_name' =>$validated['name'],
            'bank_name' => $validated['bankName']
        ]);
    if ($response->successful()) {
        return response()->json([
            'success' => true,
            'message' => 'Bank account verified successfully!',
            'data' => $response->json(),
            'loanId'  => $loan->id, 
        ]);
    }

        return response()->json([
            'success' => false, 
            'message' => 'Verification failed', 
            'error' => $response->json() 
        ], $response->status());
    }


}

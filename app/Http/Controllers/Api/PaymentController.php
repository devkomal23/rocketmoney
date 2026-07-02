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

        $api = new \Razorpay\Api\Api('rzp_test_T8W7V14tSTzzm8', 'W8UI822W034Q8JZcBlPqoWYp');
        $order = $api->order->create(['amount' => $amount * 100, 'currency' => 'INR']);

        \App\Models\Payment::create([
            'user_id' => $user->id,
            'order_id' => $order['id'],
            'amount' => $amount,
            'type' => 'assessment_fee',
            'status' => 'pending'
        ]);

        return response()->json(['order_id' => $order->id, 'amount' => $amount]);
    }

    public function verifyPayment(Request $request)
    {
        $api = new Api('rzp_test_T8W7V14tSTzzm8', 'W8UI822W034Q8JZcBlPqoWYp');

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $api->utility->verifyPaymentSignature($attributes);

            $payment = Payment::where('order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update(['status' => 'paid']);
                return response()->json(['success' => true, 'message' => 'Payment verified']);
            }

            return response()->json(['success' => false, 'message' => 'Payment record not found'], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [
                    'order_id' => $request->razorpay_order_id,
                    'payment_id' => $request->razorpay_payment_id,
                    'signature' => $request->razorpay_signature,
                ]
            ],400);
        }
    }

    public function verifyBank(Request $request)
    {
        $validated = $request->validate([
            'accNo' => 'required|string',
            'ifsc'  => 'required|string',
        ]);

        // Verify account with Setu
        $response = Http::acceptJson()
            ->asJson()
            ->withHeaders([
                'x-client-id' => '292c6e76-dabf-49c4-8e48-90fba2916673',
                'x-client-secret' => '7IZMe9zvoBBuBukLiCP7n4KLwSOy11oP',
                'x-product-instance-id' => '9480d765-ebaf-4061-91d4-66af89c3e434',
            ])
            ->post('https://dg-sandbox.setu.co/api/verify/ban', [
                'accountNumber' => $validated['accNo'],
                'ifsc' => $validated['ifsc'],
            ]);

        $user = auth()->user();

        $monthlyRate = ($user->approved_loan_amount / 12) / 100;

        $emi = $user->approved_loan_amount * $monthlyRate *
            (pow(1 + $monthlyRate, 12) /
            (pow(1 + $monthlyRate, 12) - 1));

        $emi_amount = round($emi, 2);
        dd([
    'status' => $response->status(),
    'body' => $response->body(),
    'headers' => $response->headers(),
    'requestHeaders' => $response->transferStats?->getRequest()?->getHeaders(),
]);

        if ($response->successful()) {

            $user->bank_account_verified = 1;
            $user->save();

            $loan = Loans::create([
                'user_id'        => $user->id,
                'loan_amount'    => $user->approved_loan_amount,
                'account_number' => $validated['accNo'],
                'ifsc_code'      => $validated['ifsc'],
                'agreement_path' => 'loans/agreement_' . rand() . '.pdf',
                'status'         => 'pending',
                'term_days'      => 30,
                'emi_amount'     => $emi_amount,
                'full_name'      => $request->name,
                'bank_name'      => $request->bankName,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bank account verified successfully!',
                'data'    => $response->json(),
                'loanId'  => $loan->id,
            ]);
        }

        return response()->json([
            'success' => false,
            'status' => $response->status(),
            'message' => $response->body(),
        ], $response->status());
    }

    public function createSubscription(Request $request)
    {
        $api = new Api(
            'rzp_test_T8W7V14tSTzzm8',
            'W8UI822W034Q8JZcBlPqoWYp'
        );

        $customer = $api->customer->create([
            'name' => 'komal',
            'email' => 'dev112@gmail.com',
            'contact' => '9687411172'
        ]);

        $subscription = $api->subscription->create([
            'plan_id' => 'plan_T87rpZKncj9M75',
            'customer_notify' => 1,
            'quantity' => 1,
            'total_count' => 12
        ]);

        return response()->json([
            'key' => 'rzp_test_T8W7V14tSTzzm8',
            'subscription_id' => $subscription['id']
        ]);
    }

    public function handle(Request $request)
    {
        $secret = 'W8UI822W034Q8JZcBlPqoWYp';

        $payload = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');

        $expected = hash_hmac('sha256', $payload, $secret);

        if ($expected !== $signature) {
            return response()->json(['error' => 'Invalid'], 401);
        }

        $data = json_decode($payload, true);

        if ($data['event'] === 'payment.captured') {
            // update order/payment status in DB
        }

        if ($data['event'] === 'subscription.charged') {
            // renew subscription in DB
        }

        return response()->json(['status' => 'ok']);
    }

    public function testSetu()
{
    $response = Http::acceptJson()
        ->asJson()
        ->withHeaders([
        'x-client-id' => '292c6e76-dabf-49c4-8e48-90fba2916673',
        'x-client-secret' => '7IZMe9zvoBBuBukLiCP7n4KLwSOy11oP',
        'x-product-instance-id' => '9480d765-ebaf-4061-91d4-66af89c3e434',
        ])
        ->post('https://dg-sandbox.setu.co/api/verify/ban', [
            'accountNumber' => '1234567890',
            'ifsc' => 'ABCD0123456',
        ]);

    return response()->json([
        'status' => $response->status(),
        'body' => $response->body(),
        'headers' => $response->headers(),
    ]);
}
}

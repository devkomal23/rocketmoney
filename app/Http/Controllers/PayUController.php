<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Loans;

class PayUController extends Controller
{
    public function initiateUpiAutopay(Request $request)
    {
        $key = 'GI3x8M';
        $salt = 'mkCBCpzYoAmgBseseUoACzuBPBIYqc9p';

        $txnid = 'txn_' . uniqid();

        $upiId = $request->upi_id;

        $data = [
            'key' => $key,
            'txnid' => $txnid,
            'amount' => '1.00',
            'productinfo' => 'Loan_EMI',
            'firstname' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '9999999999',
            'surl' => url('/payment-success'),
            'furl' => url('/payment-failure'),

            'si' => '1',
            'payment_type' => 'upi',
            'upi' => $upiId,
        ];

        $hashString =
            $data['key'].'|'.
            $data['txnid'].'|'.
            $data['amount'].'|'.
            $data['productinfo'].'|'.
            $data['firstname'].'|'.
            $data['email'].'|||||||||||'.
            $salt;

        $data['hash'] = strtolower(hash('sha512', $hashString));

        return response()->json([
            'action_url' => 'https://test.payu.in/_payment',
            'data' => $data
        ]);
    }

    public function initiateEnach(Request $request)
    {
        // 1. Validate the incoming loan ID
        $request->validate(['loan_id' => 'required']);
        
        $loan = Loan::findOrFail($request->loan_id);
        
        // 2. PayU Configuration
        $key = 'GI3x8M';
        $salt = 'mkCBCpzYoAmgBseseUoACzuBPBIYqc9p';
        $txnid = 'txn_' . uniqid();
        $amount = '1.00'; // Or $loan->amount

        // 3. Prepare Data Payload
        $data = [
            'key' => $key,
            'txnid' => $txnid,
            'amount' => $amount,
            'productinfo' => 'EMI_Subscription',
            'firstname' => $loan->user->name ?? 'Guest',
            'email' => $loan->user->email ?? 'test@example.com',
            'phone' => $loan->user->phone ?? '9999999999',
            'surl' => url('/api/payment/success'),
            'furl' => url('/api/payment/failure'),
            'service_provider' => 'payu_paisa',
            'si' => '1',
            'api_version' => '7'
        ];

        // 4. Important: The Hash Sequence
        // Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|||||si_details|salt
        $udf1 = $udf2 = $udf3 = $udf4 = $udf5 = '';
        $hashString = "{$data['key']}|{$data['txnid']}|{$data['amount']}|{$data['productinfo']}|{$data['firstname']}|{$data['email']}|{$udf1}|{$udf2}|{$udf3}|{$udf4}|{$udf5}|||||{$data['si']}|{$salt}";
        
        $data['hash'] = strtolower(hash('sha512', $hashString));

        return response()->json([
            'data' => $data,
            'action_url' => 'https://test.payu.in/_payment'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PayUController extends Controller
{
public function getPaymentData(Request $request)
    {
        $key = 'GI3x8M';
        $salt = 'mkCBCpzYoAmgBseseUoACzuBPBIYqc9p';
        $txnid = 'txn_' . uniqid();
        $amount = '1.00';

        $data = [
            'key' => $key,
            'txnid' => $txnid,
            'amount' => $amount,
            'productinfo' => 'EMI_Subscription',
            'firstname' => $request->user()->name,
            'email' => $request->user()->email,
            'surl' => 'http://localhost:3000/success',
            'furl' => 'http://localhost:3000/failure',
            'service_provider' => 'payu_paisa',
            'si' => '1' 
        ];

        $hashString = "{$data['key']}|{$data['txnid']}|{$data['amount']}|{$data['productinfo']}|{$data['firstname']}|{$data['email']}|||||||||||{$salt}";
        $data['hash'] = strtolower(hash('sha512', $hashString));

        return response()->json([
            'data' => $data,
            'action_url' => 'https://test.payu.in/_payment' 
        ]);
    }
}

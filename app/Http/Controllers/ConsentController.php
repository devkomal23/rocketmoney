<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserConsent;

class ConsentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['agree' => 'required|boolean']);

        UserConsent::create([
            'user_id' => auth()->id(),
            'consent_type' => 'kyc_and_aggregator',
            'ip_address' => $request->ip(),
            'consented_at' => now(),
        ]);

        return response()->json(['message' => 'Consent recorded successfully'], 200);
    }
}

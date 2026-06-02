<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LoanUnderwritingService; 
use App\Models\User;

class ApplicationController extends Controller
{
    protected $underwritingService;

    public function __construct(LoanUnderwritingService $underwritingService)
    {
        $this->underwritingService = $underwritingService;
    }

    public function completeApplication(Request $request)
    {
        $loanAmount = $this->underwritingService->calculateEligibility($request->all());

        $user = $request->user(); 
        $user->update([
            'approved_loan_amount' => $loanAmount,
            'is_registration_complete' => 1
        ]);

        return response()->json([
            'success' => true,
            'approved_loan_amount' => $loanAmount
        ]);
    }
}
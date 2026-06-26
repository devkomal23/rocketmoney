<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {

        $user = Auth::user();
        
            $payment = Payment::where('user_id', $user->id)
            ->where('type', 'assessment_fee')
            ->latest()
            ->first();

        $pendingLoan = \App\Models\Loans::where('user_id',$user->id)
            ->where('status', 'pending') 
            ->latest()
            ->first();

        // 2. Format the pending loan card data
        $pendingLoanData = $pendingLoan ? [
            'amount' => $pendingLoan->loan_amount,
            'tenure' => $pendingLoan->term_days,
            'emi_amount' =>$pendingLoan->emi_amount,
            'status' => 'Pending For Disbursement',
            'id' => $pendingLoan->id
        ] : null;    
        
        $loanProducts = \App\Models\LoansInfo::all()->map(function ($loan) {
            return [
                'id' => $loan->id,
                'title' =>$loan->title,
                'max_amount' => (int) $loan->max_amount,
                'term_days' => (int) $loan->term_days,
                'tags' => explode(',', $loan->tags), 
            ];
        });


        return response()->json([
            'success' => true,
            'data' => [
                'user' => ['full_name' => ucwords($user->full_name)],
                'approved_loan' => ['amount' => $user->approved_loan_amount ?? 1000],
                'loan_products' => $loanProducts, 
                'pending_loan' =>  $pendingLoanData,
                'meta' => [
                    'is_fee_paid' => $payment?->status === 'paid',
                    'referral_bonus' => 500
                ]
            ]
        ]);
    }

    public function getAssestment(Request $request)
    {
        $user = $request->user();

        $payment = Payment::where('user_id', 1)
            ->where('type', 'assessment_fee')
            ->latest()
            ->first();
        $isFeePaid = $payment?->status === 'paid';
        $loanProducts = \App\Models\LoansInfo::all()->map(function ($loan) {
            return [
                'id' => $loan->id,
                'title' => $loan->title,
                'max_amount' => (int) $loan->max_amount,
                'term_days' => (int) $loan->term_days,
                'tags' => explode(',', $loan->tags), 
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'user' => ['full_name' => 'komal','is_fee_paid' => $isFeePaid],
                'approved_loan' => ['amount' => 10000 ?? 1000],
                'loan_products' => $loanProducts, 
                'meta' => [
                    'is_fee_paid' => $payment?->status === 'paid',
                    'referral_bonus' => 500
                ]
            ]
        ]);
    }

}

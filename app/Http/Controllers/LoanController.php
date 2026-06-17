<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class LoanController extends Controller
{
    public function generatePdf($id)
    {
        $loan = \App\Models\Loans::findOrFail($id);
        $user = \App\Models\User::findOrFail($loan['user_id']);


        $data = [
            'loan' => $loan,
            'date' => date('d-m-Y'),
            'user' => $user
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('loan_agreement', $data);
        
        return $pdf->stream('loan_agreement.pdf');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loans extends Model
{
    protected $table='loans';
    protected $fillable = [
        'loan_amount', 
        'account_number', 
        'ifsc_code', 
        'status', 
        'agreement_path',
        'full_name',
        'bank_name',
        'emi_amount',
        'term_days'
    ];
}

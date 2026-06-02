<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{protected $table = 'payment';
        protected $fillable = [
        'user_id',
        'amount',
        'status',
        'transaction_id',
        'type'
    ];

}

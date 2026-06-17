<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoansInfo extends Model
{
    protected $table='loans_info';
    protected $fillable = [
        'title', 
        'max_amount', 
        'term_days', 
        'tags', 
    ];

}

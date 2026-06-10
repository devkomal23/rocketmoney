<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KycVerification extends Model
{
    protected $table= 'kyc_verifications';
    protected $fillable = ['user_id','image_path','status','remarks','verified_at'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 

class User extends Authenticatable
{
    use HasFactory, Notifiable,HasApiTokens;

    protected $fillable = [
        'mobile_number',
        'full_name',
        'pan_number',
        'father_name',
        'dob',
        'pincode',
        'otp_code',
        'is_registration_complete',
        'email',
        'language',
        'approved_loan_amount','kyc_status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function kycVerification()
    {
        return $this->hasOne(KycVerification::class);
    }
}

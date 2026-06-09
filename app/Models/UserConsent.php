<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserConsent extends Model
{
    protected $table = 'user_consents';
    protected $fillable = ['user_id','consent_type','ip_address','consented_at'];
}

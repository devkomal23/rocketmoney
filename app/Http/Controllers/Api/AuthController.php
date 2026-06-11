<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Http; 
use Twilio\Rest\Client; 
use App\Services\LoanUnderwritingService;
use Illuminate\Support\Facades\Auth;



class AuthController extends Controller
{

protected $underwritingService;

    public function __construct(LoanUnderwritingService $underwritingService)
    {
        $this->underwritingService = $underwritingService;
    }

    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|digits:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::firstOrCreate([
                'mobile_number' => $request->mobile_number
            ]);
            $otp = random_int(1000, 9999); 
            $token = $user->createToken('auth_token')->plainTextToken;
            $user->update([
                'otp_code'       => $otp,
                'otp_expires_at' => now()->addMinutes(5),
                'remember_token' =>$token
            ]);

            $cleanMobile = preg_replace('/[^0-9]/', '', $request->mobile_number);
            
            if (str_starts_with($cleanMobile, '91') && strlen($cleanMobile) == 12) {
                $cleanMobile = '+' . $cleanMobile;
            } elseif (str_starts_with($cleanMobile, '0')) {
                $cleanMobile = '+91' . substr($cleanMobile, 1);
            } else {
                $cleanMobile = '+91' . $cleanMobile;
            }

            $sid   = trim(env('TWILIO_SID'));
            $token = trim(env('TWILIO_AUTH_TOKEN'));
            $from  = trim(env('TWILIO_NUMBER'));

            try {
                $response = Http::timeout(5) 
                    ->withBasicAuth($sid, $token)
                    ->asForm()
                    ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                        'To'   => $cleanMobile,
                        'From' => $from,
                        'Body' => "Your RocketMoney security OTP verification code is: " . $otp,
                    ]);
            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'SMS Gateway is temporarily unreachable. Please try again in a moment.'
                ], 503);
            }

            $responseData = $response->json();

            if ($response->failed()) {
                return response()->json([
                    'success'          => false,
                    'message'          => 'Twilio Gateway Response Error',
                    'gateway_response' => $responseData
                ], 400);
            }

            return response()->json([
                'success'   => true,
                'message'   => 'OTP sent successfully via Twilio to ' . $cleanMobile,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            // 8. Outer catch block protects against unexpected database exceptions
            return response()->json([
                'success'       => false,
                'message'       => 'Server Error',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|digits:10',
            'otp'           => 'required|string|digits:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('mobile_number', $request->mobile_number)
                    ->where('otp_code', $request->otp)
                    ->first();
                    if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'The entered OTP is incorrect or expired.'
            ], 401);
        }

        $payment = Payment::where('type','assessment_fee')
                        ->where('user_id',$user->id)
                        ->first();
        $isFeePaid = $payment ? true : false;
        $feeStatus = $payment ? $payment->status : 'unpaid'; 


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'The entered OTP is incorrect or expired.'
            ], 401);
        }

        $user->update(['otp_code' => null]);

        $token = $user->createToken('auth_token')->plainTextToken;
        $isProfileComplete = !empty($user->pan_number);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    ...$user->toArray(),
                    'is_registration_complete' => !empty($user->pan_number) ? 1 : 0 // Add this
                ],
                'token' => $token,
                'is_fee_paid' => $isFeePaid,
                'assessment_fee_status' => $feeStatus,
                'kyc_status' => $user->kyc_status // Ensure this field exists in your User model
            ]
        ], 200);    }

    public function completeApplication(Request $request)
    {        
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|exists:users,mobile_number',
            'full_name'     => 'required|string',
            'pan_number'    => 'required|string|size:10',
            'father_name'   => 'required|string',
            'dob'           => 'required|date',
            'email'         => 'required|email',
            'pincode'       => 'required|digits:6',
            'language'      => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }
        $loanAmount = $this->underwritingService->calculateEligibility($request->all());

        try {
            $user = User::where('mobile_number', $request->mobile_number)->first();
            $token = $user->createToken('auth_token')->plainTextToken;

            $user->update([
                'full_name'   => $request->full_name,
                'pan_number'  => $request->pan_number,
                'father_name' => $request->father_name,
                'dob'         => $request->dob,
                'email'       => $request->email,
                'pincode'     => $request->pincode,
                'language'    => $request->language,
                'is_registration_complete' => "1" ,
                'approved_loan_amount' => $loanAmount,
                'remember_token' =>$token
            ]);
            
            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => 49.00, 
                'type' => 'assessment_fee',
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'amount' => $loanAmount,
                'token' => $request->remember_token
                
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                    'success' => false, 
                    'message' => $e->getMessage() 
                ], 500);       
        }
    }

    public function updateMobile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required|string|digits:10', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        
        $user->mobile_number = $request->mobile_number; 
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mobile number updated successfully.',
            'user'    => $user
        ], 200);
    }

    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mobile number is required to resend OTP.',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $cleanMobile = preg_replace('/[^0-9]/', '', $request->mobile_number);
            
            if (str_starts_with($cleanMobile, '91') && strlen($cleanMobile) == 12) {
                $cleanMobile = '+' . $cleanMobile;
            } elseif (str_starts_with($cleanMobile, '0')) {
                $cleanMobile = '+91' . substr($cleanMobile, 1);
            } else {
                $cleanMobile = '+91' . $cleanMobile;
            }

            $otp = rand(1000, 9999);
            $rawMobileForDb = substr($cleanMobile, -10);
            $user = User::where('mobile_number', $rawMobileForDb)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Mobile number not found in our records.'
            ], 442);
        }

        $user->otp_code = $otp;
        $user->save();
        $sid   = trim(env('TWILIO_SID'));
        $token = trim(env('TWILIO_AUTH_TOKEN'));
        $from  = trim(env('TWILIO_NUMBER'));

         $response = Http::withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'To'   => $cleanMobile,
                    'From' => $from,
                    'Body' => "Your new RocketMoney verification code is: " . $otp . ". It is valid for 5 minutes.",
                ]);

            $responseData = $response->json();

            if ($response->failed()) {
                return response()->json([
                    'success'          => false,
                    'message'          => 'Twilio Gateway Resend Error',
                    'gateway_response' => $responseData
                ], 400);
            }

            return response()->json([
                'success'   => true,
                'message'   => 'A new OTP has been sent successfully to ' . $cleanMobile,
                'debug_otp' => $otp 
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success'       => false,
                'message'       => 'Server Error during resend',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}
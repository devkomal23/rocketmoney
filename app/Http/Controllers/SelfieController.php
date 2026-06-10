<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KycVerification; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; 

class SelfieController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'selfie' => 'required|image|mimes:jpeg,png,jpg|max:2048', 
        ]);

        $path = $request->file('selfie')->store('selfies', 'public');

        KycVerification::updateOrCreate(
            ['user_id' => auth()->id()], 
            [
                'image_path' => $path,
                'status' => 'pending',
                'remarks' => null
            ]
        );

        return response()->json([
            'message' => 'Image saved successfully',
            'path' => $path
        ], 200);
    }
}
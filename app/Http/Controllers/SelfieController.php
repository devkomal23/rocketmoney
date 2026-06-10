<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KycVerification; // Ensure this is imported
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Required for Str::random()

class SelfieController extends Controller
{
    public function upload(Request $request)
    {
        // 1. Validation
        $request->validate([
            'image' => 'required|string', // Ensure the input is a base64 string
        ]);

        // 2. Decode the Base64 string
        $imageData = $request->image;
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $imageData = base64_decode($imageData);
        }

        // 3. Generate a unique filename
        $fileName = 'selfies/' . auth()->id() . '_' . Str::random(10) . '.jpg';

        // 4. Store in storage/app/public/selfies
        Storage::disk('public')->put($fileName, $imageData);

        // 5. Save/Update record in the kyc_verifications table
        KycVerification::updateOrCreate(
            ['user_id' => auth()->id()], // Condition to find existing record
            [
                'image_path' => $fileName,
                'status' => 'pending',       // Reset status to pending on new upload
                'remarks' => null            // Clear previous remarks
            ]
        );

        return response()->json([
            'message' => 'Image saved successfully',
            'path' => $fileName
        ], 200);
    }
}
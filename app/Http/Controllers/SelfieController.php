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
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',    
        ]);

        
        $imageData = $request->image;
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $imageData = base64_decode($imageData);
        }

        $fileName = 'selfies/' . auth()->id() . '_' . Str::random(10) . '.jpg';

        Storage::disk('public')->put($fileName, $imageData);

        KycVerification::updateOrCreate(
            ['user_id' => auth()->id()], 
            [
                'image_path' => $fileName,
                'status' => 'pending',       
                'remarks' => null            
            ]
        );

        return response()->json([
            'message' => 'Image saved successfully',
            'path' => $fileName
        ], 200);
    }
}
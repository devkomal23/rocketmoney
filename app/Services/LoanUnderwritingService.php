<?php

namespace App\Services;

class LoanUnderwritingService
{
    public function calculateEligibility(array $data)
    {
        // 1. Basic Rule: Validation Check
        if (empty($data['pan_number']) || strlen($data['pincode']) !== 6) {
            return 0; // Denied if basic info is missing
        }

        $score = 50; // Base score
        
        $primePincodes = ['411001', '400001', '110001'];
        if (in_array($data['pincode'], $primePincodes)) {
            $score += 20;
        }

        $approvedAmount = $score * 1000;

        return min($approvedAmount, 500000);
    }
}
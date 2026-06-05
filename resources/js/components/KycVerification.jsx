import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function KycVerification() {
  const [loading, setLoading] = useState(false);

  const handleDigiLockerClick = async () => {
    setLoading(true); // Disable button or show spinner
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/digilocker/redirect`);
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirect to DigiLocker
      }
    } catch (error) {
      console.error("Failed to initiate DigiLocker:", error);
      setLoading(false);
    }
  };

  return (
    // ... your existing JSX ...
    <div className= "container">
        <div className= "card">
            <div className="min-h-screen bg-gray-50 flex items-center justify-center  bg-white">
                <div className="w-full max-w-md    overflow-hidden  verification_container">
                    <div className="mb-8 p-2 header p-4">
                        <h2 className="text-2xl font-bold text-white pageTitle">Verification</h2>
                    </div>
                    <div className="space-y-4 bg-white shadow-xl h-100 p-4">
                        <p className="text-gray-500 mt-2">Select your preferred method to complete KYC verification securely.</p>
                        <Link to="/verify-kyc" className="">                            
                            <div className="relative border-2 border-green-500 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all">
                                <span className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">🆔</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Aadhaar E-KYC</h4>
                                        <p className="text-xs text-gray-500">Requires linked mobile number</p>
                                    </div>
                                    <span className="ml-auto text-gray-400">→</span>
                                </div>
                            </div>
                        </Link>

                        <div className="text-center text-sm text-gray-400 font-medium">OR</div>
    <div 
        className={`border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-blue-500 transition-all ${loading ? 'opacity-50 cursor-wait' : ''}`} 
        onClick={!loading ? handleDigiLockerClick : undefined}>

                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">☁️</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">DigiLocker</h4>
                                        <p className="text-xs text-gray-500">Fetch records securely</p>
                                    </div>
                                    <span className="ml-auto text-gray-400">→</span>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>  );
}
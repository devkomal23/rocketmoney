import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BankAccountDetails() {
    const [formData, setFormData] = useState({ name: '', accNo: '', confirmAccNo: '', ifsc: '', bankName: '' });
    const [message, setMessage] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;


    const handleSubmit = async () => {
        console.log("click");
        if (formData.accNo !== formData.confirmAccNo) {
            alert("Account numbers do not match!");
            return;
        }

        try {
            console.log("try");
            // Ensure API_URL is defined globally or import it
            const response = await axios.post(`${API_URL}/verify-bank`, formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Verification failed. Please check your details.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bank Account Details</h2>

                <div className="space-y-4">
                    {/* Name */}
                    <InputField label="Account Holder Name *" placeholder="As per bank records" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    
                    {/* Account Number */}
                    <InputField label="Account Number *" placeholder="Enter account number" value={formData.accNo} onChange={(e) => setFormData({ ...formData, accNo: e.target.value })} />
                    
                    {/* Confirm */}
                    <InputField label="Confirm Account Number *" placeholder="Re-enter account number" value={formData.confirmAccNo} onChange={(e) => setFormData({ ...formData, confirmAccNo: e.target.value })} />
                    
                    {/* IFSC */}
                    <InputField label="IFSC Code *" placeholder="SBIN0001234" value={formData.ifsc} onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })} />
                    
                    {/* Bank Name */}
                    <InputField label="Bank Name" placeholder="Bank Name" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                </div>

                <button onClick={handleSubmit} className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-md">
                    Verify Bank Account →
                </button>
                <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
            </div>
        </div>
    );
}

// Helper for cleaner code
function InputField({ label, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ConsentHub = ({ onConsentAccepted }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state for better UX

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isChecked) {
      setLoading(true);
      try {
        await axios.post(`${API_URL}/consent`, { agree: true });
        onConsentAccepted(); 
      } catch (error) {
        console.error("Error saving consent:", error);
        alert("Failed to save consent. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Data Usage & Privacy</h2>
      <p className="text-gray-600 mb-4">To process your loan, we need your consent to securely access your data:</p>
      
      <ul className="list-disc pl-5 mb-6 text-sm text-gray-700 space-y-2">
        <li><strong>Read-Only Access:</strong> We only view your data to calculate eligibility.</li>
        <li><strong>Security:</strong> Data is encrypted using bank-grade standards.</li>
        <li><strong>Control:</strong> You can revoke this consent at any time from Settings.</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label className="flex items-start space-x-3 mb-6">
          <input 
            type="checkbox" 
            className="mt-1"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            required
          />
          <span className="text-sm text-gray-700">
            I authorize MoneyTime Technology to process my KYC and financial data for loan assessment as per the <a href="#" className="text-blue-600 underline">Terms & Conditions</a>.
          </span>
        </label>
        
        <button 
          type="submit" 
          disabled={!isChecked || loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            isChecked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? "Processing..." : "Continue →"}
        </button>
      </form>
    </div>
  );
};

export default ConsentHub;
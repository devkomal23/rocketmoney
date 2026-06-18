import React, { useState } from 'react';
import axios from 'axios';

const ConsentHub = ({ onConsentAccepted }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isChecked) {
      setLoading(true);
      try {
        await axios.post(`${API_URL}/consent`, { agree: true });
        if (typeof onConsentAccepted === 'function') {
          onConsentAccepted();
        }
      } catch (error) {
        console.error("Error saving consent:", error);
        alert("Unauthorized: Please log in again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className= "container">
      <div className= "card">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center  bg-white">
          <div className="w-full max-w-md    overflow-hidden  verification_container">
            <div className="mb-8 p-2 header p-4">
              <h2 className="text-2xl font-bold text-white pageTitle">Consent</h2>
            </div>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4">Data Usage & Privacy</h2>
            <form onSubmit={handleSubmit}>
              <label className="flex items-start space-x-3 mb-6">
                <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} required />
                  <span className="text-sm text-gray-700">
                    I authorize <strong>MoneyTime Technology</strong> to securely access and process my KYC documents and financial information for the purpose of loan eligibility assessment, as per the 
                    <a href="/terms" className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>.
                  </span>        
              </label>
              <button type="submit" disabled={!isChecked || loading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
                {loading ? "Processing..." : "Continue →"}
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9', padding: '20px' },
  card: { width: '400px', backgroundColor: '#FFF', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', height: '100px', padding: '20px', display: 'flex', justifyContent: 'center' },
  pageTitle: { color: 'white', margin: 'auto' },
  formContainer: { padding: '0 30px 30px 30px',
    overflowY: 'auto',
    height: '600px'},
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', display: 'block', marginTop: '15px', marginBottom: '5px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' },
  warningBox: { backgroundColor: '#fffaf0', border: '1px solid #feebc8', color: '#744210', padding: '12px', fontSize: '11px', borderRadius: '8px', marginTop: '20px' },
  proceedButton: { width: '100%', marginTop: '20px', padding: '15px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '700' },
  reactDatepickerPopper:{top:'30px !important'},
  errorText: { color: 'red', fontSize: '10px', marginTop: '4px', display: 'block' }
};
export default ConsentHub;
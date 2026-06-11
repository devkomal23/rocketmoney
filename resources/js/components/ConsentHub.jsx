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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
            <img 
              src="/images/rocketmoney-logo.png" 
              alt="Take Personal Loan in India with RocketMoney" 
              style ={styles.logoImage}
            />
        </div>

        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Complete Your Application</h2>
        </div>
              
        <div style={styles.formContainer}>
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4">Data Usage & Privacy</h2>
            <form onSubmit={handleSubmit}>
              <label className="flex items-start space-x-3 mb-6">
                <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} required />
      <span className="text-sm text-gray-700">
        I authorize <strong>MoneyTime Technology</strong> to securely access and process my KYC documents and financial information for the purpose of loan eligibility assessment, as per the 
        <a href="/terms" className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>.
      </span>        </label>
              <button type="submit" disabled={!isChecked || loading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
                {loading ? "Processing..." : "Continue →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#cbdcf0', // Soft backdrop to mimic screen background
    fontFamily: 'system-ui, -apple-system, sans-serif',
    height:'100dvh'
  },
  card: {
    width: '360px',
    backgroundColor: '#FFF', 
    borderRadius: '32px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxHeight:'680px',
    height:'100dvh'
  },
  logoContainer: {
    marginBottom: '45px',
    width: 'auto',
    height: '90px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-around'
},
  logoImage:{
    width: '100%',
    height: '140px',
    objectFit: 'cover'
  },
  logoTextBold: { fontSize: '22px', fontWeight: '800', color: '#1a2b49' },
  logoTextRed: { fontSize: '22px', fontWeight: '800', color: '#d93838' },
  logoSubtext: { fontSize: '10px', color: '#4a5568', marginTop: '-2px', fontWeight: '600' },
  bannerArea: {
    width: '100%',
    height: '220px',
    background: '#5c4cee',
    borderRadius: '1rem',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
  },
  bannerImage:{
    width:'100%',
    height:'auto',
    object:'contain'
  },
  form: { display: 'flex', flexDirection: 'column',marginTop:'45px' },
  signInLabel: { fontSize: '15px', fontWeight: '700', color: '#1a2b49', marginBottom: '10px' },
  inputGroup: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid',
    alignItems: 'center',
    padding: '0 16px',
    height: '52px',
    transition: 'border-color 0.2s',
  },
  countryCode: { display: 'flex', alignItems: 'center', gap: '4px', color: '#1a2b49', fontWeight: '700', fontSize: '15px' },
  dropdownArrow: { fontSize: '10px', color: '#718096' },
  divider: { width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 12px' },
  inputField: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '500' },
  helperText: { fontSize: '11px', color: '#718096', marginTop: '8px', marginBottom: '24px', lineHeight: '1.4' },
  errorText: { fontSize: '11px', color: '#d93838', marginTop: '8px', marginBottom: '24px', fontWeight: '600' },
  submitButton: {
    border: 'none',
    height: '50px',
    borderRadius: '25px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 82, 204, 0.15)',
  },
};
export default ConsentHub;
import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; 

export default function SignIn() {
  const API_URL = import.meta.env.VITE_API_URL;
    console.log("API_URL =", API_URL);

  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // 2. Initialize useLocation
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const prefilledMobile = location.state?.mobile || '';
  const [mobileNumber, setMobileNumber] = useState(prefilledMobile);
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      setErrorMsg(''); 
    }
  };

const handleRequestOTP = async (e) => {
  e.preventDefault();
  
  // Clean up the number just in case there are hidden spaces or prefixes
  const cleanMobileNumber = mobileNumber.trim();

  if (cleanMobileNumber.length !== 10) {
    setErrorMsg('Please enter a valid 10-digit mobile number.');
    return;
  }

  setLoading(true);
  setErrorMsg('');
  console.log("API_URL =", API_URL);

  try {
    // 1. Explicitly use the absolute URL to hit your local Laravel server
  const response = await fetch(`${API_URL}/requestOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ mobile_number: cleanMobileNumber }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // 2. Safely forward the cleaned mobile string to the verification route state
      navigate('/OTPVerification', { state: { mobile: cleanMobileNumber } });      
    } else {
      // 3. Extract the exact reason directly from Laravel's Validator messages
      if (data.errors && data.errors.mobile_number) {
        setErrorMsg(data.errors.mobile_number[0]);
      } else {
        setErrorMsg(data.message || 'Validation failed');
      }
    }
  } catch (error) {
    setErrorMsg('Network error. Check if your Laravel server is running.');
  } finally {
    setLoading(false);
  }
};

  const isButtonActive = mobileNumber.length === 10;

  return (
    <div className="container">
      <div className="card p-2">
        
        <div className="logoContainer">
          <img 
            src="/images/rocketmoney-logo.png" 
            alt="Take Personal Loan in India with MoneyRocket" 
            className = "logoImage"
          />
        </div>
      <div className = "scrollable-content p-2 scrollableContainer" >
        <div className="bannerArea">
          <img 
            src="/images/rocketmoney-banner.png" 
            alt="Take Personal Loan in India with MoneyRocket" 
            className ="bannerImage"
          />
        </div>
          <form onSubmit={handleRequestOTP} className = "form">
            <label className="signInLabel">Sign In with</label>

              <div className="input-group"style={{ borderColor: errorMsg ? '#d93838' : '#b3cbe6' }}>             
                <div className="countryCode">
                <span>+91</span>
                <span className="dropdownArrow">▾</span>
              </div>
              <div className="divider"></div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={handleInputChange}
                className="inputField"
              />
            </div>

            {errorMsg ? (
              <p className="errorText">{errorMsg}</p>
            ) : (
              <p className="helperText">
                Please enter your <strong className="blue">AADHAAR</strong> linked mobile number
              </p>
            )}

            <button
              type="submit"
              disabled={!isButtonActive || loading} className="submitButton"
              style={{
                backgroundColor: isButtonActive ? '#0052cc' : '#b3cbe6',
                cursor: isButtonActive ? 'pointer' : 'not-allowed'
              }}>
              {loading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
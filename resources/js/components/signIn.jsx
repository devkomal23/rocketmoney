import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; 

export default function SignIn() {
  const API_URL = import.meta.env.VITE_API_URL;
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
      navigate('/OTPVerification', { state: { mobile: cleanMobileNumber } });      
    } else {
      if (data.errors && data.errors.mobile_number) {
        setErrorMsg(data.errors.mobile_number[0]);
      } else {
        setErrorMsg(data.message || 'Validation failed');
      }
    }
  } catch (error) {
  console.error('OTP Error:', error);
  setErrorMsg(error.message);
  } finally {
    setLoading(false);
  }
};

  const isButtonActive = mobileNumber.length === 10;

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
      <div className = "scrollable-content" style = {styles.scrollableContainer}>
        <div style={styles.bannerArea}>
          <img 
            src="/images/rocketmoney-banner.png" 
            alt="Take Personal Loan in India with RocketMoney" 
            style ={styles.bannerImage}
          />
        </div>
          <form onSubmit={handleRequestOTP} style={styles.form}>
            <label style={styles.signInLabel}>Sign In with</label>

            <div style={{
              ...styles.inputGroup,
              borderColor: errorMsg ? '#d93838' : '#b3cbe6'
            }} className="input-field">
              <div style={styles.countryCode}>
                <span>+91</span>
                <span style={styles.dropdownArrow}>▾</span>
              </div>
              <div style={styles.divider}></div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={handleInputChange}
                style={styles.inputField}
              />
            </div>

            {errorMsg ? (
              <p style={styles.errorText}>{errorMsg}</p>
            ) : (
              <p style={styles.helperText}>
                Please enter your <strong style={{ color: '#0052cc' }}>AADHAAR</strong> linked mobile number
              </p>
            )}

            <button
              type="submit"
              disabled={!isButtonActive || loading}
              style={{
                ...styles.submitButton,
                backgroundColor: isButtonActive ? '#0052cc' : '#b3cbe6',
                cursor: isButtonActive ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

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
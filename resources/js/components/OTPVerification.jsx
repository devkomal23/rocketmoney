import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobile || '9687411172'; 
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(''); 
  const [resendMessage, setResendMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [resendLoading, setResendLoading] = useState(false); 
  const inputRefs = useRef([]);
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [timer, setTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false); 
  const API_URL = import.meta.env.VITE_API_URL;
  const isOtpComplete = otp.every(digit => digit !== '');


  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true); 
      clearInterval(interval);
    }
    return () => clearInterval(interval); 
  }, [timer]);

  const maskMobileNumber = (number) => {
    if (!number || number.length < 4) return 'XXXXXXXXXX';
    const firstTwo = number.slice(0, 2);
    const lastTwo = number.slice(-2);
    return `${firstTwo}******${lastTwo}`;
  };

  const handleVerify = async () => {
    if (!isAuthorized) return;

    const fullOtp = otp.join('');
    
    if (fullOtp.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp: fullOtp
        }),
      });

      const result = await response.json();
        if (response.ok && result.success) {
          const { token, user, is_fee_paid, assessment_fee_status, kyc_status } = result.data;
          localStorage.setItem('authToken', result.data.token);
          console.log("Token from API:", result.data.token);
          console.log("Saved Token:", localStorage.getItem("authToken"));
          const isRegistrationComplete = user.is_registration_complete == 1; 
          const isFeePaid = is_fee_paid === true || assessment_fee_status === 'paid';
          const isKycVerified = kyc_status === 'verified';
          if (user.is_registration_complete != 1) {
            navigate('/complete_application',{ state: { mobile: mobileNumber } });
          } 
          else if (kyc_status !== 'verified') {
            navigate('/verify-kyc');
          } 
          else if (assessment_fee_status !== 'paid') {
            navigate('/assesmentFee');
          } 
          else {
            navigate('/BankAccountDetails');
          }
       }  
    } catch (err) {
      alert(err);
       setError('Something went wrong. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return; 
      setError('');
      setResendMessage('');
      setResendLoading(true);

    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setResendMessage('A fresh OTP has been sent successfully!');
        setOtp(['', '', '', '']); 
        inputRefs.current[0].focus(); 
        setTimer(30);
        setCanResend(false);
      } else {
        setError(result.message || 'Could not resend OTP. Try again.');
      }
    } catch (err) {
      setError('Connection error. Failed to resend.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>OTP Verification</h2>
        </div>
        <div className = "scrollable-content p-2" style = {styles.scrollableContainer}>
          <div style={styles.dataContainer}>
            <div style={styles.badgeContainer}>
              <span style={styles.badgeText}>Enter OTP</span>
            </div>
            <p style={styles.subtext}>
              Sent To {maskMobileNumber(mobileNumber)}
              <span style={styles.editLink} onClick={() => navigate('/',{ state: { mobile: mobileNumber } })}> Edit</span>
            </p>

            {error && <p style={styles.errorText}>{error}</p>}
            {resendMessage && <p style={styles.successText}>{resendMessage}</p>}

            <div style={styles.otpContainer}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9]$/.test(val) || val === '') {
                      const newOtp = [...otp];
                      newOtp[i] = val;
                      setOtp(newOtp);
                      
                      if (val !== '' && i < 3) {
                        inputRefs.current[i + 1].focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                      inputRefs.current[i - 1].focus();
                    }
                  }}
                  ref={(el) => (inputRefs.current[i] = el)}
                  style={styles.otpBox}
                />
              ))}
            </div>

            <p style={styles.resendText}>
              Didn't Receive OTP ? <br />
              {canResend ? (
                <span 
                  style={{
                    ...styles.link, 
                    opacity: resendLoading ? 0.5 : 1,
                    cursor: resendLoading ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={handleResend}
                > 
                  {resendLoading ? ' Sending...' : ' Resend OTP'}
                </span>
              ) : (
                <span style={styles.disabledTimer}> Re-send in 00:{timer < 10 ? `0${timer}` : timer}s</span>
              )}
            </p>

            <div style={styles.authRow}>
              <input 
                type="checkbox" 
                id="authCheckbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                style={styles.checkboxInput}
              />
              <label htmlFor="authCheckbox" style={styles.authLabel}>
                I authorize MoneyTime Technology Solutions Pvt. Ltd. (MoneyRocket) and its lending partners to verify my KYC details and mobile number, contact me via Call, SMS, WhatsApp, VOIP, or Email, and access my credit report. I have read and agree to the <a href="https://uat.MoneyRocket.in/terms-and-conditions" target="_blank" style={styles.inlineLink}>Terms & Conditions</a> & <a href="https://uat.MoneyRocket.in/privacy-policy" target="_blank" style={styles.inlineLink}>Privacy Policy</a>.
              </label>
            </div>
            <button 
              onClick={handleVerify} 
              disabled={loading || !isOtpComplete || !isAuthorized} 
              style={{
                ...styles.verifyButton, 
                backgroundColor: (loading || !isOtpComplete || !isAuthorized) ? '#b3cbe6' : '#0052cc',
                cursor: (loading || !isOtpComplete || !isAuthorized) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Continue →'}
            </button>
          </div>
          <div style={styles.footer}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
    backgroundColor: '#cbdcf0', fontFamily: 'system-ui, -apple-system, sans-serif', height:'100dvh'
  },
  card: {
    width: '360px', backgroundColor: '#FFF', borderRadius: '32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', height:'100dvh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  header: { 
    background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', 
    height: '100px', padding: '20px', display: 'flex',justifyContent: 'center' 
  },
  backArrow: { color: '#fff', fontSize: '24px', cursor: 'pointer', position: 'absolute', top: '20px', left: '20px' },
  dataContainer:{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { color: '#fff', fontSize: '22px', fontWeight: '700', marginTop: '-60px', marginBottom: '40px', width: '100%', textAlign: 'center' },
  
  badgeContainer: { backgroundColor: '#0033aa', padding: '6px 20px', borderRadius: '20px', marginBottom: '10px' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: '14px' },
  subtext: { fontSize: '14px', color: '#718096', margin: '5px 0 20px 0' },
  editLink: { color: '#0052cc', fontWeight: '700', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' },
  
  otpContainer: { display: 'flex', justifyContent: 'center', gap: '12px', margin: '15px 0', width: '100%' },
  otpBox: {
    width: '55px', height: '55px', borderRadius: '12px', border: '1.5px solid #b3cbe6',
    textAlign: 'center', fontSize: '20px', fontWeight: '600', color: '#0052cc'
  },
  
  verifyButton: {
    width: '100%', height: '50px', borderRadius: '12px', border: 'none',
    color: '#fff', fontSize: '16px', fontWeight: '700',
    marginTop: 'auto', transition: 'background-color 0.2s ease'
  },
  link: { color: '#0052cc', fontWeight: '700', cursor: 'pointer' },
  resendText: { fontSize: '13px', color: '#718096', textAlign: 'center', margin: '15px 0', lineHeight: '1.6' },
  disabledTimer: { color: '#0033aa', fontWeight: '700' },
  errorText: { color: '#e53e3e', fontSize: '12px', textAlign: 'center', margin: '5px 0' },
  successText: { color: '#38a169', fontSize: '12px', textAlign: 'center', margin: '5px 0' },

  authRow: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px',
    backgroundColor: '#fafafa', margin: '20px 0', width: '100%', boxSizing: 'border-box'
  },
  checkboxInput: { marginTop: '4px', transform: 'scale(1.2)', cursor: 'pointer' },
  authLabel: { fontSize: '11px', color: '#718096', lineHeight: '1.5', cursor: 'pointer', textAlign: 'left' },
  inlineLink: { color: '#0052cc', textDecoration: 'underline', fontWeight: '600' },
  pageTitle:{
    color:'white',margin:'auto'
  },
};
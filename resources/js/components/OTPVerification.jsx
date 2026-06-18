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

          const isRegistrationComplete = user.is_registration_complete == 1; 
          const isFeePaid = is_fee_paid === true || assessment_fee_status === 'paid';
          const isKycVerified = kyc_status === 'verified';
          if (user.is_registration_complete != 1) {
             //navigate('/complete_application',{ state: { mobile: mobileNumber } });
             navigate('/BankAccountDetails');

          } 
          else if (kyc_status !== 'verified') {
              navigate('/verify-kyc');
          } 
          else if (assessment_fee_status !== 'paid') {
              //navigate('/assesmentFee');
                           navigate('/BankAccountDetails');

          } 
          else {
             // navigate('/assesmentFee');
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
    <div className = "container">
      <div className = "card">
        <div className = "header">
          <h2 className = "pageTitle">OTP Verification</h2>
        </div>
        <div className = "scrollable-content p-2 scrollableContainer">
          <div className = "dataContainer">
            <div className = "badgeContainer">
              <span className = "badgeText">Enter OTP</span>
            </div>
            <p className = "subtext">
              Sent To {maskMobileNumber(mobileNumber)}
              <span 
                className="editLink" 
                onClick={() => navigate('/', { state: { mobile: mobileNumber } })}
              > 
                Edit
              </span>            
            </p>

            {error && <p className = "errorText">{error}</p>}
            {resendMessage && <p className = "successText">{resendMessage}</p>}

            <div className = "otpContainer">
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
                  className = "otpBox"
                />
              ))}
            </div>

            <p className = "resendText">
              Didn't Receive OTP ? <br />
              {canResend ? (
                <span className="blue"
                  style={{
                    opacity: resendLoading ? 0.5 : 1,
                    cursor: resendLoading ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={handleResend}
                > 
                  {resendLoading ? ' Sending...' : ' Resend OTP'}
                </span>
              ) : (
                <span className = "disabledTimer"> Re-send in 00:{timer < 10 ? `0${timer}` : timer}s</span>
              )}
            </p>

            {/* Authorization Terms Checkbox */}
            <div className = "authRow">
              <input 
                type="checkbox" 
                id="authCheckbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className = "checkboxInput"
              />
              <label htmlFor="authCheckbox" className = "authLabel">
                I authorize MoneyTime Technology Solutions Pvt. Ltd. (MoneyRocket) and its lending partners to verify my KYC details and mobile number, contact me via Call, SMS, WhatsApp, VOIP, or Email, and access my credit report. I have read and agree to the <a href="https://uat.MoneyRocket.in/terms-and-conditions" target="_blank" className = "inlineLink">Terms & Conditions</a> & <a href="https://uat.MoneyRocket.in/privacy-policy" target="_blank" className = "inlineLink">Privacy Policy</a>.
              </label>
            </div>
            <button className='submitButton'
              onClick={handleVerify} 
              disabled={loading || !isOtpComplete || !isAuthorized} 
              style={{
                backgroundColor: (loading || !isOtpComplete || !isAuthorized) ? '#b3cbe6' : '#0052cc',
                cursor: (loading || !isOtpComplete || !isAuthorized) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Continue →'}
            </button>
          </div>
          <div className = "footer"></div>
        </div>
      </div>
    </div>
  );
};

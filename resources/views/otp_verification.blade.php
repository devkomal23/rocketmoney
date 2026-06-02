import React, { useState, useRef } from 'react';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input
      if (index < 3) inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          style={styles.otpBox}
        />
      ))}
    </div>
  );
}
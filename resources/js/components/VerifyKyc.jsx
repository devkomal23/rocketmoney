import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51TdR50CwBSCb9sXM2IdrxeRSsE6nNE1gAVHeHg5N7qYb2SB8dKMYrBYGUul00NlkCpcISEBW94RKzZ6juqFsNVmi00SA8INkKP'
);

export default function VerifyKyc() {
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const checkStatus = async () => {
    if (currentStatus === 'verified') {
      setPopup({ show: true, type: 'success', title: 'Verified', message: 'Account verified!' });
      navigate('/AccountAggregator');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {popup.show && (
          <div className='popupOverlay'>
            <div className='styles.popup'>
              <div className='checkCircle'>✓</div>
              <h2 className='popupTitle'>{popup.title}</h2>
              <p className='popupText'>{popup.message}</p>
              <button
                className='popupButton'
                onClick={() => {
                  setPopup({ ...popup, show: false }); 
                  if (status === 'verified') navigate('/dashboard');
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
{showPopup && (
  <div className='popupOverlay'>
    <div className='styles.popup'>
      <div className='checkCircle'>✓</div>

      <h2 className='popupTitle'>
        Verification Successful!
      </h2>

      <p className='popupText'>
        Your identity verification has been completed successfully.
      </p>

      <button
        className='popupButton'
        onClick={() => {
          setShowPopup(false);
          navigate('/dashboard');
        }}
      >
        Continue
      </button>
    </div>
  </div>
)}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f9',
    padding: '20px',
  },
  card: {
    width: '400px',
    backgroundColor: '#fff',
    borderRadius: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    minHeight: '600px',
  },
  header: {
    background:
      'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)',
    height: '100px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  pageTitle: {
    color: '#fff',
    margin: 'auto',
  },
  formContainer: {
    padding: '30px',
  },
  instruction: {
    fontSize: '14px',
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: '20px',
  },
  proceedButton: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
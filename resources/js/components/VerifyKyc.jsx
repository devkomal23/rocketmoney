import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51TdR50CwBSCb9sXM2IdrxeRSsE6nNE1gAVHeHg5N7qYb2SB8dKMYrBYGUul00NlkCpcISEBW94RKzZ6juqFsNVmi00SA8INkKP'
);

export default function VerifyKyc() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [popup, setPopup] = useState({show: false,type: '',title: '',message: '',});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const authToken = localStorage.getItem('auth_token');

  const checkStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/kyc/status`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        }
      );

      const currentStatus = response.data.status;
      setStatus(currentStatus);

      if (currentStatus === 'verified') {
        setShowPopup(true);
        navigate('/AccountAggregator');
      }
    } catch (err) {
      console.error(
        'Status API Error:',
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    checkStatus();

    const interval = setInterval(() => {
      checkStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/kyc/init`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.client_secret) {
        throw new Error('Client secret not received');
      }

      const stripe = await stripePromise;

      const { error } = await stripe.verifyIdentity(
        data.client_secret
      );

      if (error) {
        setShowPopup(true);
        setPopup({show: true,type: 'error',title: 'Verification Failed',message: error.message,});
        //alert(`Verification failed: ${error.message}`);
        return;
      }

      setStatus('pending');
        setPopup({show: true,type: 'error',title: 'Verification Processing...',message: 'Verification submitted successfully. Waiting for verification...',});
     
      checkStatus();
    } catch (err) {
      console.error('KYC Error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>
            Identity Verification
          </h2>
        </div>

        <div style={styles.formContainer}>
          <p style={styles.instruction}>
            To proceed with your loan application,
            we need to verify your identity.
            Please keep your government-issued ID ready.
          </p>

          {status === 'pending' && (
            <p style={{ textAlign: 'center', color: '#0f52ba' }}>
              Verification is being processed...
            </p>
          )}

          {status === 'verified' && (
            <p style={{ textAlign: 'center', color: 'green' }}>
              Verification successful ✅
            </p>
          )}

          {status === 'rejected' && (
            <p style={{ textAlign: 'center', color: 'red' }}>
              Verification failed. Please try again.
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={
              isLoading ||
              status === 'pending' ||
              status === 'verified'
            }
            style={{
              ...styles.proceedButton,
              backgroundColor:
                isLoading ||
                status === 'pending' ||
                status === 'verified'
                  ? '#cbd5e0'
                  : '#6200ea',
            }}
          >
            {isLoading
              ? 'Launching...'
              : status === 'verified'
              ? 'Verified'
              : 'Verify Identity →'}
          </button>
        </div>
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
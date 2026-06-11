import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51TdR50CwBSCb9sXM2IdrxeRSsE6nNE1gAVHeHg5N7qYb2SB8dKMYrBYGUul00NlkCpcISEBW94RKzZ6juqFsNVmi00SA8INkKP');

export default function VerifyKyc() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/kyc/status`);
      const currentStatus = response.data.status;
      setStatus(currentStatus);

      if (currentStatus === 'verified') {
        //setPopup({ show: true, title: 'Verified', message: 'Identity verified!' });
        setTimeout(() => {
          navigate('/SelfieVerification');
        }, 2000);      
      }
    } catch (err) {
      console.error('Status API Error:', err);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/kyc/init`);
      const { client_secret } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.verifyIdentity(client_secret);

      if (error) throw new Error(error.message);
      setStatus('pending');
    } catch (err) {
      console.error(err);
      alert('Verification failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}><h2 style={styles.pageTitle}>Identity Verification</h2></div>
        <div style={styles.formContainer}>
          <p style={styles.instruction}>To proceed with your loan, we need to verify your identity.</p>
          
          {status === 'pending' && <p style={{textAlign: 'center', color: '#0f52ba'}}>Processing...</p>}
          {status === 'verified' && <p style={{textAlign: 'center', color: 'green'}}>Success ✅</p>}
          {status === 'rejected' && <p style={{textAlign: 'center', color: 'green'}}>Rejected ❌</p>}

          <button onClick={handleVerify} disabled={isLoading || status === 'verified'} style={{...styles.proceedButton, backgroundColor: (isLoading || status === 'verified') ? '#cbd5e0' : '#6200ea'}}>
            {isLoading ? 'Launching...' : 'Verify Identity →'}
          </button>
        </div>
      </div>

      {popup.show && (
        <div className="popupOverlay">
          <div className="popup">
            <h2>{popup.title}</h2>
            <p>{popup.message}</p>
            <button className="popupButton" onClick={() => navigate('/dashboard')}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}


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
    backgroundColor: '#FFF',
    borderRadius: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    height:'100vh'
  },
  header: {
    background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)',
    height: '100px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  pageTitle: {
    color: 'white',
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
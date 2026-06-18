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
  const issetstatus = false;
  const [isTestMode, setIsTestMode] = useState(true); 
  const TestModeView = ({ onComplete, onProceed }) => (
  <div className="test-mode-section">
    <div className="test-mode-alert">
      <strong>You're currently in test mode</strong>
      <p>This page is only shown in test mode.</p>
    </div>

    <div className="test-mode-data">
      <h3>Complete with test data</h3>
      <p>Save time by choosing a desired result.</p>
      
      <select id="mock-result" className="test-select">
        <option value="verified">Verification success</option>
        <option value="rejected">Verification rejected</option>
      </select>
      
      <button className="submitButton" onClick={onComplete}>Submit</button>
    </div>

    <div className="test-mode-preview">
      <h3>Preview user experience</h3>
      <p>Proceed to preview as an end user.</p>
      <button className="proceedButton" onClick={onProceed}>Proceed</button>
    </div>
  </div>
);
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
    setStatus('pending');
    //const result = document.getElementById('mock-result').value;
    try {
      const response = await axios.post(`${API_URL}/kyc/init`);
      const { client_secret } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.verifyIdentity(client_secret);

      if (error) throw new Error(error.message);
      setStatus('pending');
      issetstatus= true;
    } catch (err) {
      console.error(err);
      alert('Verification failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className = "container">
      <div className = "card">
        <div className = "header"><h2 className = "pageTitle">Identity Verification</h2></div>
        <div className = "formContainer">
          <p className = "instruction">To proceed with your loan, we need to verify your identity.</p>
          
            {status === 'pending' && <p className="status-text text-pending">Processing...</p>}
            {status === 'verified' && <p className="status-text text-verified">Success ✅</p>}
            {status === 'rejected' && <p className="status-text text-rejected">Rejected ❌</p>}          
            <button className= "submitButton" onClick={handleVerify} disabled={isLoading || status === 'verified'} style={{backgroundColor: (isLoading || status === 'verified') ? '#cbd5e0' : '#6200ea'}}>
            {isLoading ? 'Launching...' : 'Verify Identity →'}
          </button>
        </div>
      </div>

      {popup.show && (
        <div className="popupOverlay">
          <div className="popup">
            <h2>{popup.title}</h2>
            <p>{popup.message}</p>
            <button className="popupButton" onClick="{() => navigate('/dashboard')}">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}


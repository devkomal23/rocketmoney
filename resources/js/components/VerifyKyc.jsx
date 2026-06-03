import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51TdR50CwBSCb9sXM2IdrxeRSsE6nNE1gAVHeHg5N7qYb2SB8dKMYrBYGUul00NlkCpcISEBW94RKzZ6juqFsNVmi00SA8INkKP');

export default function VerifyKyc() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleVerify = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/kyc/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      const { client_secret } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.verifyIdentity(client_secret);

      if (error) {
        alert("Verification failed: " + error.message);
      } else {
        alert("Verification completed. Please wait while we process your status.");
        navigate('/dashboard'); 
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleManualVerify = async () => {
    try {
        const { error } = await stripe.verifyIdentity(clientSecret);
    
    if (error) {
      setErrorMessage(error.message); 
      console.error("Stripe Identity Error:", error.message);
    } else {
         alert("Submission received. We are processing your documents...");
        await axios.get('/api/debug/force-verify');
        alert("Manual verification successful!");
        navigate('/dashboard'); 
    }
    } catch (error) {
        console.error("Error updating status:", error);
    }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Identity Verification</h2>
        </div>
        
        <div style={styles.formContainer}>
          <p style={styles.instruction}>
            To proceed with your loan application, we need to verify your identity. 
            Please have your government-issued ID ready.
          </p>
          
          <button 
            onClick={handleVerify} 
            disabled={isLoading}
            style={{ 
              ...styles.proceedButton, 
              backgroundColor: isLoading ? '#cbd5e0' : '#6200ea' 
            }}
          >
            {isLoading ? "Launching..." : "Verify Identity →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9', padding: '20px' },
  card: { width: '400px', backgroundColor: '#FFF', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', height: '100px', padding: '20px', display: 'flex', justifyContent: 'center' },
  pageTitle: { color: 'white', margin: 'auto' },
  formContainer: { padding: '30px' },
  instruction: { fontSize: '14px', color: '#4a5568', textAlign: 'center', marginBottom: '20px' },
  proceedButton: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }
};
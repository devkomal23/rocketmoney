import React, { useState } from 'react';
import axios from 'axios';

const PaymentInitiator = () => {
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    setLoading(true);
    try {
      // Fetch the signed data from Laravel
      const response = await axios.post('/api/get-payment-data');
      const { data, action_url } = response.data;

      // Create and submit hidden form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = action_url;

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleProceed} disabled={loading}>
      {loading ? 'Processing...' : 'Proceed with eNACH'}
    </button>
  );
};
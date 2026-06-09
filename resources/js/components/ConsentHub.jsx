import React, { useState } from 'react';
import axios from 'axios';

const ConsentHub = ({ onConsentAccepted }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isChecked) {
      setLoading(true);
      try {
        await axios.post(`${API_URL}/consent`, { agree: true });
        if (typeof onConsentAccepted === 'function') {
          onConsentAccepted();
        }
      } catch (error) {
        console.error("Error saving consent:", error);
        alert("Unauthorized: Please log in again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Data Usage & Privacy</h2>
      <form onSubmit={handleSubmit}>
        <label className="flex items-start space-x-3 mb-6">
          <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} required />
          <span className="text-sm">I authorize...</span>
        </label>
        <button type="submit" disabled={!isChecked || loading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
          {loading ? "Processing..." : "Continue →"}
        </button>
      </form>
    </div>
  );
};
export default ConsentHub;
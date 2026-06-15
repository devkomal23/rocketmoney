import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  // 1. Declare all state variables at the top
  const [dueDate, setDueDate] = useState("");
  const [showError, setShowError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Declare hooks only once
  const navigate = useNavigate();

  const handleAccept = () => {
    if (dueDate === "") {
      setShowError(true); 
    } else {
      setShowError(false); 
      console.log("Proceeding with due date:", dueDate);
      navigate('/assesmentFee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Now 'isChecked' and 'setLoading' are correctly defined in this scope
    if (!isChecked) return;
    
    setLoading(true); 
    
    try {
      console.log("Consent submitted!");
      // Example: navigate to next page after successful API call
      // navigate('/next-step'); 
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/verify-kyc')}>←</button>
          <div className ="header_info">
            <h1>Account Aggregator</h1>
            <p>RBI-licensed · Secure data consent</p>
          </div>
        </div>
        <div className="scrollable-content">

        <div className="entity-card">
          <div className=" aggregator_icon">🛡️</div>
          <div>
            <h3>Pooja Finstock International Limited.</h3>
            <p>RBI-Registered NBFC</p>
          </div>
        </div>

        <div className="data-access">
          <h4>DATA WE WILL ACCESS</h4>

          <div className="item">
            <div className= "item_icon"><span>📄</span></div>
            <div>
              <h5>Bank Statements</h5>
              <p>12-month transaction history</p>
            </div>
          </div>
        


            <div className="item">
              <div className= "item_icon"><span>📈</span></div>
              <div>
                <h5>Income Patterns</h5>
                <p>Salary credits & cash flow analysis</p>
              </div>
            </div>

          <div className="item">
            <div className= "item_icon"><span>📄</span></div>
            <div>
              <h5>Loan Assessment</h5>
              <p>Creditworthiness evaluation only</p>
            </div>
          </div>
        </div>

        <div className="rights-box">
          <h4>Your Data Rights</h4>
          <ul>
            <li>✓ Read-only access — we cannot initiate any transaction</li>
            <li>✓ Data used strictly for loan eligibility — never shared</li>
            <li>✓ Consent expires automatically in 30 days</li>
            <li>✓ Revoke anytime from your account settings</li>
          </ul>
        </div>



        <div className="input-group select_box_due_date">
            <form onSubmit={handleSubmit}>
              <label className="flex items-start space-x-3 mb-6">
                <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} required />
                  <span className="text-sm text-gray-700">
                    I authorize <strong> Pooja Finstock International Limited</strong> to fetch my bank statements via the RBI-regulated Accountant Aggregator framework 
                    for loan assessment purposes only.This is read-only access.
                  </span>        
              </label>
              <button 
                type="submit" 
                disabled={!isChecked || loading} 
                className="w-full py-3 bg-blue-600 text-white rounded-lg action-btn disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Give Consent & Select Bank →"}
              </button>           
            </form>
        </div>
        </div>
      </div>
    </div>
  );
}
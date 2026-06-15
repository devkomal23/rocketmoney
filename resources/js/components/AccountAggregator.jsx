import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [dueDate, setDueDate] = useState("");
  const [showError, setShowError] = useState(false);
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
          </div>

          <div className="data-access">
            <h4>DATA WE WILL ACCESS</h4>

            <div className="item">
              <div className= "item_icon"><span>📈</span></div>
              <div>
                <h5>Income Patterns</h5>
                <p>Salary credits & cash flow analysis</p>
              </div>
            </div>
          </div>


        <div className="data-access">
          <h4>DATA WE WILL ACCESS</h4>

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
          <label htmlFor="dueDate">Select Due Date</label>
          <select 
            id="dueDate" 
            className="form-input due_date_dropdown"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (e.target.value !== "") setShowError(false); // Hide error if user selects a date
            }}
          >
            <option value="">-- Select --</option>
            <option value="10">10 TH OF MONTH</option>
          </select>

          {showError && (
            <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
              ⚠️ Please select a due date before accepting.
            </div>
          )}
        </div>

        <button className="action-btn" onClick={handleAccept}>
          Give Consent & Select Bank →
        </button>
        </div>
      </div>
    </div>
  );
}
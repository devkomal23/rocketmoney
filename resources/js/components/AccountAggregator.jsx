import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [dueDate, setDueDate] = useState("");
  const [showError, setShowError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAccept = () => {
      navigate('/assesmentFee');
    }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!isChecked) return;
    
    setLoading(true); 
    
    try {
      console.log("Consent submitted!");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className="container">
      <div className="card flex flex-col h-[720px]">
        <div className="header">
          <div class="back-btn">          
            <button className="" onClick={() => navigate('/verify-kyc')}>←</button>
          </div>
          <div className ="header_info">
            <h1>Account Aggregator</h1>
            <p>RBI-licensed · Secure data consent</p>
          </div>
        </div>
        <div className="scrollable-content flex-grow overflow-y-auto">

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



<div className=" mt-6 mb-8 px-4">
  <form onSubmit={handleSubmit} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-inner">
    
    <label className="flex items-start gap-4 mb-6 cursor-pointer group">
      <div className="relative flex items-center justify-center mt-1">
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={(e) => setIsChecked(e.target.checked)} 
          required 
          className="peer appearance-none h-6 w-6 border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <svg 
          className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
        I authorize <strong className="text-gray-900">Pooja Finstock International Limited</strong> to fetch my bank statements via the RBI-regulated Account Aggregator framework for loan assessment purposes only. 
      </span>        
    </label>
    
    <button 
      type="submit" 
      disabled={!isChecked || loading} 
      className="w-full p-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 select_bank_btn"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          Give Consent & Select Bank 
          <span className="text-2xl leading-none">→</span>
        </>
      )}
    </button> 
  </form>
</div>
        </div>
      </div>
    </div>
  );
}
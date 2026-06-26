import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';


export default function PaymentSelection() {
    const { loanId } = useParams();
    const navigate = useNavigate();

    // In a real app, fetch these details from your Laravel API
    const amount = "1.00"; 
    const upiLink = `upi://pay?pa=devshuklakomal@oksbi&pn=LoanApp&am=${amount}&cu=INR`;
    const [scannedUpiId, setScannedUpiId] = useState('');
    const proceedToPayU = () => {
        const proceedToPayU = () => {
            navigate(`/pay-mandate/${loanId}`);
        }; 
    };

    return (
        <div className="container">
            <div className="card">
            <h2 className="text-2xl font-bold mb-4">Complete Your Loan Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* QR Scanner Section */}
                <div className=" p-4 border text-center">
                    <h3 className="text-lg font-semibold mb-2">Scan to Pay Now</h3>
                    <div style={{ background: 'white', padding: '16px' }}>
                        <QRCode value={upiLink} size={200} />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Scan with any UPI app</p>
                </div>

                {/* Mandate Section */}
                <div className=" p-4 border text-center">
                    <h3 className="text-lg font-semibold mb-2">Setup Auto-Pay (eNACH)</h3>
                    <p className="mb-4">Authorize automatic EMI deductions.</p>
                    <button 
                        onClick={proceedToPayU}
                        className="bg-blue-600 text-white px-6 py-2 rounded"
                    >
                        Setup eNACH Mandate
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('auth_token');
    console.log(token);


    const handlePaymentClick = async () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

    
        try {

            const { data: orderData } = await axios.post(`${API_URL}/create-payment-order`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });


            const options = {
                key: "rzp_test_T8W7V14tSTzzm8", 
                amount: orderData.amount * 100,
                currency: "INR",
                order_id: orderData.order_id,
                handler: async (response) => {
                    await axios.post(`${API_URL}/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }, { headers: { 'Authorization': `Bearer ${token}` } });
                    
                    alert("Payment Successful!");
                    navigate('/SelfieVerification'); 
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);

            alert("Payment initiation failed.");
        }
    };

        useEffect(() => {
            const fetchDashboard = async () => {
                const token = localStorage.getItem('auth_token');
                try {
                    const res = await axios.get(`${API_URL}/assessment`, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                    });
                                
                    setData(res.data.data); 
                } catch (err) {
                    console.error("Dashboard Error Details:", err.response ? err.response.data : err.message);
                    if (err.response?.status === 401) {
                        navigate('/');
                    } else {
                        alert("Server error: " + (err.response?.data?.message || err.message));
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchDashboard();
        }, [navigate]);
        const handleLogout = () => {
            localStorage.removeItem('auth_token');
            navigate('/'); 
        };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <img 
                        src="/images/rocketmoney-logo.png" 
                        alt="Take Personal Loan in India with MoneyRocket" 
                        style ={styles.logoImage}
                    />
                </div>

                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                <h2 style={styles.title}>Congratulations! 🥳</h2>
                <p style={styles.subTitle}>You can apply for a loan of up to</p>
                <h1 style={styles.amount}>₹ 10000/-</h1>
            </div>

            <div style={styles.body}>
                <div style={styles.feeBox}>
                    <span>Assessment fee :</span>
                    <span style={styles.feePrice}><strong>₹49/-</strong></span>
                </div>

                <p style={styles.disclaimer}>
                    By clicking on "Proceed", I provide my consent to pay the applicable 
                    Assessment Fee (AF), which is charged solely for assessment and 
                    evaluation purposes and does not guarantee approval or sanction.
                </p>

                <button onClick={handlePaymentClick} style={styles.proceedButton}>
                    Proceed to Pay ₹49 →
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: { width: '400px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', margin: '50px auto' },
    header: { background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', padding: '30px', color: '#fff', textAlign: 'center' },
      logoContainer: {
    marginBottom: '45px',
    width: 'auto',
    height: '90px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-around'
},
  logoImage:{
    width: '100%',
    height: '140px',
    objectFit: 'cover'
  },
  logoTextBold: { fontSize: '22px', fontWeight: '800', color: '#1a2b49' },
  logoTextRed: { fontSize: '22px', fontWeight: '800', color: '#d93838' },
  logoSubtext: { fontSize: '10px', color: '#4a5568', marginTop: '-2px', fontWeight: '600' },

    logoutButton: { padding: '8px 16px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    title: { margin: '10px 0' },
    amount: { fontSize: '40px', margin: '10px 0' },
    body: { padding: '25px' },
    feeBox: { border: '2px dashed #1e90ff', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    feePrice: { color: '#1e90ff' },
    disclaimer: { fontSize: '15px', color: '#666', lineHeight: '1.5', textAlign: 'center' },
    proceedButton: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#0f52ba', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }
};

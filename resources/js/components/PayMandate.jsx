import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function PayMandate() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const styles = {
    card: { width: '400px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', margin: '50px auto' },
    header: { background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', padding: '30px', color: '#fff', textAlign: 'center' },
      logoContainer: {
    marginBottom: '45px',
    width: 'auto',
    height: '135px',
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


  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");

  const [loading, setLoading] = useState(false);

  const startMandate = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/create-subscription`,
        {
          loan_id: loanId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Subscription Response:", data);

      const options = {
        key: data.key,
        subscription_id: data.subscription_id,

        name: "MoneyRocket",
        description: "Loan EMI AutoPay",

        handler: async function (response) {
          console.log("Razorpay Response:", response);

          try {
            const verify = await axios.post(
              `${API_URL}/paymentmandate`,
              {
                loan_id: loanId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id:
                  response.razorpay_subscription_id,
                razorpay_signature:
                  response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );

          alert("Mandate Created Successfully");

            navigate("/dashboard");
          } catch (err) {
            alert("Mandate verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Mandate setup cancelled.");
          },
        },

        theme: {
          color: "#003399",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {

        alert(response.error.description);
      });

      rzp.open();
    } catch (err) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Unable to create subscription."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
        <div className="card">
          <div style={styles.logoContainer}>
            <img 
              src="/images/rocketmoney-logo.png" 
              alt="Take Personal Loan in India with MoneyRocket" 
              style ={styles.logoImage}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              textAlign: "center",
            }}
          >
          <h2>Setup AutoPay</h2>

          <p style={{ marginTop: 20 }}>
            Loan ID : <strong>{loanId}</strong>
          </p>

          <button
            onClick={startMandate}
            disabled={loading}
            style={{
              marginTop: 30,
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#003399",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Please wait..." : "Create eMandate"}
          </button>
      </div>
    </div>
    </div>
    </div>
  );
  
}

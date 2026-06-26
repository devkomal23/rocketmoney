import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function PayMandate() {
  const { loanId } = useParams();
  const navigate = useNavigate();

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

            console.log(verify.data);

            alert("Mandate Created Successfully");

            navigate("/dashboard");
          } catch (err) {
            console.log(err.response?.data);
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
        console.log(response.error);

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
    <div
      style={{
        minHeight: "100vh",
        background: "#d9e8f8",
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
          boxShadow: "0 5px 20px rgba(0,0,0,.15)",
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
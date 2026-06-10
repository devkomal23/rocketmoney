import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function VerifyKyc() {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
      const API_URL = import.meta.env.VITE_API_URL;


    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

const uploadSelfie = async () => {
    try {
        const blob = await fetch(image).then(res => res.blob());

        const formData = new FormData();
        formData.append("image", blob, "selfie.jpg");

        const response = await axios.post(
            `${API_URL}/upload-selfie`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        console.log(response.data);
        alert("Selfie uploaded successfully!");

    } catch (error) {
        console.error("Upload failed:", error);

        if (error.response) {
            console.log("Response Data:", error.response.data);
            console.log("Status:", error.response.status);
        }

        alert(error.response?.data?.message || error.message);
    }
};
    return (
        <div style={styles.container}>
            <div style={styles.card}>
        
                <div style={styles.logoContainer}>
                <img 
                    src="/images/rocketmoney-logo.png" 
                    alt="Take Personal Loan in India with RocketMoney" 
                    style ={styles.logoImage}
                />
                </div>
                <div className = "scrollable-content" style = {styles.scrollableContainer}>

                <div className="kyc-container">
                    <div className="kyc-card">

                        {!image ? (
                            <>
                                <div className="camera-frame">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width={400}
                                    />
                                </div>
                                <h2>Selfie Verification</h2>
                                <p className="kyc-subtitle">
                                    Please capture a clear selfie for identity verification.
                                </p>


                                <button className="btn-primary" onClick={capture}>
                                    📸 Capture Selfie
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="preview-frame">
                                    <img src={image} alt="selfie" />
                                </div>

                                <div className="button-group">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setImage(null)}
                                    >
                                        🔄 Retake
                                    </button>

                                    <button
                                        className="btn-success"
                                        onClick={uploadSelfie}
                                    >
                                        ✅ Confirm & Upload
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#cbdcf0', // Soft backdrop to mimic screen background
    fontFamily: 'system-ui, -apple-system, sans-serif',
    height:'100dvh'
  },
  card: {
    width: '360px',
    backgroundColor: '#FFF', 
    borderRadius: '32px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxHeight:'680px',
    height:'100dvh'
  },
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
  bannerArea: {
    width: '100%',
    height: '220px',
    background: '#5c4cee',
    borderRadius: '1rem',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
  },
  bannerImage:{
    width:'100%',
    height:'auto',
    object:'contain'
  },
  form: { display: 'flex', flexDirection: 'column',marginTop:'45px' },
  signInLabel: { fontSize: '15px', fontWeight: '700', color: '#1a2b49', marginBottom: '10px' },
  inputGroup: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid',
    alignItems: 'center',
    padding: '0 16px',
    height: '52px',
    transition: 'border-color 0.2s',
  },
  countryCode: { display: 'flex', alignItems: 'center', gap: '4px', color: '#1a2b49', fontWeight: '700', fontSize: '15px' },
  dropdownArrow: { fontSize: '10px', color: '#718096' },
  divider: { width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 12px' },
  inputField: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '500' },
  helperText: { fontSize: '11px', color: '#718096', marginTop: '8px', marginBottom: '24px', lineHeight: '1.4' },
  errorText: { fontSize: '11px', color: '#d93838', marginTop: '8px', marginBottom: '24px', fontWeight: '600' },
  submitButton: {
    border: 'none',
    height: '50px',
    borderRadius: '25px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 82, 204, 0.15)',
  },
};
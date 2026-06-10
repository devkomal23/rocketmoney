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
                        {!image ? (
                            <>
                                <Webcam 
                                    audio={false} 
                                    ref={webcamRef} 
                                    screenshotFormat="image/jpeg" 
                                    width={400}
                                />
                                <br />
                                <button onClick={capture}>Capture Selfie</button>
                            </>
                        ) : (
                            <>
                                <img src={image} alt="selfie" style={{ width: '400px' }} />
                                <br />
                                <button onClick={() => setImage(null)}>Retake</button>
                                <button onClick={uploadSelfie}>Confirm & Upload</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
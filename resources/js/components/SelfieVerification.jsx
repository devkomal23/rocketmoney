import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function VerifyKyc() {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    const uploadSelfie = async () => {
        try {
            // Ensure the route matches your Laravel API routes
            await axios.post('/upload-selfie', { image: image });
            alert('Selfie uploaded successfully!');
        } catch (error) {
            console.error("Upload failed", error);
            alert('Failed to upload selfie.');
        }
    };

    return (
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
    );
}
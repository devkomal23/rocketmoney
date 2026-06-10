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
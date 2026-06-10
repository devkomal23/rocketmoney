import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const SelfieCapture = () => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    const uploadSelfie = async () => {
        // Send base64 image string to Laravel
        await axios.post('/upload-selfie', { image: image });
        alert('Selfie uploaded!');
    };

    return (
        <div>
            {!image ? (
                <>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                    <button onClick={capture}>Capture Selfie</button>
                </>
            ) : (
                <>
                    <img src={image} alt="selfie" />
                    <button onClick={() => setImage(null)}>Retake</button>
                    <button onClick={uploadSelfie}>Confirm & Upload</button>
                </>
            )}
        </div>
    );
};
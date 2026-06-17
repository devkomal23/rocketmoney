    import React, { useRef, useState, useEffect } from 'react';
    import Webcam from 'react-webcam';
    import axios from 'axios';
    import { useNavigate,useLocation } from 'react-router-dom'; 
    import { FaceDetection } from "@mediapipe/face_detection";
    import * as faceapi from "face-api.js";

    export default function VerifyKyc() {
        const webcamRef = useRef(null);
        const [image, setImage] = useState(null);
        const API_URL = import.meta.env.VITE_API_URL;
        const [countdown, setCountdown] = useState(5);
        const [uploadSuccess, setUploadSuccess] = useState(false);
        const navigate = useNavigate(); // Hook for navigation
        const [retryCount, setRetryCount] = useState(0);
        const [alertMessage, setAlertMessage] = useState("");
        const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
 try {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            setModelsLoaded(true);
            console.log("Face model loaded");
        } catch (err) {
            console.error("Model load failed:", err);
        }        };

        loadModels();
    }, []);
    const detectFace = async (imageSrc) => {
            if (!modelsLoaded) {
        console.log("Model not loaded yet");
        return false;
    }

        const img = new Image();
        img.src = imageSrc;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const detection = await faceapi.detectSingleFace(
            img,
    new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.2
    })
        );
    console.log("Detection:", detection);

        return !!detection;
    };

    const autoCapture = () => {
        let count = 5;

        setCountdown(count);

        const timer = setInterval(async () => {
            count--;

            if (count >= 0) {
                setCountdown(count);
            }

            if (count === 0) {
                clearInterval(timer);

                const imageSrc = webcamRef.current?.getScreenshot();

                if (!imageSrc) {
                    autoCapture();
                    return;
                }

                const result = await isImageGood(imageSrc);

                if (result.valid) {
                    setAlertMessage("");
                    setRetryCount(0);
                    setImage(imageSrc);
                } else {
                    if (retryCount >= 3) {
                        setAlertMessage(
                            "Unable to capture a clear selfie. Please click Retake."
                        );
                        return;
                    }

                    setRetryCount(prev => prev + 1);
                    setAlertMessage(result.message);

                    setTimeout(() => {
                        autoCapture();
                    }, 1000);
                }
            }
        }, 1000);
    };
    const isImageBlurred = (imageSrc) => {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const data = imageData.data;

                let variance = 0;
                let mean = 0;
                let count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const gray =
                        (data[i] + data[i + 1] + data[i + 2]) / 3;

                    mean += gray;
                    count++;
                }

                mean /= count;

                for (let i = 0; i < data.length; i += 4) {
                    const gray =
                        (data[i] + data[i + 1] + data[i + 2]) / 3;

                    variance += Math.pow(gray - mean, 2);
                }

                variance /= count;

                resolve(variance < 300);
            };

            img.src = imageSrc;
        });
    };
    const isImageGood = async (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        let brightness = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
            brightness +=
                (imageData.data[i] +
                    imageData.data[i + 1] +
                    imageData.data[i + 2]) / 3;
        }

        brightness =
            brightness / (imageData.data.length / 4);

        if (brightness < 50) {
            return {
                valid: false,
                message:
                    "Lighting is too low. Please move to a brighter area."
            };
        }
          

        const blurred = await isImageBlurred(imageSrc);

        if (blurred) {
            return {
                valid: false,
                message:
                    "Image is blurry. Please keep your face steady and look at the camera."
            };
        }

        return {
            valid: true,
            message: ""
        };
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
                setUploadSuccess(true);
                setTimeout(() => {
                    navigate('/AccountAggregator');
                }, 2000);

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
<<<<<<< HEAD
                        src="/images/MoneyRocket-logo.png" 
=======
                        src="/images/rocketmoney-logo.png" 
>>>>>>> 51cdbbb (bank account info)
                        alt="Take Personal Loan in India with MoneyRocket" 
                        style ={styles.logoImage}
                    />
                    </div>
                    <div className = "scrollable-content p-0" style = {styles.scrollableContainer}>

                    <div className="kyc-container">
                        <div className="kyc-card">
                                                                {alertMessage && (
                                            <div className="alertMessages">
                                                {alertMessage}
                                            </div>
                                        )}

                            {!image && (
                                <div className="capture-badge">
                                    <div className="capture-title">
                                        📸 Capturing selfie in <strong>{countdown}s</strong>
                                    </div>
                                </div>                        
                            )}
                            {!image ? (
                                <>
                                    <div className="camera-frame">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            onUserMedia={autoCapture}
                                            videoConstraints={{
                                                    facingMode: "user",
                                                    width: 640,
                                                    height:480
                                                }}
                                        />
                                    </div>
                                    <h5>Selfie Verification</h5>
                                    <p className="kyc-subtitle">
                                        Please capture a clear selfie for identity verification.
                                    </p>
                                </>
                            ) : (
                                <>
                                <div className="preview-frame">
                                    <img src={image} alt="selfie" />
                                </div>
                                    {uploadSuccess && (
                                        <div className="success-message">
                                            <div className="success-title">
                                                ✅ Selfie Verified Successfully
                                            </div>

                                            <div className="success-subtitle">
                                                Your identity verification is being processed.
                                            </div>
                                        </div>
                                    )}   
                                    <div className="button-group selfie-button-group">
        {!uploadSuccess && (
            <>
                <button
                    className="btn-selfie btn-retake "
    onClick={() => {
        setImage(null);
        autoCapture();
    }}                disabled={uploadSuccess}

                    
                >
                    📸 Retake
                </button>

                <button
                    className="btn-selfie btn-success"
                    onClick={uploadSelfie}
                >
                    ✅ Confirm & Upload
                </button>
            </>
        )}
                                    </div>
                                </>
                            )}
                                <div className="capture-tips">
                                    <div>✓ Look directly at the camera</div>
                                    <div>✓ Ensure good lighting</div>
                                    <div>✓ Remove sunglasses or face coverings</div>
                                </div>

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
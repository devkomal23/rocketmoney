import React, { useState } from 'react';
import axios from 'axios';

const UploadSelfie = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append('selfie', selectedFile);

    try {
      // The API_URL should match your Laravel route
      const response = await axios.post(
        'https://rocketmoney-1.onrender.com/api/upload-selfie',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // If you use Sanctum/Passport, add the Authorization header here:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      setMessage('Upload successful: ' + response.data.message);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={styles.container}>
        <div style={styles.card}>
            <div style={styles.header}>
                <h2 style={styles.pageTitle}>Complete Your Application</h2>
            </div>

            <div style={{ padding: '20px' }}>
            <h3>Upload Your Selfie</h3>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
            </div>
        </div>
    </div>
  );
};

export default UploadSelfie;
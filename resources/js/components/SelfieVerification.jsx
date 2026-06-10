import React, { useState } from 'react';
import axios from 'axios';

const UploadSelfie = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false); // Added to prevent double clicks

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('selfie', selectedFile);

    try {
      const response = await axios.post(
        'https://rocketmoney-1.onrender.com/api/upload-selfie',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setMessage('Upload successful: ' + response.data.message);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
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
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

// Define your styles here
const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  card: { border: '1px solid #ccc', borderRadius: '8px', width: '300px', textAlign: 'center' },
  header: { backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '8px 8px 0 0' },
  pageTitle: { fontSize: '18px', margin: 0 }
};

export default UploadSelfie;
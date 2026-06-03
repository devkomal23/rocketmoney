import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RegistrationPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const today = new Date();
  const minYear = today.getFullYear() - 18;
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    panNumber: '',
    fatherName: '',
    dob: null,
    email: '',
    pincode: '',
    language: 'English'
  });

  const validateField = (name, value) => {
      let msg = "";
      if ((name === "fullName" || name === "fatherName") && /[0-9]/.test(value)) {
        msg = "Digits are not allowed in name.";
      } else if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg = "Invalid email format.";
      } else if (name === "panNumber" && value && !/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(value.toUpperCase())) {
        msg = "Invalid PAN format.";
      } else if (name === "pincode" && value && !/^[0-9]{6}$/.test(value)) {
        msg = "Pincode must be 6 digits.";
      }
      setErrors(prev => ({ ...prev, [name]: msg }));
    };

    const isFormValid = useMemo(() => {
      const allFieldsFilled = formData.fullName && formData.fatherName && formData.email && formData.panNumber && formData.pincode && formData.dob;
      const hasNoErrors = Object.values(errors).every(err => !err);
      return !!(allFieldsFilled && hasNoErrors);
    }, [formData, errors]);
    
    const getEighteenYearsAgo = () => {
      const today = new Date();
      const date = new Date(today);
      date.setFullYear(today.getFullYear() - 18);
      return date;
    };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === "panNumber") {
      value = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dob: date }));

    if (date) {
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const isUnderage = age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < date.getDate());
      
      setErrors(prev => ({ 
        ...prev, 
        dob: isUnderage ? "You must be 18 years or older." : "" 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);

    const ageDiff = today.getFullYear() - formData.dob.getFullYear();
    const monthDiff = today.getMonth() - formData.dob.getMonth();
    const isUnderage = ageDiff < 18 || (ageDiff === 18 && monthDiff < 0) || (ageDiff === 18 && monthDiff === 0 && today.getDate() < formData.dob.getDate());
    
    if (isUnderage) {
      alert("You must be 18 years or older.");
      return;
    }

    const formattedDob = `${formData.dob.getFullYear()}-${String(formData.dob.getMonth() + 1).padStart(2, '0')}-${String(formData.dob.getDate()).padStart(2, '0')}`;
    const payload = {
      mobile_number: location.state?.mobile, 
      full_name: formData.fullName,
      pan_number: formData.panNumber.toUpperCase(),
      father_name: formData.fatherName,
      dob: formattedDob,
      email: formData.email,
      pincode: formData.pincode,
      language: formData.language,
      
    };

    try {
      const response = await fetch(`${API_URL}/complete-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && result.success) {
          //setTimeout(() => navigate('/assesmentFee'), 2000);
          navigate('/verify-kyc', { state: { from: 'application' } });    
      } else {
          alert(result.message || "Failed to submit application.");
      }
    } catch (err) {
      alert("Something went wrong. Please check your connection.");
    }
  };

        useEffect(() => {
          const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
              setIsOpen(false);
            }
          };
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
          <div style={styles.container}>
            <div style={styles.card}>
              <div style={styles.header}>
                <h2 style={styles.pageTitle}>Complete Your Application</h2>
              </div>
              
              <div style={styles.formContainer}>
                <label style={styles.label}>Full Name as per PAN *</label>
                <input name="fullName" className="input-field" style={styles.input} placeholder="Enter your full name" onChange={handleChange} />
                {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                <label style={styles.label}>Pan Card Number *</label>
                <input name="panNumber" className="input-field"style={styles.input} placeholder="ABCDE1234F" maxLength="10" onChange={handleChange} />
                {errors.panNumber && <span style={styles.errorText}>{errors.panNumber}</span>}
                <label style={styles.label}>Father's Name as per PAN *</label>
                <input name="fatherName" className="input-field" style={styles.input} placeholder="Enter your father name" onChange={handleChange} />
                {errors.fatherName && <span style={styles.errorText}>{errors.fatherName}</span>}
                <div className="relative w-full">
                  <label style={styles.label}>Date of Birth *</label>
                  <DatePicker
                    selected={formData.dob}
                    onChange={(date) => handleDateChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showYearDropdown={true}
                    scrollableYearDropdown={true}
                    yearDropdownItemNumber={80}
                    showMonthDropdown 
                    dropdownMode="select"
                    popperPlacement="bottom-start" 
                    className="w-full border border-gray-300 rounded-lg p-3 input-field" 
                    calendarClassName="custom-modern-calendar"
                    maxDate={getEighteenYearsAgo()}  
                  />
                </div>         
              <label style={styles.label}>Email *</label>
                <input name="email" className="input-field" style={styles.input} placeholder="Enter email ID" onChange={handleChange} />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}

                <label style={styles.label}>Pincode *</label>
                <input name="pincode" className="input-field" style={styles.input} placeholder="Enter your 6-digit pincode" maxLength="6" onChange={handleChange} />
                {errors.pincode && <span style={styles.errorText}>{errors.pincode}</span>}

                <label style={styles.label}>Agreement Document Language</label>
                <select name="language" style={styles.input} onChange={handleChange} className="input-field">
                  <option>English</option>
                  <option>Hindi</option>
                </select>

                <div style={styles.warningBox}>
                  <strong>IMPORTANT*</strong> Your PAN, Full Name and Date of Birth help us verify your details quickly. Please ensure you enter correct information.
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid} 
                  style={{ 
                    ...styles.proceedButton, 
                    backgroundColor: (isFormValid && !isLoading) ? '#6200ea' : '#cbd5e0',
                    cursor: (isFormValid && !isLoading) ? 'pointer' : 'not-allowed',
                    opacity: (isFormValid && !isLoading) ? 1 : 0.7,
                    transition: 'background-color 0.3s ease'            
                  }}
                >
                {isLoading ? "Processing..." : "Proceed →"}          </button>
              </div>
            </div>
          </div>
        );
    }

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f9', padding: '20px' },
  card: { width: '400px', backgroundColor: '#FFF', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #0f52ba 0%, #1e90ff 100%)', height: '100px', padding: '20px', display: 'flex', justifyContent: 'center' },
  pageTitle: { color: 'white', margin: 'auto' },
  formContainer: { padding: '0 30px 30px 30px',
    overflowY: 'auto',
    height: '600px'},
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568', display: 'block', marginTop: '15px', marginBottom: '5px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' },
  warningBox: { backgroundColor: '#fffaf0', border: '1px solid #feebc8', color: '#744210', padding: '12px', fontSize: '11px', borderRadius: '8px', marginTop: '20px' },
  proceedButton: { width: '100%', marginTop: '20px', padding: '15px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '700' },
  errorText: { color: 'red', fontSize: '10px', marginTop: '4px', display: 'block' }
};
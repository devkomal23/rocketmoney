import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 1. Import these
import SignIn from './components/signIn';
import OTPVerification from './components/OTPVerification';
import Completeapplication from './components/CompleteApplication';
import Dashboard from './components/Dashboard';
import '../css/app.css'; 
import AssessmentFee from './components/AssessmentFee';
import VerifyKyc from './components/VerifyKyc';
import KycVerification from './components/KycVerification';
import AccountAggregator from './components/AccountAggregator';
import Consent from './components/Consent';



const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/OTPVerification" element={<OTPVerification />} />
                <Route path="/complete_application" element={<Completeapplication />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assesmentFee" element={<AssessmentFee />} />
                <Route path="/verify-kyc" element={<VerifyKyc />} />
                <Route path="/kycverification" element={<KycVerification />} />    
                <Route path ="/AccountAggregator" element={<AccountAggregator/>}/> 
                <Route path ="/Consent" element={<Consent/>}/>    
            </Routes>
        </BrowserRouter>
    );
};
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />); 
}

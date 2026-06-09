import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConsentHub from './ConsentHub';

export default function ConsentPage() {
    const navigate = useNavigate();
    return <ConsentHub onConsentAccepted={() => navigate('/kycverification')} />;
}
import { useParams, useNavigate } from 'react-router-dom';

export default function LoanDocument() {
    const { loanId } = useParams();
    const navigate = useNavigate();

    const pdfUrl =
        `${import.meta.env.VITE_API_URL}/download-loan/${loanId}`;

    const handleSubmit = () => {
        navigate(`/pay-mandate/${loanId}`);
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h2>Your Loan Agreement</h2>
                </div>

                <iframe
                    src={pdfUrl}
                    className="w-full h-[600px] border"
                    title="Loan Agreement"
                />

                <div className="mt-4">
                    <button
                        onClick={handleSubmit}
                        className="proceedButton"
                    >
                        Sign & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
}
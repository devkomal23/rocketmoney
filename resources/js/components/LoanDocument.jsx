import { useParams } from 'react-router-dom';

export default function LoanDocument() {
    const { loanId } = useParams();
    const pdfUrl = `${import.meta.env.VITE_API_URL}/download-loan/${loanId}`;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Loan Agreement</h2>
            
            <iframe 
                src={pdfUrl} 
                className="w-full h-[600px] border"
            />
            
            <a href="\dashboard"  className="mt-4 block bg-blue-600 text-white py-2 px-4 rounded">
                Sign & Proceed
            </a>
        </div>
    );
}
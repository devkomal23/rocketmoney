import { useParams } from 'react-router-dom';

export default function LoanDocument() {
    const { loanId } = useParams();
    const pdfUrl = `${import.meta.env.VITE_API_URL}/download-loan/${loanId}`;

    return (
        <div className='container'>
            <div className='card'>
                <div className='header'>
                    <h2 className="text-xl font-bold mb-4">Your Loan Agreement</h2>
                </div>
                <div className="scrollable-content overflow-y-auto">

                    <iframe 
                        src={pdfUrl} 
                        className="w-full h-[600px] border"
                    />
                    <div>           
                         <button 
                         onClick={(e) => handleSubmit(e)}   className='proceedButton'>Sign & Proceed</button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
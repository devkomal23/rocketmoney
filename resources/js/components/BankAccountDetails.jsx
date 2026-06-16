import react,{useState} from 'react';
import axios from 'axios';


export default function BankAccountDetails(){
    const [formData,setFormData]= useState({name:'',accNo:'',confirmAccNo:'',ifsc:'',bankName:''});
    const [message,setMessage] = useState('');

const handleSubmit = async()=>{
    if(formData.accNo !== formData.confirmAccNo){
        alert("Account number not match!");
        return;
    }

    try{
        const response = await axios.post(`${API_URL}/verify-bank`,formData);
        setMessage(response.data.message);
        

    }catch(error){
        setMessage("Verification failed.Please check your details.");
    }

};

return (
        <div className="container">
            <div className="card flex flex-col h-[720px]">
                <div className="header">
                    <h1>Bank Account Details</h1>
                </div>
                <div className="scrollable-content flex-grow overflow-y-auto">
                    {/* 2. Connect inputs to state using onChange */}
                    <label>Enter Account Holder Name</label>
                    <input 
                        type="text" 
                        placeholder="as per Bank records" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />

                    <label>Account Number</label>
                    <input 
                        type="text" 
                        placeholder="Enter Your Account Number" 
                        value={formData.accNo}
                        onChange={(e) => setFormData({...formData, accNo: e.target.value})}
                    />

                    <label>Confirm Account Number</label>
                    <input 
                        type="text" 
                        placeholder="Re-enter Your Account Number" 
                        value={formData.confirmAccNo}
                        onChange={(e) => setFormData({...formData, confirmAccNo: e.target.value})}
                    />

                    <label>IFSC Code</label>
                    <input 
                        type="text" 
                        placeholder="SBI0000001" 
                        value={formData.ifsc}
                        onChange={(e) => setFormData({...formData, ifsc: e.target.value})}
                    />

                    <label>Bank Name</label>
                    <input 
                        type="text" 
                        placeholder="Bank Name" 
                        value={formData.bankName}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    />

                    <button onClick={handleSubmit}>Verify Bank Details</button>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}
import react,{useState} from 'react';
import axios from 'axios';


export default function BankAccountDetails(){
const handleSubmit = async()=>{
    const [formData,setFormData]= useState({name:'',accNo:'',confirmAccNo:'',ifsc:'',bankName:''});
    const [message,setMessage] = useState('');
    if(formData.accNo !== formData.confirmAccNo){
        alert("Account number not match!");
        return;
    }

    try{
        const response = await axios.post('/verify-bank',formData);
        setMessage(response.data.message);
        

    }catch(error){
        setMessage("Verification failed.Please check your details.");
    }

};

return(
    <div className="container">
        <div className="card flex flex-col h-[720px]">
            <div className="header">
                <div className ="header_info">
                    <h1>Bank Account Details</h1>
                </div>
            </div>
            <div className="scrollable-content flex-grow overflow-y-auto">
                <label>Enter Account Holder Name</label>
                <input type="text" placeholder="as per Bank records" ></input>

                <label>Account Number</label>
                <input type="text" placeholder="Enter Your Account Number" ></input>


                <label>Confirm Account Number</label>
                <input type="text" placeholder="Re-enter Your Account Number" ></input>


                <label>IFSC Code</label>
                <input type="text" placeholder="SBI0000001" ></input>

                <label>Bank Name</label>
                <input type="text" placeholder="Bank Name" ></input>

                <div className="security-notice">
        🔒          Your bank details are encrypted and securely stored.
                </div>

                <button onClick={handleSubmit} >Verify Bank Details</button>
                <p>{message}</p>

            </div>
        </div>
    </div>



);
}
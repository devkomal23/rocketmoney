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
<div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bank Account Details</h2>
    
    <div className="space-y-4">
      {[
        { label: "Account Holder Name *", placeholder: "As per bank records" },
        { label: "Account Number *", placeholder: "Enter account number" },
        { label: "Confirm Account Number *", placeholder: "Re-enter account number" },
        { label: "IFSC Code *", placeholder: "SBIN0001234" },
        { label: "Bank Name", placeholder: "Bank Name" }
      ].map((field, idx) => (
        <div key={idx} className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>

    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center mt-6">
      <span className="mr-2">🔒</span> Your bank details are encrypted and securely stored.
    </div>

    <button className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-md">
      Verify Bank Account →
    </button>
  </div>
</div>            </div>
        </div>
    );
}
import react,{useState} from 'react';
export default function ApprovalPage() {
const [selectedDay, setSelectedDay] = useState("");

const dueDateOptions = [
  { label: "1st of the month", value: "01" },
  { label: "10th of the month", value: "10" }
];
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-bold">Congratulations!</h2>
          <p className="text-blue-100 text-sm mb-6">YOUR LOAN IS APPROVED</p>
          <h1 className="text-5xl font-extrabold">₹ 1,000<span className="text-lg text-blue-200">/-</span></h1>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <DetailRow label="Amount Approved" value="₹ 1,000" />
          
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-600">Select Due Date</label>
  <select 
    value={selectedDay} 
    onChange={(e) => setSelectedDay(e.target.value)}
    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
  >
    <option value="" disabled>Select a date</option>
    {dueDateOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
2.
          <DetailRow label="Tenure" value="NA" />
          <DetailRow label="Processing Fees" value="₹ 150 ( GST + ₹ 27 )" />
          <DetailRow label="Interest Rate" value="0.12%" />
        </div>

        {/* Action Button */}
        <div className="p-6">
          <button className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold hover:bg-blue-800 transition">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for rows
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0 border-gray-100">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}
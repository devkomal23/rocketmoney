import axios from "axios";
export default function VerifyKyc(){
const startMandate = async () => {

    const {data} = await axios.post(
        `${API_URL}/create-subscription`,
        {
            loan_id: loanId
        }
    );

    const options = {

        key: data.key,

        subscription_id: data.subscription_id,

        name: "MoneyRocket",

        description: "Loan EMI AutoPay",

        handler: function(response){

            console.log(response);

            alert("Mandate Created Successfully");

        },

        theme:{
            color:"#003399"
        }

    };

    const rzp = new window.Razorpay(options);

    rzp.open();

}
}
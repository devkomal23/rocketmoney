<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; }
        .pdf_header { text-align: center; margin-bottom: 20px;color:blue;border-bottom:1px solid blue; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table td, .table th { border: 1px solid #000; padding: 8px; }
        footer {
        position: fixed; 
        bottom: 0px; 
        left: 0px; 
        right: 0px; 
        height: 80px; 
        text-align: center;
        font-size: 9px;
        border-top: 1px solid blue;
        padding-top: 5px;
    }
    </style>
</head>
<body>
    <div class="pdf_header">
        <h2>FINANCE LOAN APPLICATION FORM</h2>
        <p>Application ID: {{ $loan->id }} | Date: {{ $date }}</p>
    </div>

    <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td><strong>Full Name</strong></td>
            <td>{{ $user->full_name }}</td> 
            <td><strong>Father Name</strong></td>
            <td>{{ $user->father_name }}</td>
        </tr>
        <tr>
            <td><strong>Purpose</strong></td>
            <td>Personal</td>
            <td><strong>Term</strong></td>
            <td>25 days</td>
        </tr>

        <tr>
            <td><strong>Sanctioned Loan Amount</strong></td>
            <td>{{ $loan->loan_amount }}</td>
            <td><strong>Interest Rate</strong></td>
            <td>5%</td>
        </tr>
        <tr>
            <td><strong>Upfront Fees(Deducted)</strong></td>
            <td>Rs.177.00(Processing Fee Rs.155+GST Rs 27)</td>
            <td><strong>Net Disbursed Amount</strong></td>
            <td>Rs.823.00</td>
        </tr>

    </table>
    <div class="card">
        <p>Here are standard clauses typically found in loan T&Cs. Note: These are for informational purposes. You should always have a legal professional review your final T&C document to ensure it complies with local regulations (such as RBI guidelines in India or your relevant jurisdiction).

           <p> 1. Eligibility & Acceptance
           <p> User Eligibility: The Borrower confirms they are at least 18 years of age, a resident of [Country], and possess the legal capacity to enter into a binding contract.

           <p> Acceptance of Terms: By submitting this loan application, the Borrower agrees to be bound by these terms, as well as the Privacy Policy and any other agreements related to the loan.

           <p> 2. Loan Disbursement & Repayment
           <p> Disbursement: The loan amount, after the deduction of applicable processing fees and taxes (as specified in the Sanction Letter), will be credited to the verified bank account provided by the Borrower.

           <p> Repayment Obligation: The Borrower unconditionally agrees to repay the total loan amount, including interest and any applicable fees, on or before the due date.

            <p>Mode of Payment: Repayment shall be made via [e-NACH, UPI, Bank Transfer] as facilitated through the app/portal.

            <p>3. Interest, Fees, and Charges
            <p>Interest Rate: Interest shall be calculated at the rate of [X]% per annum (Fixed/Floating) as stated in the loan agreement.

            <p>Late Payment Penalties: In the event of a delay in repayment, the Borrower shall be liable to pay a late payment fee of [Amount/Percentage] per day/month, as determined by the lender.

            <p>Processing Fees: Non-refundable processing fees and statutory taxes (GST, etc.) are deducted at the time of disbursement.

            <p>4. Borrower Declarations & Data Consent
            <p>Accuracy of Information: The Borrower warrants that all information provided (KYC documents, bank details, income details) is true, accurate, and complete. Providing false information is a breach of contract.

            <p>Credit Bureau Consent: The Borrower grants the Lender and its partners permission to access their credit information from credit bureaus (e.g., CIBIL) for the purpose of credit evaluation and loan monitoring.

            <p>Data Usage: The Borrower consents to the processing of personal data for loan servicing, collection, and regulatory compliance as per the Privacy Policy.

            <p>5. Default and Consequences
            <p>Event of Default: Failure to repay the installment by the due date or breach of any terms shall constitute an "Event of Default."

            <p>Collection Actions: In the event of a default, the Lender reserves the right to initiate collection efforts, including the use of authorized third-party collection agencies and the reporting of the default to credit bureaus, which may negatively impact the Borrower’s credit score.

            <p>6. Cooling-Off Period
            <p>Right to Cancel: The Borrower has a cooling-off period of [X] days from the date of disbursement, during which they may cancel the loan by repaying the principal amount plus any accrued interest without additional pre-payment penalties.</p>
    </div>
    <div class="footer">
        <footer>
    <p>
        <strong>Registered Address:</strong> 909, SUKHSAGAR COMPLEX, NR. FORTUNE LANDMARK HOTEL, USMANPURA, AHMEDABAD, Gujarat, India - 380013
    </p>
    <p>
        Contact: +91 22 69718828 | Email: support@pfilfinance.com
    </p>
    <p>
        This is a computer-generated document and does not require a physical signature. 
        It is subject to the terms and conditions agreed upon at the time of loan sanctioning.
    </p>
</footer>
    </div>
</body>
</html>
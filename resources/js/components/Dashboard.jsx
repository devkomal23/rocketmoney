import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const styles = {
    container: {
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#131b25',
      overflow: 'hidden'
    },
    card: {
      width: '360px',
      height: '680px',
      backgroundColor: '#FFF',
      borderRadius: '40px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px'
    },
    logoContainer: {
        paddingLeft:'20px',
        paddingRight:'20px',
        display:'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    dbLogoImage: {
      width: '150px',
      height:'100px'
    },
    dbMenu:{
        width:'15px',
        height:'15px' 
    },
    dbBell:{
        width:'15px',
        height:'15px' 
    },
    headerContainer: {
        background: 'linear-gradient(rgb(238, 242, 248) 0%, rgb(255, 255, 255) 100%)',
    },
    header:{
        background: 'linear-gradient(180deg, #336fc9 0%, #829ae0 100%)',
        padding: '20px',
        alignItems: 'center',
        textAlign:'center',
    },
    h1:{
        color:'white',
        fontSize:'20px',
        textTransform:'uppercase'
    },
    p:{
        fontColor:'blue',
        fontWeight:'500'
    },
    loanCardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center'
    },
    loanCard: {
      width: '290px',
      backgroundColor: '#FFF',
      borderRadius: '40px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      padding:'20px'
    },
    loanTitle:{
        fontWeight:500
    },
    loanData:{
        display:'flex'
    },
    badge: { backgroundColor: '#f0fff4', color: '#38a169', fontSize: '10px', padding: '4px 8px', borderRadius: '12px' },
    metricsRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #edf2f7', paddingTop: '16px' },
    column: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '10px', color: '#718096', textTransform: 'uppercase' },
    value: { fontSize: '15px', fontWeight: 'bold', marginTop: '4px' },
    footerRow: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tagGroup: { display: 'flex', gap: '5px' },
    tag: { backgroundColor: '#389cde', padding: '4px 8px', borderRadius: '8px', fontSize: '10px',color:'white' },
    applyBtn: { background: 'none', border: 'none', color: '#8c3e07', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
      footerNav: {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '15px 0',
  borderTop: '1px solid #edf2f7',
  backgroundColor: '#FFF',
  marginTop: 'auto' // Pushes the footer to the bottom
},
navItem: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  fontSize: '10px',
  color: '#718096'
},
navIcon: {
  width: '20px',
  height: '20px'
},
pendingCard: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#a12020',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
},
cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
statusBadge: { backgroundColor: '#ebf8ff', color: '#3182ce', fontSize: '10px', padding: '4px 8px', borderRadius: '12px' },
amountText: { fontSize: '24px', fontWeight: 'bold', margin: '10px 0' },
detailsRow: { display: 'flex', gap: '20px', marginBottom: '15px' },
actionButton: { width: '100%', padding: '12px', backgroundColor: '#003399', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer' }

  };
  const API_URL = import.meta.env.VITE_API_URL;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanProducts, setLoanProducts] = useState([]); // Initialize as empty array

  const LoanDashboard = ({ loanProducts }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
        {loanProducts.length > 0 ? (
          loanProducts.map((loan) => (
            <div key={loan.id} style={styles.loanCard}>
              <div style={styles.headerRow} className = "headerRow">
                <h3 style={styles.title}>{loan.title}</h3>
                <span style={styles.badge}>● Available</span>
              </div>

              <div style={styles.metricsRow}>
                <div style={styles.column}>
                  <span style={styles.label}>Maximum amount</span>
                  <span style={styles.value}>₹{loan.max_amount.toLocaleString()}</span>
                </div>
                <div style={styles.column}>
                  <span style={styles.label}>Length of term</span>
                  <span style={styles.value}>{loan.term_days} Days</span>
                </div>
              </div>

              <div style={styles.footerRow}>
                <div style={styles.tagGroup}>
                  {loan.tags?.map((tag, i) => <span key={i} style={styles.tag}>{tag}</span>)}
                </div>
                <button style={styles.applyBtn}>Apply Now jjjjjjjjj→</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#718096' }}>No loan products found.</p>
        )}
      </div>
    );
  };
  useEffect(() => {
   // const token = localStorage.getItem('auth_token'); 

    fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', 
        //'Authorization': `Bearer ${token}` 
      }
    })
    .then((res) => {
      if (res.status === 401) {
        window.location.href = '/'; 
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then((response) => {
      if (response.success) {
        setDashboardData(response.data); 
        setLoanProducts(response.data.loan_products);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);  if (loading) return <div>Loading...</div>;
    if (!dashboardData) return <div>No data available.</div>;

  return (
    <div  style={styles.container}>

      <div style={styles.card}>
        <div style = {styles.headerContainer}>
            <div style={styles.logoContainer}>
                <img src="/images/menu.png" alt="profileView" style={styles.dbMenu}></img>
            <img 
                src="/images/rocketmoney-logo.png" 
                alt="Take Personal Loan in India with MoneyRocket" 
                style={styles.dbLogoImage}
            />
            <img src="/images/notification-bell.png" alt="Take Personal Loan in India with MoneyRocket" 
                style={styles.dbBell}/>
            </div>
            <header style={styles.header}>
                <h1 style={styles.h1}>{dashboardData.user.full_name}</h1>
                <p style={styles.p}>Here is your loan detailssssssssssss.</p>
            </header>
        </div>

        <div className="scrollable-content p-2">
                   <section className="relative flex justify-center items-center py-10">

  <div style={styles.pendingCard}>
    <div style={styles.cardHeader}>
      <span>Loan Amount</span>
      <span style={styles.statusBadge}>{dashboardData.pending_loan.status}</span>
    </div>
    <h2 style={styles.amountText}>₹{dashboardData.pending_loan.amount}</h2>
    <div style={styles.detailsRow}>
      <div>
        <p>EMI Amount</p>
        <p>₹{dashboardData.pending_loan.emi_amount}</p> {/* Changed from emi */}
      </div>
      <div>
        <p>Tenure</p>
        {/* If 'tenure' key is missing from JSON, use tenure_days if available */}
        <p>{dashboardData.pending_loan.tenure} DAYS</p> 
      </div>
    </div>
    <button style={styles.actionButton}>Sign Loan Agreement</button>
  </div>
            <LoanDashboard loanProducts={loanProducts} />
          </section>
        </div>
        <footer style={styles.footerNav}>
          <div style={styles.navItem}>
            <img src="/images/account.png" alt="Home" style={styles.navIcon} />
            <span>Home</span>
          </div>
          <div style={styles.navItem}>
            <img src="/images/money-bag.png" alt="My Loan" style={styles.navIcon} />
            <span>My Loan</span>
          </div>
          <div style={styles.navItem}>
            <img src="/images/history.png" alt="History" style={styles.navIcon} />
            <span>History</span>
          </div>
          <div style={styles.navItem}>
            <img src="/images/account.png" alt="Profile" style={styles.navIcon} />
            <span>Profile</span>
          </div>
        </footer>
    </div>
    </div>
  );
};
const styles = {
  badge: { backgroundColor: '#f0fff4', color: '#38a169', fontSize: '10px', padding: '4px 8px', borderRadius: '12px' },
  metricsRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #edf2f7', paddingTop: '16px' },
  column: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '10px', color: '#718096', textTransform: 'uppercase' },
  value: { fontSize: '15px', fontWeight: 'bold', marginTop: '4px' },
  footerRow: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tagGroup: { display: 'flex', gap: '5px' },
  tag: { backgroundColor: '#f7fafc', padding: '4px 8px', borderRadius: '8px', fontSize: '9px' },
};

export default Dashboard;
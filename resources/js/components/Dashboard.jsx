//import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const styles = {
    container: {
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#131b25',
      overflow: 'hidden',
      position:'relative'
    },
    card: {
      width: '360px',
      height: '680px',
      backgroundColor: '#f4eeee',
      borderRadius: '40px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position:'relative'
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
    header: {
    background: 'linear-gradient(rgb(51, 111, 201) 0%, rgb(130, 154, 224) 100%)',
    padding: '50px',
    textAlign: 'center',
    },
    h1:{
        color:'white',
        fontSize:'20px',
    },
    p:{
        fontColor:'blue',
        fontWeight:'500',
        color:'white'
    },
    loanCardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
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
    label: { fontSize: '10px', color: '#718096' },
    value: { fontSize: '15px', fontWeight: 'bold', marginTop: '4px' },
    footerRow: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tagGroup: { display: 'flex', gap: '5px' },
    tag: { backgroundColor: '#389cde', padding: '4px 8px', borderRadius: '8px', fontSize: '10px',color:'white' },
    applyBtn: { background: 'none', border: 'none', color: '#3182ce', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
      footerNav: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '15px 0',
        borderTop: '1px solid #edf2f7',
        backgroundColor: '#FFF',
        marginTop: 'auto' // Pushes the footer to the bottom
      },
    activeIndicator: {
        position: 'absolute',
        bottom: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '30px',
        height: '3px',
        backgroundColor: '#020917',
        borderRadius: '2px'
      },
      navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        fontSize: '10px',
        color: '#718096',
        position: 'relative', // Essential for the indicator to sit at the bottom
        paddingBottom: '10px'
      },
      navIcon: {
      width: '20px',
      height: '20px'
    },
    pendingCard: {
        margin: ' 0 20px',
        padding: '20px',
        backgroundColor: '#FFF',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'relative',
        top:'-50px'

    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    statusBadge: { backgroundColor: '#ebf8ff', color: '#3111d1', fontSize: '10px', padding: '4px 8px', borderRadius: '12px',fontWeight:'900' },
    amountText: { fontSize: '24px', fontWeight: 'bold', margin: '10px 0' },
    detailsRow: { display: 'flex', gap: '20px', marginBottom: '15px',justifyContent:'space-between' },
    actionButton: { width: '100%', padding: '12px', backgroundColor: '#003399', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer' },
    menuOverlay: {
      position: 'absolute',
      top: 0, left: 0, width: '70%', height: '100%',
      background: 'linear-gradient(180deg,#1E2F78 0%,#2446B5 100%)',      
      zIndex: 10,
      color:'white'
    },
    menuContent: {
      display: 'flex', flexDirection: 'column', gap: '20px'
    },
    menuContentItem:{
      display:'flex',
      flexDirection:'row',
      gap:'15px',
      alignItems:'center',
      padding:'10px 20px',
      border:'1px solid rgba(255,255,255,.35)',
      borderRadius:'10px',
      marginBottom:'12px'
    },
    closeBtn:{
      position: 'absolute',
      top: '9px',
      right: '12px',
      padding: '5px 9px',
      background:'rgba(255,255,255,.12)',
      borderRadius: '50%',
      fontSize: '10px',
      width:'36px',
      height:'36px',

    },
    sideMenu:{
      padding:'0px 20px',
      paddingBottom:'30px'
    },
    profileSection:{
      display:'flex',
      flexDirection:'column',
      flexWrap:'wrap',
      alignItems:'center',
      paddingBottom:'30px',
      background:'linear-gradient(180deg, var(--color-blue-900) 0%, var(--color-blue-950) 100%)'
    },
    profileImg:{
      height:'100px',
      width:'auto',
      marginTop:'60px'
    }
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanProducts, setLoanProducts] = useState([]); // Initialize as empty array
  const navigate = useNavigate();
  const getCurrentPage = () => {
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname === '/my-loans') return 'my-loans';
    if (location.pathname === '/history') return 'history';
    if (location.pathname === '/profile') return 'profile';
    return 'dashboard';
  };
  const Footer = ({ currentPage, onNavigate }) => {
  const activeColor = '#010814';
  const inactiveColor = '#718096';

  // Helper to determine style
  const getStyle = (pageName) => ({
    ...styles.navItem,
    color: currentPage === pageName ? activeColor : inactiveColor
  });


  return (
    <footer style={styles.footerNav}>
      <div style={getStyle('dashboard')} onClick={() => onNavigate('/dashboard')}>
        <img src="/images/account.png" alt="Home" style={styles.navIcon} />
        <span>Home</span>
        {currentPage === 'dashboard' && <div style={styles.activeIndicator} />}
      </div>
      <div style={getStyle('my-loans')} onClick={() => onNavigate('/my-loans')}>
        <img src="/images/loan.png" alt="My Loan" style={styles.navIcon} />
        <span>My Loan</span>
        {currentPage === 'my_loans' && <div style={styles.activeIndicator} />}
      </div>
      <div style={getStyle('history')} onClick={() => onNavigate('/history')}>
        <img src="/images/history.png" alt="History" style={styles.navIcon} />
        <span>History</span>
        {currentPage === 'history' && <div style={styles.activeIndicator} />}
      </div>
      <div style={getStyle('profile')} onClick={() => onNavigate('/profile')}>
        <img src="/images/account.png" alt="Profile" style={styles.navIcon} />
        <span>Profile</span>
        {currentPage === 'profile' && <div style={styles.activeIndicator} />}
      </div>
    </footer>
  );
};

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
                <button style={styles.applyBtn}>Apply Now →</button>
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
const token = localStorage.getItem("authToken");    console.log(token);

    fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json', 
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
      const handleSubmit = async()=>{
    try{
      navigate(`/loan-document/${dashboardData.pending_loan.id}`);
    }catch(error){
      console.log("error",error);
    }
  };


  return (
    <div  style={styles.container}>

      <div style={styles.card}>
        <div style = {styles.headerContainer}>
            <div style={styles.logoContainer}>
              <div onClick={() => setIsMenuOpen(true)}>
                  <img src="/images/menu.png" alt="profileView" style={styles.dbMenu} ></img>
                </div>
                {isMenuOpen && (
                  <div style={styles.menuOverlay}>
                    <div style={styles.menuContent}>
                     <div style={styles.profileSection}>
                        <button style={styles.closeBtn} onClick={() => setIsMenuOpen(false)}>✕</button>

                        <img style={styles.profileImg} src="/images/default_profile_picture.png" alt="profile picture"/>
                        <p style={styles.h1}>{dashboardData.user.full_name}</p>
                        <h7 style={styles.h7}>Welcome Back</h7>

                      </div>
                      <div style={styles.sideMenu}>
                        <div  style={styles.menuContentItem} onClick={() => navigate('/my-loans')}>        
                          <img src="/images/loan_white.png" alt="Home" style={styles.navIcon} />
                            <span>My Loan</span>
                        </div>
                        <div style={styles.menuContentItem} onClick={() => navigate('/history')}>
                          <img src="/images/history_white.png" alt="Home" style={styles.navIcon} />
                            <span>History</span>
                        </div>
                        <div style={styles.menuContentItem} onClick={() => {/* Logout logic */}}>
                          <img src="/images/logout_white.png" alt="Home" style={styles.navIcon} />
                            <span>Logout</span>
                        </div>
                        </div>
                    </div>
                  </div>
                )}
                <img 
                    src="/images/rocketmoney-logo.png" 
                    alt="Take Personal Loan in India with MoneyRocket" 
                    style={styles.dbLogoImage}
                />
                <img src="/images/notification-bell.png" alt="Take Personal Loan in India with MoneyRocket" 
                    style={styles.dbBell}/>
            </div>
        </div>
        <div className="scrollable-content ">
            <header style={styles.header}>
                <h1 style={styles.h1}>{dashboardData.user.full_name}</h1>
                <p style={styles.p}>Here is your loan details.</p>
            </header>

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
            <button style={styles.actionButton} onClick={handleSubmit}>Sign Loan Agreement</button>
          </div>

         <section className="relative flex justify-center items-center py-10">
            <LoanDashboard loanProducts={loanProducts} />
          </section>
        </div>
        <Footer 
          currentPage={getCurrentPage()} 
          onNavigate={navigate} 
        />
    </div>
    </div>
  );
};
const styles = {
  badge: { backgroundColor: '#f0fff4', color: '#38a169', fontSize: '10px', padding: '4px 8px', borderRadius: '12px' },
  metricsRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #edf2f7', paddingTop: '16px' },
  column: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '10px', color: '#718096',  },
  value: { fontSize: '15px', fontWeight: 'bold', marginTop: '4px' },
  footerRow: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tagGroup: { display: 'flex', gap: '5px' },
  tag: { backgroundColor: '#f7fafc', padding: '4px 8px', borderRadius: '8px', fontSize: '9px' },
  applyBtn: { background: 'none', border: 'none', color: '#3182ce', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
};

export default Dashboard;
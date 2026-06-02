import React from 'react';
import dashboardImg from '../../assets/image.jpg';





const Dashboard = () => {
  return (
    <>
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <img
        src={dashboardImg}
        alt="Dashboard"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
      />
    </div>
    </>
  );
};

export default Dashboard;

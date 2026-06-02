import React from 'react';

const leftColumnImages = [
  'https://tse4.mm.bing.net/th?id=OIP.iUCmSM_vzFgXDE7zlIMGMQHaE8&pid=Api&P=0&h=180',
  'https://tse1.mm.bing.net/th?id=OIP.lAAU4-KxOhm1mbhd0mcLVQHaE8&pid=Api&P=0&h=180',
  'https://tse1.mm.bing.net/th?id=OIP._o6UwhbNH7sN2ngC3o7oWQHaE8&pid=Api&P=0&h=180',
];

const rightColumnImages = [
  'https://tse4.mm.bing.net/th?id=OIP.NUFl7HUxP8yN6SxKlVF0eQHaEo&pid=Api&P=0&h=180',
  'https://tse4.mm.bing.net/th?id=OIP.npxSXzzm0eqq4u7YiPVSHwHaE8&pid=Api&P=0&h=180',
  'https://tse3.mm.bing.net/th?id=OIP.u4LXfpV49raOWnMoH5XP_QHaE8&pid=Api&P=0&h=180',
];

const Choose = () => {
  const animationStyles = `
    @keyframes scrollDown {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0%); }
    }

    @keyframes scrollUp {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-100%); }
    }
  `;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: '3rem 5rem',
    color: 'white',
    flexWrap: 'wrap',
  };

  const textSectionStyle = {
    maxWidth: '500px',
    paddingRight: '3rem',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    marginBottom: '1rem',
  };

  const scrollContainerStyle = {
    display: 'flex',
    gap: '2rem',
    height: '460px',
    overflow: 'hidden',
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const leftColumnStyle = {
    ...columnStyle,
    animation: 'scrollDown 15s linear infinite',
  };

  const rightColumnStyle = {
    ...columnStyle,
    animation: 'scrollUp 15s linear infinite',
  };

  const imgStyle = {
    width: '320px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={containerStyle}>
        {/* Left: Text Section */}
        <div style={textSectionStyle}>
          <h2 style={headingStyle}>Why Hire Blue-Collar Workers?</h2>
          <p style={paragraphStyle}>
            Blue-collar workers are the backbone of every thriving economy. From electricians and plumbers to factory line experts, their dedication keeps the world moving.
          </p>
          <p style={paragraphStyle}>
            Hiring local talent not only reduces costs but ensures dependable, timely work. With the right skills and experience, they’re ready to take on any challenge.
          </p>
          <p style={{ ...paragraphStyle, fontWeight: 'bold' }}>
            Empower lives. Support communities. Grow your workforce with trusted hands.
          </p>
        </div>

        {/* Right: Scrolling Images */}
        <div style={scrollContainerStyle}>
          <div style={leftColumnStyle}>
            {[...leftColumnImages, ...leftColumnImages].map((src, i) => (
              <img key={`left-${i}`} src={src} alt="worker" style={imgStyle} />
            ))}
          </div>
          <div style={rightColumnStyle}>
            {[...rightColumnImages, ...rightColumnImages].map((src, i) => (
              <img key={`right-${i}`} src={src} alt="worker" style={imgStyle} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Choose;

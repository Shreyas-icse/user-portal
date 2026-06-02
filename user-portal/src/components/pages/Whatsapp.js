import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = "916309143024"; // Replace with a valid WhatsApp number
  const message = "Hi, I found your profile and I’d like to connect!";

  const openWhatsAppChat = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={openWhatsAppChat} style={{ padding: '10px 20px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      📲 Message on WhatsApp
    </button>
  );
};

export default WhatsAppButton;

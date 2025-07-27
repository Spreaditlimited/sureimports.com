// components/WhatsAppSender.tsx
import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppSender: React.FC = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('/api/sendMessage', { to, message });
      if (response.data.success) {
        setStatus('Message sent successfully!');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('Error sending message. Please try again.');
    }
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Recipient's phone number"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        required
      />
      <button type="submit">Send Message</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default WhatsAppSender;

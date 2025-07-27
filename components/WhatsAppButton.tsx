import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Install react-icons: npm install react-icons

interface WhatsAppButtonProps {
  waID: string;
  message?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
//https://go.wa.link/sureimportsglobal

// const whatsappUrl = `https://wa.me/message/${waID}?text=${encodeURIComponent(
//   message,
// )}`;

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  waID,
  message = 'Hello! I have a question from your website.',
  position = 'bottom-right',
}) => {
  const whatsappUrl = `https://go.wa.link/sureimportsglobal?text=${encodeURIComponent(
    message,
  )}`;

  const positionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${positionClass()} z-20`}
      aria-label="Contact us on WhatsApp" // For accessibility
      title="Contact us on WhatsApp" // For tooltip on hover
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600">
        <FaWhatsapp size={28} /> {/* WhatsApp Icon */}
      </div>
    </a>
  );
};

export default WhatsAppButton;

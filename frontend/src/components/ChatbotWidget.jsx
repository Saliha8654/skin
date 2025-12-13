import { useState, useEffect } from 'react';
import ChatMode from './ChatMode';
import SkinScanMode from './SkinScanMode';
import fairyImage from '../assets/fairy-icon3.png';
import './ChatbotWidget.css';

// FairyIcon Component - replaces BeautifulFairyIcon
const FairyIcon = ({ className }) => {
  // Use the Shopify CDN link for the fairy image
  const FAIRY_IMAGE_URL = "https://cdn.shopify.com/s/files/1/0908/9967/7517/files/fairy-icon1_f2fb5e71-b636-41ce-b6e8-83aea37a2072.png?v=1764341519";
  
  return (
    <div className={`fairy-image-container ${className}`}>
      {/* Magic sparkles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="magic-sparkle" />
      ))}
      
      {/* Fairy image */}
      <img 
        src={FAIRY_IMAGE_URL} 
        alt="Fairy Assistant" 
        className="fairy-image"
        onError={(e) => {
          // Fallback if the image fails to load
          console.log('Fairy image failed to load, trying fallback');
          e.target.src = `${window.location.origin}/chatbot-widget.png`;
        }}
      />
    </div>
  );
};

// Popup Message Component
const FairyPopup = ({ show }) => {
  return (
    <div className={`fairy-popup-message ${show ? 'show' : ''}`}>
      A little magic for your skin?
      {/* Sparkles for popup */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="popup-sparkle" />
      ))}
    </div>
  );
};

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null, 'chat', 'scan'
  const [showPopup, setShowPopup] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Hide popup when opening chatbot
      setShowPopup(false);
    }
    if (isOpen) {
      // Reset mode when closing
      setTimeout(() => setMode(null), 300);
    }
  };

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const goBack = () => {
    setMode(null);
  };

  // Popup scheduling logic
  useEffect(() => {
    let popupTimer;
    let popupInterval;

    const schedulePopups = () => {
      // Initial popup after 50ms
      popupTimer = setTimeout(() => {
        if (!isOpen) {
          setShowPopup(true);
          
          // Hide after 7 seconds
          setTimeout(() => {
            setShowPopup(false);
          }, 7000);
        }
      }, 50);

      // Repeat every 17 seconds (7s visible + 10s hidden)
      popupInterval = setInterval(() => {
        if (!isOpen) {
          setShowPopup(true);
          
          // Hide after 7 seconds
          setTimeout(() => {
            setShowPopup(false);
          }, 7000);
        }
      }, 17000);
    };

    schedulePopups();

    // Cleanup
    return () => {
      clearTimeout(popupTimer);
      clearInterval(popupInterval);
    };
  }, [isOpen]);

  // Hide popup when chatbot opens
  useEffect(() => {
    if (isOpen) {
      setShowPopup(false);
    }
  }, [isOpen]);

  return (
    <div>
      {/* Fairy Popup Message */}
      {showPopup && !isOpen && <FairyPopup show={showPopup} />}

      {/* Floating Widget Button with Fairy */}
      <button
        onClick={toggleWidget}
        className="fairy-chat-button fixed bottom-6 right-6 w-18 h-18 bg-primary rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 pulse  hover:scale-110 transform-gpu"
        aria-label="Open Skincare Chatbot"
        style={{ 
          zIndex: 9999,
          boxShadow: '0 8px 25px rgba(12, 46, 77, 0.4)',
        }}
      >
        <FairyIcon className="w-16 h-16 filter drop-shadow-lg" />
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-32 right-6 w-[365px] h-[650px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden fade-in"
          style={{ 
            zIndex: 9998,
            boxShadow: '0 20px 50px rgba(12, 46, 77, 0.3)'
          }}
        >
          {/* Header */}
          <div className=" text-white  mb-4 flex items-center justify-between relative overflow-hidden">
            {/* Replaced text content with Shopify image while keeping fairy image */}
            <div className="flex items-start flex-col pl-0 pr-0 pt-0 w-full relative z-10">
              <img
                src="https://cdn.shopify.com/s/files/1/0908/9967/7517/files/Component_4.png?v=1765556099"
                alt="Header"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="absolute right-4 top-4 z-20">
              <div className="fairy-image-wrapper relative animate-float">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0908/9967/7517/files/Group_14_1.png?v=1765556088" 
                  alt="GlowFairy" 
                  className="w-55 h-auto transition-all duration-300 hover:scale-105"
                />
                {/* Fairy dust effect on hover */}
                <div className="fairy-dust absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100">
                  {/* Enhanced CSS-based sparkle effects */}
                  <div className="fairy-sparkle sparkle-large" style={{top: '20%', left: '30%', animationDelay: '0s'}}></div>
                  <div className="fairy-sparkle sparkle-medium" style={{top: '60%', left: '70%', animationDelay: '0.5s'}}></div>
                  <div className="fairy-sparkle sparkle-small" style={{top: '30%', left: '20%', animationDelay: '1s'}}></div>
                  <div className="fairy-sparkle sparkle-large" style={{top: '70%', left: '40%', animationDelay: '1.5s'}}></div>
                  <div className="fairy-sparkle sparkle-medium" style={{top: '40%', left: '80%', animationDelay: '2s'}}></div>
                  <div className="fairy-sparkle sparkle-small" style={{top: '80%', left: '60%', animationDelay: '2.5s'}}></div>
                  <div className="fairy-sparkle sparkle-large" style={{top: '10%', left: '50%', animationDelay: '0.2s'}}></div>
                  <div className="fairy-sparkle sparkle-medium" style={{top: '50%', left: '10%', animationDelay: '0.7s'}}></div>
                  <div className="fairy-sparkle sparkle-small" style={{top: '90%', left: '30%', animationDelay: '1.2s'}}></div>
                  <div className="fairy-sparkle sparkle-large" style={{top: '25%', left: '90%', animationDelay: '1.7s'}}></div>
                  <div className="fairy-sparkle sparkle-medium" style={{top: '75%', left: '20%', animationDelay: '2.2s'}}></div>
                  <div className="fairy-sparkle sparkle-small" style={{top: '15%', left: '70%', animationDelay: '2.7s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-white to-secondary/10 flex flex-col items-center pt-4 px-6">
            {!mode && (
              <ModeSelection onSelectMode={selectMode} />
            )}
            {mode === 'chat' && (
              <ChatMode />
            )}
            {mode === 'scan' && (
              <SkinScanMode />
            )}
          </div>
          
          {/* Footer Note at the very bottom */}
          <div className="text-center px-6 pb-10">
            <p className="text-gray-600 text-[10px] italic" style={{ fontFamily: "'Inter', sans-serif" }}>
              <b>Note:</b> Your photo is never stored, and all scans are deleted within 24 hours. Product recommendations are personalised based on your skin type and concerns.
            </p>
          </div>
        </div>
      )}
      

    </div>
  );
}

function ModeSelection({ onSelectMode }) {
  return (
    <div className="h-full flex flex-col items-center bg-white w-full">
      <h2 className="text-primary mb-2 text-[24px] font-normal" style={{ fontFamily: "'Jomolhari', serif" }}>Welcome!</h2>
      
      <p className="text-gray-740 mb-12 text-[12px] font-light" style={{ fontFamily: "'Inter', sans-serif" }}>Ready to Discover Your Skin's True Needs?</p>
 
      <div className="space-y-6 w-full max-w-md">
        {/* Chat with GlowFairy Button */}
        <button
          onClick={() => onSelectMode('chat')}
          className="w-full bg-white border-3 border-primary border-solid rounded-[12px] p-7 transition-all duration-300 shadow-[0_4px_4px_2px_rgba(12,46,77,0.6)] hover:shadow-[0_6px_6px_3px_rgba(12,46,77,0.7)] group flex flex-row items-center justify-start transform hover:-translate-y-1"
          style={{
            boxShadow: '0 4px 4px 2px rgba(12, 46, 77, 0.6)',
            background: 'white',
            borderColor: '#0c2e4d',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex items-center justify-center ml-2 mr-3">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h3 className="text-primary text-[16px] font-bold mb-1 text-left" style={{ fontFamily: "'Inter', sans-serif" }}>Chat with GlowFairy</h3>
            <p className="text-primary text-[11px] font-normal text-left" style={{ fontFamily: "'Inter', sans-serif" }}>Get personalized advice for your skin.</p>
          </div>
        </button>

        {/* AI Skin Scan Button */}
        <button
          onClick={() => onSelectMode('scan')}
          className="w-full bg-white border-3 border-primary border-solid rounded-[12px] p-6 transition-all duration-300 shadow-[0_4px_4px_2px_rgba(12,46,77,0.6)] hover:shadow-[0_6px_6px_3px_rgba(12,46,77,0.7)] group flex flex-row items-center justify-start transform hover:-translate-y-1"
          style={{
            boxShadow: '0 4px 4px 2px rgba(12, 46, 77, 0.6)',
            background: 'white',
            borderColor: '#0c2e4d',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex items-center justify-center ml-2 mr-3">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h3 className="text-primary text-[16px] font-bold mb-1 text-left" style={{ fontFamily: "'Inter', sans-serif" }}>AI Skin Scan</h3>
            <p className="text-primary text-[11px] font-normal text-left" style={{ fontFamily: "'Inter', sans-serif" }}>Upload a photo to identify your skin type and concerns.</p>
          </div>
        </button>
      </div>

      {/* Footer Note */}
      {/* Note: Moved to the very bottom of the chatbot panel container */}
    </div>
  );
}
export default ChatbotWidget;
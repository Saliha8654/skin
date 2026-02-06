import { useState, useEffect } from 'react';
import ChatMode from './ChatMode';
import SkinScanMode from './SkinScanMode';
import fairyImage from '../assets/fairy-icon3.png';
import './ChatbotWidget.css';
import './ChatbotWidgetMedia.css';

// FairyIcon Component - replaces BeautifulFairyIcon
const FairyIcon = ({ className }) => {
  // Use the Shopify CDN link for the fairy image
  const FAIRY_IMAGE_URL = "https://cdn.shopify.com/s/files/1/0908/9967/7517/files/fairy-icon1_f2fb5e71-b636-41ce-b6e8-83aea37a2072.png?v=1764341519";
  
  return (
    <div className={`fairy-image-container ${className} pointer-events-none`}>
      {/* Magic sparkles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="magic-sparkle pointer-events-none" />
      ))}
      
      {/* Fairy image */}
      <img 
        src={FAIRY_IMAGE_URL} 
        alt="Fairy Assistant" 
        className="fairy-image pointer-events-none"
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

// Email Subscription Popup Component
const EmailPopup = ({ show, onClose, onSubmit, email, setEmail }) => {
  if (!show) return null;
  
  return (
    <div className="email-popup-overlay">
      <div className="email-popup-container">
        <div className="email-popup-header">
          <h3 className="email-popup-title">Join the Glow Shop Family</h3>
          <button 
            className="email-popup-close" 
            onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>
        
        <div className="email-popup-content">
          <p className="email-popup-note">
            Enter your email to be a part of glow shop family
          </p>
          
          <form onSubmit={onSubmit} className="email-popup-form">
            <input
              type="email"
              id="chatbot-email-input"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="email-input"
              required
            />
            <button 
              type="submit" 
              className="subscribe-button"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null, 'chat', 'scan'
  const [showPopup, setShowPopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const toggleWidget = () => {
    console.log('toggleWidget called, current isOpen:', isOpen);
    setIsOpen(!isOpen);
    console.log('Setting isOpen to:', !isOpen);
    if (!isOpen) {
      // Hide popup when opening chatbot
      setShowPopup(false);
    }
    if (isOpen) {
      // Reset mode when closing
      setTimeout(() => setMode(null), 300);
    }
  };

  // Debug effect to track when panel should render
  useEffect(() => {
    console.log('isOpen state changed to:', isOpen);
    if (isOpen) {
      console.log('Chatbot panel should be VISIBLE now');
    } else {
      console.log('Chatbot panel should be HIDDEN now');
    }
  }, [isOpen]);

  // Debug effect to track email popup state changes
  useEffect(() => {
    console.log('showEmailPopup state changed to:', showEmailPopup);
    console.log('pendingMode state changed to:', pendingMode);
    if (showEmailPopup && pendingMode) {
      console.log('Email popup should be VISIBLE now');
      // Force a DOM update
      setTimeout(() => {
        const popupElement = document.querySelector('.email-popup-overlay');
        if (popupElement) {
          console.log('Popup element found in DOM:', popupElement);
          popupElement.style.display = 'flex';
        } else {
          console.log('Popup element NOT found in DOM');
        }
      }, 100);
    } else {
      console.log('Email popup should be HIDDEN now');
    }
  }, [showEmailPopup, pendingMode]);

  const selectMode = (selectedMode) => {
    console.log('=== SELECT MODE FUNCTION STARTED ===');
    console.log('selectMode called with:', selectedMode);
    console.log('Current states - pendingMode:', pendingMode, 'showEmailPopup:', showEmailPopup);
    
    // Force immediate state updates
    setPendingMode(selectedMode);
    console.log('Set pendingMode to:', selectedMode);
    
    // Use setTimeout to ensure state update completes before showing popup
    setTimeout(() => {
      setShowEmailPopup(true);
      console.log('Set showEmailPopup to: true');
      console.log('=== SELECT MODE FUNCTION ENDED ===');
    }, 0);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    // Instant transition - proceed immediately
    console.log('Instant transition to mode:', pendingMode);
    setShowEmailPopup(false);
    setMode(pendingMode);
    setEmail('');
    setPendingMode(null);
    
    // Handle subscription in background (fire and forget)
    try {
      console.log('Processing subscription in background for email:', email);
      // Don't await this - let it run in background
      fetch(`${import.meta.env.VITE_API_URL}/shopify/add-subscriber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(response => {
        if (response.ok) {
          console.log('Subscription successful for:', email);
          setIsSubscribed(true);
        } else {
          console.log('Subscription failed, but user experience unaffected');
        }
      }).catch(error => {
        console.log('Background subscription error (不影响用户体验):', error);
      });
    } catch (error) {
      console.log('Background subscription setup failed (不影响用户体验):', error);
    }
  };

  const closeEmailPopup = () => {
    console.log('Closing email popup instantly');
    setShowEmailPopup(false);
    setPendingMode(null);
    setEmail('');
    // Instantly return to mode selection
    setMode(null);
  };

  const goBack = () => {
    setMode(null);
    setIsSubscribed(false);
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
        className="fairy-chat-button fixed bottom-6 right-6 w-16 h-16 md:w-18 md:h-18 bg-primary rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 pulse hover:scale-110 transform-gpu"
        aria-label="Open Skincare Chatbot"
        style={{ 
          zIndex: 9999,
          boxShadow: '0 8px 25px rgba(12, 46, 77, 0.4)',
        }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 filter drop-shadow-lg pointer-events-none">
          <FairyIcon className="w-full h-full" />
        </div>
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[365px] h-[650px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden fade-in chatbot-panel"
          style={{ 
            zIndex: 10000,
            boxShadow: '0 20px 50px rgba(12, 46, 77, 0.3)'
          }}
        >
          {/* Header */}
          <div className="text-white bg-white mb-4 flex items-center justify-between relative overflow-hidden chatbot-header">
            {/* Replaced text content with Shopify image while keeping fairy image */}
            <div className="flex items-start flex-col pl-0 pr-0 pt-0 w-full relative z-10">
              <img
                src="https://cdn.shopify.com/s/files/1/0908/9967/7517/files/Frame_32_2.png?v=1769950879"
                alt="Header"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="absolute right-1 top-1 z-20">
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

          {/* Email Subscription Popup - Positioned inside chatbot */}
          {/* Email Subscription - No popup */}
          {/* Email Subscription - No popup */}
          {showEmailPopup && pendingMode && (
            <div>No popup - using full screen page</div>
          )}




            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-white to-secondary/10 flex flex-col items-center pt-4 px-6 chatbot-content">
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
          <div className="text-center px-6 pb-10 chatbot-footer">
            <p className="text-gray-600 text-[10px] italic" style={{ fontFamily: "'Inter', sans-serif" }}>
              <b>Note:</b> Your photo is never stored, and all scans are deleted within 24 hours. Product recommendations are personalised based on your skin type and concerns.
            </p>
          </div>
        </div>
      )}
      

export default ChatbotWidget;

import { useState, useEffect } from 'react';
import ChatMode from './ChatMode';
import SkinScanMode from './SkinScanMode';

// FairyIcon Component - replaces BeautifulFairyIcon
const FairyIcon = ({ className }) => {
  const FAIRY_IMAGE_URL = '/src/assets/fairy-icon3.png';
  
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
          className="fixed bottom-32 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden fade-in"
          style={{ 
            zIndex: 9998,
            boxShadow: '0 20px 50px rgba(12, 46, 77, 0.3)'
          }}
        >
          {/* Header */}
          <div className="bg-primary text-white p-5 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              {mode && (
                <button onClick={goBack} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h3 className="font-bold text-xl">K-Beauty Fairy</h3>
                <p className="text-xs text-white/80">Your skincare guide ✨</p>
              </div>
            </div>
            <button onClick={toggleWidget} className="hover:bg-white/20 p-2 rounded-full transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-white to-secondary/10">
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
        </div>
      )}
      
      {/* Custom animations and fairy styles */}
      <style jsx>{`
        /* Fairy Image Container */
        .fairy-image-container {
          position: relative;
          width: 64px !important;
          height: 64px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* The fairy image itself */
        .fairy-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: all 0.3s ease;
          z-index: 2;
          position: relative;
          animation: fadeIn 0.5s ease-in;
        }

        /* Magical sparkles around the fairy */
        .magic-sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ffefc8 10%, #ffefc8 10%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: sparkleFloat 3s ease-in-out infinite;
          z-index: 1;
          filter: brightness(1.2);
        }

        /* Position sparkles around the fairy */
        .magic-sparkle:nth-child(1) {
          top: 5px;
          left: 8px;
          animation-delay: 0s;
        }

        .magic-sparkle:nth-child(2) {
          top: 12px;
          right: 5px;
          animation-delay: 0.25s;
        }

        .magic-sparkle:nth-child(3) {
          bottom: 10px;
          left: 6px;
          animation-delay: 0.5s;
        }

        .magic-sparkle:nth-child(4) {
          top: 20px;
          right: 10px;
          animation-delay: 0.75s;
        }

        .magic-sparkle:nth-child(5) {
          bottom: 15px;
          right: 8px;
          animation-delay: 1s;
        }

        .magic-sparkle:nth-child(6) {
          top: 8px;
          left: 15px;
          animation-delay: 1.25s;
        }

        /* Hover effects - fairy floats and glows */
        .fairy-image-container:hover .fairy-image {
          transform: translateY(-4px) scale(1.05);
        }

        .fairy-image-container:hover {
          animation: gentleFloat 2s ease-in-out infinite;
        }

        /* Add a subtle glow behind the fairy */
        .fairy-image-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          z-index: 0;
          animation: glowPulse 3s ease-in-out infinite;
        }

        /* Popup message styles */
        .fairy-popup-message {
          position: fixed;
          bottom: 105px;
          right: 24px;
          background-color: rgba(255, 239, 200, 0.8);
          border: 3px solid #ffeab7;
          border-radius: 45px;
          padding: 8px 12px;
          font-family: "Inter", sans-serif;
          font-size: 10.5px;
          font-weight: 28px;
          color: #0c2e4d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 9998;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          max-width: 220px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block !important;
        }

        .fairy-popup-message.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* Sparkle elements for the popup */
        .popup-sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ffefc8 10%, #ffefc8 10%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: popupSparkle 2s ease-in-out infinite;
          z-index: 1;
          filter: brightness(1.2);
        }

        /* Position sparkles around popup */
        .popup-sparkle:nth-child(1) {
          top: 5px;
          left: 8px;
          animation-delay: 0s;
        }

        .popup-sparkle:nth-child(2) {
          top: 12px;
          right: 5px;
          animation-delay: 0.25s;
        }

        .popup-sparkle:nth-child(3) {
          bottom: 10px;
          left: 6px;
          animation-delay: 0.5s;
        }

        .popup-sparkle:nth-child(4) {
          top: 20px;
          right: 10px;
          animation-delay: 0.75s;
        }

        .popup-sparkle:nth-child(5) {
          bottom: 15px;
          right: 8px;
          animation-delay: 1s;
        }

        .popup-sparkle:nth-child(6) {
          top: 8px;
          left: 15px;
          animation-delay: 1.25s;
        }

        .popup-sparkle:nth-child(7) {
          top: 8px;
          right: 15px;
          animation-delay: 1.5s;
        }

        .popup-sparkle:nth-child(8) {
          bottom: 8px;
          left: 15px;
          animation-delay: 1.75s;
        }

        .popup-sparkle:nth-child(9) {
          bottom: 8px;
          right: 15px;
          animation-delay: 2s;
        }

        .popup-sparkle:nth-child(10) {
          top: 20px;
          left: 20px;
          animation-delay: 2.25s;
        }

        /* Float animation for button */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .fairy-chat-button {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 239, 200, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 239, 200, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 239, 200, 0); }
        }

        /* Sparkle animations */
        @keyframes sparkleFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.3);
          }
          20% {
            opacity: 1;
            transform: translateY(-10px) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.3);
          }
        }

        @keyframes popupSparkle {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translateY(-8px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px) scale(0.3);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function ModeSelection({ onSelectMode }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-secondary/30 to-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-3">Welcome! ✨</h2>
        <p className="text-gray-600">How would you like to get started?</p>
      </div>

      <div className="space-y-5 w-full">
        <button
          onClick={() => onSelectMode('chat')}
          className="w-full bg-white border-4 border-primary text-primary p-7 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="font-bold text-xl">Chat</span>
              </div>
              <p className="text-base opacity-80">Answer questions about your skin</p>
            </div>
            <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('scan')}
          className="w-full bg-white border-4 border-primary text-primary p-7 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-bold text-xl">Skin Scan</span>
              </div>
              <p className="text-base opacity-80">Upload a photo for AI analysis</p>
            </div>
            <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
export default ChatbotWidget;
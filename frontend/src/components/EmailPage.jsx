import React from 'react';

const EmailPage = ({ onClose, onSubmit, email, setEmail, pendingMode }) => {
  return (
    <div 
      className="fixed bottom-24 right-6 w-[365px] h-[650px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden fade-in chatbot-panel"
      style={{ 
        zIndex: 10000,
        boxShadow: '0 20px 50px rgba(12, 46, 77, 0.3)'
      }}
    >
      {/* Header - Same as chatbot header */}
      <div className="text-white bg-white mb-4 flex items-center justify-between relative overflow-hidden chatbot-header">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto">
        <div className="text-center max-w-md w-full">
          {/* Welcome message from GlowFairy */}
          <div className="mb-8">
            <p className="text-primary text-[11px] leading-relaxed font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
              Hi, I'm GlowFairy!<br />
              I'm here to sprinkle a little magic on your skincare journey<br />
              and help you find the right products for your skin's<br />
              unique needs.
            </p>
          </div>

          {/* Spacer */}
          <div className="h-12"></div>

          {/* Email instruction text */}
          <p className="text-primary text-[10px] mb-6 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
            Enter Your email so we can send you curated products and routine right in your inbox according to your skin needs
          </p>

          {/* Email Form */}
          <form onSubmit={onSubmit} className="w-full space-y-6">
            <input
              type="email"
              id="chatbot-email-input"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 text-[16px] bg-white border border-[#0c2e4d] rounded-[10px] focus:outline-none transition-all duration-300"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #0c2e4d',
                borderWidth: '1px'
              }}
              required
            />
            
            <button 
              type="submit" 
              className="w-1/2 py-3 text-[16px] font-medium text-white transition-all duration-300 hover:shadow-lg mx-auto block"
              style={{
                backgroundColor: '#0c2e4d',
                border: '1px solid #ffefc8',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer - Same as chatbot footer */}
      <div className="text-center px-6 pb-10 chatbot-footer">
        <p className="text-gray-600 text-[10px] italic" style={{ fontFamily: "'Inter', sans-serif" }}>
          <b>Note:</b> Your photo is never stored, and all scans are deleted within 24 hours. Product recommendations are personalised based on your skin type and concerns.
        </p>
      </div>
    </div>
  );
};

export default EmailPage;
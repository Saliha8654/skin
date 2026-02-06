import React from 'react';

const EmailPage = ({ onClose, onSubmit, email, setEmail, pendingMode }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden fade-in">
      {/* Header - Same as chatbot header */}
      <div className="text-white bg-white mb-4 flex items-center justify-between relative overflow-hidden chatbot-header">
        <div className="flex items-start flex-col pl-0 pr-0 pt-0 w-full relative z-10">
          <img
            src="https://cdn.shopify.com/s/files/1/0908/9967/7517/files/Frame_32_2.png?v=1769950879"
            alt="Header"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-md w-full">
          {/* Welcome Text */}
          <h2 className="text-primary mb-2 text-[24px] font-normal welcome-text" style={{ fontFamily: "'Jomolhari', serif" }}>
            Welcome!
          </h2>
          
          {/* Instruction Text */}
          <p className="text-primary text-[16px] mb-8 font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
            Enter your Email Please to be a part of GlowShop Family
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
              className="w-full px-4 py-3 text-[16px] bg-white border border-[#0c2e4d] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#0c2e4d] transition-all duration-300"
              style={{
                boxShadow: '0 4px 6px rgba(12, 46, 77, 0.1)',
                border: '1px solid #0c2e4d'
              }}
              required
            />
            
            <button 
              type="submit" 
              className="w-full py-3 text-[16px] font-medium text-white transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: '#0c2e4d',
                border: '2px solid #ffefc8',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(12, 46, 77, 0.3)'
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
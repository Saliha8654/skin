import { useState } from 'react';
import ChatMode from './ChatMode';
import SkinScanMode from './SkinScanMode';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // null, 'chat', 'scan'

  const toggleWidget = () => {
    setIsOpen(!isOpen);
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

  return (
    <>
      {/* Floating Widget Button */}
      <button
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 pulse"
        aria-label="Open Skincare Chatbot"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden slide-up">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mode && (
                <button onClick={goBack} className="hover:bg-white/10 p-1 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h3 className="font-semibold text-lg">K-Beauty Assistant</h3>
                <p className="text-xs text-secondary">Your skincare expert</p>
              </div>
            </div>
            <button onClick={toggleWidget} className="hover:bg-white/10 p-1 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
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
    </>
  );
}

function ModeSelection({ onSelectMode }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-secondary/20 to-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome! ✨</h2>
        <p className="text-gray-600">How would you like to get started?</p>
      </div>

      <div className="space-y-4 w-full">
        <button
          onClick={() => onSelectMode('chat')}
          className="w-full bg-white border-2 border-primary text-primary p-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold text-lg">Chat</span>
              </div>
              <p className="text-sm opacity-75">Answer questions about your skin</p>
            </div>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('scan')}
          className="w-full bg-white border-2 border-primary text-primary p-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-lg">Skin Scan</span>
              </div>
              <p className="text-sm opacity-75">Upload a photo for AI analysis</p>
            </div>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ChatbotWidget;

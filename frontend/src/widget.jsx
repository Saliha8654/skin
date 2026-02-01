import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget';
import './index.css';
import './components/ChatbotWidget.css';
import './components/ChatbotWidgetMedia.css';

// Create a CSP-compliant way to initialize the widget
function initializeChatbotWidget() {
  // Check if container already exists
  let container = document.getElementById('skincare-chatbot-root');
  
  if (!container) {
    // Create container if it doesn't exist
    container = document.createElement('div');
    container.id = 'skincare-chatbot-root';
    document.body.appendChild(container);
  }

  // Render the chatbot widget
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatbotWidget />
    </React.StrictMode>
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatbotWidget);
} else {
  // DOM is already ready
  initializeChatbotWidget();
}

// Export for potential manual initialization
window.initializeSkincareChatbot = initializeChatbotWidget;
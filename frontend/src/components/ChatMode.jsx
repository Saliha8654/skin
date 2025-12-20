import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../utils/api';
import ProductCard from './ProductCard';
import EmailCollector from './EmailCollector';

function ChatMode() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // New state for backend initialization
  const [products, setProducts] = useState([]);
  const [showEmailCollector, setShowEmailCollector] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Start conversation
    startChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startChat = async () => {
    try {
      setIsInitializing(true); // Set initializing state
      const response = await chatAPI.start();
      setMessages([{ role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error('Failed to start chat:', error);
      setMessages([{ role: 'assistant', content: 'Hi, I\'m GlowFairy!🧚🏻‍♀️\n I\'m here to sprinkle a little magic on your skincare journey and help you find the right products for your skin\'s unique needs. Ready?\n First, what\'s your main skin concern right now?' }]);
    } finally {
      setIsInitializing(false); // Always set initializing to false when done
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(updatedMessages);

      // Add assistant message
      setMessages([...updatedMessages, { role: 'assistant', content: response.message }]);

      // If products are recommended
      if (response.products && response.products.length > 0) {
        setProducts(response.products);
        setShowEmailCollector(true);
        
        // Extract preferences for email
        const concerns = [];
        const conversation = updatedMessages.map(m => m.content).join(' ').toLowerCase();
        if (conversation.includes('acne')) concerns.push('acne');
        if (conversation.includes('dry')) concerns.push('dryness');
        if (conversation.includes('oily')) concerns.push('oily');
        
        setUserPreferences({ concerns });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, I had trouble processing that. Could you try again?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Backend initialization loading indicator */}
        {isInitializing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex gap-1 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-primary text-center font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Please wait for some seconds, Our System is warming up...</p>
          </div>
        )}

        {!isInitializing && messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-primary'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-primary p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-primary mb-3">✨ Recommended for you:</h3>
            <div className="space-y-3">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Email Collector */}
        {showEmailCollector && (
          <EmailCollector preferences={userPreferences} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
            disabled={isLoading || isInitializing}
          />
          <button
            type="submit"
            disabled={isLoading || isInitializing || !inputValue.trim()}
            className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: '#0c2e4d',
              borderWidth: '3px',
              borderStyle: 'solid'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatMode;
import { useState, useEffect } from 'react';
import ChatbotWidget from './components/ChatbotWidget';

function TestWidget() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chatbot Widget Test</h1>
      <p>Status: {loaded ? 'Loaded' : 'Loading...'}</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', minHeight: '200px' }}>
        <h2>Widget Container:</h2>
        {loaded && <ChatbotWidget />}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>If you don't see the widget above:</p>
        <ol>
          <li>Check the browser console for errors (F12)</li>
          <li>Make sure all servers are running</li>
          <li>Verify API keys are configured</li>
        </ol>
      </div>
    </div>
  );
}

export default TestWidget;
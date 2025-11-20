import React from 'react';

const ChatView = ({
  userSubject,
  chatHistory,
  chatMessage,
  setChatMessage,
  chatWithTutor,
  loading,
  setChatHistory
}) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🤖 Chat with Your AI Tutor</h3>
      
      <div className="kid-card">
        <h4 style={{ color: '#667eea', marginBottom: '20px' }}>💬 Conversation</h4>
        <div className="chat-container">
          {chatHistory.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: '50px' }}>
              👋 Hi there! I'm your AI tutor. Ask me anything about {userSubject}!
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <strong style={{ marginBottom: '5px', display: 'block' }}>
                  {msg.role === 'user' ? '👤 You' : '🤖 AI Tutor'}:
                </strong>
                {msg.content}
              </div>
            ))
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder={`Ask me about ${userSubject}... 🤔`}
            style={{ flex: '1' }}
            onKeyPress={(e) => e.key === 'Enter' && chatWithTutor(chatMessage)}
          />
          <button 
            className="big-button" 
            onClick={() => chatWithTutor(chatMessage)}
            disabled={!chatMessage.trim() || loading.chat}
            style={{ minWidth: '120px' }}
          >
            {loading.chat ? '🔄 Sending...' : '📤 Send'}
          </button>
        </div>
        
        <div className="button-group" style={{ marginTop: '20px' }}>
          <button className="warning-button" onClick={() => setChatHistory([])}>
            🧹 Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;


import React from 'react';

const VideoView = ({
  videoTitle,
  videoUrl,
  videoError,
  userSubject,
  loadVideoForSubject,
  loading,
  completeVideoWatching,
  videoCompletionMsg,
  checkAttention,
  attentionStatus,
  attentionAlert,
  socraticQuestion,
  handleSocraticAnswer
}) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🎬 Educational Videos</h3>
      
      {videoTitle && (
        <div className="kid-card" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{videoTitle}</h4>
        </div>
      )}
      
      <div className="video-container">
        {videoUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title={videoTitle || 'Learning video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="kid-card" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>Load a video to start watching.</p>
          </div>
        )}
      </div>

      {videoError && (
        <div className="attention-alert" role="alert">
          {videoError}
        </div>
      )}
      
      <div className="button-group" style={{ marginTop: '30px' }}>
        <button 
          className="big-button" 
          onClick={loadVideoForSubject}
          disabled={loading.video}
        >
          {loading.video ? '🔄 Loading Video...' : `📺 Load Video for ${userSubject}`}
        </button>
        <button className="success-button" onClick={() => completeVideoWatching(userSubject)}>
          ✅ I Finished Watching!
        </button>
      </div>
      
      {videoCompletionMsg && (
        <div className="kid-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(86, 171, 47, 0.1), rgba(168, 230, 207, 0.1))' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#56ab2f', margin: '0' }}>{videoCompletionMsg}</p>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
        <div className="webcam-preview">📹 Attention Monitor (Simulated)</div>
        <button className="warning-button" onClick={checkAttention}>🔍 Check My Focus</button>
        
        {attentionStatus && (
          <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '600', color: 'white' }}>
            {attentionStatus}
          </div>
        )}
      </div>
      
      {attentionAlert && <div className="attention-alert">{attentionAlert}</div>}
      
      {socraticQuestion && (
        <div className="kid-card">
          <h4 style={{ color: '#667eea', marginBottom: '20px' }}>💭 Quick Question:</h4>
          <input 
            placeholder="Type your answer here..." 
            onChange={(e) => handleSocraticAnswer(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <div className="button-group">
            <button className="warning-button">💡 Submit Answer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoView;

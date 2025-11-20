import React from 'react';

const RewardsView = ({ gameState, PERKS_SHOP, buyPerk, loading, perkResult }) => {
  return (
    <div className="content-section">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>🎁 Your Amazing Rewards</h3>
      
      <div className="kid-card">
        <h4 style={{ color: '#667eea', marginBottom: '20px' }}>🏆 Your Progress</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(247, 151, 30, 0.1), rgba(255, 210, 0, 0.1))', borderRadius: '15px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🪙</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f7971e' }}>{gameState.total_coins_earned}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Coins Earned</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))', borderRadius: '15px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{gameState.quizzes_completed}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Quizzes Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(86, 171, 47, 0.1), rgba(168, 230, 207, 0.1))', borderRadius: '15px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📺</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#56ab2f' }}>{gameState.videos_watched}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Videos Watched</div>
          </div>
        </div>
      </div>
      
      <div className="kid-card">
        <h4 style={{ color: '#667eea', marginBottom: '20px' }}>🛍️ Awesome Perk Shop</h4>
        <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
          {PERKS_SHOP.map((perk, i) => (
            <div key={i} className="quiz-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '6px solid #f7971e' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea', marginBottom: '8px' }}>{perk.name}</div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{perk.description}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#f7971e' }}>💰 {perk.cost} coins</div>
              </div>
              <button 
                className="warning-button" 
                onClick={() => buyPerk(i)}
                disabled={loading.perk}
                style={{ minWidth: '120px', padding: '10px 20px' }}
              >
                {loading.perk ? '🔄 Buying...' : '💳 Buy Now'}
              </button>
            </div>
          ))}
        </div>
        
        {perkResult && (
          <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#667eea', margin: '0' }}>{perkResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsView;


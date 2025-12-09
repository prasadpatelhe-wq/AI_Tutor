import React from 'react';

const Profile = ({ student, onLogout }) => {
    if (!student) return null;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'white',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    🧑‍🎓
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', margin: '0' }}>{student.name}</h1>
                <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>Grade {student.grade_band} • {student.board}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '30px' }}>
                    <div className="glass-card" style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '2rem' }}>🏆</div>
                        <h3>Level 1</h3>
                        <p>Beginner</p>
                    </div>
                    <div className="glass-card" style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '2rem' }}>🪙</div>
                        <h3>100</h3>
                        <p>Coins</p>
                    </div>
                    <div className="glass-card" style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '2rem' }}>🔥</div>
                        <h3>0</h3>
                        <p>Day Streak</p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    style={{
                        marginTop: '30px',
                        padding: '12px 24px',
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid var(--accent-pink)',
                        color: 'white',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;

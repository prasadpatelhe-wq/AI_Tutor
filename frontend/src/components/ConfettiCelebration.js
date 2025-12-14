import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

/**
 * ConfettiCelebration - Celebration effect component
 * Used for quiz success, achievements, and rewards
 */
const ConfettiCelebration = ({
    show = false,
    duration = 5000,
    theme = 'teen',
    particleCount = 200,
    onComplete
}) => {
    const [isActive, setIsActive] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Theme-specific confetti colors
    const getColors = () => {
        switch (theme) {
            case 'kids':
                return ['#FF6B9D', '#4ECDC4', '#FFE66D', '#FF6B6B', '#95E1D3', '#F38181'];
            case 'teen':
                return ['#667eea', '#764ba2', '#4fd1c5', '#48bb78', '#ed8936', '#f56565'];
            case 'mature':
            default:
                return ['#38B2AC', '#4A5568', '#68D391', '#4299E1', '#ED8936', '#F56565'];
        }
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle show/hide with duration
    useEffect(() => {
        if (show) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
                if (onComplete) onComplete();
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setIsActive(false);
        }
    }, [show, duration, onComplete]);

    if (!isActive) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            pointerEvents: 'none'
        }}>
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={particleCount}
                colors={getColors()}
                recycle={false}
                gravity={0.3}
                wind={0.01}
                opacity={0.9}
                tweenDuration={5000}
            />

            {/* Celebration message */}
            <div style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                animation: 'celebrationPop 0.5s ease-out forwards'
            }}>
                <style>{`
          @keyframes celebrationPop {
            0% { transform: translateX(-50%) scale(0); opacity: 0; }
            50% { transform: translateX(-50%) scale(1.2); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
          }
          @keyframes celebrationBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
                <div style={{
                    fontSize: theme === 'kids' ? '80px' : '60px',
                    animation: 'celebrationBounce 1s ease-in-out infinite',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    🎉
                </div>
            </div>
        </div>
    );
};

export default ConfettiCelebration;

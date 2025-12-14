import React, { useMemo } from 'react';

/**
 * AnimatedBackground - Floating blob/gradient background
 * Provides a premium, dynamic feel with theme-aware colors
 */
const AnimatedBackground = ({ theme = 'teen' }) => {
    // Theme-specific colors for the blobs
    const blobColors = useMemo(() => {
        switch (theme) {
            case 'kids':
                return {
                    blob1: 'rgba(255, 107, 157, 0.3)',
                    blob2: 'rgba(78, 205, 196, 0.25)',
                    blob3: 'rgba(255, 230, 109, 0.2)',
                    blob4: 'rgba(255, 107, 107, 0.25)',
                };
            case 'teen':
                return {
                    blob1: 'rgba(102, 126, 234, 0.2)',
                    blob2: 'rgba(118, 75, 162, 0.15)',
                    blob3: 'rgba(79, 209, 197, 0.15)',
                    blob4: 'rgba(102, 126, 234, 0.1)',
                };
            case 'mature':
            default:
                return {
                    blob1: 'rgba(56, 178, 172, 0.15)',
                    blob2: 'rgba(74, 85, 104, 0.1)',
                    blob3: 'rgba(45, 55, 72, 0.12)',
                    blob4: 'rgba(56, 178, 172, 0.08)',
                };
        }
    }, [theme]);

    const styles = {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: -1,
            pointerEvents: 'none',
        },
        blob: {
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.8,
        },
    };

    const keyframes = `
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -50px) scale(1.1); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(50px, 30px) scale(1.05); }
    }
    
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-40px, 30px) scale(1.08); }
      66% { transform: translate(20px, -40px) scale(0.92); }
    }
    
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(40px, 40px) rotate(180deg); }
    }
    
    @keyframes float4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(-30px, 20px) scale(0.9); }
      75% { transform: translate(20px, -30px) scale(1.1); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
  `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={styles.container}>
                {/* Large blob - top right */}
                <div
                    style={{
                        ...styles.blob,
                        width: '500px',
                        height: '500px',
                        background: `radial-gradient(circle, ${blobColors.blob1} 0%, transparent 70%)`,
                        top: '-10%',
                        right: '-5%',
                        animation: 'float1 20s ease-in-out infinite',
                    }}
                />

                {/* Medium blob - bottom left */}
                <div
                    style={{
                        ...styles.blob,
                        width: '400px',
                        height: '400px',
                        background: `radial-gradient(circle, ${blobColors.blob2} 0%, transparent 70%)`,
                        bottom: '-5%',
                        left: '-5%',
                        animation: 'float2 25s ease-in-out infinite',
                    }}
                />

                {/* Small blob - center right */}
                <div
                    style={{
                        ...styles.blob,
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${blobColors.blob3} 0%, transparent 70%)`,
                        top: '40%',
                        right: '10%',
                        animation: 'float3 30s ease-in-out infinite, pulse 4s ease-in-out infinite',
                    }}
                />

                {/* Extra blob - top left */}
                <div
                    style={{
                        ...styles.blob,
                        width: '350px',
                        height: '350px',
                        background: `radial-gradient(circle, ${blobColors.blob4} 0%, transparent 70%)`,
                        top: '20%',
                        left: '15%',
                        animation: 'float4 22s ease-in-out infinite',
                    }}
                />
            </div>
        </>
    );
};

export default AnimatedBackground;

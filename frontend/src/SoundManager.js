/**
 * Sound Manager - Web Audio API based sound effects
 * Theme-aware sounds for AI Tutor application
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
    this.theme = 'teen'; // Default theme
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this;
  }

  /**
   * Set current theme for sound variations
   */
  setTheme(themeName) {
    this.theme = themeName || 'teen';
  }

  /**
   * Set volume (0-1)
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Toggle sound on/off
   */
  toggle(enabled) {
    this.enabled = enabled !== undefined ? enabled : !this.enabled;
  }

  /**
   * Create an oscillator-based sound
   */
  _playTone(frequency, duration, type = 'sine', gainValue = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    const now = this.audioContext.currentTime;
    const adjustedGain = gainValue * this.volume;

    gainNode.gain.setValueAtTime(adjustedGain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Play a sequence of tones
   */
  _playSequence(notes, interval = 0.1) {
    if (!this.enabled) return;
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        this._playTone(note.freq, note.duration || 0.15, note.type || 'sine', note.gain || 0.3);
      }, index * interval * 1000);
    });
  }

  /**
   * 🪙 Coin collection sound - theme aware
   */
  playCoinSound() {
    this.init();
    
    switch (this.theme) {
      case 'kids':
        // Playful ascending chime
        this._playSequence([
          { freq: 523, duration: 0.1, type: 'sine', gain: 0.4 },
          { freq: 659, duration: 0.1, type: 'sine', gain: 0.35 },
          { freq: 784, duration: 0.15, type: 'sine', gain: 0.3 },
          { freq: 1047, duration: 0.2, type: 'sine', gain: 0.25 }
        ], 0.08);
        break;
        
      case 'teen':
        // Gaming-style coin sound
        this._playSequence([
          { freq: 880, duration: 0.08, type: 'square', gain: 0.2 },
          { freq: 1320, duration: 0.12, type: 'square', gain: 0.15 }
        ], 0.06);
        break;
        
      case 'mature':
      default:
        // Subtle click
        this._playTone(600, 0.08, 'sine', 0.15);
        break;
    }
  }

  /**
   * ✅ Correct answer sound
   */
  playCorrectSound() {
    this.init();
    
    switch (this.theme) {
      case 'kids':
        this._playSequence([
          { freq: 523, duration: 0.12, type: 'sine', gain: 0.4 },
          { freq: 659, duration: 0.12, type: 'sine', gain: 0.35 },
          { freq: 784, duration: 0.2, type: 'sine', gain: 0.3 }
        ], 0.1);
        break;
        
      case 'teen':
        this._playSequence([
          { freq: 440, duration: 0.1, type: 'triangle', gain: 0.25 },
          { freq: 880, duration: 0.15, type: 'triangle', gain: 0.2 }
        ], 0.08);
        break;
        
      case 'mature':
      default:
        this._playTone(880, 0.12, 'sine', 0.12);
        break;
    }
  }

  /**
   * ❌ Wrong answer sound
   */
  playWrongSound() {
    this.init();
    
    switch (this.theme) {
      case 'kids':
        this._playSequence([
          { freq: 330, duration: 0.15, type: 'sine', gain: 0.3 },
          { freq: 262, duration: 0.2, type: 'sine', gain: 0.25 }
        ], 0.12);
        break;
        
      case 'teen':
        this._playTone(200, 0.2, 'sawtooth', 0.15);
        break;
        
      case 'mature':
      default:
        this._playTone(300, 0.15, 'sine', 0.1);
        break;
    }
  }

  /**
   * 🎉 Achievement/Level complete sound
   */
  playAchievementSound() {
    this.init();
    
    switch (this.theme) {
      case 'kids':
        // Fanfare
        this._playSequence([
          { freq: 523, duration: 0.12, type: 'sine', gain: 0.4 },
          { freq: 659, duration: 0.12, type: 'sine', gain: 0.35 },
          { freq: 784, duration: 0.12, type: 'sine', gain: 0.3 },
          { freq: 1047, duration: 0.3, type: 'sine', gain: 0.4 }
        ], 0.12);
        break;
        
      case 'teen':
        // Power-up style
        this._playSequence([
          { freq: 440, duration: 0.08, type: 'square', gain: 0.2 },
          { freq: 550, duration: 0.08, type: 'square', gain: 0.2 },
          { freq: 660, duration: 0.08, type: 'square', gain: 0.2 },
          { freq: 880, duration: 0.15, type: 'square', gain: 0.25 }
        ], 0.06);
        break;
        
      case 'mature':
      default:
        this._playSequence([
          { freq: 600, duration: 0.1, type: 'sine', gain: 0.15 },
          { freq: 800, duration: 0.15, type: 'sine', gain: 0.12 }
        ], 0.1);
        break;
    }
  }

  /**
   * 🃏 Card flip sound
   */
  playFlipSound() {
    this.init();
    this._playTone(400, 0.06, 'sine', 0.15);
    setTimeout(() => this._playTone(600, 0.04, 'sine', 0.1), 50);
  }

  /**
   * 🔔 Click/tap sound
   */
  playClickSound() {
    this.init();
    this._playTone(800, 0.04, 'sine', 0.1);
  }

  /**
   * ⏱️ Timer tick sound
   */
  playTickSound() {
    this.init();
    this._playTone(1000, 0.03, 'sine', 0.08);
  }

  /**
   * 🚀 Level up sound
   */
  playLevelUpSound() {
    this.init();
    
    const baseFreq = this.theme === 'kids' ? 400 : this.theme === 'teen' ? 300 : 500;
    
    this._playSequence([
      { freq: baseFreq, duration: 0.1, type: 'sine', gain: 0.3 },
      { freq: baseFreq * 1.25, duration: 0.1, type: 'sine', gain: 0.28 },
      { freq: baseFreq * 1.5, duration: 0.1, type: 'sine', gain: 0.26 },
      { freq: baseFreq * 2, duration: 0.25, type: 'sine', gain: 0.35 }
    ], 0.1);
  }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;

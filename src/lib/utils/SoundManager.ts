class SoundManager {
    private context: AudioContext | null = null;
    private enabled = true;
    private ambientMusicNodes: AudioNode[] = [];

    async init() {
        if (!this.context && typeof window !== 'undefined') {
            try {
                this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
                // Resume context on user interaction
                if (this.context.state === 'suspended') {
                    await this.context.resume();
                }
            } catch (e) {
                console.warn('Web Audio API not supported', e);
            }
        }
    }

    startAmbientMusic() {
        if (!this.enabled || !this.context) return;
        if (this.ambientMusicNodes.length > 0) return; // Already playing

        const baseFreq = 55; // Low A

        // Osc 1: Deep Drone
        const osc1 = this.context.createOscillator();
        const gain1 = this.context.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, this.context.currentTime);
        gain1.gain.setValueAtTime(0.15, this.context.currentTime);

        // Osc 2: Texture
        const osc2 = this.context.createOscillator();
        const gain2 = this.context.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(baseFreq * 2 + 0.5, this.context.currentTime);
        gain2.gain.setValueAtTime(0.05, this.context.currentTime);

        // Filter
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.context.currentTime);
        filter.Q.setValueAtTime(5, this.context.currentTime);

        // Slow modulation (Breathing)
        const lfo = this.context.createOscillator();
        const lfoGain = this.context.createGain();
        lfo.frequency.setValueAtTime(0.2, this.context.currentTime);
        lfoGain.gain.setValueAtTime(0.05, this.context.currentTime);

        const masterGain = this.context.createGain();
        masterGain.gain.setValueAtTime(0.1, this.context.currentTime);

        // Connections
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(filter);
        gain2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(this.context.destination);

        // LFO connection to master gain (breathe effect)
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);

        osc1.start();
        osc2.start();
        lfo.start();

        this.ambientMusicNodes = [osc1, osc2, lfo, gain1, gain2, lfoGain, filter, masterGain];
    }

    stopAmbientMusic() {
        this.ambientMusicNodes.forEach(node => {
            if (node instanceof OscillatorNode) {
                node.stop();
            }
            node.disconnect();
        });
        this.ambientMusicNodes = [];
    }

    playTone(frequency: number, duration: number = 0.2, volume: number = 0.3) {
        if (!this.enabled || !this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    playSuccess() {
        this.playTone(800, 0.1, 0.3);
        setTimeout(() => this.playTone(1000, 0.15, 0.3), 100);
    }

    playError() {
        this.playTone(200, 0.3, 0.2);
    }

    playClick() {
        this.playTone(600, 0.05, 0.1);
    }

    playWin() {
        [400, 500, 600, 800].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 0.3), i * 100);
        });
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopAmbientMusic();
        }
    }

    isEnabled() {
        return this.enabled;
    }
}

export const soundManager = new SoundManager();

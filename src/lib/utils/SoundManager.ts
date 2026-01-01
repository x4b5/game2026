class SoundManager {
    private context: AudioContext | null = null;
    private enabled = true;
    private ambientMusicNodes: AudioNode[] = [];
    private pingInterval: any = null;

    async init() {
        if (!this.context && typeof window !== 'undefined') {
            try {
                this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
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
        if (this.ambientMusicNodes.length > 0) return;

        const now = this.context.currentTime;
        const baseFreq = 48.99; // Low G1

        // --- 1. Deep Sub Drone ---
        const subOsc = this.context.createOscillator();
        const subGain = this.context.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(baseFreq, now);
        subGain.gain.setValueAtTime(0.12, now);

        // --- 2. Dissonant Texture (Minor Second / Tritone) ---
        const textureOsc = this.context.createOscillator();
        const textureGain = this.context.createGain();
        textureOsc.type = 'sawtooth';
        // Playing a tritone above (root * 1.414)
        textureOsc.frequency.setValueAtTime(baseFreq * 1.414, now);
        textureGain.gain.setValueAtTime(0.04, now);

        // --- 3. Noise Floor (Wind/Static) ---
        const bufferSize = 2 * this.context.sampleRate;
        const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const noiseGain = this.context.createGain();
        noiseGain.gain.setValueAtTime(0.02, now);

        // --- 4. Filters ---
        const lpFilter = this.context.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(150, now);
        lpFilter.Q.setValueAtTime(8, now);

        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(400, now);
        noiseFilter.Q.setValueAtTime(0.5, now);

        // --- 5. Movement (LFOs) ---
        const lfo1 = this.context.createOscillator();
        const lfo1Gain = this.context.createGain();
        lfo1.frequency.setValueAtTime(0.15, now); // Very slow breath
        lfo1Gain.gain.setValueAtTime(0.06, now);

        const lfo2 = this.context.createOscillator(); // For filter movement
        const lfo2Gain = this.context.createGain();
        lfo2.frequency.setValueAtTime(0.05, now);
        lfo2Gain.gain.setValueAtTime(50, now);

        // --- 6. Master Output ---
        const masterGain = this.context.createGain();
        masterGain.gain.setValueAtTime(0.15, now);

        // --- Connections ---
        subOsc.connect(subGain);
        textureOsc.connect(textureGain);

        subGain.connect(lpFilter);
        textureGain.connect(lpFilter);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        lpFilter.connect(masterGain);
        masterGain.connect(this.context.destination);

        // Modulation
        lfo1.connect(lfo1Gain);
        lfo1Gain.connect(masterGain.gain);

        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(lpFilter.frequency);

        // Start everything
        subOsc.start();
        textureOsc.start();
        whiteNoise.start();
        lfo1.start();
        lfo2.start();

        this.ambientMusicNodes = [
            subOsc, textureOsc, whiteNoise,
            subGain, textureGain, noiseGain, masterGain,
            lpFilter, noiseFilter, lfo1, lfo1Gain, lfo2, lfo2Gain
        ];

        // --- 7. Random Mysterious Pings ---
        this.startRandomPings();
    }

    private startRandomPings() {
        if (this.pingInterval) return;

        const schedulePing = () => {
            const delay = Math.random() * 5000 + 3000; // Every 3-8 seconds
            this.pingInterval = setTimeout(() => {
                this.playMysteriousPing();
                schedulePing();
            }, delay);
        };
        schedulePing();
    }

    private playMysteriousPing() {
        if (!this.enabled || !this.context) return;

        const now = this.context.currentTime;
        const freq = [880, 1100, 1320, 1760][Math.floor(Math.random() * 4)]; // High harmonic frequencies

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const delay = this.context.createDelay();
        const feedback = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4); // Long decay

        // Simple Delay/Reverb Effect
        delay.delayTime.setValueAtTime(0.4, now);
        feedback.gain.setValueAtTime(0.4, now);

        osc.connect(gain);
        gain.connect(this.context.destination);

        // Echo loop
        gain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(this.context.destination);

        osc.start(now);
        osc.stop(now + 4.5);
    }

    stopAmbientMusic() {
        if (this.pingInterval) {
            clearTimeout(this.pingInterval);
            this.pingInterval = null;
        }

        this.ambientMusicNodes.forEach(node => {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
                try { node.stop(); } catch (e) { }
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

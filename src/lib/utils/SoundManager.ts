class SoundManager {
    private context: AudioContext | null = null;
    private enabled = true;
    private ambientMusicNodes: AudioNode[] = [];
    private pingInterval: any = null;
    private isInitialized = false;

    constructor() {
        // Try to initialize as soon as possible
        if (typeof window !== 'undefined') {
            this.addUnlockListeners();
        }
    }

    private addUnlockListeners() {
        const unlock = () => {
            if (this.context && this.context.state === 'suspended') {
                this.context.resume().then(() => {
                    console.log('AudioContext resumed via user interaction');
                    // If music was supposed to be playing but couldn't, start it now
                    if (this.ambientMusicNodes.length === 0 && this.isInitialized) {
                        this.startAmbientMusic();
                    }
                });
            }
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
        window.addEventListener('keydown', unlock);
    }

    async init() {
        if (typeof window === 'undefined') return;

        if (!this.context) {
            try {
                this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.isInitialized = true;

                if (this.context.state === 'suspended') {
                    await this.context.resume().catch(() => {
                        console.warn('Initial resume failed, waiting for user interaction');
                    });
                }
            } catch (e) {
                console.warn('Web Audio API not supported', e);
            }
        }
        return this.context;
    }

    startAmbientMusic() {
        if (!this.enabled || !this.context) return;

        // If context is suspended, we can't start nodes meaningfully yet
        // but we flag isInitialized so the unlock listeners will start it
        if (this.context.state === 'suspended') {
            console.log('AudioContext suspended, will start music after interaction');
            return;
        }

        if (this.ambientMusicNodes.length > 0) return;

        const now = this.context.currentTime;
        const baseFreq = 48.99; // Low G1

        // --- 1. Deep Sub Drone ---
        const subOsc = this.context.createOscillator();
        const subGain = this.context.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(baseFreq, now);
        subGain.gain.setValueAtTime(0.12, now);

        // --- 2. Dissonant Texture ---
        const textureOsc = this.context.createOscillator();
        const textureGain = this.context.createGain();
        textureOsc.type = 'sawtooth';
        textureOsc.frequency.setValueAtTime(baseFreq * 1.414, now);
        textureGain.gain.setValueAtTime(0.04, now);

        // --- 3. Broken AM Radio Effect ---
        const bufferSize = 2 * this.context.sampleRate;
        const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            noiseData[i] = Math.random() * 2 - 1;
        }
        const radioNoise = this.context.createBufferSource();
        radioNoise.buffer = noiseBuffer;
        radioNoise.loop = true;

        const radioFilter = this.context.createBiquadFilter();
        radioFilter.type = 'bandpass';
        radioFilter.frequency.setValueAtTime(1200, now);
        radioFilter.Q.setValueAtTime(1, now);

        const radioGain = this.context.createGain();
        radioGain.gain.setValueAtTime(0.04, now);

        const flickerLfo = this.context.createOscillator();
        const flickerGain = this.context.createGain();
        flickerLfo.type = 'square';
        flickerLfo.frequency.setValueAtTime(8, now);
        flickerGain.gain.setValueAtTime(0.03, now);

        const driftLfo = this.context.createOscillator();
        const driftGain = this.context.createGain();
        driftLfo.frequency.setValueAtTime(0.5, now);
        driftGain.gain.setValueAtTime(400, now);

        // --- 4. Deep Filters ---
        const lpFilter = this.context.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.setValueAtTime(150, now);
        lpFilter.Q.setValueAtTime(8, now);

        // --- 5. Movement ---
        const breatheLfo = this.context.createOscillator();
        const breatheGain = this.context.createGain();
        breatheLfo.frequency.setValueAtTime(0.15, now);
        breatheGain.gain.setValueAtTime(0.06, now);

        // --- 6. Master Output ---
        const masterGain = this.context.createGain();
        masterGain.gain.setValueAtTime(0.15, now);

        // --- Connections ---
        subOsc.connect(subGain);
        textureOsc.connect(textureGain);
        subGain.connect(lpFilter);
        textureGain.connect(lpFilter);
        lpFilter.connect(masterGain);

        radioNoise.connect(radioFilter);
        radioFilter.connect(radioGain);
        radioGain.connect(masterGain);

        flickerLfo.connect(flickerGain);
        flickerGain.connect(radioGain.gain);

        driftLfo.connect(driftGain);
        driftGain.connect(radioFilter.frequency);

        breatheLfo.connect(breatheGain);
        breatheGain.connect(masterGain.gain);

        masterGain.connect(this.context.destination);

        // Start everything
        subOsc.start();
        textureOsc.start();
        radioNoise.start();
        flickerLfo.start();
        driftLfo.start();
        breatheLfo.start();

        this.ambientMusicNodes = [
            subOsc, textureOsc, radioNoise, flickerLfo, driftLfo, breatheLfo,
            subGain, textureGain, radioGain, flickerGain, driftGain, breatheGain,
            lpFilter, radioFilter, masterGain
        ];

        this.startRandomPings();
    }

    private startRandomPings() {
        if (this.pingInterval) return;

        const schedulePing = () => {
            const delay = Math.random() * 5000 + 3000;
            this.pingInterval = setTimeout(() => {
                this.playMysteriousPing();
                schedulePing();
            }, delay);
        };
        schedulePing();
    }

    private playMysteriousPing() {
        if (!this.enabled || !this.context || this.context.state === 'suspended') return;

        const now = this.context.currentTime;
        const freq = [880, 1100, 1320, 1760][Math.floor(Math.random() * 4)];

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const delay = this.context.createDelay();
        const feedback = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4);

        delay.delayTime.setValueAtTime(0.4, now);
        feedback.gain.setValueAtTime(0.4, now);

        osc.connect(gain);
        gain.connect(this.context.destination);

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
        if (!this.enabled || !this.context || this.context.state === 'suspended') return;
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
        if (!enabled) { this.stopAmbientMusic(); }
    }

    isEnabled() { return this.enabled; }
}

export const soundManager = new SoundManager();

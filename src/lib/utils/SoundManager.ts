class SoundManager {
    private context: AudioContext | null = null;
    private enabled = true;

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
    }

    isEnabled() {
        return this.enabled;
    }
}

export const soundManager = new SoundManager();

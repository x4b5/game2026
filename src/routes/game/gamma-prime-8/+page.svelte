<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";

    let gameContainer: any;
    let frequency = $state(440); // Starting at A4
    let targetFrequency = 0;
    let isLocked = $state(false);
    let proximity = $state(0);
    let audioContext: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    let isAccessLocked = $state(true);
    let accessCode = $state("");
    let accessError = $state("");
    let showRevelation = $state(false);

    function checkAccessCode() {
        if (accessCode.toLowerCase().trim() === "neus") {
            isAccessLocked = false;
            soundManager.playSuccess();
        } else {
            accessError = "Onjuiste code!";
            soundManager.playError();
        }
    }

    const MIN_FREQ = 200;
    const MAX_FREQ = 800;
    const TOLERANCE = 25;

    onMount(() => {
        // Random target frequency
        targetFrequency =
            Math.floor(Math.random() * (MAX_FREQ - MIN_FREQ)) + MIN_FREQ;
        initAudio();

        return () => {
            stopTone();
        };
    });

    async function initAudio() {
        if (typeof window === "undefined") return;

        try {
            audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            await soundManager.init();
        } catch (e) {
            console.warn("Audio not available", e);
        }
    }

    function startTone() {
        if (!audioContext || oscillator) return;

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";
        gainNode.gain.value = 0.2;

        oscillator.start();
    }

    function stopTone() {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
        if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
        }
    }

    function updateFrequency(value: number) {
        frequency = value;

        if (oscillator) {
            oscillator.frequency.value = frequency;
        }

        // Calculate proximity
        const distance = Math.abs(frequency - targetFrequency);
        proximity = Math.max(0, 100 - (distance / (MAX_FREQ - MIN_FREQ)) * 100);

        // Visual/audio feedback when close
        if (distance < 50 && !isLocked) {
            soundManager.playClick();
        }
    }

    function lockFrequency() {
        const distance = Math.abs(frequency - targetFrequency);

        if (distance <= TOLERANCE) {
            isLocked = true;
            stopTone();
            soundManager.playWin();
            showRevelation = true;
        } else {
            soundManager.playError();
        }
    }

    function handleSliderInput(e: Event) {
        const target = e.target as HTMLInputElement;
        updateFrequency(parseInt(target.value));
    }

    $effect(() => {
        if (oscillator && !isLocked) {
            oscillator.frequency.value = frequency;
        }
    });
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="gamma-prime"
    title="🗼 Gamma Prime"
>
    {#if isAccessLocked}
        <div class="lock-screen">
            <h3>🔒 VEILIGHEIDSPROTOCOL</h3>
            <p>Voer de toegangscode in om het systeem te activeren.</p>
            <div class="input-group">
                <input
                    type="text"
                    bind:value={accessCode}
                    placeholder="Wachtwoord..."
                    class="access-input"
                    onkeydown={(e) => e.key === "Enter" && checkAccessCode()}
                />
                <button class="unlock-btn" onclick={checkAccessCode}>→</button>
            </div>
            {#if accessError}
                <p class="error-text">{accessError}</p>
            {/if}
        </div>
    {:else}
        <div class="frequency-game">
            <div class="instructions">
                <p>
                    Stem af op de juiste frequentie om de <strong
                        >bron van het signaal</strong
                    > te onthullen.
                </p>
            </div>

            <!-- Waveform Display -->
            <div class="waveform-display">
                <div
                    class="signal-strength"
                    style:width="{proximity}%"
                    style:--signal-color={proximity > 90
                        ? "#22c55e"
                        : proximity > 50
                          ? "#f59e0b"
                          : "#6366f1"}
                >
                    <div class="signal-bar"></div>
                </div>

                <div class="frequency-reading">
                    <span class="hz-value">{frequency}</span>
                    <span class="hz-unit">Hz</span>
                </div>

                <!-- Visual waveform -->
                <div class="wave-container">
                    {#each Array(20) as _, i}
                        <div
                            class="wave-bar"
                            style:height="{20 +
                                Math.sin(
                                    (i / 20) * Math.PI * 4 + frequency / 100,
                                ) *
                                    (proximity / 5)}%"
                            style:opacity={proximity / 100}
                        ></div>
                    {/each}
                </div>
            </div>

            <!-- Frequency Slider -->
            <div class="tuner-controls">
                <button
                    class="control-btn"
                    onclick={() => !isLocked && startTone()}
                >
                    ▶️ Speel Toon
                </button>
                <button class="control-btn" onclick={() => stopTone()}>
                    ⏸️ Stop
                </button>
            </div>

            <div class="slider-container">
                <input
                    type="range"
                    min={MIN_FREQ}
                    max={MAX_FREQ}
                    bind:value={frequency}
                    oninput={handleSliderInput}
                    disabled={isLocked}
                    class="frequency-slider"
                />
                <div class="slider-labels">
                    <span>{MIN_FREQ} Hz</span>
                    <span>{MAX_FREQ} Hz</span>
                </div>
            </div>

            <button
                class="lock-button"
                class:ready={proximity > 90}
                onclick={lockFrequency}
                disabled={isLocked}
            >
                {isLocked ? "🔒 Vergrendeld!" : "🔓 Vergrendel Frequentie"}
            </button>

            <div class="proximity-indicator">
                Nabijheid: <strong>{proximity.toFixed(0)}%</strong>
            </div>
        </div>
    {/if}
    {#if showRevelation}
        <div class="revelation-overlay" transition:fade>
            <div class="revelation-card">
                <div class="icon">🤡</div>
                <h1>VALS ALARM!</h1>
                <p>Het signaal is getraceerd naar een lokale kroeg...</p>
                <div class="story-box">
                    Het blijkt een groep<strong> verdwaalde carnavalisten</strong> te zijn
                    die na 3 dagen feesten vergeten  zijn hun alienpakken uit te trekken!
                </div>
                <p class="sub-text">"Alaaf? 👽🍺"</p>
                <button
                    class="finish-btn"
                    onclick={() => {
                        gameContainer?.win(Math.floor(proximity * 20));
                        setTimeout(() => goto("/game/finale"), 1500);
                    }}
                >
                    MISSIE AFRONDEN
                </button>
            </div>
        </div>
    {/if}
</GameContainer>

<style>
    .frequency-game {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .instructions {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--text-muted);
    }

    .waveform-display {
        background: var(--glass);
        border: 2px solid var(--glass-border);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
    }

    .signal-strength {
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        background: var(--signal-color);
        transition:
            width 0.3s ease,
            background 0.3s ease;
        box-shadow: 0 0 10px var(--signal-color);
    }

    .signal-bar {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, var(--signal-color));
        animation: pulse-signal 1s ease-in-out infinite;
    }

    @keyframes pulse-signal {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .frequency-reading {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .hz-value {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary);
        font-family: monospace;
    }

    .hz-unit {
        font-size: 1.5rem;
        color: var(--text-muted);
        margin-left: 0.5rem;
    }

    .wave-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2px;
        height: 80px;
    }

    .wave-bar {
        flex: 1;
        background: linear-gradient(to top, var(--primary), var(--secondary));
        border-radius: 2px;
        transition:
            height 0.1s ease,
            opacity 0.3s ease;
    }

    .tuner-controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .control-btn {
        flex: 1;
        padding: 0.75rem;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        color: white;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .control-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .slider-container {
        margin-bottom: 2rem;
    }

    .frequency-slider {
        width: 100%;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--glass);
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--glass-border);
    }

    .frequency-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary);
        cursor: pointer;
        box-shadow: 0 0 10px var(--primary);
        transition: transform 0.2s ease;
    }

    .frequency-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .frequency-slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary);
        cursor: pointer;
        border: none;
        box-shadow: 0 0 10px var(--primary);
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .lock-button {
        width: 100%;
        padding: 1rem;
        border-radius: 12px;
        background: var(--glass);
        border: 2px solid var(--glass-border);
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }

    .lock-button.ready {
        background: var(--primary);
        border-color: var(--primary);
        animation: glow-pulse 1s ease-in-out infinite;
    }

    @keyframes glow-pulse {
        0%,
        100% {
            box-shadow: 0 0 20px var(--primary);
        }
        50% {
            box-shadow: 0 0 40px var(--primary);
        }
    }

    .lock-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .proximity-indicator {
        text-align: center;
        font-size: 1.125rem;
        color: var(--text-muted);
    }

    .proximity-indicator strong {
        color: var(--primary);
        font-size: 1.5rem;
    }
    .lock-screen {
        text-align: center;
        padding: 2rem;
        background: var(--glass);
        border: 2px solid var(--glass-border);
        border-radius: 20px;
        color: white;
    }

    .input-group {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin: 1.5rem 0;
    }

    .access-input {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--primary);
        padding: 0.8rem;
        border-radius: 8px;
        color: white;
        font-family: inherit;
        text-align: center;
        font-size: 1.1rem;
    }

    .access-input:focus {
        outline: none;
        box-shadow: 0 0 10px var(--primary);
    }

    .unlock-btn {
        background: var(--primary);
        border: none;
        padding: 0 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        transition: all 0.2s;
    }

    .unlock-btn:hover {
        transform: scale(1.05);
    }

    .error-text {
        color: #ef4444;
        font-weight: bold;
    }

    .revelation-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        padding: 2rem;
        text-align: center;
    }

    .revelation-card {
        background: linear-gradient(135deg, #1e1b4b, #312e81);
        padding: 2.5rem;
        border-radius: 24px;
        border: 2px solid #6366f1;
        box-shadow: 0 0 50px rgba(99, 102, 241, 0.4);
        max-width: 400px;
        animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .revelation-card .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 2s infinite;
    }

    .story-box {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 12px;
        margin: 1.5rem 0;
        line-height: 1.6;
        font-size: 1.1rem;
        color: #e0e7ff;
    }

    .sub-text {
        font-style: italic;
        color: #818cf8;
        margin-bottom: 2rem;
    }

    .finish-btn {
        width: 100%;
        padding: 1rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .finish-btn:hover {
        transform: scale(1.05);
        background: #16a34a;
    }

    @keyframes pop-in {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>

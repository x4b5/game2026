<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";
    import { fade, scale, fly, slide } from "svelte/transition";
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
            accessError = "⚠️ ACCESS DENIED: INVALID KEY";
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

<svelte:head>
    <title>Gamma Prime // SIGNAL ANALYSIS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Audiowide&family=Chakra+Petch:wght@400;700&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="omicron-page">
    <div class="env-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="gamma-prime"
        title="🗼 GAMMA PRIME: SIGNAL TRACKER"
        nextUrl="/game/finale"
    >
        {#if isAccessLocked}
            <div class="lock-screen-panel" in:fade>
                <div class="panel-header">
                    <span class="status-icon blink">🔒</span>
                    VEILIGHEIDSPROTOCOL // ACCESS REQUIRED
                </div>
                <div class="panel-content glass-card">
                    <div class="deco-box tl"></div>
                    <div class="deco-box br"></div>

                    <p class="instruction-text">
                        Het systeem is vergrendeld. Voer de biomechanische
                        encryptiesleutel in om de signaaltracer te activeren.
                    </p>

                    <div class="code-entry-group">
                        <div class="input-container">
                            <input
                                type="text"
                                bind:value={accessCode}
                                placeholder="ACCESS KEY..."
                                class="cyber-input"
                                onkeydown={(e) =>
                                    e.key === "Enter" && checkAccessCode()}
                            />
                            <div class="input-line"></div>
                        </div>
                        <button
                            class="unlock-btn cyber-btn primary"
                            onclick={checkAccessCode}
                        >
                            <span class="btn-text">UNLOCK</span>
                        </button>
                    </div>

                    {#if accessError}
                        <div class="error-banner" transition:slide>
                            <span class="icon">⚠️</span>
                            {accessError}
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="frequency-game-container" in:fade>
                <div class="mission-briefing glass-card">
                    <p class="brief-text">
                        <span class="label">>> OBJECTIVE:</span>
                        Stem af op de exacte frequentie van de bron om de positie
                        te onthullen. Zoek naar de sonische harmonie.
                    </p>
                </div>

                <!-- Waveform Display -->
                <div class="analyzer-panel glass-card">
                    <div class="panel-header">
                        SIGNAL ANALYZER // {frequency}Hz
                    </div>

                    <div class="signal-gauge-container">
                        <div class="gauge-background"></div>
                        <div
                            class="gauge-fill"
                            style:width="{proximity}%"
                            style:--gauge-color={proximity > 90
                                ? "#10b981"
                                : proximity > 50
                                  ? "#f59e0b"
                                  : "#3b82f6"}
                        >
                            <div class="gauge-scanner"></div>
                        </div>
                    </div>

                    <div class="visualization-area">
                        <div class="wave-container">
                            {#each Array(30) as _, i}
                                <div
                                    class="wave-bar"
                                    style:height="{25 +
                                        Math.sin(
                                            (i / 30) * Math.PI * 6 +
                                                frequency / 50,
                                        ) *
                                            (proximity / 4)}%"
                                    style:opacity={0.2 +
                                        (proximity / 100) * 0.8}
                                    style:--bar-color={proximity > 80
                                        ? "#10b981"
                                        : "#3b82f6"}
                                ></div>
                            {/each}
                        </div>
                    </div>

                    <div class="hz-display-box">
                        <span class="hz-value">{frequency}</span>
                        <span class="hz-unit">HZ</span>
                    </div>
                </div>

                <!-- Tuner Controls -->
                <div class="tuner-panel glass-card">
                    <div class="panel-header">TUNER CONTROLS</div>

                    <div class="audio-actions">
                        <button
                            class="cyber-btn secondary small"
                            onclick={() => !isLocked && startTone()}
                            disabled={isLocked}
                        >
                            ▶️ LISTEN
                        </button>
                        <button
                            class="cyber-btn danger small"
                            onclick={() => stopTone()}
                        >
                            ⏸️ MUTE
                        </button>
                    </div>

                    <div class="slider-wrapper">
                        <div
                            class="slider-track-glow"
                            style:width="{((frequency - MIN_FREQ) /
                                (MAX_FREQ - MIN_FREQ)) *
                                100}%"
                        ></div>
                        <input
                            type="range"
                            min={MIN_FREQ}
                            max={MAX_FREQ}
                            bind:value={frequency}
                            oninput={handleSliderInput}
                            disabled={isLocked}
                            class="cyber-slider"
                        />
                        <div class="freq-labels">
                            <span>{MIN_FREQ}Hz</span>
                            <span>{MAX_FREQ}Hz</span>
                        </div>
                    </div>

                    <button
                        class="cyber-btn big-action"
                        class:ready={proximity > 90}
                        onclick={lockFrequency}
                        disabled={isLocked}
                    >
                        <span class="btn-text">
                            {isLocked
                                ? "🔒 FREQUENCY LOCKED"
                                : "🔓 LOCK SIGNAL"}
                        </span>
                        <div class="btn-glitch"></div>
                    </button>

                    <div class="proximity-readout">
                        <span class="label">SYNC STATUS:</span>
                        <span class="value" class:synced={proximity > 90}
                            >{proximity.toFixed(0)}%</span
                        >
                    </div>
                </div>
            </div>
        {/if}

        {#if showRevelation}
            <div class="revelation-overlay" transition:fade>
                <div class="revelation-card glass-card success">
                    <div class="deco-corner tl"></div>
                    <div class="deco-corner br"></div>

                    <div class="revelation-header">
                        <span class="icon">🤡</span>
                        <h1 class="glitch-title" data-text="VALS ALARM">
                            VALS ALARM!
                        </h1>
                    </div>

                    <div class="intel-report">
                        <p class="report-text">
                            Het signaal is getraceerd naar een lokale kroeg...
                        </p>
                        <div class="revelation-details">
                            <span class="prefix">>> DETECTIE:</span>
                            Het blijkt een groep
                            <strong>verdwaalde carnavalisten</strong> te zijn die
                            na 3 dagen feesten vergeten zijn hun alienpakken uit
                            te trekken!
                        </div>
                        <p class="comic-relief">"Alaaf? 👽🍺"</p>
                    </div>

                    <button
                        class="cyber-btn success-action"
                        onclick={() => {
                            gameContainer?.win(Math.floor(proximity * 20));
                        }}
                    >
                        <span class="btn-text">MISSIE AFRONDEN</span>
                        <div class="glitch-effect"></div>
                    </button>
                </div>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap");

    :global(body) {
        background-color: #020617;
        margin: 0;
        color: #e2e8f0;
    }

    .omicron-page {
        position: relative;
        min-height: 100vh;
        font-family: "Rajdhani", sans-serif;
    }

    /* Background Effects */
    .env-bg {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            #0f172a 0%,
            #020617 100%
        );
        z-index: -1;
    }

    .scanlines {
        position: fixed;
        inset: 0;
        background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.05) 50%
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 100;
        opacity: 0.3;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 40%,
            rgba(0, 0, 0, 0.8) 100%
        );
        pointer-events: none;
        z-index: 101;
    }

    /* Panel Styles */
    .glass-card {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(59, 130, 246, 0.2);
        backdrop-filter: blur(12px);
        padding: 2rem;
        position: relative;
    }

    .panel-header {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.75rem;
        color: #3b82f6;
        opacity: 0.8;
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .deco-box {
        position: absolute;
        width: 12px;
        height: 12px;
        border: 2px solid #3b82f6;
    }
    .deco-box.tl {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
    }
    .deco-box.br {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
    }

    /* Lock Screen */
    .lock-screen-panel {
        max-width: 500px;
        margin: 2rem auto;
        text-align: center;
    }

    .instruction-text {
        font-size: 1.1rem;
        color: #94a3b8;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .code-entry-group {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }

    .input-container {
        width: 100%;
        position: relative;
    }

    .cyber-input {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: none;
        padding: 1rem;
        font-family: "Share Tech Mono", monospace;
        color: #fff;
        font-size: 1.5rem;
        text-align: center;
        letter-spacing: 4px;
    }

    .cyber-input:focus {
        outline: none;
    }

    .input-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #3b82f6;
        box-shadow: 0 0 10px #3b82f6;
    }

    /* Frequency Game Container */
    .frequency-game-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .mission-briefing {
        padding: 1rem 1.5rem !important;
        border-left: 4px solid #3b82f6 !important;
    }

    .brief-text {
        margin: 0;
        font-size: 1rem;
        color: #cbd5e1;
        line-height: 1.5;
    }

    .brief-text .label {
        font-family: "Share Tech Mono", monospace;
        color: #3b82f6;
        margin-right: 0.5rem;
    }

    /* Analyzer Panel */
    .analyzer-panel {
        padding-top: 1rem !important;
    }

    .signal-gauge-container {
        position: relative;
        height: 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 1.5rem;
    }

    .gauge-fill {
        height: 100%;
        background: var(--gauge-color);
        box-shadow: 0 0 15px var(--gauge-color);
        transition:
            width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            background 0.5s;
        position: relative;
    }

    .gauge-scanner {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
        );
        animation: scanner-loop 1.5s infinite;
    }

    @keyframes scanner-loop {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-500%);
        }
    }

    .visualization-area {
        height: 120px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .wave-container {
        display: flex;
        align-items: center;
        gap: 2px;
        height: 100%;
        width: 100%;
        padding: 0 1rem;
    }

    .wave-bar {
        flex: 1;
        background: var(--bar-color);
        border-radius: 1px;
        transition:
            height 0.1s linear,
            background 0.3s;
        box-shadow: 0 0 5px var(--bar-color);
    }

    .hz-display-box {
        text-align: center;
        font-family: "Orbitron", sans-serif;
    }

    .hz-value {
        font-size: 3.5rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: -2px;
    }

    .hz-unit {
        font-size: 1.2rem;
        color: #3b82f6;
        margin-left: 0.5rem;
    }

    /* Tuner Panel */
    .audio-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .slider-wrapper {
        position: relative;
        margin-bottom: 2.5rem;
        padding-top: 1rem;
    }

    .slider-track-glow {
        position: absolute;
        top: 14px;
        left: 0;
        height: 2px;
        background: #3b82f6;
        box-shadow: 0 0 15px #3b82f6;
        opacity: 0.3;
        pointer-events: none;
    }

    .cyber-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
    }

    .cyber-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 24px;
        height: 24px;
        background: #fff;
        border: 4px solid #3b82f6;
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    }

    .freq-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 0.75rem;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        color: #64748b;
    }

    .big-action {
        width: 100% !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #64748b !important;
        padding: 1.25rem !important;
        font-size: 1.2rem !important;
        margin-bottom: 1.5rem !important;
    }

    .big-action.ready {
        background: #3b82f6 !important;
        border-color: #3b82f6 !important;
        color: #fff !important;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
        animation: cyber-glow 2s infinite;
    }

    @keyframes cyber-glow {
        0%,
        100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
        50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
        }
    }

    .proximity-readout {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        font-family: "Orbitron", sans-serif;
    }

    .proximity-readout .label {
        font-size: 0.8rem;
        color: #64748b;
    }
    .proximity-readout .value {
        font-size: 1.5rem;
        color: #3b82f6;
    }
    .proximity-readout .value.synced {
        color: #10b981;
        text-shadow: 0 0 10px #10b981;
    }

    /* Revelation Overlay */
    .revelation-overlay {
        position: absolute;
        inset: 0;
        background: rgba(2, 6, 23, 0.9);
        backdrop-filter: blur(8px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }

    .revelation-card {
        max-width: 450px;
        width: 100%;
        text-align: center;
        border-color: #fbbf24 !important;
        box-shadow: 0 0 50px rgba(251, 191, 36, 0.2);
    }

    .revelation-header {
        margin-bottom: 2rem;
    }

    .revelation-header .icon {
        font-size: 4rem;
        display: block;
        margin-bottom: 1rem;
        animation: emoji-bounce 2s infinite ease-in-out;
    }

    @keyframes emoji-bounce {
        0%,
        100% {
            transform: scale(1) rotate(0deg);
        }
        50% {
            transform: scale(1.2) rotate(10deg);
        }
    }

    .glitch-title {
        font-family: "Orbitron", sans-serif;
        font-size: 2.5rem;
        color: #fff;
        position: relative;
    }

    .intel-report {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .report-text {
        font-size: 1.1rem;
        color: #94a3b8;
    }

    .revelation-details {
        background: rgba(251, 191, 36, 0.1);
        border-left: 2px solid #fbbf24;
        padding: 1rem;
        color: #fbbf24;
        font-family: "Rajdhani", sans-serif;
        line-height: 1.5;
    }

    .revelation-details .prefix {
        font-family: "Share Tech Mono", monospace;
        font-weight: 700;
        margin-right: 0.5rem;
    }

    .comic-relief {
        text-align: center;
        font-family: "Audiowide", cursive;
        font-size: 1.5rem;
        color: #fff;
        margin: 0;
    }

    /* Cyber Buttons Base */
    .cyber-btn {
        position: relative;
        padding: 0.75rem 1.5rem;
        border: none;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    }

    .cyber-btn.primary {
        background: #3b82f6;
        width: 100%;
    }
    .cyber-btn.secondary {
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid #3b82f6;
        flex: 1;
    }
    .cyber-btn.danger {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #ef4444;
        flex: 1;
    }
    .cyber-btn.success-action {
        background: #10b981;
        color: #000;
        width: 100%;
        font-size: 1.2rem;
        padding: 1.25rem;
    }

    .cyber-btn:hover:not(:disabled) {
        filter: brightness(1.2);
        transform: translateY(-2px);
    }

    /* Additional helpers */
    .blink {
        animation: blink-anim 1s infinite alternate;
    }
    @keyframes blink-anim {
        from {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
    }

    .error-banner {
        color: #ef4444;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.85rem;
        margin-top: 1rem;
    }

    @media (max-width: 480px) {
        .hz-value {
            font-size: 2.5rem;
        }
        .glass-card {
            padding: 1.5rem;
        }
    }
</style>

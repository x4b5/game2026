<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade, fly, scale, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";
    import HandTracker from "$lib/components/HandTracker.svelte";
    import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

    let gameContainer: any;
    let gameActive = $state(false);
    let waterLevel = $state(0);
    let floodLevel = $state(0);
    let baseFloodThreshold = $state(80);
    let floodThreshold = $state(80); // Starts high (easy), drops over time

    let aliens = $state<
        { id: number; x: number; y: number; speed: number; type: number }[]
    >([]);
    let aliensCaught = $state(0);
    let aliensEscaped = $state(0);
    let timeLeft = $state(45);
    let isHolding = $state(false);
    let isCritical = $state(false);

    // Hand Tracking
    let tracker: any;
    let handX = $state(50);
    let handY = $state(50); // 0-100
    let isHandActive = $state(false);

    const TARGET_SCORE = 20;
    const MAX_ESCAPED = 5;
    let isInverted = $state(false);
    let invertTimer = 0;

    let spawnTimer: any;
    let gameLoop: any;
    let countdownTimer: any;
    let currentId = 0;

    // Visual particles for splashes
    let particles = $state<
        { id: number; x: number; y: number; life: number }[]
    >([]);
    let particleId = 0;

    onMount(() => {
        // Init
    });

    function startGame() {
        gameActive = true;
        aliens = [];
        particles = [];
        waterLevel = 0;
        floodLevel = 0;
        baseFloodThreshold = 80;
        floodThreshold = 80;
        aliensCaught = 0;
        aliensEscaped = 0;
        timeLeft = 45;
        isCritical = false;
        isInverted = false;
        invertTimer = 0;

        soundManager.playClick();

        // Spawn logic: Recursive to allow dynamic intervals
        const scheduleNextSpawn = () => {
            if (!gameActive) return;
            spawnAlien();
            // Interval gets shorter over time: starts at 800ms, drops to 400ms
            const interval = Math.max(400, 800 - (45 - timeLeft) * 8);
            spawnTimer = setTimeout(scheduleNextSpawn, interval);
        };
        scheduleNextSpawn();

        gameLoop = requestAnimationFrame(updateGame);
        countdownTimer = setInterval(() => {
            if (gameActive) {
                timeLeft--;
                if (timeLeft <= 0) {
                    endGame(true);
                }
            }
        }, 1000);
    }

    function spawnAlien() {
        if (!gameActive) return;
        // Speed up based on time elapsed
        const timeFactor = (45 - timeLeft) * 0.05;

        // 5% chance for a Ghost Drone if less than 20s left
        const isGhost = timeLeft < 20 && Math.random() < 0.05;
        const speed = (isGhost ? 5.0 : 1.5) + timeFactor + Math.random() * 2.0;

        const alien = {
            id: currentId++,
            x: Math.random() * 80 + 10,
            y: -10,
            speed: speed,
            type: isGhost ? 3 : Math.floor(Math.random() * 3),
        };
        aliens = [...aliens, alien];
    }

    function spawnSplash(x: number, y: number) {
        // Percentage based x, y
        for (let i = 0; i < 5; i++) {
            particles.push({
                id: particleId++,
                x: x + (Math.random() - 0.5) * 5,
                y: y,
                life: 1.0,
            });
        }
    }

    function handleHandResults(results: HandLandmarkerResult) {
        if (results.landmarks && results.landmarks.length > 0) {
            isHandActive = true;
            const hand = results.landmarks[0];
            const indexTip = hand[8]; // Index finger tip
            // Map 0-1 to 0-100 percent
            // Invert X because video is mirrored
            handX = (1 - indexTip.x) * 100;
            handY = indexTip.y * 100;
        } else {
            isHandActive = false;
        }
    }

    function updateGame() {
        if (!gameActive) return;

        // Difficulty increase: normalized drop in the base line
        baseFloodThreshold = Math.max(30, baseFloodThreshold - 0.05);

        // Handle Inversion Logic
        if (invertTimer > 0) {
            invertTimer--;
            if (invertTimer === 0) isInverted = false;
        } else if (Math.random() < 0.001) {
            // 0.1% chance per frame to trigger (very rare now)
            isInverted = true;
            invertTimer = 60; // Inverted for 1 second approx
            soundManager.playError();
        }

        // Fluctuation: Violent Sine wave + jitter
        const fluctuation =
            Math.sin(Date.now() / 1500) * 12 + (Math.random() - 0.5) * 6;
        floodThreshold = Math.max(
            15,
            Math.min(95, baseFloodThreshold + fluctuation),
        );

        // Update Water Level
        if (isHandActive) {
            const effectiveY = isInverted ? 100 - handY : handY;
            const targetLevel = Math.max(0, Math.min(100, 100 - effectiveY));
            const diff = targetLevel - waterLevel;
            // Signal Interference: 0.5% chance to "lock" controls
            const reactivity = Math.random() < 0.005 ? 0.5 : 7.0;
            if (Math.abs(diff) < reactivity) {
                waterLevel = targetLevel;
            } else {
                waterLevel += Math.sign(diff) * reactivity;
            }
        } else {
            if (isHolding) {
                // Rise speed is slightly variable
                const riseSpeed = 3.0 + Math.random() * 2.0;
                waterLevel = Math.min(100, waterLevel + riseSpeed);
            } else {
                // Fall speed varies randomly between 1.5 and 4.5
                const fallSpeed = 1.5 + Math.random() * 3.0;
                waterLevel = Math.max(0, waterLevel - fallSpeed);
            }
        }

        // Add random turbulence (unpredictable shifts)
        if (Math.random() < 0.08) {
            // 8% chance per frame
            const shift = (Math.random() - 0.5) * 25; // Shift between -12.5 and +12.5
            waterLevel = Math.max(0, Math.min(100, waterLevel + shift));
        }

        // Update Flood Danger (slower increase)
        if (waterLevel > floodThreshold) {
            floodLevel = Math.min(100, floodLevel + 1.2);
        } else {
            floodLevel = Math.max(0, floodLevel - 2.5);
        }

        isCritical = floodLevel > 80;

        if (floodLevel >= 100) {
            soundManager.playError();
            endGame(false);
            return;
        }

        // Update Particles
        particles = particles
            .map((p) => ({ ...p, y: p.y - 1, life: p.life - 0.05 }))
            .filter((p) => p.life > 0);

        // Update Aliens & Collision (with minimal wind jitter)
        aliens = aliens.map((a) => ({
            ...a,
            y: a.y + a.speed,
            x: Math.max(5, Math.min(95, a.x + (Math.random() - 0.5) * 0.4)),
        }));
        const surfaceY = 100 - waterLevel;

        // Check Caught
        const caught = aliens.filter((a) => a.y >= surfaceY);
        if (caught.length > 0) {
            caught.forEach((a) => spawnSplash(a.x, 100 - waterLevel));
            aliensCaught += caught.length;
            soundManager.playSuccess();
            aliens = aliens.filter((a) => a.y < surfaceY);

            if (aliensCaught >= TARGET_SCORE) {
                endGame(true);
                return;
            }
        }

        // Check Escaped
        const escaped = aliens.filter((a) => a.y > 100);
        if (escaped.length > 0) {
            aliensEscaped += escaped.length;
            soundManager.playError();
            aliens = aliens.filter((a) => a.y <= 100);

            if (aliensEscaped >= MAX_ESCAPED) {
                endGame(false);
                return;
            }
        }

        gameLoop = requestAnimationFrame(updateGame);
    }

    function endGame(victory: boolean) {
        gameActive = false;
        clearTimeout(spawnTimer);
        clearInterval(countdownTimer);
        cancelAnimationFrame(gameLoop);

        if (victory) {
            gameContainer.win(aliensCaught * 100 + timeLeft * 50);
        } else {
            gameContainer.lose();
        }
    }
</script>

<svelte:head>
    <title>Mosa Defense // SYSTEM ACTIVE</title>
</svelte:head>

<div class="defense-page">
    <div class="tracker-layer">
        <HandTracker
            bind:this={tracker}
            onResults={handleHandResults}
            showDebug={true}
        />
    </div>

    <!-- Dynamic Background -->
    <div class="env-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette" class:critical-pulse={isCritical}></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="mosa-defense"
        title="🌊 DEFENSE PROTOCOL: SERVAASBRUG"
        nextUrl="/game/mosa-bridge-44/victory"
    >
        {#if !gameActive}
            <div class="start-screen glass-panel" in:fade>
                <div class="deco-corner tl"></div>
                <div class="deco-corner br"></div>

                <h2 class="glitch-title" data-text="MAAS PEIL CONTROLE">
                    MAAS PEIL CONTROLE
                </h2>

                <div class="intel-grid">
                    <div class="instruction-card">
                        <div class="icon">🖐️</div>
                        <p>
                            <strong>BESTURING</strong><br />Beweeg je hand
                            omhoog/omlaag voor waterpeil.
                        </p>
                    </div>
                    <div class="instruction-card">
                        <div class="icon">👾</div>
                        <p>
                            <strong>DOELWIT</strong><br />Vang de drones in het
                            water voor ze ontsnappen.
                        </p>
                    </div>
                    <div class="instruction-card danger">
                        <div class="icon">⚠️</div>
                        <p>
                            <strong>GEVAAR</strong><br />Houd het peil onder de
                            rode limiet!
                        </p>
                    </div>
                </div>

                <div class="controls-setup">
                    <button
                        class="cyber-btn secondary"
                        onclick={() => tracker?.enableCam()}
                    >
                        <span class="btn-text">CAMERA ACTIVEREN</span>
                    </button>
                    <button class="cyber-btn primary" onclick={startGame}>
                        <span class="btn-text">START MISSIE</span>
                        <div class="glitch-effect"></div>
                    </button>
                </div>
            </div>
        {:else}
            <div
                class="game-area"
                class:critical-border={isCritical}
                onpointerdown={() => (isHolding = true)}
                onpointerup={() => (isHolding = false)}
                onpointerleave={() => (isHolding = false)}
            >
                <!-- HUD -->
                <div class="hud-top">
                    <div class="hud-stat">
                        <span class="label">DRONES GEVANGEN</span>
                        <span class="value cyan"
                            >{aliensCaught}<span class="total"
                                >/{TARGET_SCORE}</span
                            ></span
                        >
                    </div>
                    <div class="hud-stat right">
                        <span class="label">ONTSNAPT</span>
                        <span class="value red"
                            >{aliensEscaped}<span class="total"
                                >/{MAX_ESCAPED}</span
                            ></span
                        >
                    </div>
                </div>

                {#if isInverted}
                    <div class="alert-overlay" in:fade={{ duration: 200 }}>
                        <div class="alert-box">
                            <span class="blink">WARNING: SIGNAL INVERTED</span>
                        </div>
                    </div>
                {/if}

                <!-- Hand Cursor -->
                {#if isHandActive}
                    <div
                        class="target-reticle"
                        style="left: {handX}%; top: {handY}%"
                    >
                        <div class="ring"></div>
                        <div class="dot"></div>
                        <div class="crosshairs"></div>
                    </div>
                {/if}

                <!-- Danger Limit Line -->
                <div
                    class="limit-line-container"
                    style:bottom="{floodThreshold}%"
                >
                    <div class="limit-line"></div>
                    <div class="limit-text">
                        MAXIMAAL PEIL <span class="val"
                            >{Math.round(floodThreshold)}%</span
                        >
                    </div>
                </div>

                <!-- Aliens -->
                {#each aliens as alien (alien.id)}
                    <div
                        class="alien-pod type-{alien.type}"
                        style:left="{alien.x}%"
                        style:top="{alien.y}%"
                    >
                        <div class="pod-core"></div>
                        <div class="pod-ring"></div>
                        <div class="pod-glow"></div>
                    </div>
                {/each}

                <!-- Splash Particles -->
                {#each particles as p (p.id)}
                    <div
                        class="splash-particle"
                        style:left="{p.x}%"
                        style:bottom="{100 - (100 - waterLevel)}%"
                        style:opacity={p.life}
                    ></div>
                {/each}

                <!-- Water System -->
                <div class="water-system" style:height="{waterLevel}%">
                    <div class="surface-line"></div>
                    <div class="water-body">
                        <!-- SVG Waves -->
                        <svg
                            class="wave-svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                class="wave-path layer1"
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25"
                            ></path>
                            <path
                                class="wave-path layer2"
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43c54.52-5.13,108.28,20.55,160,39.2V0Z"
                                opacity=".5"
                            ></path>
                            <path
                                class="wave-path layer3"
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                opacity=".7"
                            ></path>
                        </svg>
                    </div>
                </div>

                <!-- Warning HUD (Left side vertical bar) -->
                <div class="flood-gauge">
                    <div class="gauge-bar">
                        <div
                            class="gauge-fill"
                            style:height="{floodLevel}%"
                            class:critical={isCritical}
                        ></div>
                    </div>
                    <div class="gauge-label">
                        {#if isCritical}
                            <span class="blink">CRITICAL</span>
                        {:else}
                            STABILITY
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    /* 
     * OMICRON DEFENSE STYLE
     * Palette: #020617 (Bg), #0ea5e9 (Cyan), #ef4444 (Red), #f59e0b (Amber)
     */
    :global(body) {
        margin: 0;
        background: #020617;
        font-family: "Rajdhani", sans-serif;
        overflow: hidden;
    }

    .defense-page {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .env-bg {
        position: fixed;
        inset: 0;
        background: linear-gradient(rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.8)),
            url("https://images.unsplash.com/photo-1590001155093-fa2744820907?auto=format&fit=crop&q=80&w=2000");
        background-size: cover;
        background-position: center;
        filter: grayscale(1) contrast(1.2);
        z-index: -10;
        animation: pulse-bg 10s infinite alternate;
    }

    @keyframes pulse-bg {
        0% {
            opacity: 0.5;
        }
        100% {
            opacity: 0.7;
        }
    }

    .scanlines {
        position: fixed;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
        );
        pointer-events: none;
        z-index: -5;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle, transparent 40%, #000 100%);
        pointer-events: none;
        z-index: -4;
        transition: box-shadow 0.2s;
    }

    .vignette.critical-pulse {
        box-shadow: inset 0 0 100px rgba(239, 68, 68, 0.5);
        animation: critical-flash 0.5s infinite alternate;
    }

    @keyframes critical-flash {
        0% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }

    .tracker-layer {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 180px;
        z-index: 100;
        border: 1px solid rgba(14, 165, 233, 0.3);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.5);
    }

    /* --- Start Screen --- */
    .start-screen {
        text-align: center;
        padding: 2rem;
        color: white;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid #0ea5e9;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(8px);
    }

    .deco-corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #0ea5e9;
    }
    .tl {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
    }
    .br {
        bottom: 0;
        right: 0;
        border-left: none;
        border-top: none;
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.2rem;
        color: #fff;
        margin: 0 0 2rem 0;
        text-shadow: 2px 2px 0px rgba(14, 165, 233, 0.8);
    }

    .intel-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .instruction-card {
        background: rgba(14, 165, 233, 0.05);
        border: 1px solid rgba(14, 165, 233, 0.2);
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
    }
    .instruction-card.danger {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }

    .instruction-card .icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    .instruction-card p {
        font-size: 0.8rem;
        color: #cbd5e1;
        margin: 0;
        line-height: 1.4;
    }
    .instruction-card strong {
        color: #38bdf8;
        display: block;
        margin-bottom: 4px;
        font-family: "Orbitron";
    }
    .instruction-card.danger strong {
        color: #f87171;
    }

    .controls-setup {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .cyber-btn {
        padding: 1rem 2rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
        transition: all 0.2s;
    }

    .cyber-btn.primary {
        background: #0ea5e9;
        color: #000;
        box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
    }
    .cyber-btn.primary:hover {
        background: #38bdf8;
        transform: translateY(-2px);
    }

    .cyber-btn.secondary {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #334155;
    }
    .cyber-btn.secondary:hover {
        border-color: #cbd5e1;
        color: #fff;
    }

    /* --- Game Area --- */
    .game-area {
        position: relative;
        width: 100%;
        height: 600px;
        background: rgba(2, 6, 23, 0.6);
        border: 1px solid rgba(14, 165, 233, 0.3);
        border-radius: 4px;
        overflow: hidden;
        touch-action: none;
        user-select: none;
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
    }

    .game-area.critical-border {
        border-color: #ef4444;
        box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.3);
    }

    /* HUD */
    .hud-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        z-index: 50;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    }

    .hud-stat {
        display: flex;
        flex-direction: column;
        color: #94a3b8;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
    }
    .hud-stat.right {
        text-align: right;
    }

    .hud-stat .value {
        font-size: 1.8rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        line-height: 1;
    }
    .hud-stat .total {
        font-size: 1rem;
        color: #64748b;
        font-weight: 400;
    }
    .cyan {
        color: #0ea5e9;
        text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
    }
    .red {
        color: #ef4444;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }

    /* Flood Gauge */
    .flood-gauge {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        height: 300px;
        width: 30px;
        display: flex;
        flex-direction: column-reverse; /* Fill from bottom */
        align-items: center;
        gap: 10px;
        z-index: 40;
    }

    .gauge-bar {
        width: 10px;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #334155;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
    }

    .gauge-fill {
        width: 100%;
        background: #0ea5e9;
        position: absolute;
        bottom: 0;
        transition: height 0.2s;
        box-shadow: 0 0 10px #0ea5e9;
    }
    .gauge-fill.critical {
        background: #ef4444;
        box-shadow: 0 0 15px #ef4444;
    }

    .gauge-label {
        font-family: "Share Tech Mono";
        font-size: 0.7rem;
        color: #94a3b8;
        transform: rotate(-90deg);
        white-space: nowrap;
    }

    /* Hand Cursor */
    .target-reticle {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        pointer-events: none;
        z-index: 100;
    }
    .ring {
        position: absolute;
        inset: 0;
        border: 2px dashed #0ea5e9;
        border-radius: 50%;
        animation: spin 3s linear infinite;
    }
    .dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: #0ea5e9;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px #0ea5e9;
    }
    .crosshairs {
        position: absolute;
        inset: 10%;
        border: 1px solid rgba(14, 165, 233, 0.5);
        transform: rotate(45deg);
    }
    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }

    /* Limit Line */
    .limit-line-container {
        position: absolute;
        width: 100%;
        height: 0;
        z-index: 40;
        transition: bottom 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }

    .limit-line {
        position: absolute;
        width: 100%;
        height: 1px;
        background: rgba(239, 68, 68, 0.5);
        border-bottom: 2px dashed #ef4444;
        box-shadow: 0 0 5px #ef4444;
    }

    .limit-text {
        position: absolute;
        right: 20px;
        bottom: 5px;
        color: #ef4444;
        font-family: "Orbitron";
        font-size: 0.8rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 2px 6px;
        border-radius: 4px;
    }

    /* Aliens */
    .alien-pod {
        position: absolute;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
        z-index: 30;
    }
    .pod-core {
        position: absolute;
        inset: 10px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px white;
    }
    .pod-ring {
        position: absolute;
        inset: 0;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
    }
    .type-0 .pod-core {
        background: #d8b4fe;
        box-shadow: 0 0 10px #d8b4fe;
    } /* Purple */
    .type-1 .pod-core {
        background: #fca5a5;
        box-shadow: 0 0 10px #fca5a5;
    } /* Red */
    .type-2 .pod-core {
        background: #86efac;
        box-shadow: 0 0 10px #86efac;
    } /* Green */
    .type-3 {
        filter: invert(1) brightness(2) contrast(2) opacity(0.6);
    }
    .type-3 .pod-core {
        background: #fff;
        box-shadow:
            0 0 20px #fff,
            0 0 40px #0ea5e9;
        animation: ghost-flicker 0.2s infinite alternate;
    }
    @keyframes ghost-flicker {
        0% {
            opacity: 0.3;
        }
        100% {
            opacity: 1;
        }
    }

    .pod-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.2),
            transparent 70%
        );
        animation: pulse 1s infinite alternate;
    }

    /* Splashes */
    .splash-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #0ea5e9;
        border-radius: 50%;
        pointer-events: none;
        z-index: 25;
        box-shadow: 0 0 5px #0ea5e9;
    }

    /* Water */
    .water-system {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: height 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 20;
        pointer-events: none;
    }

    .surface-line {
        position: absolute;
        top: 0;
        width: 100%;
        height: 3px;
        background: #7dd3fc;
        box-shadow: 0 0 20px #7dd3fc;
        z-index: 22;
    }

    .water-body {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1000px;
        background: linear-gradient(
            to bottom,
            rgba(14, 165, 233, 0.6) 0%,
            rgba(2, 6, 23, 0.9) 100%
        );
        overflow: hidden;
    }

    .wave-svg {
        position: absolute;
        top: -40px;
        left: -10%;
        width: 120%;
        height: 80px;
        overflow: visible;
    }

    .wave-path {
        fill: #0ea5e9;
    }

    .layer1 {
        animation: wave 4s linear infinite;
    }
    .layer2 {
        animation: wave 6s linear infinite reverse;
    }
    .layer3 {
        animation: wave 8s linear infinite;
    }

    @keyframes wave {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50px);
        }
    }
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.6;
        }
        100% {
            transform: scale(1.2);
            opacity: 0.2;
        }
    }
    .blink {
        animation: blink 0.5s infinite;
        color: #ef4444;
    }
    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .alert-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 150;
        background: rgba(239, 68, 68, 0.1);
    }
    .alert-box {
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid #ef4444;
        padding: 1rem 2rem;
        font-family: "Orbitron";
        font-size: 1.5rem;
        color: #ef4444;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
        text-transform: uppercase;
    }
</style>

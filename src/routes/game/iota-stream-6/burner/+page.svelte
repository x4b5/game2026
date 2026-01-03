<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import HandTracker from "$lib/components/HandTracker.svelte";
    import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

    let gameContainer: any;
    let weapons = $state<
        {
            id: number;
            x: number;
            y: number;
            type: string;
            hp: number;
            drift: number;
        }[]
    >([]);
    let explosions = $state<{ id: number; x: number; y: number }[]>([]);
    let weaponsDestroyed = $state(0);
    let timeLeft = $state(30);
    let attempts = $state(3);
    let isShaking = $state(false);
    let gameActive = $state(false);
    let currentId = 0;
    let explosionId = 0;
    let accessDenied = $state(false);
    let systemReady = $state(false); // New state for waiting for activation

    // Hand Tracking State
    let tracker: any;
    let handX = $state(50); // Percent
    let handY = $state(50); // Percent
    let isHandActive = $state(false);

    const TARGET_WEAPONS = 40;
    const INITIAL_TIME = 45; // Increased time slightly for more targets
    let spawnTimer: any;
    let updateTimer: any;
    let countdownTimer: any;

    onMount(() => {
        // Did not start game immediately

        return () => {
            stopGame();
        };
    });

    function activateSystem() {
        if (tracker) {
            tracker.enableCam();
        }
        systemReady = true;
        // Small delay to allow camera to initialize and UI keyframe animation before spawning starts
        setTimeout(() => {
            startGame();
        }, 1500);
    }

    function stopGame() {
        clearInterval(spawnTimer);
        clearInterval(updateTimer);
        clearInterval(countdownTimer);
    }

    function startGame() {
        weapons = [];
        weaponsDestroyed = 0;
        timeLeft = INITIAL_TIME;
        gameActive = true;

        spawnTimer = setInterval(spawnWeapon, 600); // Faster spawns
        updateTimer = setInterval(updateWeapons, 50);
        countdownTimer = setInterval(() => {
            if (gameActive) {
                timeLeft--;
                if (timeLeft <= 0) {
                    loseLife();
                }
            }
        }, 1000);
    }

    function loseLife() {
        gameActive = false;
        stopGame();
        attempts--;

        if (attempts > 0) {
            gameContainer?.lose();
        } else {
            gameContainer?.lose();
        }
    }

    function handleReset() {
        if (attempts > 0) {
            startGame();
        } else {
            // If completely out of attempts, reset all
            attempts = 3;
            startGame();
        }
    }

    function spawnWeapon() {
        if (!gameActive) return;

        const weapon = {
            id: currentId++,
            // Spawn closer to center for perspective effect
            x: 30 + Math.random() * 40, // Wider spawn area
            y: 0,
            // Vary types
            type: Math.random() > 0.5 ? "pistol" : "rifle",
            hp: 1,
            drift: (Math.random() - 0.5) * 3, // More drift
        };
        weapons = [...weapons, weapon];
    }

    function updateWeapons() {
        if (!gameActive) return;

        // Check hand collisions if hand is active
        if (isHandActive) {
            weapons.forEach((w) => {
                const dx = w.x - handX;
                const dy = w.y - (handY - 10); // Offset hit area slightly above hero
                // Hitbox gets larger as enemy gets closer (visual perspective)
                const hitRadius = 8 + (w.y / 100) * 5;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < hitRadius) {
                    destroyWeapon(w.id, w.x, w.y);
                }
            });
        }

        weapons = weapons
            .map((w) => {
                // Move towards edges as they come closer to simulate perspective
                const centerDiff = w.x - 50;
                return {
                    ...w,
                    y: w.y + 2.0 + (w.y / 100) * 3, // Faster acceleration
                    x: w.x + w.drift + centerDiff * 0.03, // Spread out
                };
            })
            .filter((w) => {
                if (w.y > 100) {
                    return false;
                }
                return true;
            });
    }

    function destroyWeapon(id: number, x: number, y: number) {
        if (!gameActive) return;
        if (!weapons.find((w) => w.id === id)) return;

        // Add explosion
        const newExplosion = { id: explosionId++, x, y };
        explosions = [...explosions, newExplosion];

        // Screen shake
        isShaking = true;
        setTimeout(() => (isShaking = false), 200);

        // Remove explosion after animation
        setTimeout(() => {
            explosions = explosions.filter((e) => e.id !== newExplosion.id);
        }, 600);

        weapons = weapons.filter((w) => {
            if (w.id === id) {
                weaponsDestroyed++;
                soundManager.playSuccess();

                if (weaponsDestroyed >= TARGET_WEAPONS) {
                    gameActive = false;
                    stopGame();
                    handleWin();
                }
                return false;
            }
            return true;
        });
    }

    function handleWin() {
        const nextPath = "/game/omicron-base-victory";

        fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: nextPath }),
        }).catch(console.error);

        gameContainer?.win(weaponsDestroyed * 200 + timeLeft * 50);

        setTimeout(() => {
            goto(nextPath);
        }, 2000);
    }

    // Hand tracking update: map Y less strictly so hero stays mostly at bottom
    function handleHandResults(results: HandLandmarkerResult) {
        if (results.landmarks && results.landmarks.length > 0) {
            isHandActive = true;
            const hand = results.landmarks[0];
            const indexTip = hand[8];

            handX = (1 - indexTip.x) * 100;
            // Constrain Y movement to bottom half for "tunnel flight" feel
            handY = 60 + indexTip.y * 40;
        } else {
            isHandActive = false;
        }
    }
</script>

<svelte:head>
    <title>The Minck: Burner Protocol</title>
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

<div class="burner-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    {#if accessDenied}
        <div class="denied-overlay" in:fade>
            <div class="denied-card glass-panel">
                <div class="warning-icon">🚫</div>
                <h1>TOEGANG GEWEIGERD</h1>
                <p>
                    Deze missie vereist pyrokinetische vermogens. Alleen <strong
                        >The Minck</strong
                    > kan dit alien-arsenaal vernietigen.
                </p>
                <button class="back-btn" onclick={() => history.back()}>
                    TERUG
                </button>
            </div>
        </div>
    {:else}
        <GameContainer
            bind:this={gameContainer}
            gameId="iota-burner"
            title="🔥 The Minck // PYRO PURGE"
            onReset={handleReset}
        >
            <div class="burner-game">
                <!-- Persistent Tracker for seamless transition -->
                <div
                    class="persistent-tracker-wrapper"
                    class:hidden={!systemReady}
                >
                    <HandTracker
                        bind:this={tracker}
                        onResults={handleHandResults}
                        showDebug={systemReady}
                    />
                    <button
                        class="btn-camera-overlay"
                        onclick={() => tracker?.enableCam()}
                    >
                        RE-ACTIVATE CAM
                    </button>
                </div>

                {#if !systemReady}
                    <div class="activation-screen" in:fade>
                        <div class="content-card">
                            <!-- Decoration Bars -->
                            <div class="deco-bar top"></div>
                            <div class="deco-bar bottom"></div>

                            <h1 class="glitch-title" data-text="SYSTEM OFFLINE">
                                SYSTEM OFFLINE
                            </h1>

                            <div class="briefing-panel">
                                <div class="panel-header">
                                    PYRO-KINETIC MODULE REQUIRED
                                </div>
                                <div class="briefing-content">
                                    <p>
                                        Om het vijandelijke wapenarsenaal te
                                        vernietigen, moeten de <span
                                            class="highlight-fire"
                                            >Pyro-Vlammen</span
                                        > geactiveerd worden.
                                    </p>
                                    <div class="instruction-box">
                                        <span class="icon">🖐️</span>
                                        Gebruik je handen als vlammenwerper om de
                                        geweren te vernietigen.
                                    </div>
                                </div>
                            </div>

                            <button
                                class="action-button primary-action"
                                onclick={activateSystem}
                            >
                                <div class="btn-content">
                                    <span class="icon">🔥</span>
                                    <span class="text">ACTIVEREN PYRO-VLAM</span
                                    >
                                </div>
                                <div class="btn-glitch"></div>
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="active-game-ui" in:fade={{ duration: 500 }}>
                        <div class="hud-header">
                            <div class="hud-stat time">
                                <span class="label">TIJD OVER</span>
                                <span class="value" class:urgent={timeLeft < 10}
                                    >{timeLeft}s</span
                                >
                            </div>
                            <div class="hud-stat destroyed">
                                <span class="label">WAPENS VERNIETIGD</span>
                                <span class="value"
                                    >{weaponsDestroyed}/{TARGET_WEAPONS}</span
                                >
                                <div class="progress-bar">
                                    <div
                                        class="fill"
                                        style:width="{(weaponsDestroyed /
                                            TARGET_WEAPONS) *
                                            100}%"
                                    ></div>
                                </div>
                            </div>
                            <div class="hud-stat lives">
                                <span class="value">❤️ {attempts}</span>
                            </div>
                        </div>

                        <div class="battlefield-container">
                            <!-- Decoration Corners -->
                            <div class="corner tl"></div>
                            <div class="corner tr"></div>
                            <div class="corner bl"></div>
                            <div class="corner br"></div>

                            <!-- Styled as a 3D Tunnel -->
                            <div
                                class="battlefield tunnel-view"
                                class:shaking={isShaking}
                            >
                                <div class="tunnel-grid"></div>
                                <div class="tunnel-fog"></div>

                                <!-- Hero (THE FLAME) -->
                                {#if isHandActive}
                                    <div
                                        class="hero-container"
                                        style:left="{handX}%"
                                        style:top="{handY}%"
                                    >
                                        <!-- REMOVED IMAGE, ADDED BIG FLAME -->
                                        <div class="hero-huge-flame">🔥</div>
                                        <div class="hero-glow"></div>
                                    </div>
                                {/if}

                                {#each weapons as weapon (weapon.id)}
                                    <button
                                        class="alien-weapon {weapon.type}"
                                        style:left="{weapon.x}%"
                                        style:top="{weapon.y}%"
                                        style:transform="translate(-50%, -50%)
                                        scale({0.5 + (weapon.y / 100) * 1.5})"
                                        onclick={() =>
                                            destroyWeapon(
                                                weapon.id,
                                                weapon.x,
                                                weapon.y,
                                            )}
                                    >
                                        <div class="weapon-icon">
                                            {weapon.type === "pistol"
                                                ? "🔫"
                                                : "💣"}
                                        </div>
                                        <div class="weapon-hp-bar"></div>
                                    </button>
                                {/each}

                                {#each explosions as exp (exp.id)}
                                    <div
                                        class="vfx-explosion"
                                        style:left="{exp.x}%"
                                        style:top="{exp.y}%"
                                        style:transform="translate(-50%, -50%)
                                        scale({0.5 + (exp.y / 100) * 1.5})"
                                    >
                                        <div class="fireball"></div>
                                        <div class="sparks">
                                            {#each Array(8) as _, j}
                                                <div
                                                    class="spark-line"
                                                    style:--angle="{j * 45}deg"
                                                ></div>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <div class="instruction-ticker">
                            >> VLIEG DOOR DE TUNNEL // GEBRUIK PYRO-HANDEN OM
                            HET PAD VRIJ TE MAKEN
                        </div>
                    </div>
                {/if}
            </div>
        </GameContainer>
    {/if}
</div>

<style>
    /* Global Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .burner-page {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 100%,
                rgba(239, 68, 68, 0.15) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(20, 20, 20, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 20, 20, 0.8) 1px, transparent 1px);
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -2;
        animation: bg-pulse-red 8s ease-in-out infinite;
    }

    @keyframes bg-pulse-red {
        0%,
        100% {
            opacity: 0.8;
        }
        50% {
            opacity: 1;
        }
    }

    .scanline-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
        opacity: 0.3;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 40%,
            #000 100%
        );
        z-index: 5;
        pointer-events: none;
    }

    .burner-game {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        z-index: 20;
    }

    /* Persistent Tracker Styles */
    .persistent-tracker-wrapper {
        transition: all 0.5s ease;
        margin: 0 auto 1rem auto;
        max-width: 300px;
        position: relative;
        z-index: 50;
    }

    .persistent-tracker-wrapper.hidden {
        position: absolute;
        top: -9999px;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
    }

    .btn-camera-overlay {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #fff;
        color: #fff;
        font-size: 0.6rem;
        padding: 2px 5px;
        border-radius: 4px;
        cursor: pointer;
    }

    /* Content Card (Activation) */
    .content-card {
        background: rgba(10, 5, 5, 0.95);
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 3rem;
        position: relative;
        box-shadow: 0 0 50px rgba(239, 68, 68, 0.2);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 30px),
            calc(100% - 30px) 100%,
            0 100%
        );
        margin: 2rem auto;
        max-width: 600px;
        text-align: center;
    }

    .deco-bar {
        position: absolute;
        height: 4px;
        background: #ef4444;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
        box-shadow: 0 0 10px #ef4444;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
        background: #fb923c;
        width: 60px;
        box-shadow: 0 0 10px #fb923c;
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.5rem;
        color: #fff;
        margin-bottom: 2rem;
        text-transform: uppercase;
        position: relative;
        text-shadow: 3px 3px 0px rgba(239, 68, 68, 0.5);
    }

    .highlight-fire {
        color: #ef4444;
        font-weight: bold;
        text-shadow: 0 0 10px #ef4444;
    }

    .briefing-panel {
        background: rgba(40, 10, 10, 0.5);
        border: 1px solid #ef4444;
        margin-bottom: 2rem;
        padding: 1.5rem;
        border-radius: 4px;
        text-align: left;
    }

    .panel-header {
        font-family: "Share Tech Mono", monospace;
        color: #ef4444;
        border-bottom: 1px dashed #ef4444;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .instruction-box {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        background: rgba(0, 0, 0, 0.4);
        padding: 0.8rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        color: #fb923c;
    }

    .action-button {
        width: 100%;
        background: #ef4444;
        border: none;
        padding: 1.5rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            15px 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            0 100%,
            0 15px
        );
        transition: transform 0.2s;
    }

    .action-button:hover {
        transform: scale(1.02);
        background: #dc2626;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
    }

    .btn-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-family: "Orbitron", sans-serif;
        color: #fff;
        font-weight: 900;
        font-size: 1.4rem;
        letter-spacing: 1px;
    }

    .camera-preview-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        opacity: 0;
    }

    /* Active Game UI */
    .hud-header {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
        background: rgba(10, 5, 5, 0.8);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 1rem;
        clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
    }

    .hud-stat {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .label {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.7rem;
        color: #94a3b8;
        letter-spacing: 1px;
        margin-bottom: 0.3rem;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.8rem;
        font-weight: 700;
        color: #fff;
    }

    .value.urgent {
        color: #ef4444;
        animation: blink 0.5s infinite;
    }

    .progress-bar {
        width: 100%;
        height: 6px;
        background: #333;
        margin-top: 0.5rem;
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-bar .fill {
        height: 100%;
        background: #ef4444;
        box-shadow: 0 0 10px #ef4444;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hearts {
        font-size: 1.2rem;
        letter-spacing: 0.2rem;
    }

    /* Battlefield */
    .battlefield-container {
        position: relative;
        padding: 5px;
    }

    /* Tunnel Battlefield Styles */
    .battlefield.tunnel-view {
        position: relative;
        height: 550px;
        background: #000;
        border: 2px solid rgba(239, 68, 68, 0.5);
        overflow: hidden;
        perspective: 600px; /* Enable 3D perspective */
    }

    .tunnel-grid {
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        background: linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px);
        background-size: 50px 50px;
        transform: rotateX(60deg) translateY(-20%);
        animation: tunnel-scroll 0.5s linear infinite;
        opacity: 0.4;
    }

    .tunnel-fog {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at 50% 0%,
            rgba(0, 0, 0, 0) 0%,
            #000 80%
        );
        pointer-events: none;
        z-index: 5;
    }

    @keyframes tunnel-scroll {
        from {
            transform: rotateX(60deg) translateY(0);
        }
        to {
            transform: rotateX(60deg) translateY(50px);
        }
    }

    .corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #ef4444;
        z-index: 10;
        pointer-events: none;
    }
    .corner.tl {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
    }
    .corner.tr {
        top: 0;
        right: 0;
        border-left: none;
        border-bottom: none;
    }
    .corner.bl {
        bottom: 0;
        left: 0;
        border-right: none;
        border-top: none;
    }
    .corner.br {
        bottom: 0;
        right: 0;
        border-left: none;
        border-top: none;
    }

    /* Hero Styles */
    .hero-container {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 120px;
        height: 120px;
        z-index: 50;
        pointer-events: none;
        transition:
            top 0.1s ease-out,
            left 0.1s ease-out;
    }

    .hero-sprite {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.5));
    }

    .hero-flame {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        opacity: 0.8;
        mix-blend-mode: screen;
        animation: pulse-fire 0.1s infinite alternate;
    }

    .hero-huge-flame {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 6rem; /* Much bigger */
        filter: drop-shadow(0 0 20px #ef4444) drop-shadow(0 0 40px #fbbf24);
        animation: pulse-huge-fire 0.1s infinite alternate;
        z-index: 60;
    }

    @keyframes pulse-huge-fire {
        0% {
            transform: translate(-50%, -50%) scale(0.95) rotate(-5deg);
            opacity: 0.9;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.05) rotate(5deg);
            opacity: 1;
        }
    }

    @keyframes pulse-fire {
        0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.7;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
    }

    .hero-glow {
        position: absolute;
        inset: 20px;
        background: radial-gradient(
            circle,
            rgba(251, 146, 60, 0.6),
            transparent 70%
        );
        border-radius: 50%;
        z-index: -1;
    }

    /* Game Entities */
    .alien-weapon {
        position: absolute;
        background: none;
        border: none;
        width: 60px;
        height: 60px;
        z-index: 20;
        cursor: pointer;
        /* Transform handled inline for dynamic scaling */
        transition: none;
    }

    .weapon-icon {
        font-size: 3rem;
        filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.8));
    }

    .alien-weapon:active .weapon-icon {
        transform: scale(0.9);
        filter: brightness(2);
    }

    /* VFX */
    .vfx-explosion {
        position: absolute;
        width: 100px;
        height: 100px;
        pointer-events: none;
        z-index: 30;
    }

    .fireball {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            #fff,
            #fbbf24,
            #ef4444,
            transparent
        );
        border-radius: 50%;
        animation: explode 0.5s ease-out forwards;
    }

    @keyframes explode {
        0% {
            transform: scale(0.1);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    .sparks {
        position: absolute;
        inset: 0;
    }
    .spark-line {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        background: #fff;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(10px);
        animation: spark-out 0.4s ease-out forwards;
    }
    @keyframes spark-out {
        0% {
            width: 0;
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
        }
        100% {
            width: 40px;
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle))
                translateX(30px);
        }
    }

    .instruction-ticker {
        font-family: "Share Tech Mono", monospace;
        color: #ef4444;
        text-align: center;
        margin-top: 1rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    /* Mobile */
    @media (max-width: 600px) {
        .hud-header {
            grid-template-columns: 1fr 1fr;
        }
        .hud-stat.lives {
            display: none;
        }
        .battlefield.tunnel-view {
            height: 400px;
        }
        .glitch-title {
            font-size: 2rem;
        }
        .hero-container {
            width: 80px;
            height: 80px;
        }
    }

    @keyframes rise {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        20% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-500px) translateX(var(--drift)) scale(0);
            opacity: 0;
        }
    }

    .instruction {
        text-align: center;
        color: #fb923c;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 1px;
        margin-top: 1rem;
    }

    /* Access Denied styles */
    .denied-overlay {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    .denied-card {
        max-width: 450px;
        text-align: center;
        padding: 3rem;
        background: rgba(239, 68, 68, 0.1);
        border: 2px solid #ef4444;
    }
    .warning-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    .back-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
    }
</style>

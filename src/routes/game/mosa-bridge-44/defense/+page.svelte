<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";
    import HandTracker from "$lib/components/HandTracker.svelte";
    import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

    let gameContainer: any;
    let gameActive = $state(false);
    let waterLevel = $state(0);
    let floodLevel = $state(0);
    let floodThreshold = $state(80); // Starts high (easy), drops over time

    let aliens = $state<{ id: number; x: number; y: number; speed: number }[]>(
        [],
    );
    let aliensCaught = $state(0);
    let aliensEscaped = $state(0);
    let timeLeft = $state(45);
    let isHolding = $state(false);

    // Hand Tracking
    let tracker: any;
    let handX = $state(50);
    let handY = $state(50); // 0-100
    let isHandActive = $state(false);

    const TARGET_SCORE = 20;
    const MAX_ESCAPED = 5;

    let spawnTimer: any;
    let gameLoop: any;
    let countdownTimer: any;
    let currentId = 0;

    onMount(() => {
        // ...
    });

    function startGame() {
        gameActive = true;
        aliens = [];
        waterLevel = 0;
        floodLevel = 0;
        floodThreshold = 80;
        aliensCaught = 0;
        aliensEscaped = 0;
        timeLeft = 45;

        soundManager.playClick();

        spawnTimer = setInterval(spawnAlien, 800);
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
        const alien = {
            id: currentId++,
            x: Math.random() * 80 + 10,
            y: -10,
            speed: 1.5 + Math.random() * 2.5,
        };
        aliens = [...aliens, alien];
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
            // Optional: Debounce loss of hand tracking?
            // For now instant off is safer
            isHandActive = false;
        }
    }

    function updateGame() {
        if (!gameActive) return;

        // 0. Difficulty increase: Lower the safe threshold
        floodThreshold = Math.max(30, floodThreshold - 0.06); // Drops fast!

        // 1. Update Water Level
        if (isHandActive) {
            // Hand Height Control: Top of screen (0) -> High Water (100)
            const targetLevel = Math.max(0, Math.min(100, 100 - handY));

            // Move water towards target level
            const diff = targetLevel - waterLevel;
            // High sensitivity/difficulty: React faster
            if (Math.abs(diff) < 5.0) {
                waterLevel = targetLevel;
            } else {
                waterLevel += Math.sign(diff) * 5.0;
            }
        } else {
            // Mouse/Touch Control fallback
            if (isHolding) {
                waterLevel = Math.min(100, waterLevel + 2.5); // Faster manual too
            } else {
                waterLevel = Math.max(0, waterLevel - 2.5);
            }
        }

        // 2. Update Flood Danger
        if (waterLevel > floodThreshold) {
            floodLevel = Math.min(100, floodLevel + 1.5);
        } else {
            floodLevel = Math.max(0, floodLevel - 2.0);
        }

        if (floodLevel >= 100) {
            soundManager.playError();
            endGame(false); // Flooded!
            return;
        }

        // 3. Update Aliens & Collision
        aliens = aliens.map((a) => ({ ...a, y: a.y + a.speed }));

        // Check Caught (Touching Water)
        const surfaceY = 100 - waterLevel;

        const caught = aliens.filter((a) => a.y >= surfaceY);
        if (caught.length > 0) {
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
        clearInterval(spawnTimer);
        clearInterval(countdownTimer);
        cancelAnimationFrame(gameLoop);

        if (victory) {
            gameContainer.win(aliensCaught * 100 + timeLeft * 50);
            setTimeout(() => {
                goto("/game/mosa-bridge-44/victory");
            }, 2000);
        } else {
            gameContainer.lose();
        }
    }
</script>

<div class="defense-page">
    <div class="water-bg"></div>

    <!-- Hand Tracker (Always present to allow setup) -->
    <div class="tracker-layer">
        <HandTracker
            bind:this={tracker}
            onResults={handleHandResults}
            showDebug={true}
        />
    </div>

    <GameContainer
        bind:this={gameContainer}
        gameId="mosa-defense"
        title="🌊 Servaasbrug Verdediging"
    >
        {#if !gameActive}
            <div class="start-screen" in:fade>
                <h2>MAAS PEIL BEHEER</h2>
                <div class="instructions">
                    <p>
                        🖐️ <strong>BEWEEG JE HAND</strong> omhoog/omlaag om het water
                        te sturen.
                    </p>
                    <p>
                        (Of 🔵 <strong>HOUD IN</strong> met muis/touch)
                    </p>
                    <p>👾 <strong>VANG ALIENS</strong> in het water.</p>
                    <p class="danger">
                        ⚠️ <strong>PAS OP:</strong> Blijf onder de rode lijn!
                    </p>
                </div>
                <div class="controls-setup">
                    <button
                        class="btn-secondary"
                        onclick={() => tracker?.enableCam()}
                    >
                        📸 Camera AAN
                    </button>
                    <button class="start-btn" onclick={startGame}>
                        START MISSIE
                    </button>
                </div>
            </div>
        {:else}
            <div
                class="game-area"
                onpointerdown={() => (isHolding = true)}
                onpointerup={() => (isHolding = false)}
                onpointerleave={() => (isHolding = false)}
            >
                <!-- Hand Cursor visual -->
                {#if isHandActive}
                    <div
                        class="hand-cursor"
                        style="left: {handX}%; top: {handY}%"
                    >
                        🌊
                    </div>
                {/if}

                <div class="hud">
                    <div class="stat">SCORE: {aliensCaught}/{TARGET_SCORE}</div>
                    <div class="stat danger">
                        GEMIST: {aliensEscaped}/{MAX_ESCAPED}
                    </div>
                </div>

                <!-- Flood Warning Bar -->
                <div class="flood-meter-container">
                    <div class="flood-label">OVERSTROMINGSGEVAAR</div>
                    <div class="flood-bar">
                        <div
                            class="flood-fill"
                            style:width="{floodLevel}%"
                            class:critical={floodLevel > 80}
                        ></div>
                    </div>
                </div>

                <!-- Aliens -->
                {#each aliens as alien (alien.id)}
                    <div
                        class="alien"
                        style:left="{alien.x}%"
                        style:top="{alien.y}%"
                    >
                        👾
                    </div>
                {/each}

                <!-- Safe Limit Line (Dynamic) -->
                <div class="limit-line" style:bottom="{floodThreshold}%">
                    ⚠️ PEIL ZAKT ({Math.round(floodThreshold)}%) ⚠️
                </div>

                <!-- Water -->
                <div class="wave-visual" style:height="{waterLevel}%">
                    <div class="wave-shape shape1"></div>
                    <div class="wave-shape shape2"></div>
                    <div class="wave-body"></div>
                </div>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    .defense-page {
        min-height: 100vh;
        background: #0f172a;
        display: flex;
        flex-direction: column;
    }

    .tracker-layer {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 160px;
        z-index: 50;
        opacity: 0.8;
        border-radius: 8px;
        overflow: hidden;
        pointer-events: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .water-bg {
        position: fixed;
        inset: 0;
        background: linear-gradient(to bottom, #0f172a 0%, #1e3a8a 100%);
        z-index: -1;
    }

    .start-screen {
        text-align: center;
        color: white;
        padding: 2rem;
    }

    .controls-setup {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(36, 189, 248, 0.5);
        padding: 0.8rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: #38bdf8;
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }

    .instructions {
        background: rgba(56, 189, 248, 0.1);
        padding: 1.5rem;
        border-radius: 12px;
        margin: 2rem 0;
        border: 1px solid #38bdf8;
    }

    .start-btn {
        background: #0284c7;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.2s;
        width: 100%;
    }

    .start-btn:hover {
        transform: scale(1.05);
        background: #0ea5e9;
    }

    .game-area {
        position: relative;
        height: 600px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid #38bdf8;
        border-radius: 12px;
        overflow: hidden;
        touch-action: none;
        user-select: none;
    }

    .hand-cursor {
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        pointer-events: none;
        z-index: 100;
        filter: drop-shadow(0 0 10px white);
    }

    .hud {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        z-index: 100;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        border-radius: 8px;
    }

    .hud .danger {
        color: #ef4444;
    }

    .alien {
        position: absolute;
        font-size: 2rem;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 0 5px #ef4444);
        z-index: 10;
    }

    .wave-visual {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /* remove background color from container, shapes handles it */
        transition: height 0.05s linear; /* Faster visual update */
        z-index: 20;
        pointer-events: none;
    }

    .wave-visual.charging {
        background: rgba(56, 189, 248, 0.7);
    }

    .wave-body {
        position: absolute;
        top: 20px; /* Start below wave shapes */
        left: 0;
        width: 100%;
        height: 1000px; /* Extend downwards */
        background: rgba(2, 132, 199, 0.7);
    }

    .wave-shape {
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 40px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%230ea5e9' fill-opacity='0.6'/%3E%3C/svg%3E");
        background-size: 50% 100%;
        background-repeat: repeat-x;
        animation: wave-move 3s linear infinite;
        transform: translateY(-50%) rotate(180deg); /* Flip SVG to look like wave top */
    }

    .wave-shape.shape2 {
        top: 5px;
        opacity: 0.7;
        animation: wave-move 5s linear infinite reverse;
        filter: brightness(1.2);
        transform: translateY(-40%) rotate(180deg);
    }

    @keyframes wave-move {
        0% {
            transform: translateX(0) translateY(-50%) rotate(180deg);
        }
        100% {
            transform: translateX(-50%) translateY(-50%) rotate(180deg);
        }
    }

    .limit-line {
        position: absolute;
        width: 100%;
        height: 2px;
        border-bottom: 2px dashed #ef4444;
        text-align: right;
        color: #ef4444;
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        padding-right: 10px;
        z-index: 40;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        transition: bottom 0.2s linear;
    }

    .flood-meter-container {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        text-align: center;
        z-index: 100;
        pointer-events: none;
    }

    .flood-label {
        font-size: 0.7rem;
        color: white;
        margin-bottom: 4px;
        font-family: "Orbitron", sans-serif;
    }

    .flood-bar {
        width: 100%;
        height: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid white;
        border-radius: 5px;
        overflow: hidden;
    }

    .flood-fill {
        height: 100%;
        background: #fbbf24;
        transition: width 0.1s linear;
    }

    .flood-fill.critical {
        background: #ef4444;
        box-shadow: 0 0 10px #ef4444;
    }

    .danger {
        color: #ef4444;
        font-weight: bold;
    }
</style>

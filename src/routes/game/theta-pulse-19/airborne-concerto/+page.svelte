<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";
    import { soundManager } from "$lib/utils/SoundManager";
    import HandTracker from "$lib/components/HandTracker.svelte";
    import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

    let score = $state(0);
    let timeLeft = $state(30);
    let gameActive = $state(false);
    let gameWon = $state(false);
    let notes = $state<
        {
            id: number;
            x: number;
            y: number;
            type: string;
            visible: boolean;
            caught: boolean;
            shootX: number;
            shootY: number;
        }[]
    >([]);

    // Hand tracking
    let tracker: any;
    let handX = $state(50);
    let handY = $state(50);
    let isHandActive = $state(false);

    // Game loop variables
    let noteInterval: any;
    let gameLoop: any;
    let flickerInterval: any;
    let timerInterval: any;
    let nextNoteId = 0;

    onMount(() => {
        // Init sound if needed, though likely already global
    });

    onDestroy(() => {
        stopGame();
    });

    function startGame() {
        gameActive = true;
        score = 0;
        timeLeft = 30;
        notes = [];

        // Spawn notes slower (every 800ms)
        noteInterval = setInterval(spawnNote, 800);

        // Game loop - collisions & physics
        gameLoop = setInterval(() => {
            // Move notes down slower
            notes = notes
                .map((n) => ({ ...n, y: n.y + 2 })) // Slower descent for better playability
                .filter((n) => n.y < 100);

            checkHandCollisions();
        }, 50);

        // Flicker effect - randomly hide/show notes
        flickerInterval = setInterval(() => {
            notes = notes.map((n) => ({
                ...n,
                visible: Math.random() > 0.3, // 70% chance to be visible
            }));
        }, 300);

        // Separate timer for countdown
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                endGame();
            }
        }, 1000);
    }

    function spawnNote() {
        if (!gameActive) return;
        const types = ["🛸"];
        const note = {
            id: nextNoteId++,
            x: Math.random() * 80 + 10, // 10-90% width
            y: -10,
            type: types[Math.floor(Math.random() * types.length)],
            visible: true,
            caught: false,
            shootX: 0,
            shootY: 0,
        };
        notes = [...notes, note];
    }

    function checkHandCollisions() {
        if (!isHandActive) return;

        notes.forEach((note) => {
            if (note.caught || !note.visible) return;

            // Simple distance interaction
            const dx = note.x - handX;
            const dy = note.y - handY;
            // Note: coordinates are % based. Aspect ratio matters but simplified:
            // Assuming simplified euclidean distance in % space.
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 8) {
                // Catch radius ~8%
                catchNote(note.id);
            }
        });
    }

    function handleHandResults(results: HandLandmarkerResult) {
        if (results.landmarks && results.landmarks.length > 0) {
            isHandActive = true;
            const hand = results.landmarks[0];
            const indexTip = hand[8];

            // Mirror X (1 - x) because webcam is mirrored visually usually
            handX = (1 - indexTip.x) * 100;
            handY = indexTip.y * 100;
        } else {
            isHandActive = false;
        }
    }

    function catchNote(id: number) {
        let caughtOne = false;
        notes = notes.map((n) => {
            if (n.id === id && !n.caught) {
                caughtOne = true;
                score += 100;
                soundManager.playClick();
                return {
                    ...n,
                    caught: true,
                    shootX: (Math.random() - 0.5) * 200,
                    shootY: -150 - Math.random() * 100,
                };
            }
            return n;
        });

        // Remove caught notes after animation
        if (caughtOne) {
            setTimeout(() => {
                notes = notes.filter((n) => n.id !== id);
            }, 500);
        }
    }

    function endGame() {
        stopGame();
        if (score >= 500) {
            gameWon = true;
            setTimeout(() => {
                goto("/game/theta-pulse-19/victory");
            }, 3000);
        } else {
            alert("Niet genoeg harmonie verzameld! Probeer opnieuw.");
        }
    }

    function stopGame() {
        gameActive = false;
        clearInterval(noteInterval);
        clearInterval(gameLoop);
        clearInterval(flickerInterval);
        clearInterval(timerInterval);
    }
</script>

<div class="concerto-page" in:fade>
    <div class="sky-background"></div>

    <!-- Hand Tracker Preview -->
    <div class="tracker-layer">
        <HandTracker
            bind:this={tracker}
            onResults={handleHandResults}
            showDebug={true}
        />
    </div>

    {#if !gameActive && !gameWon}
        <div class="intro-card glass-panel" in:scale>
            <h1>AIRBORNE CONCERTO</h1>
            <p>
                Gebruik je hand om de muzieknoten te vangen!
                <br />
                <em>Beweeg je hand voor de camera.</em>
            </p>
            <div class="controls">
                <button
                    class="btn-secondary"
                    onclick={() => tracker?.enableCam()}
                >
                    📸 Camera AAN
                </button>
                <button class="btn-primary" onclick={startGame}
                    >START VLUCHT 🚀</button
                >
            </div>
        </div>
    {:else if gameActive}
        <div class="game-hud">
            <div class="score">HARMONIE: {score}</div>
            <div class="timer">TIJD: {timeLeft}s</div>
        </div>

        <div class="game-area">
            <!-- Hand Cursor / Sparkle -->
            {#if isHandActive}
                <div class="hand-cursor" style="left: {handX}%; top: {handY}%">
                    🎻
                </div>
            {/if}

            <!-- Stella / Player Avatar - follows hand or centers -->
            <div
                class="player-avatar"
                style:left={isHandActive ? `${handX}%` : "50%"}
            ></div>

            <!-- Falling Notes -->
            {#each notes as note (note.id)}
                <button
                    class="note"
                    class:hidden={!note.visible}
                    class:caught={note.caught}
                    style="left: {note.x}%; top: {note.y}%; --shoot-x: {note.shootX}px; --shoot-y: {note.shootY}px;"
                    onmouseenter={() => catchNote(note.id)}
                    ontouchstart={() => catchNote(note.id)}
                >
                    {note.type}
                </button>
            {/each}
        </div>
    {:else if gameWon}
        <div class="victory-card glass-panel" in:scale>
            <h1>MISSIE GESLAAGD!</h1>
            <p>De harmonie is teruggekeerd boven Maastricht.</p>
            <div class="score-final">SCORE: {score}</div>
            <p>Op naar de finale...</p>
        </div>
    {/if}
</div>

<style>
    .concerto-page {
        min-height: 100vh;
        overflow: hidden;
        position: relative;
        font-family: "Rajdhani", sans-serif;
        color: white;
    }

    .sky-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #0f172a, #1e3a8a, #3b82f6);
        z-index: -1;
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
        pointer-events: none; /* Let clicks pass through if needed, but video needs none */
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .glass-panel {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        max-width: 500px;
        margin: 10vh auto;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        margin-bottom: 1rem;
    }

    .controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.2s;
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 1rem 1.5rem;
        font-size: 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    .btn-primary:hover {
        transform: scale(1.05);
    }
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .game-hud {
        position: absolute;
        top: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 2rem;
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        z-index: 10;
    }

    .game-area {
        position: relative;
        width: 100%;
        height: 100vh;
    }

    .hand-cursor {
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        pointer-events: none;
        z-index: 100;
        filter: drop-shadow(0 0 10px white);
    }

    .note {
        position: absolute;
        font-size: 2.5rem;
        background: none;
        border: none;
        cursor: pointer;
        transition:
            top 0.2s linear,
            opacity 0.15s ease;
        animation: float 1s infinite ease-in-out;
    }

    .note.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .note.caught {
        animation: shootAway 0.5s ease-out forwards;
        pointer-events: none;
    }

    @keyframes shootAway {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(2)
                translate(
                    calc(var(--shoot-x) * 0.5),
                    calc(var(--shoot-y) * 0.5)
                );
            opacity: 1;
        }
        100% {
            transform: scale(3) translate(var(--shoot-x), var(--shoot-y));
            opacity: 0;
        }
    }

    .player-avatar {
        position: absolute;
        bottom: 50px;
        /* left is dynamic now */
        transform: translateX(-50%);
        font-size: 4rem;
        transition: left 0.1s linear;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>

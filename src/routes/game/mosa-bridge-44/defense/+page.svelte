<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

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

        spawnTimer = setInterval(spawnAlien, 1000);
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
            speed: 0.8 + Math.random() * 1.5,
        };
        aliens = [...aliens, alien];
    }

    function updateGame() {
        if (!gameActive) return;

        // 0. Difficulty increase: Lower the safe threshold
        floodThreshold = Math.max(30, floodThreshold - 0.04); // Drops ~2.4% per second

        // 1. Update Water Level (Direct Control)
        if (isHolding) {
            waterLevel = Math.min(100, waterLevel + 1.5);
        } else {
            waterLevel = Math.max(0, waterLevel - 1.5); // Responsive again
        }

        // 2. Update Flood Danger
        if (waterLevel > floodThreshold) {
            floodLevel = Math.min(100, floodLevel + 1.0);
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
                        🔵 <strong>HOUD IN</strong> om het water te laten stijgen.
                    </p>
                    <p>👾 <strong>VANG ALIENS</strong> in het water.</p>
                    <p class="danger">
                        ⚠️ <strong>PAS OP:</strong> Blijf onder de rode lijn! De
                        lijn zakt steeds verder!
                    </p>
                </div>
                <button class="start-btn" onclick={startGame}>
                    START MISSIE
                </button>
            </div>
        {:else}
            <div
                class="game-area"
                onpointerdown={() => (isHolding = true)}
                onpointerup={() => (isHolding = false)}
                onpointerleave={() => (isHolding = false)}
            >
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
                    <div class="wave-surface"></div>
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
        background: rgba(2, 132, 199, 0.6);
        transition: height 0.1s linear;
        z-index: 20;
        pointer-events: none;
    }

    .wave-visual.charging {
        background: rgba(56, 189, 248, 0.7);
    }

    .wave-surface {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background: #bae6fd;
        box-shadow: 0 0 20px #bae6fd;
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

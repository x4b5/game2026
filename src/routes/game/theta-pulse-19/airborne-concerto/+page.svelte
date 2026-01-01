<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { gameProgress } from "$lib/stores/gameStore";

    let gameContainer: any;
    let score = $state(0);
    let timeLeft = $state(45);
    let gameActive = $state(false);
    let stellaPos = $state({ x: 50, y: 70 });
    let targets = $state<any[]>([]);
    let bursts = $state<any[]>([]);
    let isStella = $derived($gameProgress.player?.avatar === "stella");

    let gameLoop: any;

    function initGame() {
        score = 0;
        timeLeft = 45;
        targets = [];
        bursts = [];
        gameActive = true;

        gameLoop = setInterval(() => {
            if (timeLeft > 0 && gameActive) {
                timeLeft -= 0.1;
                updateGame();
            } else if (timeLeft <= 0) {
                endGame();
            }
        }, 100);
    }

    function spawnTarget() {
        if (targets.length < 5) {
            targets.push({
                id: Math.random(),
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 10,
                health: 100,
                type: Math.random() > 0.8 ? "mothership" : "scout",
            });
        }
    }

    function updateGame() {
        if (Math.random() > 0.9) spawnTarget();

        // Update bursts
        bursts = bursts
            .filter((b) => b.age < 5)
            .map((b) => ({ ...b, age: b.age + 0.5 }));
    }

    function handleInput(e: MouseEvent | TouchEvent) {
        if (!gameActive) return;

        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const rect = document
            .querySelector(".game-area")
            ?.getBoundingClientRect();
        if (rect) {
            stellaPos.x = ((clientX - rect.left) / rect.width) * 100;
            stellaPos.y = ((clientY - rect.top) / rect.height) * 100;
        }
    }

    function playViolin() {
        if (!gameActive) return;

        // Add sonic burst
        bursts.push({
            id: Math.random(),
            x: stellaPos.x,
            y: stellaPos.y,
            age: 0,
        });

        // Check for hits
        targets = targets.filter((target) => {
            const dist = Math.sqrt(
                Math.pow(target.x - stellaPos.x, 2) +
                    Math.pow(target.y - stellaPos.y, 2),
            );
            if (dist < 15) {
                score += target.type === "mothership" ? 500 : 100;
                return false; // Remove hit target
            }
            return true;
        });
    }

    function endGame() {
        gameActive = false;
        clearInterval(gameLoop);
        if (score >= 1500) {
            gameContainer?.win(score);
        } else {
            gameContainer?.lose();
        }
    }

    function handleReset() {
        initGame();
    }

    onMount(() => {
        if (!isStella) {
            goto("/game/theta-pulse-19");
            return;
        }
        initGame();
    });

    onDestroy(() => {
        clearInterval(gameLoop);
    });
</script>

<div class="game-page" in:fade>
    <GameContainer
        bind:this={gameContainer}
        gameId="airborne-concerto"
        title="🎻 AIRBORNE CONCERTO"
        onReset={handleReset}
    >
        <div class="game-wrapper">
            <div class="hud">
                <div class="hud-item">
                    <span class="label">SONISCHE IMPACT</span>
                    <span class="value">{score}</span>
                </div>
                <div class="hud-item">
                    <span class="label">VRIJTHOF STABILITEIT</span>
                    <div class="timer-bar">
                        <div
                            class="fill"
                            style="width: {(timeLeft / 45) * 100}%"
                        ></div>
                    </div>
                </div>
            </div>

            <div
                class="game-area"
                onmousemove={handleInput}
                ontouchmove={handleInput}
                onclick={playViolin}
            >
                <!-- Background Cityscape -->
                <div class="cityscape">
                    <div class="servaas-tower"></div>
                </div>

                <!-- Targets -->
                {#each targets as target (target.id)}
                    <div
                        class="target {target.type}"
                        style="left: {target.x}%; top: {target.y}%"
                        in:scale
                    >
                        <div class="alien-ship">🛸</div>
                        {#if target.type === "mothership"}
                            <div class="shield-ring"></div>
                        {/if}
                    </div>
                {/each}

                <!-- Sonic Bursts -->
                {#each bursts as burst (burst.id)}
                    <div
                        class="sonic-burst"
                        style="left: {burst.x}%; top: {burst.y}%; transform: translate(-50%, -50%) scale({burst.age})"
                    ></div>
                {/each}

                <!-- Stella -->
                <div
                    class="stella"
                    style="left: {stellaPos.x}%; top: {stellaPos.y}%"
                >
                    <div class="stella-sprite">✨</div>
                    <div class="violin-aura">🎻</div>
                    <div class="wings"></div>
                </div>

                <div class="tap-hint">TAP OF KLIK OM DE VIOOL TE BESPELEN!</div>
            </div>
        </div>
    </GameContainer>
</div>

<style>
    .game-page {
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: none;
    }

    .game-wrapper {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .hud {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .hud-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        color: #60a5fa;
        letter-spacing: 2px;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: white;
        font-weight: 900;
    }

    .timer-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
    }

    .timer-bar .fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.1s linear;
    }

    .game-area {
        height: 500px;
        background: linear-gradient(to bottom, #020617, #0f172a);
        border-radius: 24px;
        position: relative;
        overflow: hidden;
        border: 2px solid rgba(59, 130, 246, 0.2);
        cursor: crosshair;
    }

    .cityscape {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 30%;
        background: linear-gradient(to top, #1e293b, transparent);
        pointer-events: none;
    }

    .servaas-tower {
        position: absolute;
        bottom: 0;
        left: 20%;
        width: 40px;
        height: 80px;
        background: #0f172a;
        clip-path: polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%);
    }

    .stella {
        position: absolute;
        width: 60px;
        height: 60px;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        pointer-events: none;
        transition:
            left 0.1s ease-out,
            top 0.1s ease-out;
    }

    .stella-sprite {
        font-size: 2rem;
        z-index: 2;
    }

    .violin-aura {
        position: absolute;
        font-size: 1.2rem;
        top: -10px;
        right: -10px;
        filter: drop-shadow(0 0 5px #3b82f6);
    }

    .wings {
        position: absolute;
        width: 100px;
        height: 40px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        filter: blur(5px);
        animation: wing-flap 0.2s infinite alternate;
    }

    @keyframes wing-flap {
        from {
            transform: scaleY(0.5);
        }
        to {
            transform: scaleY(1.2);
        }
    }

    .target {
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 2.5rem;
        z-index: 5;
    }

    .mothership {
        font-size: 4rem;
    }

    .shield-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120%;
        height: 120%;
        border: 2px solid rgba(239, 68, 68, 0.3);
        border-radius: 50%;
        animation: rotate 4s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }

    .sonic-burst {
        position: absolute;
        width: 100px;
        height: 100px;
        border: 4px solid #3b82f6;
        border-radius: 50%;
        opacity: 0.5;
        pointer-events: none;
    }

    .tap-hint {
        position: absolute;
        bottom: 2rem;
        width: 100%;
        text-align: center;
        font-family: "Orbitron", sans-serif;
        color: rgba(255, 255, 255, 0.3);
        font-size: 0.8rem;
        letter-spacing: 1px;
        pointer-events: none;
    }

    @media (max-width: 600px) {
        .game-area {
            height: 400px;
        }
    }
</style>

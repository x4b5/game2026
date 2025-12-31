<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    interface Glitch {
        id: number;
        x: number;
        y: number;
        opacity: number;
        lifetime: number;
        rgb: { r: number; g: number; b: number };
    }

    let gameContainer: any;
    let glitches = $state<Glitch[]>([]);
    let score = $state(0);
    let missed = $state(0);
    let gameActive = $state(false);
    let spawnInterval: any;
    let currentId = 0;

    const MAX_MISSES = 3;
    const TARGET_SCORE = 20;

    onMount(() => {
        startGame();
        return () => clearInterval(spawnInterval);
    });

    function startGame() {
        gameActive = true;
        spawnGlitchPeriodically();
    }

    function spawnGlitchPeriodically() {
        spawnGlitch();

        const delay = Math.max(800, 2000 - score * 50); // Speed up as score increases
        spawnInterval = setTimeout(() => {
            if (gameActive) spawnGlitchPeriodically();
        }, delay);
    }

    function spawnGlitch() {
        const newGlitch: Glitch = {
            id: currentId++,
            x: Math.random() * 80 + 10, // 10-90% to keep in bounds
            y: Math.random() * 80 + 10,
            opacity: 0,
            lifetime: 0,
            rgb: {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
            },
        };

        glitches = [...glitches, newGlitch];
        animateGlitch(newGlitch.id);
    }

    function animateGlitch(glitchId: number) {
        const fadeInDuration = 300;
        const visibleDuration = 1500 - score * 30; // Shorter as difficulty increases
        const fadeOutDuration = 300;

        let elapsed = 0;
        const interval = setInterval(() => {
            const glitchIndex = glitches.findIndex((g) => g.id === glitchId);
            if (glitchIndex === -1) {
                clearInterval(interval);
                return;
            }

            elapsed += 50;

            if (elapsed < fadeInDuration) {
                // Fade in
                glitches[glitchIndex].opacity = elapsed / fadeInDuration;
            } else if (elapsed < fadeInDuration + visibleDuration) {
                // Fully visible
                glitches[glitchIndex].opacity = 1;
            } else if (
                elapsed <
                fadeInDuration + visibleDuration + fadeOutDuration
            ) {
                // Fade out
                const fadeProgress =
                    (elapsed - fadeInDuration - visibleDuration) /
                    fadeOutDuration;
                glitches[glitchIndex].opacity = 1 - fadeProgress;
            } else {
                // Glitch disappeared - count as miss
                clearInterval(interval);
                removeGlitch(glitchId, true);
            }
        }, 50);
    }

    function handleGlitchClick(glitchId: number) {
        const glitchIndex = glitches.findIndex((g) => g.id === glitchId);
        if (glitchIndex === -1) return;

        score++;
        soundManager.playSuccess();
        removeGlitch(glitchId, false);

        if (score >= TARGET_SCORE) {
            gameActive = false;
            clearTimeout(spawnInterval);
            gameContainer?.win(score * 100);
        }
    }

    function removeGlitch(glitchId: number, countAsMiss: boolean) {
        if (countAsMiss) {
            missed++;
            soundManager.playError();

            if (missed >= MAX_MISSES) {
                gameActive = false;
                clearTimeout(spawnInterval);
                gameContainer?.lose();
            }
        }

        glitches = glitches.filter((g) => g.id !== glitchId);
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="omega-rift"
    title="⚛️ Omega Rift"
>
    <div class="glitch-game">
        <div class="game-stats">
            <div class="stat">
                <span class="stat-label">Gevangen</span>
                <span class="stat-value">{score}/{TARGET_SCORE}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Gemist</span>
                <span class="stat-value" class:danger={missed >= 2}
                    >{missed}/{MAX_MISSES}</span
                >
            </div>
        </div>

        <div class="reality-field">
            <!-- Background distortion effect -->
            <div class="distortion-layer"></div>

            {#each glitches as glitch (glitch.id)}
                <button
                    class="glitch"
                    style:left="{glitch.x}%"
                    style:top="{glitch.y}%"
                    style:opacity={glitch.opacity}
                    style:--glitch-r={glitch.rgb.r}
                    style:--glitch-g={glitch.rgb.g}
                    style:--glitch-b={glitch.rgb.b}
                    onclick={() => handleGlitchClick(glitch.id)}
                >
                    <div class="glitch-core"></div>
                    <div class="glitch-ring"></div>
                </button>
            {/each}
        </div>

        <div class="hint">Tap de reality glitches voordat ze verdwijnen!</div>
    </div>
</GameContainer>

<style>
    .glitch-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .game-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: var(--glass);
        border-radius: 12px;
        border: 1px solid var(--glass-border);
        flex: 1;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stat-value.danger {
        color: #ef4444;
    }

    .reality-field {
        position: relative;
        width: 100%;
        aspect-ratio: 4 / 3;
        background: radial-gradient(
                circle at 30% 40%,
                rgba(236, 72, 153, 0.1),
                transparent
            ),
            radial-gradient(
                circle at 70% 60%,
                rgba(99, 102, 241, 0.1),
                transparent
            );
        border-radius: 20px;
        border: 2px solid var(--glass-border);
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .distortion-layer {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
        );
        pointer-events: none;
        animation: scan 8s linear infinite;
    }

    @keyframes scan {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(20px);
        }
    }

    .glitch {
        position: absolute;
        width: 60px;
        height: 60px;
        transform: translate(-50%, -50%);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: opacity 0.1s ease;
    }

    .glitch-core {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(
            var(--glitch-r),
            var(--glitch-g),
            var(--glitch-b),
            0.6
        );
        filter: blur(8px);
        animation: glitch-distort 0.5s ease-in-out infinite;
    }

    .glitch-ring {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        border: 2px solid
            rgba(var(--glitch-r), var(--glitch-g), var(--glitch-b), 0.8);
        animation: pulse-ring 1s ease-in-out infinite;
    }

    @keyframes glitch-distort {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
            filter: blur(8px) hue-rotate(0deg);
        }
        25% {
            transform: translate(-3px, 2px) scale(0.95);
            filter: blur(10px) hue-rotate(30deg);
        }
        75% {
            transform: translate(2px, -3px) scale(1.05);
            filter: blur(6px) hue-rotate(-30deg);
        }
    }

    @keyframes pulse-ring {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.3);
            opacity: 0.3;
        }
    }

    .glitch:active .glitch-core {
        transform: scale(0.8);
    }

    .hint {
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-muted);
        font-style: italic;
    }

    @media (max-width: 640px) {
        .glitch {
            width: 50px;
            height: 50px;
        }
    }
</style>

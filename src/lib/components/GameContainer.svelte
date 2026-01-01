<script lang="ts">
    import { gameProgress } from "$lib/stores/gameStore";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    let {
        gameId,
        title,
        children,
        onComplete = () => {},
        onReset = () => {},
    }: {
        gameId: string;
        title: string;
        children: any;
        onComplete?: (score: number) => void;
        onReset?: () => void;
    } = $props();

    let gameState = $state<"playing" | "won" | "lost">("playing");
    let score = $state(0);
    let showVictory = $state(false);

    onMount(() => {
        soundManager.init();
    });

    export function win(finalScore: number) {
        score = finalScore;
        gameState = "won";
        showVictory = true;
        soundManager.playWin();
        gameProgress.completeGame(gameId, finalScore);
        onComplete(finalScore);

        setTimeout(() => {
            showVictory = false;
        }, 3000);
    }

    export function lose() {
        gameState = "lost";
        soundManager.playError();
    }

    export function reset() {
        gameState = "playing";
        score = 0;
        showVictory = false;
        onReset();
    }
</script>

<div class="game-wrapper">
    <div class="game-header">
        <h2>{title}</h2>
        {#if $gameProgress.completed.includes(gameId)}
            <span class="completed-badge">✓ Voltooid</span>
        {/if}
    </div>

    <div class="game-content">
        {@render children()}
    </div>

    {#if showVictory}
        <div class="victory-overlay">
            <div class="victory-content animate-victory">
                <div class="victory-icon">🎉</div>
                <h1>Missie Geslaagd!</h1>
                <p class="score-display">Score: {score}</p>
                <button class="btn-play-again" onclick={reset}>
                    Speel Opnieuw
                </button>
            </div>
        </div>
    {/if}

    {#if gameState === "lost"}
        <div class="defeat-overlay">
            <div class="defeat-content">
                <div class="defeat-icon">😔</div>
                <h1>Helaas!</h1>
                <button class="btn-try-again" onclick={reset}>
                    Probeer Opnieuw
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .game-wrapper {
        position: relative;
        min-height: 60vh;
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1.5rem;
        color: var(--text-main);
    }

    .completed-badge {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        padding: 0.5rem 1rem;
        border-radius: 99px;
        font-size: 0.875rem;
        font-weight: 600;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .game-content {
        position: relative;
    }

    .victory-overlay,
    .defeat-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    .victory-content,
    .defeat-content {
        text-align: center;
        padding: 2rem 1.5rem;
        width: 100%;
        max-width: 400px;
    }

    .animate-victory {
        animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .victory-icon,
    .defeat-icon {
        font-size: clamp(3rem, 15vw, 5rem);
        margin-bottom: 1rem;
        animation: float 2s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    h1 {
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .score-display {
        font-size: 1.5rem;
        color: var(--accent);
        font-weight: 700;
        margin-bottom: 2rem;
    }

    .btn-play-again,
    .btn-try-again {
        padding: 1rem 2.5rem;
        border-radius: 12px;
        background: var(--primary);
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .btn-play-again:hover,
    .btn-try-again:hover {
        transform: translateY(-2px);
        filter: brightness(1.2);
    }
</style>

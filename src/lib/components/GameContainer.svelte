<script lang="ts">
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    let {
        gameId,
        title,
        children,
        nextUrl,
        onComplete = () => {},
        onReset = () => {},
    }: {
        gameId: string;
        title: string;
        children: any;
        nextUrl?: string;
        onComplete?: (score: number) => void;
        onReset?: () => void;
    } = $props();

    let gameState = $state<"playing" | "won" | "lost">("playing");
    let score = $state(0);
    let showVictory = $state(false);
    let adminPassword = $state("");
    let showAdminBypass = $state(false);

    function handleAdminBypass() {
        if (adminPassword.toLowerCase() === "xavier") {
            const currentPath = window.location.pathname.replace(/\/$/, "");
            const idx = MISSION_ORDER.indexOf(currentPath);
            if (idx !== -1 && idx < MISSION_ORDER.length - 1) {
                const nextPath = MISSION_ORDER[idx + 1];
                fetch("/api/mission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ navTo: nextPath }),
                }).catch(console.error);
                goto(nextPath);
            }
        }
    }

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
                <div class="victory-icon">🏆</div>
                <h1>MISSIE GESLAAGD</h1>
                <p class="score-display">PUNTEN: {score}</p>
                <div class="victory-actions">
                    <button class="btn-play-again" onclick={reset}>
                        Speel Opnieuw
                    </button>
                    <button
                        class="btn-continue"
                        onclick={() => {
                            if (nextUrl) {
                                goto(nextUrl);
                                return;
                            }
                            const currentPath =
                                window.location.pathname.replace(/\/$/, "");
                            const idx = MISSION_ORDER.indexOf(currentPath);
                            // Also try to match the parent mission path if it's a sub-game
                            const parentPath = currentPath
                                .split("/")
                                .slice(0, 3)
                                .join("/");
                            const pIdx = MISSION_ORDER.indexOf(parentPath);

                            const targetIdx = idx !== -1 ? idx : pIdx;

                            if (
                                targetIdx !== -1 &&
                                targetIdx < MISSION_ORDER.length - 1
                            ) {
                                const nextPath = MISSION_ORDER[targetIdx + 1];
                                fetch("/api/mission", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ navTo: nextPath }),
                                }).catch(console.error);
                                goto(nextPath);
                            } else {
                                goto("/game");
                            }
                        }}
                    >
                        Volgende Missie
                    </button>
                </div>
            </div>
        </div>
    {/if}

    {#if gameState === "lost"}
        <div class="defeat-overlay">
            <div class="defeat-content">
                <div class="defeat-icon">😔</div>
                <h1>Helaas!</h1>
                <div class="defeat-actions">
                    <button class="btn-try-again" onclick={reset}>
                        Probeer Opnieuw
                    </button>

                    <button
                        class="btn-continue-anyway"
                        onclick={() => {
                            const currentPath =
                                window.location.pathname.replace(/\/$/, "");
                            const idx = MISSION_ORDER.indexOf(currentPath);
                            if (idx !== -1 && idx < MISSION_ORDER.length - 1) {
                                const nextPath = MISSION_ORDER[idx + 1];
                                // Tell everyone else to follow
                                fetch("/api/mission", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ navTo: nextPath }),
                                }).catch(console.error);
                                goto(nextPath);
                            } else {
                                window.history.back();
                            }
                        }}
                    >
                        Doorgaan
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Admin Bypass Section -->
    <div class="admin-section">
        <button
            class="admin-toggle"
            onclick={() => (showAdminBypass = !showAdminBypass)}
        >
            🔑 Admin
        </button>
        {#if showAdminBypass}
            <div class="admin-bypass">
                <input
                    type="password"
                    bind:value={adminPassword}
                    placeholder="Wachtwoord..."
                    onkeydown={(e) => e.key === "Enter" && handleAdminBypass()}
                />
                <button onclick={handleAdminBypass}>Skip</button>
            </div>
        {/if}
    </div>
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

    .defeat-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .btn-play-again,
    .btn-try-again,
    .btn-continue-anyway,
    .btn-continue {
        padding: 1rem 2.5rem;
        border-radius: 4px;
        font-weight: 700;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .victory-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .btn-play-again,
    .btn-try-again {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-continue {
        background: #0ef3ff;
        color: #020617;
        box-shadow: 0 0 20px rgba(14, 243, 255, 0.3);
    }

    .btn-continue:hover {
        background: #fff;
        box-shadow: 0 0 30px rgba(14, 243, 255, 0.5);
    }

    .btn-continue-anyway {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-play-again:hover,
    .btn-try-again:hover,
    .btn-continue-anyway:hover {
        transform: translateY(-2px);
        filter: brightness(1.2);
    }

    .btn-continue-anyway:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .admin-section {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }

    .admin-toggle {
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.7);
        padding: 0.6rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.85rem;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }

    .admin-toggle:hover {
        background: rgba(0, 0, 0, 0.9);
        border-color: rgba(255, 255, 255, 0.6);
        color: white;
    }

    .admin-bypass {
        margin-top: 0.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        display: flex;
        gap: 0.5rem;
        backdrop-filter: blur(10px);
    }

    .admin-bypass input {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.6rem;
        border-radius: 6px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 0.85rem;
    }

    .admin-bypass input:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.15);
    }

    .admin-bypass button {
        background: var(--primary);
        border: none;
        color: white;
        padding: 0.6rem 1rem;
        border-radius: 6px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
    }

    .admin-bypass button:hover {
        background: var(--secondary);
        transform: translateY(-1px);
    }
</style>

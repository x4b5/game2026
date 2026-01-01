<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale, scale as svelteScale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    const TARGET_LOCATION = "SLAAPKAMERLUCA";
    const CLEAN_TARGET = TARGET_LOCATION;

    let currentGuess = $state("");
    let solved = $state(false);
    let mounted = $state(false);

    // Generate a grid of letters including the target location
    let grid = $state<string[]>([]);

    onMount(() => {
        mounted = true;
        generateGrid();
    });

    function generateGrid() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const result = [];
        const required = CLEAN_TARGET.split("");

        // Add required letters
        result.push(...required);

        // Fill rest with random letters until 15 (3x5 grid)
        while (result.length < 15) {
            result.push(letters[Math.floor(Math.random() * letters.length)]);
        }

        // Shuffle
        grid = result.sort(() => Math.random() - 0.5);
    }

    function handleLetterClick(letter: string) {
        if (solved) return;

        const nextExpectedChar = CLEAN_TARGET[currentGuess.length];

        if (letter === nextExpectedChar) {
            currentGuess += letter;
            if (currentGuess === CLEAN_TARGET) {
                solved = true;
            }
        } else {
            // Wrong letter, reset or vibrate?
            currentGuess = "";
        }
    }

    function handleComplete() {
        // Navigate to the specific scan page for Luca's bedroom
        goto("/game/theta-pulse-19/luca-scan");
    }
</script>

<div class="tracking-page" in:fade>
    <div class="background-scan"></div>

    <div class="content-panel glass-panel">
        <header in:fly={{ y: -20 }}>
            <div class="mission-tag">OPERATIE: ACHTERVOLGING</div>
            <h1>SIGNAL TRACKER</h1>
            <p class="subtitle">
                Decodeer de achtergebleven ionische sporen om de ontsnapte
                aliens te lokaliseren.
            </p>
        </header>

        <div class="decoder-container">
            <div class="progress-display">
                <div class="label">GELOKALISEERDE COORDINATEN:</div>
                <div class="guess-box">
                    {#each TARGET_LOCATION.split("") as char, i}
                        <span
                            class="char-slot"
                            class:filled={i < currentGuess.length}
                        >
                            {#if i < currentGuess.length}
                                {CLEAN_TARGET[i]}
                            {:else}
                                _
                            {/if}
                        </span>
                    {/each}
                </div>
            </div>

            <div class="letter-grid">
                {#each grid as letter, i}
                    <button
                        class="letter-btn"
                        onclick={() => handleLetterClick(letter)}
                        in:svelteScale={{ delay: i * 30 }}
                    >
                        {letter}
                    </button>
                {/each}
            </div>

            <div class="status-box" class:solved>
                {#if solved}
                    <div class="success-message" in:fly={{ y: 10 }}>
                        <span class="icon">📍</span>
                        <div class="text">
                            <strong>LOCATIE GEVONDEN:</strong>
                            <h2>SLAAPKAMER LUCA</h2>
                        </div>
                    </div>
                {:else}
                    <div class="hint-message">
                        Selecteer de letters in de juiste volgorde om het spoor
                        te reconstrueren.
                    </div>
                {/if}
            </div>
        </div>

        {#if solved}
            <button
                class="next-btn"
                onclick={handleComplete}
                in:fly={{ y: 20 }}
            >
                NAAR DE SLAAPKAMER 🔦
            </button>
        {/if}
    </div>
</div>

<style>
    .tracking-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: #020617;
        position: relative;
        overflow: hidden;
    }

    .background-scan {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                rgba(59, 130, 246, 0.05) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.05) 1px,
                transparent 1px
            );
        background-size: 50px 50px;
        animation: scanMove 10s linear infinite;
    }

    @keyframes scanMove {
        from {
            background-position: 0 0;
        }
        to {
            background-position: 50px 50px;
        }
    }

    .content-panel {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(15, 23, 42, 0.9);
        border: 2px solid #3b82f6;
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
        display: flex;
        flex-direction: column;
        gap: 2rem;
        z-index: 1;
        border-radius: 24px;
        text-align: center;
    }

    .mission-tag {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        font-size: 0.8rem;
        letter-spacing: 3px;
        margin-bottom: 0.5rem;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2rem;
        color: white;
        margin: 0;
    }

    .subtitle {
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .decoder-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .progress-display {
        background: rgba(0, 0, 0, 0.4);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        color: #64748b;
        margin-bottom: 0.75rem;
        letter-spacing: 1px;
    }

    .guess-box {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .char-slot {
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        color: #334155;
        width: 25px;
        border-bottom: 2px solid #334155;
        transition: all 0.3s;
    }

    .char-slot.filled {
        color: #3b82f6;
        border-color: #3b82f6;
        text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    .letter-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.75rem;
    }

    .letter-btn {
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .letter-btn:hover {
        background: rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
        transform: scale(1.05);
    }

    .letter-btn:active {
        transform: scale(0.95);
    }

    .status-box {
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 1rem;
    }

    .status-box.solved {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .hint-message {
        color: #64748b;
        font-size: 0.85rem;
        font-style: italic;
    }

    .success-message {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        text-align: left;
    }

    .success-message .icon {
        font-size: 2.5rem;
    }

    .success-message h2 {
        font-family: "Orbitron", sans-serif;
        color: #22c55e;
        margin: 0;
        font-size: 1.4rem;
    }

    .success-message strong {
        font-size: 0.7rem;
        color: #4ade80;
        letter-spacing: 2px;
    }

    .next-btn {
        width: 100%;
        padding: 1.2rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
    }

    .next-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(34, 197, 94, 0.3);
        filter: brightness(1.1);
    }

    @media (max-width: 480px) {
        .letter-grid {
            gap: 0.5rem;
        }
        .letter-btn {
            font-size: 1rem;
        }
        h1 {
            font-size: 1.5rem;
        }
    }
</style>

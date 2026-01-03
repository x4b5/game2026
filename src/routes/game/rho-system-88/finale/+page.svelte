<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";
    import GameContainer from "$lib/components/GameContainer.svelte";

    let gameContainer: any;
    let gamePhase = $state<"intro" | "playing" | "success">("intro");

    // The target word (with space)
    const TARGET_WORD = "KAMER LUCA";

    // Available tiles (scrambled letters + space + some decoys)
    const ALL_LETTERS = [
        "K",
        "A",
        "M",
        "E",
        "R",
        " ",
        "L",
        "U",
        "C",
        "A",
        "X",
        "Z",
        "P",
        "N",
        "O",
        "I",
    ];

    let tiles = $state<{ id: number; letter: string; selected: boolean }[]>([]);
    let selectedLetters = $state<string[]>([]);
    let errorMessage = $state("");
    let showHint = $state(false);

    onMount(() => {
        shuffleTiles();
    });

    // Pre-filled letters (positions in TARGET_WORD: "KAMER LUCA")
    // Position: K=0, A=1, M=2, E=3, R=4, space=5, L=6, U=7, C=8, A=9
    // We pre-fill M (pos 2) and C (pos 8)
    const PREFILLED = [
        { pos: 2, letter: "M" },
        { pos: 8, letter: "C" },
    ];

    function shuffleTiles() {
        // Shuffle the letters, but mark M and C as already selected
        const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
        tiles = shuffled.map((letter, index) => ({
            id: index,
            letter,
            selected: letter === "M" || letter === "C", // Pre-select M and C
        }));
        // Initialize selectedLetters with placeholders for the prefilled positions
        initializeSelectedLetters();
    }

    function initializeSelectedLetters() {
        // Create array with nulls, then fill in prefilled letters
        const arr: (string | null)[] = new Array(TARGET_WORD.length).fill(null);
        PREFILLED.forEach((p) => {
            arr[p.pos] = p.letter;
        });
        selectedLetters = arr.filter((l) => l !== null) as string[];
        // Actually we need a different approach - track which positions are filled
    }

    // We'll use a different state: an array representing each slot
    let slots = $state<(string | null)[]>([]);

    function initSlots() {
        slots = TARGET_WORD.split("").map((letter, idx) => {
            const prefilled = PREFILLED.find((p) => p.pos === idx);
            return prefilled ? prefilled.letter : null;
        });
    }

    function selectTile(id: number) {
        const tile = tiles.find((t) => t.id === id);
        if (!tile || tile.selected) return;

        // Find next empty slot (that's not prefilled)
        const nextEmptyIdx = slots.findIndex(
            (s, idx) => s === null && !PREFILLED.some((p) => p.pos === idx),
        );

        if (nextEmptyIdx === -1) return; // All filled

        const expectedLetter = TARGET_WORD[nextEmptyIdx];

        if (tile.letter === expectedLetter) {
            // Correct!
            soundManager.playClick();
            tiles = tiles.map((t) =>
                t.id === id ? { ...t, selected: true } : t,
            );
            slots = slots.map((s, idx) =>
                idx === nextEmptyIdx ? tile.letter : s,
            );

            // Check if complete
            if (slots.every((s) => s !== null)) {
                soundManager.playWin();
                gamePhase = "success";
                setTimeout(() => {
                    goto("/game/gamma-prime-8");
                }, 3000);
            }
        } else {
            // Wrong!
            soundManager.playError();
            errorMessage = "Verkeerde letter! Begin opnieuw.";
            resetSelection();
        }
    }

    function resetSelection() {
        setTimeout(() => {
            // Reset tiles except M and C
            tiles = tiles.map((t) => ({
                ...t,
                selected: t.letter === "M" || t.letter === "C",
            }));
            // Reset slots to only prefilled
            initSlots();
            errorMessage = "";
        }, 500);
    }

    function startGame() {
        gamePhase = "playing";
        shuffleTiles();
        initSlots();
    }

    function resetGame() {
        // Reset tiles except M and C
        tiles = tiles.map((t) => ({
            ...t,
            selected: t.letter === "M" || t.letter === "C",
        }));
        initSlots();
        errorMessage = "";
    }
</script>

<div class="puzzle-page" in:fade>
    <GameContainer
        bind:this={gameContainer}
        gameId="pottenberg-puzzle"
        title="🧩 POTTENBERG PUZZEL"
    >
        {#if gamePhase === "intro"}
            <div class="intro-card" in:scale>
                <div class="location-badge">📍 POTTENBERG</div>
                <h2>ALIEN CODEBREAKER</h2>
                <p>
                    De ontsnapte aliens hebben zich verschanst in Pottenberg. Om
                    hun schuilplaats te onthullen, moet je de geheime code
                    ontcijferen.
                </p>
                <div class="hint-box">
                    <p>
                        💡 <strong>HINT:</strong> Combineer de naam van een ruimte
                        met de naam van een persoon.
                    </p>
                </div>
                <button class="start-btn" onclick={startGame}>
                    🔓 START PUZZEL
                </button>
            </div>
        {:else if gamePhase === "playing"}
            <div class="game-area">
                <div class="code-display">
                    <h3>GESELECTEERDE CODE:</h3>
                    <div class="selected-word">
                        {#each TARGET_WORD.split("") as char, i}
                            <div
                                class="letter-slot"
                                class:filled={slots[i] !== null}
                                class:prefilled={PREFILLED.some(
                                    (p) => p.pos === i,
                                )}
                                class:space={char === " "}
                            >
                                {#if char === " "}
                                    <span class="space-indicator">␣</span>
                                {:else}
                                    {slots[i] || "_"}
                                {/if}
                            </div>
                        {/each}
                    </div>
                    {#if errorMessage}
                        <p class="error-text" transition:slide>
                            {errorMessage}
                        </p>
                    {/if}
                </div>

                <div class="tiles-container">
                    <h3>TAP DE LETTERS IN DE JUISTE VOLGORDE:</h3>
                    <div class="tiles-grid">
                        {#each tiles as tile (tile.id)}
                            <button
                                class="tile"
                                class:selected={tile.selected}
                                class:space-tile={tile.letter === " "}
                                onclick={() => selectTile(tile.id)}
                                disabled={tile.selected}
                            >
                                {#if tile.letter === " "}
                                    <span class="space-label">SPATIE</span>
                                {:else}
                                    {tile.letter}
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>

                <button
                    class="hint-toggle"
                    onclick={() => (showHint = !showHint)}
                >
                    {showHint ? "❌ VERBERG HINT" : "💡 TOON HINT"}
                </button>

                {#if showHint}
                    <div class="hint-panel" transition:slide>
                        <p>
                            🏠 <strong>KAMER</strong> + 👤 <strong>LUCA</strong>
                            = ???
                        </p>
                    </div>
                {/if}

                <button class="reset-btn" onclick={resetGame}>
                    🔄 RESET LETTERS
                </button>
            </div>
        {:else if gamePhase === "success"}
            <div class="success-card" in:scale>
                <div class="success-icon">🎉</div>
                <h2>CODE GEKRAAKT!</h2>
                <div class="code-reveal">KAMERLUCA</div>
                <p>
                    De aliens zijn gelokaliseerd! Op naar de volgende missie...
                </p>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    .puzzle-page {
        min-height: 90vh;
        padding: 1rem;
    }

    .intro-card,
    .success-card {
        text-align: center;
        padding: 2rem;
    }

    .location-badge {
        display: inline-block;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }

    h3 {
        font-family: "Orbitron", sans-serif;
        color: #94a3b8;
        font-size: 0.85rem;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }

    p {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .hint-box {
        background: rgba(251, 191, 36, 0.1);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
    }

    .hint-box p {
        margin: 0;
        color: #fbbf24;
    }

    .start-btn {
        width: 100%;
        padding: 1.2rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
    }

    .start-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }

    .game-area {
        padding: 1.5rem;
    }

    .code-display {
        text-align: center;
        margin-bottom: 2rem;
    }

    .selected-word {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .letter-slot {
        width: 40px;
        height: 50px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #3b82f6;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: #64748b;
    }

    .letter-slot.filled {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border-color: #60a5fa;
    }

    .letter-slot.prefilled {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        border-color: #22c55e;
    }

    .letter-slot.space {
        width: 30px;
        background: rgba(251, 191, 36, 0.1);
        border-color: #fbbf24;
        border-style: dashed;
    }

    .space-indicator {
        color: #fbbf24;
        font-size: 1rem;
    }

    .error-text {
        color: #ef4444;
        font-size: 0.9rem;
        margin-top: 1rem;
        margin-bottom: 0;
    }

    .tiles-container {
        margin-bottom: 1.5rem;
    }

    .tiles-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
    }

    .tile {
        aspect-ratio: 1;
        background: linear-gradient(145deg, #1e293b, #0f172a);
        border: 2px solid #475569;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tile:hover:not(.selected) {
        border-color: #3b82f6;
        background: linear-gradient(145deg, #334155, #1e293b);
        transform: scale(1.05);
    }

    .tile.selected {
        background: #22c55e;
        border-color: #16a34a;
        opacity: 0.5;
        cursor: not-allowed;
        transform: scale(0.95);
    }

    .tile.space-tile {
        background: linear-gradient(145deg, #44403c, #292524);
        border-color: #fbbf24;
        border-style: dashed;
    }

    .tile.space-tile:hover:not(.selected) {
        background: linear-gradient(145deg, #57534e, #44403c);
        border-color: #fcd34d;
    }

    .space-label {
        font-size: 0.7rem;
        color: #fbbf24;
    }

    .hint-toggle {
        width: 100%;
        padding: 0.8rem;
        background: transparent;
        border: 1px dashed rgba(251, 191, 36, 0.5);
        border-radius: 8px;
        color: #fbbf24;
        font-family: "Orbitron", sans-serif;
        font-size: 0.85rem;
        cursor: pointer;
        margin-bottom: 1rem;
        transition: all 0.2s;
    }

    .hint-toggle:hover {
        background: rgba(251, 191, 36, 0.1);
    }

    .hint-panel {
        background: rgba(251, 191, 36, 0.1);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
    }

    .hint-panel p {
        margin: 0;
        color: #fbbf24;
        font-size: 1.2rem;
    }

    .reset-btn {
        width: 100%;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        border-radius: 12px;
        color: #f87171;
        font-family: "Orbitron", sans-serif;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .reset-btn:hover {
        background: rgba(239, 68, 68, 0.3);
    }

    .success-card {
        text-align: center;
    }

    .success-icon {
        font-size: 5rem;
        margin-bottom: 1rem;
    }

    .code-reveal {
        font-family: "Orbitron", sans-serif;
        font-size: 2rem;
        font-weight: 900;
        color: #22c55e;
        letter-spacing: 4px;
        padding: 1rem;
        background: rgba(34, 197, 94, 0.1);
        border: 2px solid #22c55e;
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale, slide, fly } from "svelte/transition";
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
    let errorMessage = $state("");
    let showHint = $state(false);

    onMount(() => {
        shuffleTiles();
    });

    // Pre-filled letters
    const PREFILLED = [
        { pos: 2, letter: "M" },
        { pos: 8, letter: "C" },
    ];

    function shuffleTiles() {
        const shuffled = [...ALL_LETTERS].sort(() => Math.random() - 0.5);
        tiles = shuffled.map((letter, index) => ({
            id: index,
            letter,
            selected: letter === "M" || letter === "C",
        }));
        initializeSelectedLetters();
    }

    function initializeSelectedLetters() {
        initSlots();
    }

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

        const nextEmptyIdx = slots.findIndex(
            (s, idx) => s === null && !PREFILLED.some((p) => p.pos === idx),
        );

        if (nextEmptyIdx === -1) return;

        const expectedLetter = TARGET_WORD[nextEmptyIdx];

        if (tile.letter === expectedLetter) {
            soundManager.playClick();
            tiles = tiles.map((t) =>
                t.id === id ? { ...t, selected: true } : t,
            );
            slots = slots.map((s, idx) =>
                idx === nextEmptyIdx ? tile.letter : s,
            );

            if (slots.every((s) => s !== null)) {
                soundManager.playSuccess();
                gamePhase = "success";
                gameContainer?.win(1500); // Trigger victory screen with button
            }
        } else {
            soundManager.playError();
            errorMessage = "SEQUENTIE FOUT! RESET VEREIST.";
            resetSelection();
        }
    }

    function resetSelection() {
        setTimeout(() => {
            tiles = tiles.map((t) => ({
                ...t,
                selected: t.letter === "M" || t.letter === "C",
            }));
            initSlots();
            errorMessage = "";
        }, 1000);
    }

    function startGame() {
        soundManager.playClick();
        gamePhase = "playing";
        shuffleTiles();
        initSlots();
    }

    function resetGame() {
        soundManager.playClick();
        tiles = tiles.map((t) => ({
            ...t,
            selected: t.letter === "M" || t.letter === "C",
        }));
        initSlots();
        errorMessage = "";
    }
</script>

<div class="omicron-theme">
    <div class="env-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="pottenberg-puzzle"
        title="🧩 POTTENBERG: DECRYPTION UNIT"
        nextUrl="/game/gamma-prime-8"
    >
        {#if gamePhase === "intro"}
            <div class="intro-screen" in:fade>
                <div class="location-badge">
                    <span class="dot"></span> POTTENBERG SECTOR
                </div>
                <h2 class="glitch-title" data-text="CODEBREAKER">
                    CODEBREAKER
                </h2>
                <div class="briefing-panel glass-panel">
                    <div class="deco-corner tl"></div>
                    <div class="deco-corner br"></div>
                    <p class="story-text">
                        De ontsnapte aliens hebben zich verschanst in
                        Pottenberg. Om hun schuilplaats te onthullen, moet je de
                        biomechanische encryptie doorbreken.
                    </p>
                    <div class="hint-strip">
                        <span class="icon">💡</span>
                        INTEL: NAAM RUIMTE + NAAM PERSOON
                    </div>
                </div>
                <button class="cyber-btn primary" onclick={startGame}>
                    <span class="btn-text">🔓 INITIATE DECRYPTION</span>
                    <div class="glitch-effect"></div>
                </button>
            </div>
        {:else if gamePhase === "playing"}
            <div class="game-area" in:fade>
                <div class="code-panel glass-panel">
                    <div class="panel-header">ACTIVE SEQUENCE</div>
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
                                    <span class="space-indicator">/</span>
                                {:else}
                                    {slots[i] || ""}
                                    <div class="slot-bg"></div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    {#if errorMessage}
                        <div class="error-banner" transition:slide>
                            <span class="blink">⚠</span>
                            {errorMessage}
                        </div>
                    {/if}
                </div>

                <div class="input-panel glass-panel">
                    <div class="panel-header">AVAILABLE FRAGMENTS</div>
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
                                    <span class="space-label">SPACE</span>
                                {:else}
                                    {tile.letter}
                                {/if}
                                <div class="tile-glow"></div>
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="controls-row">
                    <button
                        class="cyber-btn secondary small"
                        onclick={() => (showHint = !showHint)}
                    >
                        {showHint ? "HIDE INTEL" : "REVEAL HINT"}
                    </button>
                    <button class="cyber-btn danger small" onclick={resetGame}>
                        RESET SEQUENCE
                    </button>
                </div>

                {#if showHint}
                    <div class="hint-overlay" transition:fly={{ y: 20 }}>
                        <div class="hint-content glass-panel">
                            <span class="terminal-text">> KAMER + LUCA</span>
                        </div>
                    </div>
                {/if}
            </div>
        {:else if gamePhase === "success"}
            <div class="success-screen" in:scale>
                <div class="success-icon">🏆</div>
                <h2 class="success-title">DECRYPTION SUCCESS</h2>
                <div class="code-reveal">
                    {TARGET_WORD}
                </div>
                <p class="success-msg">
                    Schuilplaats gelokaliseerd. Signaal wordt omgeleid...
                </p>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap");

    :global(body) {
        background-color: #020617;
        margin: 0;
        overflow-x: hidden;
    }

    .omicron-theme {
        position: relative;
        min-height: 100vh;
        font-family: "Rajdhani", sans-serif;
        color: #e2e8f0;
    }

    /* Backgrounds */
    .env-bg {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            #0f172a 0%,
            #020617 100%
        );
        z-index: -1;
    }

    .scanlines {
        position: fixed;
        inset: 0;
        background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 100;
        opacity: 0.3;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 40%,
            rgba(0, 0, 0, 0.8) 100%
        );
        pointer-events: none;
        z-index: 101;
    }

    /* Common Components */
    .glass-panel {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(14, 243, 255, 0.2);
        backdrop-filter: blur(8px);
        padding: 1.5rem;
        position: relative;
    }

    .deco-corner {
        position: absolute;
        width: 10px;
        height: 10px;
        border: 2px solid #0ef3ff;
    }
    .deco-corner.tl {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
    }
    .deco-corner.br {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
    }

    .panel-header {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.75rem;
        color: #0ef3ff;
        opacity: 0.7;
        margin-bottom: 1rem;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    /* Intro Screen */
    .intro-screen {
        text-align: center;
        max-width: 500px;
        margin: 2rem auto;
    }

    .location-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(14, 243, 255, 0.1);
        color: #0ef3ff;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(14, 243, 255, 0.2);
    }

    .dot {
        width: 8px;
        height: 8px;
        background: #0ef3ff;
        border-radius: 50%;
        animation: pulse-dot 1s infinite;
    }

    @keyframes pulse-dot {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.4;
            transform: scale(0.8);
        }
    }

    .glitch-title {
        font-family: "Orbitron", sans-serif;
        font-size: 3rem;
        color: #fff;
        text-transform: uppercase;
        position: relative;
        margin-bottom: 2rem;
    }

    .glitch-title::after {
        content: attr(data-text);
        position: absolute;
        left: 2px;
        top: 0;
        color: #0ef3ff;
        background: transparent;
        overflow: hidden;
        clip-path: inset(0 0 0 0);
        animation: glitch-anim 3s infinite linear alternate-reverse;
        opacity: 0.5;
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(80% 0 1% 0);
        }
        50% {
            clip-path: inset(10% 0 30% 0);
        }
        100% {
            clip-path: inset(40% 0 40% 0);
        }
    }

    .story-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #94a3b8;
        margin-bottom: 1.5rem;
    }

    .hint-strip {
        background: rgba(251, 191, 36, 0.1);
        border: 1px dashed rgba(251, 191, 36, 0.3);
        padding: 1rem;
        color: #fbbf24;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.9rem;
    }

    /* Game Area */
    .game-area {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 650px;
        margin: 0 auto;
    }

    .selected-word {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .letter-slot {
        position: relative;
        width: 45px;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif;
        font-size: 1.8rem;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(14, 243, 255, 0.2);
    }

    .slot-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(14, 243, 255, 0.05)
        );
        pointer-events: none;
    }

    .letter-slot.filled {
        border-color: #0ef3ff;
        box-shadow: inset 0 0 10px rgba(14, 243, 255, 0.1);
    }

    .letter-slot.prefilled {
        background: rgba(34, 197, 94, 0.1);
        color: #4ade80;
        border-color: #22c55e;
    }

    .letter-slot.space {
        border-style: dashed;
        background: rgba(255, 255, 255, 0.05);
    }

    .space-indicator {
        opacity: 0.3;
        font-size: 1.2rem;
    }

    .error-banner {
        margin-top: 1rem;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 0.5rem;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.85rem;
        border: 1px solid #ef4444;
        text-align: center;
    }

    .blink {
        animation: blink-anim 1s infinite alternate;
    }
    @keyframes blink-anim {
        from {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
    }

    /* Input Panel */
    .tiles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 0.75rem;
    }

    .tile {
        position: relative;
        aspect-ratio: 1;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: "Orbitron", sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .tile:hover:not(.selected) {
        border-color: #0ef3ff;
        background: rgba(14, 243, 255, 0.1);
        transform: translateY(-2px);
    }

    .tile.selected {
        opacity: 0.2;
        cursor: not-allowed;
    }

    .tile.space-tile .space-label {
        font-size: 0.65rem;
        color: #0ef3ff;
    }

    .tile-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            rgba(14, 243, 255, 0.1),
            transparent
        );
        opacity: 0;
        transition: opacity 0.2s;
    }
    .tile:hover .tile-glow {
        opacity: 1;
    }

    /* Controls */
    .controls-row {
        display: flex;
        gap: 1rem;
    }

    .hint-overlay {
        text-align: center;
    }

    .hint-content {
        display: inline-block;
        padding: 0.75rem 2rem;
        background: rgba(14, 243, 255, 0.05);
    }

    .terminal-text {
        font-family: "Share Tech Mono", monospace;
        color: #0ef3ff;
        font-size: 1.2rem;
    }

    /* Cyber Buttons */
    .cyber-btn {
        position: relative;
        padding: 1rem 1.5rem;
        border: none;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
    }

    .cyber-btn.primary {
        background: #0ef3ff;
        color: #020617;
        width: 100%;
        clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);
    }

    .cyber-btn.secondary {
        flex: 1;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid #0ef3ff;
        clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
    }

    .cyber-btn.danger {
        flex: 1;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #ef4444;
        clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
    }

    .cyber-btn:hover {
        filter: brightness(1.2);
        transform: translateY(-2px);
    }

    .glitch-effect {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        transform: translateX(-100%);
        transition: 0.5s;
    }
    .cyber-btn:hover .glitch-effect {
        transform: translateX(100%);
    }

    /* Success Screen */
    .success-screen {
        text-align: center;
        padding: 2rem;
    }

    .success-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        animation: success-bounce 1s infinite alternate
            cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes success-bounce {
        from {
            transform: scale(0.9);
            filter: drop-shadow(0 0 10px #0ef3ff);
        }
        to {
            transform: scale(1.1);
            filter: drop-shadow(0 0 30px #0ef3ff);
        }
    }

    .success-title {
        font-family: "Orbitron", sans-serif;
        color: #0ef3ff;
        margin-bottom: 1.5rem;
    }

    .code-reveal {
        font-family: "Orbitron", sans-serif;
        font-size: 2.5rem;
        background: rgba(14, 243, 255, 0.1);
        border: 1px solid #0ef3ff;
        padding: 1rem;
        letter-spacing: 5px;
        margin-bottom: 1.5rem;
        color: #fff;
    }

    .success-msg {
        color: #94a3b8;
        font-style: italic;
    }
</style>

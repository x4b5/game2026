<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";

    let gameContainer: any;
    let nodes = $state<{ id: number; active: boolean; energy: number }[]>([]);
    let gameActive = $state(false);
    let stability = $state(100);
    let timer: any;

    const TARGET_STABILITY = 100;

    function initGame() {
        nodes = Array.from({ length: 9 }, (_, i) => ({
            id: i,
            active: Math.random() > 0.5,
            energy: Math.floor(Math.random() * 100),
        }));
        stability = 50;
        gameActive = true;

        timer = setInterval(() => {
            if (gameActive) {
                stability -= 0.5;
                if (stability <= 0) {
                    gameActive = false;
                    gameContainer?.lose();
                }
            }
        }, 100);
    }

    function toggleNode(id: number) {
        if (!gameActive) return;

        nodes[id].active = !nodes[id].active;

        // Influence neighbors
        const neighbors = getNeighbors(id);
        neighbors.forEach((nId) => {
            nodes[nId].active = !nodes[nId].active;
        });

        checkWin();
    }

    function getNeighbors(id: number) {
        const neighbors = [];
        const row = Math.floor(id / 3);
        const col = id % 3;

        if (row > 0) neighbors.push(id - 3);
        if (row < 2) neighbors.push(id + 3);
        if (col > 0) neighbors.push(id - 1);
        if (col < 2) neighbors.push(id + 1);

        return neighbors;
    }

    function checkWin() {
        const allActive = nodes.every((n) => n.active);
        if (allActive) {
            gameActive = false;
            clearInterval(timer);
            gameContainer?.win(Math.floor(stability * 100));
        }
    }

    onMount(() => {
        initGame();
        return () => clearInterval(timer);
    });

    function handleReset() {
        initGame();
    }
</script>

<div class="circuit-page" in:fade>
    <GameContainer
        bind:this={gameContainer}
        gameId="zeta-circuit"
        title="⚡ ZETA FLUX: CIRCUIT OVERLOAD"
        onReset={handleReset}
    >
        <div class="game-content">
            <div class="mission-briefing">
                <p>
                    Stabiliseer het circuit door alle knooppunten te activeren.
                    Elke actie beïnvloedt de omliggende verbindingen!
                </p>
            </div>

            <div class="status-panel">
                <div class="stability-label">SYSTEEM STABILITEIT</div>
                <div class="stability-bar">
                    <div
                        class="stability-fill"
                        style:width="{stability}%"
                        class:critical={stability < 30}
                    ></div>
                </div>
                <div class="stability-value">{Math.round(stability)}%</div>
            </div>

            <div class="nodes-grid">
                {#each nodes as node (node.id)}
                    <button
                        class="node-btn"
                        class:active={node.active}
                        onclick={() => toggleNode(node.id)}
                    >
                        <div class="node-inner">
                            <div class="pulse-ring"></div>
                            {#if node.active}
                                <span class="bolt">⚡</span>
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </GameContainer>
</div>

<style>
    .circuit-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .game-content {
        max-width: 500px;
        width: 100%;
        margin: 0 auto;
    }

    .mission-briefing {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        color: #d8b4fe;
        font-size: 0.9rem;
        text-align: center;
        line-height: 1.5;
    }

    .status-panel {
        margin-bottom: 2.5rem;
        text-align: center;
    }

    .stability-label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.75rem;
        color: #94a3b8;
        margin-bottom: 0.8rem;
        letter-spacing: 2px;
    }

    .stability-bar {
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 0.5rem;
    }

    .stability-fill {
        height: 100%;
        background: linear-gradient(90deg, #8b5cf6, #d8b4fe);
        transition: width 0.3s ease;
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }

    .stability-fill.critical {
        background: linear-gradient(90deg, #ef4444, #f87171);
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        animation: blink 0.5s infinite;
    }

    .stability-value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: white;
    }

    .nodes-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        padding: 1rem;
    }

    .node-btn {
        aspect-ratio: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(139, 92, 246, 0.3);
        border-radius: 16px;
        cursor: pointer;
        position: relative;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 0;
        overflow: hidden;
    }

    .node-btn:hover {
        border-color: rgba(139, 92, 246, 0.8);
        transform: scale(1.05);
    }

    .node-btn.active {
        background: rgba(139, 92, 246, 0.2);
        border-color: #8b5cf6;
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
    }

    .node-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .bolt {
        font-size: 1.5rem;
        filter: drop-shadow(0 0 5px #8b5cf6);
        animation: bolt-in 0.3s ease-out forwards;
    }

    .pulse-ring {
        position: absolute;
        width: 40%;
        height: 40%;
        border-radius: 50%;
        border: 2px solid #8b5cf6;
        opacity: 0;
    }

    .node-btn.active .pulse-ring {
        animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(2.5);
            opacity: 0;
        }
    }

    @keyframes bolt-in {
        from {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0);
            opacity: 1;
        }
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>

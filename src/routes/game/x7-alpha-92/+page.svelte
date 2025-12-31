<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    interface Star {
        id: number;
        x: number;
        y: number;
        connected: boolean;
    }

    interface Connection {
        from: number;
        to: number;
    }

    let gameContainer: any;
    let stars = $state<Star[]>([]);
    let connections = $state<Connection[]>([]);
    let selectedStar = $state<number | null>(null);
    let canvasEl: HTMLCanvasElement;
    let containerEl: HTMLDivElement;

    // Correct sequence spells "2026"
    const correctSequence = [0, 1, 2, 3, 4, 5, 6, 7];

    onMount(() => {
        initStars();
        drawCanvas();
    });

    function initStars() {
        // Generate star positions that form "2026" when connected
        const pattern = [
            { x: 20, y: 30 }, // 0: Start of "2"
            { x: 40, y: 20 }, // 1
            { x: 40, y: 50 }, // 2
            { x: 20, y: 60 }, // 3: End of "2"
            { x: 55, y: 30 }, // 4: "0" top
            { x: 70, y: 45 }, // 5: "0" right
            { x: 55, y: 60 }, // 6: "0" bottom
            { x: 40, y: 45 }, // 7: "0" left (connects back to 4)
        ];

        stars = pattern.map((pos, id) => ({
            id,
            x: pos.x,
            y: pos.y,
            connected: false,
        }));
    }

    function drawCanvas() {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext("2d");
        if (!ctx) return;

        const rect = containerEl.getBoundingClientRect();
        canvasEl.width = rect.width;
        canvasEl.height = rect.height;

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Draw connections
        ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        connections.forEach((conn) => {
            const from = stars.find((s) => s.id === conn.from);
            const to = stars.find((s) => s.id === conn.to);
            if (from && to) {
                const x1 = (from.x / 100) * canvasEl.width;
                const y1 = (from.y / 100) * canvasEl.height;
                const x2 = (to.x / 100) * canvasEl.width;
                const y2 = (to.y / 100) * canvasEl.height;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Add glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#6366f1";
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        });
    }

    function handleStarClick(starId: number) {
        soundManager.playClick();

        if (selectedStar === null) {
            selectedStar = starId;
        } else if (selectedStar === starId) {
            selectedStar = null;
        } else {
            // Create connection
            const newConnection = { from: selectedStar, to: starId };
            connections = [...connections, newConnection];

            stars[selectedStar].connected = true;
            stars[starId].connected = true;

            selectedStar = null;
            drawCanvas();

            soundManager.playSuccess();
            checkWin();
        }
    }

    function checkWin() {
        if (connections.length >= 7) {
            // Check if connections form correct pattern
            const isCorrect =
                connections.length === 7 &&
                connections.every((conn) => {
                    const expectedNext = correctSequence.indexOf(conn.from) + 1;
                    return (
                        correctSequence[expectedNext] === conn.to ||
                        correctSequence[expectedNext - 1] === conn.from
                    );
                });

            if (isCorrect || connections.length === 7) {
                gameContainer?.win(1000);
            }
        }
    }

    $effect(() => {
        drawCanvas();
    });
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="nebula-post"
    title="🌌 Nebula Post"
>
    <div class="constellation-game" bind:this={containerEl}>
        <div class="instructions">
            <p>Verbind de sterren om de verborgen code te onthullen</p>
        </div>

        <div class="star-field">
            <canvas bind:this={canvasEl} class="connection-canvas"></canvas>

            {#each stars as star}
                <button
                    class="star"
                    class:selected={selectedStar === star.id}
                    class:connected={star.connected}
                    style:left="{star.x}%"
                    style:top="{star.y}%"
                    onclick={() => handleStarClick(star.id)}
                >
                    <span class="star-glow"></span>
                    ⭐
                </button>
            {/each}
        </div>

        <div class="hint">
            Tip: De sterren vormen cijfers wanneer je ze correct verbindt
        </div>
    </div>
</GameContainer>

<style>
    .constellation-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .instructions {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--text-muted);
    }

    .star-field {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: radial-gradient(
            ellipse at center,
            rgba(99, 102, 241, 0.1),
            transparent
        );
        border-radius: 20px;
        border: 2px solid var(--glass-border);
        overflow: hidden;
    }

    .connection-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .star {
        position: absolute;
        width: 50px;
        height: 50px;
        transform: translate(-50%, -50%);
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
        animation: twinkle 3s ease-in-out infinite;
    }

    @keyframes twinkle {
        0%,
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }

    .star.selected {
        animation: pulse 0.5s ease-in-out infinite;
        filter: drop-shadow(0 0 20px #6366f1);
    }

    @keyframes pulse {
        0%,
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.3);
        }
    }

    .star.connected {
        filter: drop-shadow(0 0 10px #22c55e);
    }

    .star:hover {
        transform: translate(-50%, -50%) scale(1.2);
    }

    .hint {
        margin-top: 2rem;
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-muted);
        font-style: italic;
    }

    @media (max-width: 640px) {
        .star {
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
        }
    }
</style>

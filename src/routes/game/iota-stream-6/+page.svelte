<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    interface DataFragment {
        id: number;
        x: number;
        y: number;
        speed: number;
        type: "good" | "bad";
    }

    let gameContainer: any;
    let fragments = $state<DataFragment[]>([]);
    let catcherX = $state(50); // Percentage position
    let goodCaught = $state(0);
    let badCaught = $state(0);
    let gameActive = $state(true);
    let currentId = 0;

    const TARGET_GOOD = 30;
    const MAX_BAD = 5;
    const CATCHER_WIDTH = 20; // Percentage

    let spawnTimer: any;
    let updateTimer: any;

    onMount(() => {
        startGame();

        return () => {
            clearInterval(spawnTimer);
            clearInterval(updateTimer);
        };
    });

    function startGame() {
        spawnTimer = setInterval(spawnFragment, 800);
        updateTimer = setInterval(updateFragments, 50);
    }

    function spawnFragment() {
        if (!gameActive) return;

        const fragment: DataFragment = {
            id: currentId++,
            x: Math.random() * 100,
            y: -5,
            speed: 1 + Math.random() * 1.5 + goodCaught * 0.05, // Speed increases
            type: Math.random() > 0.3 ? "good" : "bad",
        };

        fragments = [...fragments, fragment];
    }

    function updateFragments() {
        if (!gameActive) return;

        fragments = fragments
            .map((f) => ({
                ...f,
                y: f.y + f.speed,
            }))
            .filter((f) => {
                // Check if caught
                if (f.y > 85 && f.y < 95) {
                    const catcherLeft = catcherX - CATCHER_WIDTH / 2;
                    const catcherRight = catcherX + CATCHER_WIDTH / 2;

                    if (f.x >= catcherLeft && f.x <= catcherRight) {
                        if (f.type === "good") {
                            goodCaught++;
                            soundManager.playSuccess();

                            if (goodCaught >= TARGET_GOOD) {
                                gameActive = false;
                                clearInterval(spawnTimer);
                                clearInterval(updateTimer);
                                gameContainer?.win(
                                    goodCaught * 100 - badCaught * 50,
                                );
                            }
                        } else {
                            badCaught++;
                            soundManager.playError();

                            if (badCaught >= MAX_BAD) {
                                gameActive = false;
                                clearInterval(spawnTimer);
                                clearInterval(updateTimer);
                                gameContainer?.lose();
                            }
                        }
                        return false; // Remove caught fragment
                    }
                }

                // Remove if off screen
                return f.y < 100;
            });
    }

    function handlePointerMove(e: PointerEvent) {
        const rect = (
            e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        catcherX = Math.max(
            CATCHER_WIDTH / 2,
            Math.min(100 - CATCHER_WIDTH / 2, percentage),
        );
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = (
            e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        catcherX = Math.max(
            CATCHER_WIDTH / 2,
            Math.min(100 - CATCHER_WIDTH / 2, percentage),
        );
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="iota-stream"
    title="🌊 Iota Stream"
>
    <div class="stream-game">
        <div class="game-stats">
            <div class="stat good">
                <span class="stat-label">✓ Goede Data</span>
                <span class="stat-value">{goodCaught}/{TARGET_GOOD}</span>
            </div>
            <div class="stat bad">
                <span class="stat-label">✗ Corrupte Data</span>
                <span class="stat-value">{badCaught}/{MAX_BAD}</span>
            </div>
        </div>

        <div
            class="stream-field"
            role="slider"
            tabindex="0"
            aria-label="Data catcher position"
            onpointermove={handlePointerMove}
            ontouchmove={handleTouchMove}
        >
            <!-- Data fragments -->
            {#each fragments as fragment (fragment.id)}
                <div
                    class="data-fragment"
                    class:good={fragment.type === "good"}
                    class:bad={fragment.type === "bad"}
                    style:left="{fragment.x}%"
                    style:top="{fragment.y}%"
                >
                    <div class="fragment-glow"></div>
                    <div class="fragment-core">
                        {fragment.type === "good" ? "1" : "0"}
                    </div>
                </div>
            {/each}

            <!-- Catcher -->
            <div class="catcher" style:left="{catcherX}%">
                <div class="catcher-beam"></div>
                <div class="catcher-body">
                    <div class="catcher-indicator"></div>
                </div>
            </div>

            <!-- Grid background -->
            <div class="grid-background"></div>
        </div>

        <div class="hint">
            Sleep horizontaal om data te vangen • Vang groene data, vermijd
            rode!
        </div>
    </div>
</GameContainer>

<style>
    .stream-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .game-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat {
        flex: 1;
        padding: 1rem;
        background: var(--glass);
        border-radius: 12px;
        border: 2px solid var(--glass-border);
        text-align: center;
    }

    .stat.good {
        border-color: rgba(34, 197, 94, 0.5);
    }

    .stat.bad {
        border-color: rgba(239, 68, 68, 0.5);
    }

    .stat-label {
        display: block;
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stream-field {
        position: relative;
        width: 100%;
        height: 500px;
        background: linear-gradient(
            to bottom,
            rgba(99, 102, 241, 0.1),
            rgba(236, 72, 153, 0.1)
        );
        border-radius: 20px;
        border: 2px solid var(--glass-border);
        overflow: hidden;
        touch-action: none;
        cursor: none;
        margin-bottom: 1rem;
    }

    .grid-background {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                90deg,
                transparent 49%,
                rgba(255, 255, 255, 0.05) 50%,
                transparent 51%
            ),
            linear-gradient(
                0deg,
                transparent 49%,
                rgba(255, 255, 255, 0.05) 50%,
                transparent 51%
            );
        background-size: 40px 40px;
        pointer-events: none;
        opacity: 0.3;
    }

    .data-fragment {
        position: absolute;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .fragment-glow {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        filter: blur(8px);
    }

    .data-fragment.good .fragment-glow {
        background: #22c55e;
        animation: pulse-good 2s ease-in-out infinite;
    }

    .data-fragment.bad .fragment-glow {
        background: #ef4444;
        animation: pulse-bad 2s ease-in-out infinite;
    }

    @keyframes pulse-good {
        0%,
        100% {
            opacity: 0.6;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    @keyframes pulse-bad {
        0%,
        100% {
            opacity: 0.6;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    .fragment-core {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
        border: 2px solid;
    }

    .data-fragment.good .fragment-core {
        background: rgba(34, 197, 94, 0.3);
        border-color: #22c55e;
        color: #22c55e;
    }

    .data-fragment.bad .fragment-core {
        background: rgba(239, 68, 68, 0.3);
        border-color: #ef4444;
        color: #ef4444;
    }

    .catcher {
        position: absolute;
        bottom: 5%;
        width: 20%;
        transform: translateX(-50%);
        transition: left 0.1s ease-out;
        pointer-events: none;
    }

    .catcher-beam {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100px;
        background: linear-gradient(to bottom, transparent, var(--primary));
        box-shadow: 0 0 10px var(--primary);
    }

    .catcher-body {
        position: relative;
        width: 100%;
        height: 40px;
        background: var(--glass);
        border: 2px solid var(--primary);
        border-radius: 20px;
        box-shadow: 0 0 20px var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .catcher-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary);
        animation: blink 1s ease-in-out infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }

    .hint {
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-muted);
        font-style: italic;
    }

    @media (max-width: 640px) {
        .stream-field {
            height: 400px;
        }

        .data-fragment {
            width: 35px;
            height: 35px;
        }

        .fragment-core {
            font-size: 1rem;
        }
    }
</style>

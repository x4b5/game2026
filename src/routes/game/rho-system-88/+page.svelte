<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";

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
    let gameActive = $state(false);
    let briefingVisible = $state(true);
    let currentId = 0;

    const TARGET_GOOD = 30;
    const MAX_BAD = 5;
    const CATCHER_WIDTH = 20; // Percentage

    let spawnTimer: any;
    let updateTimer: any;

    onMount(() => {
        return () => {
            clearInterval(spawnTimer);
            clearInterval(updateTimer);
        };
    });

    function acceptBriefing() {
        briefingVisible = false;
        startGame();
    }

    function startGame() {
        gameActive = true;
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
                                // Win -> Go to Finale
                                gameContainer?.win(
                                    goodCaught * 100 - badCaught * 50,
                                );
                                setTimeout(
                                    () => goto("/game/rho-system-88/finale"),
                                    1500,
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

<div class="scanlines"></div>
<div class="animated-bg"></div>

<GameContainer
    bind:this={gameContainer}
    gameId="rho-system"
    title="📡 Rho System 88"
>
    <div class="stream-game">
        {#if briefingVisible}
            <div class="intel-briefing" in:fade>
                <div class="briefing-header">
                    <span class="alert-tag">⚠️ STATUS: UPDATE</span>
                    <h1>MISSION UPDATE</h1>
                </div>

                <div class="briefing-content">
                    <p class="intel-text">
                        <strong>> PREVIOUS MISSION:</strong>
                        <span class="highlight">SUCCESS</span>. Energieveld
                        geneutraliseerd. Kappa Grid is offline. Uitstekend werk,
                        agenten.
                    </p>
                    <p>
                        <strong>> NEW INTEL:</strong> Sensoren detecteren nu activiteit
                        in Sector **KAZEMATTEN**. The Minck vertoont ongebruikelijke
                        energie-pieken.
                    </p>
                    <p>
                        <strong>> OBJECTIVE:</strong> Verplaats onmiddellijk naar
                        de Kazematten. Observeer en rapporteer. Wees op uw hoede
                        voor vijandelijke resten.
                    </p>
                    <div class="warning-box">MOVE OUT. STAY FROSTY.</div>
                </div>

                <button class="accept-btn" onclick={acceptBriefing}>
                    [ PROCEED TO TARGET ]
                </button>
            </div>
        {:else}
            <div class="game-stats" in:fade>
                <div class="stat good">
                    <span class="stat-label">DATA INTEGRITY</span>
                    <span class="stat-value">{goodCaught}/{TARGET_GOOD}</span>
                </div>
                <div class="stat bad">
                    <span class="stat-label">CORRUPTION</span>
                    <span class="stat-value">{badCaught}/{MAX_BAD}</span>
                </div>
            </div>
        {/if}

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
            <div class="scan-line-sweep"></div>
        </div>

        <div class="hint">> SWIPE TO CAPTURE DATA STREAMS</div>
    </div>
</GameContainer>

<style>
    /* Military / Tactical Theme Global Overrides */
    :global(body) {
        background-color: #050505;
        color: #10b981;
    }

    /* Scanlines Overlay */
    .scanlines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
        );
        pointer-events: none;
        z-index: 10;
        opacity: 0.7;
    }

    /* Animated Background */
    .animated-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(16, 185, 129, 0.05) 70%
            ),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.03) 1px,
                transparent 1px
            );
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -1;
    }

    .stream-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        font-family: "Courier New", Courier, monospace;
        position: relative;
        z-index: 20;
    }

    /* Stats Panel */
    .game-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(16, 185, 129, 0.3);
        background: rgba(0, 0, 0, 0.6);
    }

    .stat {
        flex: 1;
        padding: 1rem;
        text-align: center;
        border-right: 1px solid rgba(16, 185, 129, 0.3);
    }
    .stat:last-child {
        border-right: none;
    }

    .stat-label {
        display: block;
        font-size: 0.7rem;
        color: #64748b;
        letter-spacing: 1px;
        margin-bottom: 0.3rem;
        text-transform: uppercase;
    }

    .stat-value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #10b981;
    }

    .stat.bad .stat-value {
        color: #ef4444;
    }

    /* Game Field (Radar/Grid) */
    .stream-field {
        position: relative;
        width: 100%;
        height: 500px;
        background: rgba(0, 20, 10, 0.8);
        border: 2px solid #10b981;
        overflow: hidden;
        touch-action: none;
        cursor: crosshair;
        margin-bottom: 1rem;
        /* Simplified tactical corners (No Notches) */
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    .grid-background {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(16, 185, 129, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
    }

    .scan-line-sweep {
        position: absolute;
        width: 100%;
        height: 10px;
        background: rgba(16, 185, 129, 0.2);
        top: 0;
        left: 0;
        animation: scanSweep 3s linear infinite;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }

    @keyframes scanSweep {
        0% {
            top: -10%;
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            top: 110%;
            opacity: 0;
        }
    }

    /* Data Fragments */
    .data-fragment {
        position: absolute;
        width: 30px;
        height: 30px;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .fragment-core {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1rem;
        background: #000;
        border: 1px solid;
    }

    .data-fragment.good .fragment-core {
        color: #10b981;
        border-color: #10b981;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
    }

    .data-fragment.bad .fragment-core {
        color: #ef4444;
        border-color: #ef4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    }

    /* Catcher */
    .catcher {
        position: absolute;
        bottom: 20px;
        width: 20%;
        transform: translateX(-50%);
        transition: left 0.05s linear;
        pointer-events: none;
    }

    .catcher-body {
        position: relative;
        width: 100%;
        height: 15px;
        background: #10b981;
        border: 1px solid #10b981;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
    }

    .catcher-beam {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 80px;
        background: linear-gradient(
            to top,
            rgba(16, 185, 129, 0.2),
            transparent
        );
        border-left: 1px dashed rgba(16, 185, 129, 0.3);
        border-right: 1px dashed rgba(16, 185, 129, 0.3);
    }

    .catcher-indicator {
        display: none;
    }

    .hint {
        text-align: center;
        font-size: 0.8rem;
        color: #10b981;
        font-family: monospace;
        margin-top: 1rem;
        opacity: 0.7;
    }

    /* Intel Briefing */
    .intel-briefing {
        background: rgba(10, 20, 15, 0.95);
        border: 2px solid #10b981;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    .alert-tag {
        display: inline-block;
        background: #ef4444;
        color: #000;
        padding: 2px 8px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
    }

    .briefing-header h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: #fff;
        margin: 0;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(16, 185, 129, 0.3);
        padding-bottom: 0.5rem;
    }

    .briefing-content {
        margin: 1.5rem 0;
        line-height: 1.6;
        color: #10b981;
        font-size: 0.95rem;
    }

    .intel-text {
        margin-bottom: 1rem;
    }

    .highlight {
        color: #fff;
        font-weight: bold;
    }

    .warning-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px dashed #ef4444;
        padding: 1rem;
        text-align: center;
        color: #ef4444;
        font-weight: 700;
        font-family: "Orbitron", sans-serif;
        margin-top: 1.5rem;
        animation: blink 2s infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }

    .accept-btn {
        width: 100%;
        padding: 1.2rem;
        background: #10b981;
        color: #000;
        border: none;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 1px;
        text-transform: uppercase;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
    }

    .accept-btn:hover {
        background: #34d399;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
    }

    @media (max-width: 640px) {
        .stream-field {
            height: 400px;
        }
        .data-fragment {
            width: 25px;
            height: 25px;
        }
        .fragment-core {
            font-size: 0.8rem;
        }
    }
</style>

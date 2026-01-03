<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
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
        // Game starts only after briefing
        return () => {
            clearInterval(spawnTimer);
            clearInterval(updateTimer);
        };
    });

    function acceptBriefing() {
        goto("/game/iota-stream-6/burner");
    }

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

<svelte:head>
    <title>Iota Stream 6 // Secure Channel</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Audiowide&family=Chakra+Petch:wght@400;700&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="iota-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="iota-stream"
        title="🌊 Iota Stream"
    >
        <div class="stream-game">
            {#if briefingVisible}
                <div class="content-card" in:fade>
                    <!-- Decoration Bars -->
                    <div class="deco-bar top"></div>
                    <div class="deco-bar bottom"></div>

                    <div class="header-section">
                        <span class="status-badge"
                            >✅ SYSTEM ACCESS: GRANTED</span
                        >
                        <h1 class="glitch-title" data-text="THE MINCK">
                            THE MINCK
                        </h1>
                    </div>

                    <div class="briefing-panel">
                        <div class="panel-header">
                            SECURE CONNECTION ESTABLISHED
                        </div>
                        <div class="briefing-content">
                            <div class="agent-profile">
                                <div class="profile-frame">
                                    <img
                                        src="/heroes/the-minck.png"
                                        alt="The Minck"
                                        class="profile-image"
                                    />
                                    <div class="scan-overlay"></div>
                                </div>
                                <div class="agent-info">
                                    <div class="agent-name">THE MINCK</div>
                                    <div class="agent-role">
                                        PYRO-KINETIC SPECIALIST
                                    </div>
                                </div>
                            </div>

                            <div class="intel-block">
                                <span class="icon">💻</span>
                                <div class="text-content">
                                    <p>
                                        <strong>> SYSTEM ALERT:</strong><br />
                                        U heeft volledige toegang tot het lokale
                                        netwerk. Het is nu de beurt aan
                                        <span class="highlight-danger"
                                            >The Minck</span
                                        >.
                                    </p>
                                </div>
                            </div>

                            <div class="divider"></div>

                            <div class="intel-block">
                                <span class="icon alert">☢️</span>
                                <div class="text-content">
                                    <p>
                                        <strong>> CRITICAL INTEL:</strong><br />
                                        Een enorme buitenaardse
                                        <span class="highlight-warning"
                                            >wapenopslag</span
                                        > is hier verborgen. Ze staan op het punt
                                        de binnenstad aan te vallen.
                                    </p>
                                </div>
                            </div>

                            <div class="intel-block objective">
                                <div class="objective-header">
                                    >> MISSION OBJECTIVE
                                </div>
                                <p>
                                    De enige optie is om het arsenaal te <strong
                                        >verbranden</strong
                                    >.<br />
                                    Gebruik de 'Burner' utility om de aanval te stoppen.
                                </p>
                                <div class="warning-ticker">
                                    BURN SEQUENCE READY. // AWAITING INPUT.
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        class="action-button primary-action"
                        onclick={acceptBriefing}
                    >
                        <div class="btn-content">
                            <span class="icon">🔥</span>
                            <span class="text">INITIATE BURN SEQUENCE</span>
                        </div>
                        <div class="btn-glitch"></div>
                    </button>
                </div>
            {:else}
                <div class="game-ui" in:fade>
                    <div class="stats-panel">
                        <div class="stat-box good">
                            <span class="stat-label">DATA INTEGRITY</span>
                            <span class="stat-value"
                                >{goodCaught}/{TARGET_GOOD}</span
                            >
                            <div
                                class="stat-bar"
                                style:width="{(goodCaught / TARGET_GOOD) *
                                    100}%"
                            ></div>
                        </div>
                        <div class="stat-box bad">
                            <span class="stat-label">CORRUPTION</span>
                            <span class="stat-value">{badCaught}/{MAX_BAD}</span
                            >
                            <div
                                class="stat-bar alert"
                                style:width="{(badCaught / MAX_BAD) * 100}%"
                            ></div>
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
                        <!-- Grid & FX -->
                        <div class="grid-background"></div>
                        <div class="scan-line-sweep"></div>

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
                                <div class="fragment-trail"></div>
                            </div>
                        {/each}

                        <!-- Catcher -->
                        <div class="catcher" style:left="{catcherX}%">
                            <div class="catcher-beam"></div>
                            <div class="catcher-body">
                                <div class="catcher-engine left"></div>
                                <div class="catcher-engine right"></div>
                                <div class="catcher-glow"></div>
                            </div>
                        </div>
                    </div>

                    <div class="hint-strip">
                        <span class="hint-icon">👆</span> SWIPE TO CAPTURE DATA STREAMS
                    </div>
                </div>
            {/if}
        </div>
    </GameContainer>
</div>

<style>
    /* Global Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .iota-page {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: fixed;
        inset: 0;
        background: radial-gradient(
                circle at 50% 50%,
                rgba(59, 130, 246, 0.1) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.05) 1px,
                transparent 1px
            );
        background-size:
            100% 100%,
            30px 30px,
            30px 30px;
        z-index: -2;
        animation: bg-pulse 10s ease-in-out infinite;
    }

    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 0.8;
        }
    }

    .scanline-overlay {
        position: fixed;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
        opacity: 0.4;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 40%,
            #000 100%
        );
        z-index: 5;
        pointer-events: none;
    }

    .stream-game {
        width: 100%;
        max-width: 650px;
        margin: 0 auto;
        position: relative;
        z-index: 20;
    }

    /* Content Card (Briefing) */
    .content-card {
        background: rgba(5, 10, 20, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.4);
        padding: 3rem;
        position: relative;
        backdrop-filter: blur(12px);
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 30px),
            calc(100% - 30px) 100%,
            0 100%
        );
        margin-bottom: 2rem;
    }

    /* Deco Bars */
    .deco-bar {
        position: absolute;
        height: 4px;
        background: #3b82f6;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
        box-shadow: 0 0 10px #3b82f6;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
        background: #ef4444;
        width: 60px;
        box-shadow: 0 0 10px #ef4444;
    }

    /* Header */
    .header-section {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .status-badge {
        background: #10b981;
        color: #000;
        padding: 4px 12px;
        font-family: "Chakra Petch", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        letter-spacing: 2px;
        clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
        margin-bottom: 1rem;
        display: inline-block;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 3rem;
        color: #fff;
        margin: 0.5rem 0;
        text-transform: uppercase;
        position: relative;
        text-shadow: 3px 3px 0px rgba(59, 130, 246, 0.5);
    }

    .glitch-title::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #3b82f6;
        z-index: -1;
        animation: glitch-anim 3s infinite linear alternate-reverse;
        opacity: 0.7;
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(10% 0 80% 0);
            transform: translate(-2px, 2px);
        }
        20% {
            clip-path: inset(80% 0 10% 0);
            transform: translate(2px, -2px);
        }
        40% {
            clip-path: inset(40% 0 50% 0);
            transform: translate(-2px, 2px);
        }
        60% {
            clip-path: inset(20% 0 20% 0);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(-1px, 1px);
        }
        100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(1px, -1px);
        }
    }

    /* Briefing Panel */
    .briefing-panel {
        background: rgba(0, 20, 10, 0.3);
        border: 1px solid #10b981;
        margin-bottom: 2.5rem;
        position: relative;
        border-radius: 4px;
    }

    .panel-header {
        background: #3b82f6;
        color: #fff;
        font-family: "Share Tech Mono", monospace;
        font-weight: 700;
        font-size: 0.8rem;
        padding: 4px 10px;
        position: absolute;
        top: -12px;
        left: 10px;
        letter-spacing: 1px;
    }

    .briefing-content {
        padding: 2rem;
        font-family: "Rajdhani", sans-serif;
        color: #e2e8f0;
    }

    .intel-block {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        align-items: flex-start;
    }

    .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.4),
            transparent
        );
        margin: 1.5rem 0;
    }

    .icon {
        font-size: 1.5rem;
    }
    .icon.alert {
        animation: pulse-alert 1.5s infinite;
    }

    .highlight-danger {
        color: #ef4444;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    }
    .highlight-warning {
        color: #f59e0b;
        font-weight: bold;
    }

    .objective {
        background: rgba(239, 68, 68, 0.1);
        border-left: 3px solid #ef4444;
        padding: 1rem;
        margin-top: 1rem;
        flex-direction: column;
    }

    .objective-header {
        font-family: "Orbitron", sans-serif;
        color: #ef4444;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        letter-spacing: 1px;
    }

    .warning-ticker {
        font-family: "Share Tech Mono", monospace;
        color: #f59e0b;
        font-size: 0.8rem;
        margin-top: 1rem;
        text-align: center;
        letter-spacing: 2px;
        animation: blink 1s step-end infinite;
    }

    /* Action Button */
    .action-button {
        width: 100%;
        background: #ef4444;
        border: none;
        padding: 1.5rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            15px 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            0 100%,
            0 15px
        );
        transition: transform 0.2s;
    }

    .action-button:hover {
        transform: scale(1.02);
        background: #dc2626;
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
    }

    .btn-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-family: "Orbitron", sans-serif;
        color: #fff;
        font-weight: 900;
        font-size: 1.4rem;
        letter-spacing: 1px;
    }

    /* Game UI */
    .game-ui {
        width: 100%;
    }

    .stats-panel {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-box {
        flex: 1;
        background: rgba(10, 20, 30, 0.8);
        border: 1px solid rgba(59, 130, 246, 0.3);
        padding: 0.8rem;
        position: relative;
        overflow: hidden;
    }

    .stat-label {
        font-size: 0.7rem;
        color: #94a3b8;
        display: block;
        letter-spacing: 1px;
        margin-bottom: 0.2rem;
    }

    .stat-value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
    }

    .stat-bar {
        height: 3px;
        background: #10b981;
        margin-top: 0.5rem;
        box-shadow: 0 0 10px #10b981;
        transition: width 0.3s;
    }

    .stat-bar.alert {
        background: #ef4444;
        box-shadow: 0 0 10px #ef4444;
    }

    /* Stream Field */
    .stream-field {
        position: relative;
        width: 100%;
        height: 500px;
        background: rgba(5, 10, 20, 0.9);
        border: 2px solid #3b82f6;
        overflow: hidden;
        touch-action: none;
        cursor: crosshair;
        margin-bottom: 1rem;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
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
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
    }

    .scan-line-sweep {
        position: absolute;
        width: 100%;
        height: 4px;
        background: rgba(59, 130, 246, 0.5);
        top: 0;
        left: 0;
        animation: scanSweep 3s linear infinite;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
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

    /* Game Elements */
    .data-fragment {
        position: absolute;
        width: 30px;
        height: 30px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10;
    }

    .fragment-core {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Share Tech Mono", monospace;
        font-weight: 700;
        font-size: 1.2rem;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid;
    }

    .data-fragment.good .fragment-core {
        color: #10b981;
        border-color: #10b981;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        text-shadow: 0 0 5px #10b981;
    }

    .data-fragment.bad .fragment-core {
        color: #ef4444;
        border-color: #ef4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        text-shadow: 0 0 5px #ef4444;
    }

    .catcher-body {
        position: relative;
        width: 100%;
        height: 20px;
        background: #3b82f6;
        border: 1px solid #60a5fa;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
    }

    .catcher-beam {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 100px;
        background: linear-gradient(
            to top,
            rgba(59, 130, 246, 0.3),
            transparent
        );
        border-left: 1px dashed rgba(59, 130, 246, 0.4);
        border-right: 1px dashed rgba(59, 130, 246, 0.4);
    }

    .catcher {
        position: absolute;
        bottom: 30px;
        width: 20%;
        transform: translateX(-50%);
        transition: left 0.05s linear;
        pointer-events: none;
        z-index: 20;
    }

    /* Agent Profile */
    .agent-profile {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px dashed rgba(59, 130, 246, 0.4);
    }

    .profile-frame {
        width: 100px;
        height: 100px;
        border: 2px solid #3b82f6;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    }

    .profile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .scan-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(59, 130, 246, 0.3),
            transparent
        );
        animation: scan-profile 2s infinite linear;
    }

    @keyframes scan-profile {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(100%);
        }
    }

    .agent-info {
        font-family: "Orbitron", sans-serif;
    }

    .agent-name {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
    }

    .agent-role {
        font-size: 0.8rem;
        color: #60a5fa;
        letter-spacing: 1px;
    }

    .hint-strip {
        text-align: center;
        font-family: "Orbitron", sans-serif;
        color: #64748b;
        font-size: 0.8rem;
        margin-top: 1rem;
        letter-spacing: 2px;
        animation: pulse 2s infinite;
    }

    @media (max-width: 600px) {
        .content-card {
            padding: 1.5rem;
        }
        .glitch-title {
            font-size: 2.5rem;
        }
        .stream-field {
            height: 400px;
        }
    }
</style>

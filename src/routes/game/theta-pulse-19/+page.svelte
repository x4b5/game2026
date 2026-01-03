<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    let missionStarted = $state(false);
    let chargingStatus = $state(0);

    onMount(() => {
        visible = true;
        const interval = setInterval(() => {
            if (chargingStatus < 100) chargingStatus += 1;
            else clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    });

    function startFinalAssault() {
        missionStarted = true;
        setTimeout(() => {
            goto("/game/theta-pulse-19/airborne-concerto");
        }, 2000);
    }
</script>

<svelte:head>
    <title>Theta Pulse // SONIC STORM</title>
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

<div class="mission-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <div class="content-wrapper">
        <header in:fly={{ y: -50, duration: 800 }}>
            <div class="mission-tag">
                <span class="blinking-dot"></span>
                OPERATIE: SONISCHE STORM
            </div>
            <h1 class="glitch-title" data-text="THETA PULSE 19">
                THETA PULSE 19
            </h1>
        </header>

        <main>
            <div
                class="hero-briefing glass-panel"
                in:fly={{ x: -30, delay: 200 }}
            >
                <div class="decoration-line top-left"></div>
                <div class="decoration-line bottom-right"></div>

                <div class="hero-section">
                    <div class="hero-avatar">
                        <img
                            src="/heroes/stella-2.png"
                            alt="Stella"
                            class="hero-img"
                        />
                        <div class="halo-ring"></div>
                        <div class="scan-overlay"></div>
                    </div>
                </div>

                <div class="briefing-text">
                    <h2 class="agent-name">AGENT: STELLA</h2>
                    <p class="flavor-text">
                        "De enige manier om ze te stoppen is met <strong
                            >pure harmonie</strong
                        >."
                    </p>
                    <p class="mission-desc">
                        Stella, jouw vermogen om te vliegen gecombineerd met je
                        muzikale talent is de sleutel. De aliens zijn gevoelig
                        voor sonische frequenties.
                    </p>

                    <div class="intel-box">
                        <div class="icon-box">🎻</div>
                        <div class="text">
                            <strong>MICROFOON VERSTERKING:</strong><br />
                            De viool van André Rieu is gekoppeld. Output:
                            <span class="highlight">500%</span>.
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mission-objective cyber-box"
                in:fly={{ x: 30, delay: 400 }}
            >
                <div class="corner-accents">
                    <span class="c-tl"></span><span class="c-tr"></span><span
                        class="c-bl"
                    ></span><span class="c-br"></span>
                </div>

                <div class="vrijthof-map">
                    <div class="grid-overlay"></div>
                    <div class="scanner-line"></div>
                    <div class="target-dots">
                        <div class="dot" style="top: 20%; left: 30%"></div>
                        <div class="dot" style="top: 50%; left: 70%"></div>
                        <div class="dot" style="top: 80%; left: 40%"></div>
                    </div>
                    <div class="map-label">VRIJTHOF SECTOR</div>
                </div>

                <div class="objective-text">
                    <h3>DOELWIT: VRIJTHOF</h3>
                    <p>
                        Vlieg over het plein. Slinger de vioolklanken in elke
                        hoek. Schakel de schepen boven de <strong
                            >Sint Servaasbasiliek</strong
                        > uit.
                    </p>
                </div>
            </div>
        </main>

        <footer in:fly={{ y: 50, delay: 600 }}>
            <div class="system-ready">
                <div class="charge-bar-container">
                    <div class="charge-bar">
                        <div
                            class="fill"
                            style="width: {chargingStatus}%"
                        ></div>
                    </div>
                    <div
                        class="charge-glitch"
                        style="left: {chargingStatus}%"
                    ></div>
                </div>
                <span class="status-msg">
                    SYSTEEM STATUS:
                    <span class:ready={chargingStatus === 100}>
                        {chargingStatus === 100
                            ? "GEREED VOOR LANCERING"
                            : `LADEN... ${chargingStatus}%`}
                    </span>
                </span>
            </div>

            <button
                class="start-btn"
                class:ready={chargingStatus === 100}
                disabled={chargingStatus < 100 || missionStarted}
                onclick={startFinalAssault}
            >
                <div class="btn-content">
                    {#if missionStarted}
                        INITIALISEREN...
                    {:else}
                        STIJG OP & SPEEL <span class="icon">🚀🎻</span>
                    {/if}
                </div>
                {#if chargingStatus === 100 && !missionStarted}
                    <div class="btn-glitch-effect"></div>
                {/if}
            </button>
        </footer>
    </div>
</div>

{#if missionStarted}
    <div class="transition-overlay" out:fade={{ duration: 500 }}>
        <div class="concerto-preview" in:scale>
            <span class="violin-symbol">🎻</span>
            <div class="sonic-waves">
                <span></span><span></span><span></span><span></span><span
                ></span>
            </div>
            <div class="loading-text">LANCERING...</div>
        </div>
    </div>
{/if}

<style>
    /* Global Font & Body Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .mission-page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 10%,
                rgba(59, 130, 246, 0.15) 0%,
                transparent 60%
            ),
            linear-gradient(rgba(15, 23, 42, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.9) 1px, transparent 1px);
        background-size:
            100% 100%,
            50px 50px,
            50px 50px;
        z-index: -2;
        animation: bg-pulse 10s ease-in-out infinite;
    }

    .scanline-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.2) 2px,
            rgba(0, 0, 0, 0.2) 4px
        );
        pointer-events: none;
        z-index: 10;
        opacity: 0.15;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 30%,
            #020617 90%
        );
        pointer-events: none;
    }

    .content-wrapper {
        max-width: 900px;
        width: 100%;
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        z-index: 20;
    }

    header {
        text-align: center;
        margin-bottom: 1rem;
    }

    .mission-tag {
        font-family: "Share Tech Mono", monospace;
        color: #3b82f6;
        font-size: 0.9rem;
        letter-spacing: 2px;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .blinking-dot {
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        animation: blink 1s infinite;
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 3.5rem;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
        position: relative;
        text-shadow: 2px 2px 0px rgba(59, 130, 246, 0.5);
    }

    /* Main Grid Layout */
    main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: stretch;
    }

    /* Hero Briefing Card */
    .hero-briefing {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(59, 130, 246, 0.3);
        padding: 2rem;
        position: relative;
        display: flex;
        gap: 1.5rem;
        flex-direction: column;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%
        );
    }

    .decoration-line {
        position: absolute;
        width: 40px;
        height: 3px;
        background: #3b82f6;
    }
    .decoration-line.top-left {
        top: 0;
        left: 0;
    }
    .decoration-line.bottom-right {
        bottom: 0;
        right: 0;
        width: 20px;
    }

    .hero-section {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .hero-avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.2),
            transparent
        );
    }

    .hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        position: relative;
        z-index: 2;
        border: 2px solid rgba(59, 130, 246, 0.5);
    }

    .halo-ring {
        position: absolute;
        inset: -10px;
        border: 2px dashed rgba(59, 130, 246, 0.4);
        border-radius: 50%;
        animation: spin 10s linear infinite;
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
        height: 20%;
        animation: scan-vertical 2s linear infinite;
        border-radius: 50%;
        pointer-events: none;
        z-index: 3;
    }

    .briefing-text {
        text-align: left;
    }

    .agent-name {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);
        padding-bottom: 0.5rem;
    }

    .flavor-text {
        font-style: italic;
        color: #94a3b8;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .mission-desc {
        color: #cbd5e1;
        line-height: 1.5;
        font-size: 1rem;
    }

    .intel-box {
        margin-top: 1.5rem;
        background: rgba(59, 130, 246, 0.05);
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 0.8rem;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .icon-box {
        font-size: 1.5rem;
        background: rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .highlight {
        color: #facc15;
        font-weight: bold;
    }

    /* Mission Objective Card */
    .mission-objective {
        background: rgba(10, 10, 10, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .corner-accents span {
        position: absolute;
        width: 8px;
        height: 8px;
        border: 2px solid #ef4444;
    }
    .c-tl {
        top: -1px;
        left: -1px;
        border-right: 0;
        border-bottom: 0;
    }
    .c-tr {
        top: -1px;
        right: -1px;
        border-left: 0;
        border-bottom: 0;
    }
    .c-bl {
        bottom: -1px;
        left: -1px;
        border-right: 0;
        border-top: 0;
    }
    .c-br {
        bottom: -1px;
        right: -1px;
        border-left: 0;
        border-top: 0;
    }

    .vrijthof-map {
        height: 250px;
        background: #0f172a;
        background-image: linear-gradient(
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(59, 130, 246, 0.2);
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }

    .map-label {
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.7rem;
        color: rgba(59, 130, 246, 0.7);
        background: rgba(0, 0, 0, 0.7);
        padding: 2px 5px;
    }

    .scanner-line {
        position: absolute;
        width: 100%;
        height: 2px;
        background: rgba(239, 68, 68, 0.8);
        box-shadow: 0 0 10px #ef4444;
        top: 0;
        animation: scan-full 4s linear infinite;
    }

    .target-dots .dot {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        box-shadow: 0 0 10px #ef4444;
        animation: pulse-dot 1s infinite alternate;
    }
    .target-dots .dot::after {
        content: "";
        position: absolute;
        inset: -4px;
        border: 1px solid rgba(239, 68, 68, 0.5);
        border-radius: 50%;
        animation: expand 1s infinite;
    }

    .objective-text h3 {
        font-family: "Orbitron", sans-serif;
        color: #ef4444;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .objective-text p {
        color: #cbd5e1;
        font-size: 1rem;
        line-height: 1.6;
    }

    /* Footer & Controls */
    footer {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }

    .system-ready {
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .charge-bar-container {
        position: relative;
        width: 100%;
        height: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .charge-bar .fill {
        height: 100%;
        background: #3b82f6;
        box-shadow: 0 0 15px #3b82f6;
    }

    .status-msg {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        color: #64748b;
        display: flex;
        justify-content: space-between;
    }

    .status-msg .ready {
        color: #3b82f6;
        text-shadow: 0 0 5px #3b82f6;
        animation: blink 0.5s infinite alternate;
    }

    .start-btn {
        width: 100%;
        max-width: 400px;
        padding: 1.2rem;
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #64748b;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        cursor: not-allowed;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        clip-path: polygon(
            15px 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            0 100%,
            0 15px
        );
    }

    .start-btn.ready {
        background: #3b82f6;
        color: white;
        border-color: #60a5fa;
        cursor: pointer;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
    }

    .start-btn.ready:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.4);
    }

    .btn-glitch-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            transparent 5%,
            rgba(255, 255, 255, 0.2) 5%,
            transparent 6%
        );
        animation: glitch-anim 3s infinite linear;
        pointer-events: none;
    }

    /* Transition Overlay */
    .transition-overlay {
        position: fixed;
        inset: 0;
        background: #000;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .concerto-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .violin-symbol {
        font-size: 6rem;
        animation: pulse 1s infinite alternate;
    }

    .sonic-waves {
        display: flex;
        gap: 8px;
        align-items: center;
        height: 60px;
    }

    .sonic-waves span {
        width: 8px;
        background: #3b82f6;
        border-radius: 4px;
        animation: wave 1s infinite ease-in-out;
    }
    .sonic-waves span:nth-child(1) {
        height: 20px;
        animation-delay: 0s;
    }
    .sonic-waves span:nth-child(2) {
        height: 40px;
        animation-delay: 0.1s;
    }
    .sonic-waves span:nth-child(3) {
        height: 60px;
        animation-delay: 0.2s;
    }
    .sonic-waves span:nth-child(4) {
        height: 40px;
        animation-delay: 0.3s;
    }
    .sonic-waves span:nth-child(5) {
        height: 20px;
        animation-delay: 0.4s;
    }

    .loading-text {
        font-family: "Orbitron", sans-serif;
        color: #3b82f6;
        font-size: 1.5rem;
        letter-spacing: 4px;
    }

    /* Animations */
    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
    }
    @keyframes blink {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes scan-full {
        0% {
            top: -10%;
        }
        100% {
            top: 110%;
        }
    }
    @keyframes scan-vertical {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(100%);
        }
    }
    @keyframes pulse-dot {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0.4;
            transform: scale(1.5);
        }
    }
    @keyframes expand {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    @keyframes glitch-anim {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
    @keyframes wave {
        0%,
        100% {
            transform: scaleY(1);
        }
        50% {
            transform: scaleY(1.5);
        }
    }
    @keyframes pulse {
        from {
            transform: scale(1);
            filter: drop-shadow(0 0 10px #3b82f6);
        }
        to {
            transform: scale(1.1);
            filter: drop-shadow(0 0 30px #3b82f6);
        }
    }

    @media (max-width: 768px) {
        main {
            grid-template-columns: 1fr;
        }
        .glitch-title {
            font-size: 2rem;
        }
        .hero-briefing {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .briefing-text {
            text-align: center;
        }
        .agent-name {
            justify-content: center;
        }
    }
</style>

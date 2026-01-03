<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);
    let intelRevealed = $state(false);

    onMount(() => {
        visible = true;
        setTimeout(() => (intelRevealed = true), 2500);
    });

    async function handleNextMission() {
        const nextPath = "/game/sint-pieter/scan";
        try {
            await fetch("/api/mission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ navTo: nextPath }),
            });
        } catch (e) {
            console.error(e);
        }
        goto(nextPath);
    }
</script>

<svelte:head>
    <title>Mission Complete // VIOLIN SECURED</title>
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

<div class="victory-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <div class="content-card glass-panel" in:fade={{ duration: 1000 }}>
        <!-- Decoration Bars -->
        <div class="deco-bar top"></div>
        <div class="deco-bar bottom"></div>

        <div class="header-section">
            <span class="status-badge">✅ MISSIE SUCCESVOL</span>
            <h1 class="glitch-title" data-text="VIOOL GERED">VIOOL GERED</h1>
        </div>

        <div class="intel-grid">
            <div class="intel-block" in:fly={{ x: -20, delay: 500 }}>
                <span class="label">ARTEFACT</span>
                <span class="value highlight">ANDRÉ'S VIOOL</span>
            </div>
            <div class="intel-block" in:fly={{ x: 20, delay: 700 }}>
                <span class="label">STATUS</span>
                <span class="value success">VEILIGGESTELD</span>
            </div>
        </div>

        <div class="visual-container">
            <div class="violin-glow">🎻</div>
            <div class="energy-rings">
                <div class="ring"></div>
                <div class="ring"></div>
            </div>
        </div>

        <div class="report-container">
            {#if intelRevealed}
                <div class="report-content" in:fade>
                    <p class="typewriter-text">
                        <strong class="highlight-info"
                            >>> SITUATIE RAPPORT:</strong
                        ><br />
                        Het artefact is succesvol beveiligd. De sonische resonantie
                        van de viool is intact.
                        <br /><br />
                        <span class="highlight-danger">WAARSCHUWING:</span>
                        Sensoren detecteren nu een massale energievloed in
                        sector <strong class="highlight-warn">VRIJTHOF</strong>.
                    </p>
                    <div class="warning-box">
                        <span class="icon">⚠️</span>
                        <div class="warning-text">
                            <strong>NIEUWE OPDRACHT:</strong> Aliens
                            hergroeperen voor een laatste aanval. Gebruik de
                            kracht van de viool om ze te stoppen bij de
                            <strong>FINALE</strong>.
                        </div>
                    </div>

                    <button class="next-btn" onclick={handleNextMission}>
                        <div class="btn-content">
                            <span class="icon">🚀</span>
                            NAAR HET VRIJTHOF
                        </div>
                        <div class="btn-glitch"></div>
                    </button>
                </div>
            {:else}
                <div class="scanning-loader">
                    <div class="scan-visual">
                        <div class="scan-line"></div>
                        <div class="scan-grid"></div>
                    </div>
                    <div class="loading-text">RESONANTIE ANALYSE LOPEN...</div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Global Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .victory-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 100%,
                rgba(251, 191, 36, 0.15) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(20, 20, 20, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 20, 20, 0.8) 1px, transparent 1px);
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -2;
        animation: bg-pulse 8s ease-in-out infinite;
    }

    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.8;
        }
        50% {
            opacity: 1;
        }
    }

    .scanline-overlay {
        position: absolute;
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
        opacity: 0.3;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 40%,
            #000 100%
        );
        z-index: 5;
        pointer-events: none;
    }

    .content-card {
        max-width: 650px;
        width: 100%;
        padding: 3rem;
        background: rgba(15, 10, 5, 0.95);
        border: 1px solid rgba(251, 191, 36, 0.3);
        box-shadow: 0 0 50px rgba(251, 191, 36, 0.15);
        display: flex;
        flex-direction: column;
        gap: 2rem;
        position: relative;
        z-index: 20;
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 30px),
            calc(100% - 30px) 100%,
            0 100%
        );
    }

    .deco-bar {
        position: absolute;
        height: 4px;
        background: #fbbf24;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
        box-shadow: 0 0 10px #fbbf24;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
        background: #ef4444;
        width: 60px;
        box-shadow: 0 0 10px #ef4444;
    }

    .header-section {
        text-align: center;
    }

    .status-badge {
        display: inline-block;
        background: rgba(34, 197, 94, 0.1);
        color: #4ade80;
        padding: 0.4rem 1.2rem;
        border: 1px solid rgba(34, 197, 94, 0.3);
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        letter-spacing: 2px;
        margin-bottom: 1rem;
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.1);
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.5rem;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
        position: relative;
        text-shadow: 2px 2px 0px rgba(251, 191, 36, 0.5);
    }

    .intel-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .intel-block {
        background: rgba(40, 30, 10, 0.4);
        padding: 1rem;
        border-left: 2px solid #fbbf24;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .intel-block .label {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.7rem;
        color: #94a3b8;
        margin-bottom: 0.3rem;
        text-transform: uppercase;
    }

    .intel-block .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .value.success {
        color: #4ade80;
        text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
    }
    .value.highlight {
        color: #fbbf24;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
    }

    .visual-container {
        position: relative;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
    }

    .violin-glow {
        font-size: 4rem;
        filter: drop-shadow(0 0 20px #fbbf24);
        z-index: 2;
        animation: float 3s ease-in-out infinite;
    }

    .energy-rings {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid #fbbf24;
        border-radius: 50%;
        opacity: 0;
        animation: ripple 3s linear infinite;
    }
    .ring:nth-child(2) {
        animation-delay: 1.5s;
    }

    .report-container {
        min-height: 180px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
    }

    .report-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .typewriter-text {
        color: #cbd5e1;
        font-family: "Share Tech Mono", monospace;
        line-height: 1.6;
        margin: 0;
        border-left: 2px solid #fbbf24;
        padding-left: 1rem;
    }

    .highlight-info {
        color: #fbbf24;
    }
    .highlight-danger {
        color: #ef4444;
        font-weight: bold;
    }
    .highlight-warn {
        color: #f97316;
    }

    .warning-box {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 1rem;
        color: #fca5a5;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
    }

    .scanning-loader {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background: rgba(0, 0, 0, 0.5);
    }

    .loading-text {
        font-family: "Share Tech Mono", monospace;
        color: #fbbf24;
        letter-spacing: 2px;
        animation: blink 1s infinite;
    }

    .scan-visual {
        width: 100%;
        height: 60px;
        position: relative;
        overflow: hidden;
        background: rgba(251, 191, 36, 0.1);
    }

    .scan-line {
        position: absolute;
        width: 20px;
        height: 100%;
        background: #fbbf24;
        box-shadow: 0 0 20px #fbbf24;
        animation: horizontal-scan 2s ease-in-out infinite alternate;
        opacity: 0.5;
    }

    .next-btn {
        width: 100%;
        background: #fbbf24;
        border: none;
        padding: 1.2rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-top: 1rem;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
    }

    .btn-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.8rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        color: #000;
        position: relative;
        z-index: 2;
    }

    .next-btn:hover {
        background: #f59e0b;
        transform: scale(1.02);
    }

    .btn-glitch {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            transparent 5%,
            rgba(255, 255, 255, 0.4) 5%,
            rgba(255, 255, 255, 0.4) 10%,
            transparent 10%
        );
        animation: glitch-anim 2s infinite linear;
        pointer-events: none;
    }

    @keyframes horizontal-scan {
        from {
            left: 0;
        }
        to {
            left: 100%;
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }

    @media (max-width: 600px) {
        .content-card {
            padding: 1.5rem;
        }
        .glitch-title {
            font-size: 2rem;
        }
        .intel-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

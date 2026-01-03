<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";

    let gameContainer: any;
    let adminPassword = $state("");

    async function acceptBriefing() {
        // Proceed to next stage (Kazematten Scan)
        await fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: "/game/rho-system-88/scan" }),
        });
        goto("/game/rho-system-88/scan");
    }

    function handleAdminBypass() {
        if (adminPassword.toLowerCase() === "xavier") {
            // ADMIN OVERRIDE: Skip scan, go to finale
            goto("/game/rho-system-88/finale");
        }
    }
</script>

<svelte:head>
    <title>Rho System 88 // Briefing</title>
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

<div class="rho-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="rho-system"
        title="📡 Rho System 88"
    >
        <div class="stream-game">
            <div class="content-card" in:fade>
                <!-- Decoration Bars -->
                <div class="deco-bar top"></div>
                <div class="deco-bar bottom"></div>

                <div class="header-section">
                    <span class="status-badge">⚠️ PRIORITY ALPHA</span>
                    <h1 class="glitch-title" data-text="MISSION UPDATE">
                        MISSION UPDATE
                    </h1>
                </div>

                <div class="briefing-panel">
                    <div class="panel-header">
                        ENCRYPTED TRANSMISSION // INCOMING
                    </div>
                    <div class="briefing-content">
                        <div class="intel-block previous">
                            <span class="icon">✅</span>
                            <p>
                                <strong>PREVIOUS MISSION:</strong><br />
                                <span class="highlight-success">SUCCESS</span>.
                                Energy field neutralized. Kappa Grid offline.
                            </p>
                        </div>

                        <div class="divider"></div>

                        <div class="intel-block current">
                            <span class="icon alert">🚨</span>
                            <div class="text-content">
                                <p>
                                    <strong>> NEW INTEL:</strong><br />
                                    Sensoren detecteren activiteit in Sector
                                    <span class="highlight-danger"
                                        >**KAZEMATTEN**</span
                                    >. Kazematten vertoont ongebruikelijke
                                    energie-pieken.
                                </p>
                            </div>
                        </div>

                        <div class="intel-block objective">
                            <div class="objective-header">
                                >> CURRENT OBJECTIVE
                            </div>
                            <p>
                                Verplaats onmiddellijk naar de Kazematten.<br />
                                Zoek de
                                <span class="highlight-info"
                                    >koudste plek van de laagste ruimte</span
                                >.<br />
                                Observeer en rapporteer.
                            </p>
                            <div class="warning-ticker">
                                MOVE OUT. STAY FROSTY. // MOVE OUT. STAY FROSTY.
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    class="action-button primary-action"
                    onclick={acceptBriefing}
                >
                    <div class="btn-content">
                        <span class="icon">🎯</span>
                        <span class="text">PROCEED TO TARGET</span>
                    </div>
                    <div class="btn-glitch"></div>
                </button>

                <div class="admin-container">
                    <div class="admin-lock">🔒 ADMIN_OVERRIDE</div>
                    <input
                        type="password"
                        class="admin-input"
                        bind:value={adminPassword}
                        placeholder="ENTER CODE..."
                        onkeydown={(e) =>
                            e.key === "Enter" && handleAdminBypass()}
                    />
                </div>
            </div>
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

    .rho-page {
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
                rgba(16, 185, 129, 0.1) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.05) 1px,
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

    /* Main Card */
    .content-card {
        background: rgba(5, 10, 20, 0.9);
        border: 1px solid rgba(16, 185, 129, 0.4);
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
        overflow: hidden;
    }

    /* Deco Bars */
    .deco-bar {
        position: absolute;
        height: 4px;
        background: #10b981;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
        box-shadow: 0 0 10px #10b981;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
        background: #3b82f6;
        width: 60px;
        box-shadow: 0 0 10px #3b82f6;
    }

    /* Header */
    .header-section {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .status-badge {
        background: #ef4444;
        color: #000;
        padding: 4px 12px;
        font-family: "Chakra Petch", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        letter-spacing: 2px;
        clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
        margin-bottom: 1rem;
        display: inline-block;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 3.5rem;
        color: #fff;
        margin: 0.5rem 0;
        text-transform: uppercase;
        position: relative;
        text-shadow: 3px 3px 0px rgba(16, 185, 129, 0.5);
    }

    .glitch-title::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #10b981;
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
        background: #10b981;
        color: #000;
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

    .intel-block.previous {
        opacity: 0.7;
        font-size: 0.9rem;
    }

    .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(16, 185, 129, 0.4),
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

    @keyframes pulse-alert {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1);
        }
    }

    .highlight-success {
        color: #10b981;
        font-weight: bold;
    }
    .highlight-danger {
        color: #ef4444;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    }
    .highlight-info {
        color: #60a5fa;
        font-weight: bold;
    }

    .objective {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        padding: 1rem;
        margin-top: 1rem;
        flex-direction: column;
    }

    .objective-header {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        letter-spacing: 1px;
    }

    .warning-ticker {
        font-family: "Share Tech Mono", monospace;
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 1rem;
        text-align: center;
        letter-spacing: 2px;
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

    /* Action Button */
    .action-button {
        width: 100%;
        background: #10b981;
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
        margin-bottom: 2rem;
    }

    .action-button:hover {
        transform: scale(1.02);
        background: #059669;
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
    }

    .btn-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-family: "Orbitron", sans-serif;
        color: #000;
        font-weight: 900;
        font-size: 1.4rem;
        letter-spacing: 1px;
    }

    .action-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
        );
        transition: 0.5s;
    }

    .action-button:hover::before {
        left: 100%;
    }

    /* Admin Section */
    .admin-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.3;
        transition: opacity 0.3s;
    }

    .admin-container:hover {
        opacity: 1;
    }

    .admin-lock {
        font-family: "Share Tech Mono", monospace;
        color: #64748b;
        font-size: 0.8rem;
    }

    .admin-input {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #334155;
        color: #94a3b8;
        padding: 0.5rem;
        font-family: "Share Tech Mono", monospace;
        text-align: center;
        width: 150px;
        border-radius: 4px;
        transition: all 0.3s;
    }

    .admin-input:focus {
        border-color: #ef4444;
        color: #ef4444;
        outline: none;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
    }

    /* Mobile */
    @media (max-width: 600px) {
        .content-card {
            padding: 1.5rem;
        }
        .glitch-title {
            font-size: 2.5rem;
        }
    }
</style>

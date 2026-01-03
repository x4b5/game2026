<script lang="ts">
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";

    let showExtraInfo = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location
    const VALID_CODES = ["noorderbrug"];

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";
        } else {
            errorMessage = "Onjuiste code. Zoek goed rond op de locatie!";
            showSuccess = false;
        }
    }
</script>

<svelte:head>
    <title>Rho System 88 // Scan</title>
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

<div class="scan-page" in:fade={{ duration: 800 }}>
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <div class="content-card">
        <!-- Decoration Bars -->
        <div class="deco-bar top"></div>
        <div class="deco-bar bottom"></div>

        <div class="header-section">
            <h1>RHO SYSTEM 88 // SECURITY LAYER</h1>
            <h2 class="mission-title" data-text="LOCATIE VERIFICATIE">
                LOCATIE VERIFICATIE
            </h2>
        </div>

        {#if showSuccess}
            <div class="success-message" transition:slide>
                <div class="success-icon-wrapper">
                    <span class="success-icon">🔓</span>
                </div>
                <h3>TOEGANG VERLEEND</h3>
                <p>Locatie bevestigd. Systemen online...</p>

                <button
                    class="action-button success-btn"
                    onclick={() => {
                        const currentPath = window.location.pathname.replace(
                            /\/$/,
                            "",
                        );
                        const idx = MISSION_ORDER.indexOf(currentPath);
                        if (idx !== -1 && idx < MISSION_ORDER.length - 1) {
                            const nextPath = MISSION_ORDER[idx + 1];
                            fetch("/api/mission", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ navTo: nextPath }),
                            }).catch(console.error);
                            goto(nextPath);
                        } else {
                            goto("/game/iota-stream-6");
                        }
                    }}
                >
                    START DE SCAN
                </button>
            </div>
        {:else}
            <div class="briefing-panel">
                <div class="panel-header">LOCATION DATA // ENCRYPTED</div>
                <div class="briefing-text">
                    <p>
                        <strong>TARGET LOCATIE:</strong>
                        <span class="highlight-danger">KAZEMATTEN</span>
                    </p>
                    <p>
                        U bevindt zich in de gevarenzone. Voer de locatiecode in
                        om het systeem te ontgrendelen en de scan te starten.
                    </p>
                    <div class="clue-box">
                        <span class="clue-label">>> HINT DECRYPTED:</span>
                        <span class="clue-content"
                            >Koudste plek van de laagste ruimte.</span
                        >
                    </div>
                </div>
            </div>

            <button
                class="info-toggle-btn"
                onclick={() => (showExtraInfo = !showExtraInfo)}
                class:active={showExtraInfo}
            >
                <span class="icon">ℹ️</span>
                <span class="btn-text">TACTICAL ANALYSIS</span>
                <span class="arrow">{showExtraInfo ? "▲" : "▼"}</span>
            </button>

            {#if showExtraInfo}
                <div class="extra-info-panel" transition:slide>
                    <p>
                        <span class="highlight-info">SCANNING PROTOCOL:</span> Zoek
                        naar aanwijzingen in de ruimte. De code is fysiek aanwezig
                        op de locatie.
                    </p>
                </div>
            {/if}

            <div class="mission-status-grid">
                <div class="status-cell">
                    <span class="label">SYSTEEM STATUS</span>
                    <span class="value high">LOCKED</span>
                </div>
                <div class="status-cell">
                    <span class="label">DREIGINGS NIVEAU</span>
                    <span class="value high">ACTIVE</span>
                </div>
            </div>

            <div class="code-entry">
                <label for="location-code">Authenticatie Code</label>
                <div class="input-wrapper">
                    <input
                        id="location-code"
                        type="text"
                        bind:value={locationCode}
                        placeholder="ENTER ACCESS CODE"
                        onkeydown={(e) =>
                            e.key === "Enter" && handleCodeSubmit()}
                        autocomplete="off"
                        autocapitalize="none"
                    />
                    <div class="input-border"></div>
                </div>

                {#if errorMessage}
                    <div class="error-box" transition:slide>
                        <span class="error-icon">⚠️</span>
                        {errorMessage}
                    </div>
                {/if}

                <button
                    class="action-button primary-action"
                    onclick={handleCodeSubmit}
                >
                    <div class="btn-content">
                        <span class="icon">🔓</span>
                        <span class="text">INITIATE UNLOCK</span>
                    </div>
                    <div class="btn-glitch"></div>
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Global Overrides */
    :global(body) {
        background-color: #030712;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .scan-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 50%,
                rgba(16, 185, 129, 0.1) 0%,
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
            40px 40px,
            40px 40px;
        z-index: -2;
        animation: bg-pulse 10s ease-in-out infinite;
    }

    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.6;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.02);
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

    /* Main Card */
    .content-card {
        position: relative;
        width: 100%;
        max-width: 650px;
        background: rgba(10, 15, 30, 0.85);
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 3rem;
        z-index: 20;
        backdrop-filter: blur(12px);
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 40px),
            calc(100% - 40px) 100%,
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

    /* Titles */
    h1 {
        font-family: "Share Tech Mono", monospace;
        color: #60a5fa;
        font-size: 0.9rem;
        letter-spacing: 4px;
        text-align: center;
        margin-bottom: 0.5rem;
        opacity: 0.8;
    }

    .mission-title {
        font-family: "Audiowide", cursive;
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 2.5rem 0;
        color: #fff;
        text-transform: uppercase;
        position: relative;
        text-shadow: 2px 2px 0px #10b981;
    }

    .mission-title::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #10b981;
        z-index: -1;
        animation: glitch-anim 2.5s infinite linear alternate-reverse;
        opacity: 0.7;
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(20% 0 80% 0);
            transform: translate(-2px, 1px);
        }
        20% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(2px, -1px);
        }
        40% {
            clip-path: inset(40% 0 50% 0);
            transform: translate(-2px, 2px);
        }
        60% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(-1px, 1px);
        }
        100% {
            clip-path: inset(30% 0 10% 0);
            transform: translate(1px, -1px);
        }
    }

    /* Briefing Panel */
    .briefing-panel {
        background: rgba(0, 20, 10, 0.4);
        border: 1px solid #10b981;
        margin-bottom: 2rem;
        position: relative;
    }

    .panel-header {
        background: #10b981;
        color: #000;
        font-family: "Chakra Petch", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        padding: 4px 10px;
        display: inline-block;
        position: absolute;
        top: -10px;
        left: 10px;
    }

    .briefing-text {
        font-family: "Share Tech Mono", monospace;
        color: #34d399;
        padding: 2rem 1.5rem 1.5rem 1.5rem;
        line-height: 1.6;
        font-size: 1.1rem;
        text-shadow: 0 0 5px rgba(52, 211, 153, 0.4);
        text-align: center;
    }

    .clue-box {
        margin-top: 1.5rem;
        background: rgba(16, 185, 129, 0.1);
        border: 1px dashed rgba(16, 185, 129, 0.4);
        padding: 0.8rem;
        text-align: center;
    }

    .clue-label {
        font-weight: bold;
        color: #10b981;
        display: block;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        letter-spacing: 1px;
    }

    .clue-content {
        color: #fff;
        font-style: italic;
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

    /* Info Toggle */
    .info-toggle-btn {
        background: transparent;
        border: 1px solid #10b981;
        color: #10b981;
        padding: 1rem;
        width: 100%;
        border-radius: 4px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        transition: all 0.2s;
    }

    .info-toggle-btn:hover {
        background: rgba(16, 185, 129, 0.1);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
    }

    .extra-info-panel {
        background: rgba(59, 130, 246, 0.1);
        border-left: 4px solid #3b82f6;
        padding: 1rem;
        color: #e2e8f0;
        margin-bottom: 2rem;
        font-family: "Rajdhani", sans-serif;
        font-size: 1.1rem;
    }

    /* Mission Grid */
    .mission-status-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .status-cell {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .label {
        font-size: 0.7rem;
        color: #94a3b8;
        letter-spacing: 1px;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin-top: 5px;
    }

    .value.high {
        color: #ef4444;
        animation: blink-red 1s infinite alternate;
    }

    @keyframes blink-red {
        from {
            text-shadow: 0 0 10px #ef4444;
            opacity: 1;
        }
        to {
            text-shadow: 0 0 20px #ef4444;
            opacity: 0.7;
        }
    }

    /* Code Entry */
    .code-entry label {
        display: block;
        font-family: "Orbitron", sans-serif;
        color: #10b981;
        margin-bottom: 0.8rem;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }

    .input-wrapper {
        position: relative;
        margin-bottom: 1rem;
    }

    .code-entry input {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #1e293b;
        color: #fff;
        font-family: "Share Tech Mono", monospace;
        font-size: 1.5rem;
        padding: 1rem;
        text-align: center;
        letter-spacing: 3px;
        transition: 0.3s;
        border-radius: 4px;
    }

    .code-entry input:focus {
        border-color: #10b981;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        outline: none;
    }

    /* Error Box */
    .error-box {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 0.8rem;
        text-align: center;
        margin-bottom: 1rem;
        font-family: "Chakra Petch", sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        animation: shake 0.4s ease-in-out;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        75% {
            transform: translateX(5px);
        }
    }

    /* Action Button */
    .action-button {
        width: 100%;
        background: #10b981;
        border: none;
        padding: 1.2rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
        transition: transform 0.2s;
    }

    .action-button:hover {
        transform: scale(1.02);
        background: #059669;
    }

    .success-btn {
        margin-top: 2rem;
        background: #10b981 !important;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }

    .success-btn:hover {
        background: #059669 !important;
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
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
        font-size: 1.2rem;
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
            rgba(255, 255, 255, 0.4),
            transparent
        );
        transition: 0.5s;
    }

    .action-button:hover::before {
        left: 100%;
    }

    /* Success State */
    .success-message {
        text-align: center;
        padding: 2rem;
        animation: scale-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes scale-up {
        0% {
            transform: scale(0.8);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .success-icon-wrapper {
        width: 80px;
        height: 80px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem auto;
        box-shadow: 0 0 30px #10b981;
    }

    .success-icon {
        font-size: 2.5rem;
    }

    .success-message h3 {
        font-family: "Orbitron", sans-serif;
        color: #10b981;
        font-size: 1.8rem;
        margin: 0 0 0.5rem 0;
    }

    .loading-bar {
        width: 100%;
        height: 4px;
        background: #1e293b;
        margin-top: 1.5rem;
        border-radius: 2px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: #10b981;
        width: 0%;
        animation: fill-bar 3s ease-out forwards;
    }

    @keyframes fill-bar {
        to {
            width: 100%;
        }
    }

    /* Mobile */
    @media (max-width: 600px) {
        .content-card {
            padding: 1.5rem;
        }
        .mission-title {
            font-size: 2rem;
        }
    }
</style>

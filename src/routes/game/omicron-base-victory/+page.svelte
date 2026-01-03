<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    let showHint = $state(false);
    let intelScanned = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location
    const VALID_CODES = ["badkamer"];

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to Zeta Flux after brief delay
            setTimeout(() => {
                const nextPath = "/game/zeta-flux-33";
                fetch("/api/mission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ navTo: nextPath }),
                }).catch(console.error);
                goto(nextPath);
            }, 1000);
        } else {
            errorMessage = "⚠️ ACCESS DENIED: INVALID DECRYPTION KEY";
            showSuccess = false;
        }
    }

    onMount(() => {
        visible = true;
        setTimeout(() => (intelScanned = true), 2500);
    });
</script>

<svelte:head>
    <title>Omicron Base // DECRYPTED</title>
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
            <span class="status-badge">✅ DECRYPTIE VOLTOOID</span>
            <h1 class="glitch-title" data-text="INTEL RAPPORT">
                INTEL RAPPORT
            </h1>
        </div>

        <div class="intel-grid">
            <div class="intel-block" in:fly={{ x: -20, delay: 500 }}>
                <span class="label">STATUS</span>
                <span class="value success">WAPENS VERBRAND</span>
            </div>
            <div class="intel-block" in:fly={{ x: 20, delay: 700 }}>
                <span class="label">SITUATIE</span>
                <span class="value highlight">VIJAND VERZWAKT</span>
            </div>
        </div>

        <div class="report-container">
            {#if intelScanned}
                <div class="report-content" in:fade>
                    <p class="typewriter-text">
                        <strong class="highlight-info"
                            >>> SITUATIE RAPPORT:</strong
                        ><br />
                        Doelwit geneutraliseerd. Arsenanaal vernietigd. Signaal interceptie
                        bevestigd. Bron onbekend... Wacht.
                        <span class="highlight-danger"
                            >Anomalie gedetecteerd.</span
                        >
                    </p>
                    <div class="warning-box">
                        <span class="icon">📡</span>
                        <div class="warning-text">
                            <strong>PRIORITY ORDER:</strong> Traceer signaal
                            naar sector <strong>ZETA FLUX</strong>.
                            Onmiddellijke verplaatsing vereist.
                        </div>
                    </div>
                </div>
            {:else}
                <div class="scanning-loader">
                    <div class="scan-visual">
                        <div class="scan-line"></div>
                        <div class="scan-grid"></div>
                    </div>
                    <div class="loading-text">DECRYPTING DATA STREAMS...</div>
                </div>
            {/if}
        </div>

        <div class="action-section">
            {#if showSuccess}
                <div class="success-message" transition:scale>
                    <div class="success-icon-container">
                        <div class="success-icon">🔓</div>
                        <div class="success-ring"></div>
                    </div>
                    <p class="success-text">COÖRDINATEN BEVESTIGD</p>
                    <p class="sub-text">Initialiseren Zeta Flux Protocol...</p>
                </div>
            {:else}
                <button
                    class="hint-toggle"
                    onclick={() => (showHint = !showHint)}
                >
                    <span class="toggle-icon">{showHint ? "❌" : "🔍"}</span>
                    {showHint ? "VERBERG GEGEVENS" : "ONTSLEUTEL LOCATIE DATA"}
                </button>

                {#if showHint}
                    <div class="hint-box" transition:slide>
                        <div class="hint-header">>> LOCATIE PUZZEL</div>
                        <p class="hint-context">
                            Waar bevindt Zeta Flux zich? Los de volgende
                            berekening op:
                        </p>
                        <div class="riddle-math">
                            <span class="math-part">((14 × 3) + 6)</span>
                            <span class="math-operator">÷</span>
                            <span class="math-part">6</span>
                            <span class="math-equals">=</span>
                            <span class="math-result">?</span>
                        </div>
                        <p class="riddle-instruction">
                            De uitkomst is het aantal letters van de ruimte.
                        </p>
                    </div>
                {/if}

                <div class="code-entry">
                    <label for="location-code">
                        <span class="lock-icon">🔐</span>
                        VOER LOCATIECODE IN
                    </label>
                    <div class="input-wrapper">
                        <input
                            id="location-code"
                            type="text"
                            bind:value={locationCode}
                            placeholder="CODE..."
                            onkeydown={(e) =>
                                e.key === "Enter" && handleCodeSubmit()}
                            autocomplete="off"
                            autocapitalize="none"
                        />
                        <div class="input-border"></div>
                    </div>

                    {#if errorMessage}
                        <p class="error-text" transition:slide>
                            {errorMessage}
                        </p>
                    {/if}
                    <button class="next-btn" onclick={handleCodeSubmit}>
                        <div class="btn-content">
                            <span class="icon">🔓</span>
                            UNLOCK SECTOR
                        </div>
                        <div class="btn-glitch"></div>
                    </button>
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
                circle at 50% 0%,
                rgba(59, 130, 246, 0.15) 0%,
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
        background: rgba(10, 15, 25, 0.95);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.15);
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
        background: #fb923c;
        width: 60px;
        box-shadow: 0 0 10px #fb923c;
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
        text-shadow: 2px 2px 0px rgba(59, 130, 246, 0.5);
    }

    .intel-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .intel-block {
        background: rgba(30, 41, 59, 0.4);
        padding: 1rem;
        border-left: 2px solid #3b82f6;
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
        color: #60a5fa;
        text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
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
        border-left: 2px solid #3b82f6;
        padding-left: 1rem;
    }

    .highlight-info {
        color: #3b82f6;
    }
    .highlight-danger {
        color: #ef4444;
        font-weight: bold;
    }

    .warning-box {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: rgba(251, 191, 36, 0.1);
        border: 1px solid rgba(251, 191, 36, 0.3);
        padding: 1rem;
        color: #fbbf24;
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
        color: #3b82f6;
        letter-spacing: 2px;
        animation: blink 1s infinite;
    }

    .scan-visual {
        width: 100%;
        height: 60px;
        position: relative;
        overflow: hidden;
        background: rgba(59, 130, 246, 0.1);
    }

    .scan-line {
        position: absolute;
        width: 20px;
        height: 100%;
        background: #3b82f6;
        box-shadow: 0 0 20px #3b82f6;
        animation: horizontal-scan 2s ease-in-out infinite alternate;
        opacity: 0.5;
    }

    @keyframes horizontal-scan {
        from {
            left: 0;
        }
        to {
            left: 100%;
        }
    }

    .action-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .hint-toggle {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #334155;
        padding: 0.8rem;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
    }

    .hint-toggle:hover {
        background: rgba(59, 130, 246, 0.1);
        color: #fff;
        border-color: #3b82f6;
    }

    .hint-box {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid #3b82f6;
        padding: 1.5rem;
        position: relative;
    }

    .hint-header {
        font-family: "Share Tech Mono", monospace;
        color: #3b82f6;
        margin-bottom: 1rem;
        border-bottom: 1px dashed rgba(59, 130, 246, 0.3);
        padding-bottom: 0.5rem;
    }

    .riddle-math {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        margin: 1rem 0;
        font-family: "Chakra Petch", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .math-part {
        color: #fbbf24;
    }
    .math-operator {
        color: #fff;
    }
    .math-result {
        color: #3b82f6;
        animation: blink 1s infinite;
    }

    .riddle-instruction {
        font-size: 0.9rem;
        color: #94a3b8;
        text-align: center;
        font-style: italic;
    }

    .code-entry label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-family: "Orbitron", sans-serif;
        color: #fff;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }

    .input-wrapper {
        position: relative;
        overflow: hidden;
    }

    .code-entry input {
        width: 100%;
        padding: 1.2rem;
        background: rgba(0, 0, 0, 0.4);
        border: none;
        border-bottom: 2px solid #334155;
        color: white;
        font-size: 1.5rem;
        font-family: "Share Tech Mono", monospace;
        text-align: center;
        letter-spacing: 4px;
        text-transform: uppercase;
        transition: all 0.3s;
    }

    .code-entry input:focus {
        outline: none;
        border-bottom-color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
    }

    .error-text {
        color: #ef4444;
        font-family: "Share Tech Mono", monospace;
        text-align: center;
        font-size: 0.9rem;
        background: rgba(239, 68, 68, 0.1);
        padding: 0.5rem;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .next-btn {
        width: 100%;
        background: #3b82f6;
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
        margin-top: 1rem;
    }

    .btn-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.8rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        color: #fff;
        position: relative;
        z-index: 2;
    }

    .next-btn:hover {
        background: #2563eb;
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
            rgba(255, 255, 255, 0.1) 5%,
            rgba(255, 255, 255, 0.1) 10%,
            transparent 10%
        );
        animation: glitch-anim 2s infinite linear;
        pointer-events: none;
    }

    /* Success Message */
    .success-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid #22c55e;
        position: relative;
    }

    .success-icon-container {
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .success-icon {
        font-size: 3rem;
        position: relative;
        z-index: 2;
    }

    .success-ring {
        position: absolute;
        inset: 0;
        border: 2px dashed #22c55e;
        border-radius: 50%;
        animation: spin 4s linear infinite;
    }

    .success-text {
        font-family: "Orbitron", sans-serif;
        color: #4ade80;
        font-size: 1.2rem;
        font-weight: 900;
        letter-spacing: 1px;
    }

    .sub-text {
        font-family: "Share Tech Mono", monospace;
        color: #86efac;
        font-size: 0.9rem;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
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

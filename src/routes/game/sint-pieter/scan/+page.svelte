<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";

    let visible = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location (Vrijthof)
    const VALID_CODES = ["mooswief"];

    onMount(() => {
        visible = true;
    });

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to Theta Pulse after brief delay
            setTimeout(() => {
                goto("/game/theta-pulse-19");
            }, 1000);
        } else {
            errorMessage = "⚠ TOEGANG GEWEIGERD: ZOEK OP HET VRIJTHOF!";
            showSuccess = false;
        }
    }
</script>

<svelte:head>
    <title>Missie Briefing // MOOSWIEF PROTOCOL</title>
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

<div class="scan-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <div class="content-card glass-panel" in:fade={{ duration: 1000 }}>
        <!-- Decoration Bars -->
        <div class="deco-bar top"></div>
        <div class="deco-bar bottom"></div>

        <div class="status-header">
            <div class="pulse-dot"></div>
            <span>NIEUWE LOCATIE VEREIST</span>
        </div>

        <h1 class="glitch-title" data-text="NAAR HET VRIJTHOF">
            NAAR HET VRIJTHOF
        </h1>

        {#if showSuccess}
            <div class="success-message" transition:scale>
                <div class="success-icon-container">
                    <div class="success-icon">✅</div>
                    <div class="success-ring"></div>
                </div>
                <div class="success-content">
                    <p class="success-title">DOELWIT GEACCEPTEERD</p>
                    <p class="success-sub">Initialiseren Theta Pulse...</p>
                </div>
            </div>
        {:else}
            <div class="briefing" in:slide>
                <div class="briefing-text">
                    <p>
                        <strong>>> SITUATIE GEÜPDATET:</strong><br />
                        Viool beveiligd. Het artefact is stabiel.<br />
                        Nu is het tijd om de aliens te confronteren bij hun verzamelpunt.<br
                        />
                    </p>
                </div>

                <div class="location-hint">
                    <div class="hint-icon">📍</div>
                    <div class="hint-content">
                        <strong>LOCATIE INTEL:</strong>
                        Zoek de locatiecode op het <strong>Vrijthof</strong>.
                    </div>
                </div>

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
                    <button class="scan-btn" onclick={handleCodeSubmit}>
                        <div class="btn-content">
                            <span class="icon">🔓</span>
                            BEVESTIG LOCATIE
                        </div>
                        <div class="btn-glitch"></div>
                    </button>
                </div>
            </div>
        {/if}

        <div class="footer-meta">
            <span class="meta-label">SYSTEEM STATUS:</span>
            <span class="meta-value"
                >OPERATIONEEL // SONISCHE WAPENS GELADEN</span
            >
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

    .scan-page {
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
        max-width: 600px;
        width: 100%;
        padding: 3rem 2.5rem;
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
        background: #fbbf24;
        width: 60px;
        box-shadow: 0 0 10px #fbbf24;
    }

    .status-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.8rem;
        color: #60a5fa;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        letter-spacing: 2px;
        background: rgba(59, 130, 246, 0.1);
        padding: 0.5rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
        max-width: fit-content;
        margin: 0 auto;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #3b82f6;
        border-radius: 50%;
        box-shadow: 0 0 10px #3b82f6;
        animation: pulse 2s infinite;
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.2rem;
        color: #fff;
        margin: 0;
        text-align: center;
        text-transform: uppercase;
        position: relative;
        text-shadow: 2px 2px 0px rgba(59, 130, 246, 0.5);
    }

    .briefing-text {
        font-family: "Share Tech Mono", monospace;
        color: #cbd5e1;
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        border-left: 2px solid #3b82f6;
        padding-left: 1rem;
    }

    .location-hint {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
        padding: 1rem;
        margin-bottom: 2rem;
        border: 1px dashed rgba(59, 130, 246, 0.4);
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
    }

    .hint-icon {
        font-size: 1.5rem;
    }

    .code-entry {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    .code-entry label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        color: #fff;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .input-wrapper {
        position: relative;
        width: 100%;
    }

    .code-entry input {
        width: 100%;
        padding: 1.2rem;
        background: rgba(0, 0, 0, 0.4);
        border: none;
        border-bottom: 2px solid #334155;
        color: white;
        font-size: 1.3rem;
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
        font-size: 0.9rem;
        text-align: center;
        margin: 0.5rem 0;
        background: rgba(239, 68, 68, 0.1);
        padding: 0.5rem;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .scan-btn {
        width: 100%;
        padding: 1.2rem;
        background: #3b82f6;
        color: white;
        border: none;
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
        font-weight: 700;
        font-size: 1.1rem;
        position: relative;
        z-index: 2;
    }

    .scan-btn:hover {
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
            rgba(255, 255, 255, 0.2) 5%,
            rgba(255, 255, 255, 0.2) 10%,
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
        border-radius: 4px;
        position: relative;
    }

    .success-icon-container {
        position: relative;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .success-icon {
        font-size: 2.5rem;
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

    .success-title {
        font-family: "Orbitron", sans-serif;
        color: #4ade80;
        font-size: 1.2rem;
        font-weight: 900;
        text-align: center;
        margin-bottom: 0.5rem;
    }

    .success-sub {
        font-family: "Share Tech Mono", monospace;
        color: #86efac;
        font-size: 0.9rem;
        text-align: center;
    }

    .footer-meta {
        margin-top: auto;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
    }

    .meta-label {
        font-family: "Share Tech Mono", monospace;
        font-size: 0.7rem;
        color: #64748b;
    }

    .meta-value {
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: #3b82f6;
        letter-spacing: 1px;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.6;
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

    @media (max-width: 600px) {
        .content-card {
            padding: 1.5rem;
        }
        .glitch-title {
            font-size: 1.8rem;
        }
    }
</style>

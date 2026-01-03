<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    let intelRevealed = $state(false);
    let showAlienImage = $state(false);
    let enlargedImage = $state(false);
    let isStella = $derived($gameProgress.player?.avatar === "stella");

    onMount(() => {
        visible = true;
        setTimeout(() => (intelRevealed = true), 1000);
    });

    async function handleContinue() {
        // Send everyone to the bridge
        await fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: "/game/mosa-bridge-44" }),
        }).catch(console.error);

        goto("/game/mosa-bridge-44");
    }
</script>

<svelte:head>
    <title>Theta Pulse // MISSION ACCOMPLISHED</title>
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

    <div class="content-panel cyber-card" in:fade={{ duration: 800 }}>
        <!-- Decoration Bars -->
        <div class="deco-bar top"></div>
        <div class="deco-bar bottom"></div>

        <div class="header" in:fly={{ y: -20, delay: 200 }}>
            <div class="badge-status-completed">
                <span class="status-icon">✅</span>
                <span>MISSIE SUCCESVOL</span>
            </div>
            <h1 class="glitch-title" data-text="VRIJTHOF BEVRIJD">
                VRIJTHOF BEVRIJD!
            </h1>
        </div>

        <div class="visual-container">
            <div class="hero-display">
                <div class="circle-ring"></div>
                <div class="circle-ring-2"></div>
                <div
                    class="stella-victory"
                    in:scale={{ duration: 1000, delay: 400 }}
                >
                    <img
                        src="/heroes/stella-violin.png"
                        alt="Stella Violin"
                        class="hero-image"
                    />
                </div>
            </div>
        </div>

        <div class="report-section">
            {#if intelRevealed}
                <div class="report-box glass-panel" in:fly={{ y: 20 }}>
                    <div class="report-header">
                        <span class="report-label">SITUATIE RAPPORT</span>
                        <div class="line"></div>
                    </div>

                    <h3 class="cyber-heading">UITSTEKEND WERK, STELLA!</h3>
                    <p class="mission-text">
                        De sonische pulsen zijn effectief. De alien-vloot boven
                        het Vrijthof is volledig gedestabiliseerd. <strong
                            class="highlight">Gevaar geneutraliseerd.</strong
                        >
                    </p>

                    <button
                        class="reveal-btn"
                        onclick={() => (showAlienImage = !showAlienImage)}
                    >
                        {showAlienImage
                            ? "SLUIT DOSSIER"
                            : "BEKIJK VIJANDIGE STATUS"}
                    </button>

                    {#if showAlienImage}
                        <div class="alien-image-container" in:scale>
                            <div class="corner-accents">
                                <span class="c-tl"></span><span class="c-tr"
                                ></span><span class="c-bl"></span><span
                                    class="c-br"
                                ></span>
                            </div>
                            <img
                                src="/alien-diarree.png"
                                alt="Alien Diarree"
                                class="alien-image"
                                onclick={() => (enlargedImage = true)}
                                role="button"
                                tabindex="0"
                            />
                            <p class="image-caption">
                                <span class="warning-icon">⚠</span>
                                DOELWIT STATUS: CRITISCH
                            </p>
                            <p class="tap-hint">klik om te vergroten</p>
                        </div>
                    {/if}

                    <div class="objective-box warning">
                        <div class="warning-header">
                            <span class="blink">⚠</span> NIEUWE DREIGING
                        </div>
                        <p>
                            Sensoren detecteren restanten van de vloot. Ze
                            hergroeperen in <strong>WYCK</strong>.
                        </p>
                    </div>

                    <p class="final-words">
                        "We kunnen ze niet laten ontkomen. De achtervolging
                        wordt ingezet."
                    </p>
                </div>

                <button class="final-btn" onclick={handleContinue}>
                    <div class="btn-content">
                        ACHTERVOLG DE ALIENS <span class="icon">🛸</span>
                    </div>
                    <div class="btn-glitch-effect"></div>
                </button>
            {:else}
                <div class="decoding-text">
                    <span class="loading-spinner"></span>
                    <span class="text">SONISCHE ECHO'S ANALYSEREN...</span>
                </div>
            {/if}
        </div>
    </div>
</div>

<!-- Lightbox Modal -->
{#if enlargedImage}
    <div
        class="lightbox"
        onclick={() => (enlargedImage = false)}
        transition:fade
    >
        <div class="lightbox-content" onclick={(e) => e.stopPropagation()}>
            <img
                src="/alien-diarree.png"
                alt="Alien Diarree Vergroot"
                class="lightbox-image"
            />
            <div class="lightbox-caption">
                VIJANDIGE REACTIE OP SONISCHE GOLVEN BEVESTIGD
            </div>
            <button class="close-btn" onclick={() => (enlargedImage = false)}>
                SLUIT
            </button>
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

    .victory-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 1rem;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* Background Effects */
    .animated-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 0%,
                rgba(34, 197, 94, 0.15) 0%,
                transparent 70%
            ),
            linear-gradient(rgba(15, 23, 42, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.9) 1px, transparent 1px);
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -2;
        animation: bg-pulse 8s ease-in-out infinite;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 40%,
            #000 100%
        );
        pointer-events: none;
        z-index: -1;
    }

    .content-panel {
        max-width: 650px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(10, 15, 25, 0.95);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.15);
        text-align: center;
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
        width: 60px;
        background: #22c55e;
        box-shadow: 0 0 10px #22c55e;
    }

    .badge-status-completed {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(34, 197, 94, 0.1);
        color: #4ade80;
        padding: 0.5rem 1rem;
        border: 1px solid #22c55e;
        border-radius: 4px;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        letter-spacing: 2px;
        margin-bottom: 1rem;
    }

    h1.glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.8rem;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
        text-shadow: 2px 2px 0px rgba(34, 197, 94, 0.5);
    }

    .visual-container {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0 2rem;
    }

    .hero-display {
        position: relative;
        width: 100%;
        max-width: 450px;
        aspect-ratio: 16/9;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .circle-ring {
        position: absolute;
        width: 300px;
        height: 300px;
        border: 1px dashed rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: spin 20s linear infinite;
    }

    .circle-ring-2 {
        position: absolute;
        width: 350px;
        height: 350px;
        border: 1px solid rgba(59, 130, 246, 0.1);
        border-radius: 50%;
        animation: spin 30s linear infinite reverse;
    }

    .stella-victory {
        position: relative;
        z-index: 2;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .hero-image {
        width: 100%;
        height: auto;
        filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.3));
        animation: float 4s ease-in-out infinite;
    }

    .report-box {
        background: rgba(15, 23, 42, 0.6);
        border-left: 2px solid #3b82f6;
        padding: 1.5rem;
        text-align: left;
    }

    .report-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .report-label {
        font-family: "Share Tech Mono", monospace;
        color: #64748b;
        font-size: 0.8rem;
    }

    .report-header .line {
        flex-grow: 1;
        height: 1px;
        background: #334155;
    }

    .cyber-heading {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        letter-spacing: 1px;
    }

    .mission-text {
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 1rem;
        margin-bottom: 2rem;
    }

    .highlight {
        color: #22c55e;
    }

    .reveal-btn {
        width: 100%;
        padding: 1rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid #3b82f6;
        color: #60a5fa;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .reveal-btn:hover {
        background: rgba(59, 130, 246, 0.2);
    }

    .alien-image-container {
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .corner-accents span {
        position: absolute;
        width: 6px;
        height: 6px;
        border: 1px solid #ef4444;
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

    .alien-image {
        width: 100%;
        max-width: 400px;
        height: auto;
        opacity: 0.9;
        cursor: pointer;
        transition: opacity 0.2s;
        display: block;
        margin: 0 auto;
    }

    .alien-image:hover {
        opacity: 1;
    }

    .image-caption {
        color: #ef4444;
        font-size: 0.8rem;
        font-family: "Share Tech Mono", monospace;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .tap-hint {
        color: #475569;
        font-size: 0.7rem;
        text-align: center;
        margin: 0;
        font-family: "Share Tech Mono", monospace;
    }

    /* Objective Box */
    .objective-box.warning {
        background: rgba(239, 68, 68, 0.05); /* Red tint */
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 1rem;
        color: #e2e8f0;
        margin-bottom: 1.5rem;
    }

    .warning-header {
        color: #ef4444;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .blink {
        animation: blink 1s infinite;
    }

    .final-words {
        font-style: italic;
        color: #94a3b8;
        font-size: 0.95rem;
        border-left: 2px solid #fbbf24;
        padding-left: 1rem;
    }

    /* Final Button */
    .final-btn {
        width: 100%;
        padding: 1.4rem;
        background: #3b82f6;
        color: white;
        border: none;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-top: 1rem;
        clip-path: polygon(
            15px 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            0 100%,
            0 15px
        );
    }

    .btn-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
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

    .final-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
    }

    /* Decoding Animation */
    .decoding-text {
        font-family: "Share Tech Mono", monospace;
        color: #3b82f6;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 1.1rem;
    }

    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    /* Lightbox Modal */
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        backdrop-filter: blur(5px);
    }

    .lightbox-content {
        position: relative;
        max-width: 600px;
        width: 100%;
        background: #0f172a;
        border: 1px solid #ef4444;
        padding: 2rem;
        text-align: center;
    }

    .lightbox-image {
        width: 100%;
        height: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 1rem;
    }

    .lightbox-caption {
        color: #ef4444;
        font-family: "Orbitron", sans-serif;
        margin-bottom: 1.5rem;
    }

    .close-btn {
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
        padding: 0.5rem 2rem;
        cursor: pointer;
        font-family: "Share Tech Mono", monospace;
        transition: all 0.2s;
    }
    .close-btn:hover {
        background: white;
        color: black;
    }

    /* Animations */
    @keyframes float {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
        100% {
            transform: translateY(0);
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
    @keyframes bg-pulse {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
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

    @media (max-width: 480px) {
        h1.glitch-title {
            font-size: 1.8rem;
        }
        .hero-display {
            aspect-ratio: 1;
        }
        .content-panel {
            padding: 1.5rem;
        }
    }
</style>

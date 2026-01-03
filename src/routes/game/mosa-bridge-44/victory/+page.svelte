<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

    let gameContainer: any;
    let showContent = $state(false);

    // Alien intercepts
    const intercepts = [
        { text: '"Retreat naar sector Pottenberg!"', type: "command" },
        { text: '"De anderen zijn ontsnapt..."', type: "report" },
        { text: '"Coördinaten: 50.8421, 5.7012"', type: "data" },
        { text: '"Ze hergroeperen zich!"', type: "warning" },
        { text: '"Laatste kans om te stoppen!"', type: "threat" },
    ];

    onMount(() => {
        soundManager.playSuccess();
        setTimeout(() => {
            showContent = true;
        }, 300);
    });

    async function handleContinue() {
        soundManager.playClick();
        goto("/game/rho-system-88/finale");
    }
</script>

<div class="omicron-theme">
    <div class="env-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <GameContainer
        bind:this={gameContainer}
        gameId="mosa-victory"
        title="📡 MISSION DEBRIEF: PARTIAL SUCCESS"
    >
        {#if showContent}
            <div class="victory-content" in:fade={{ duration: 800 }}>
                <!-- Header Section -->
                <div class="victory-header" in:fly={{ y: -20, delay: 200 }}>
                    <div class="badge-container">
                        <div class="badge-glow"></div>
                        <div class="badge-icon">🌊</div>
                        <div class="badge-ring"></div>
                    </div>
                    <h2 class="glitch-title" data-text="ALIENS WEGGESPOELD!">
                        ALIENS WEGGESPOELD!
                    </h2>
                </div>

                <!-- Story Block -->
                <div
                    class="story-block glass-panel"
                    in:fly={{ y: 20, delay: 400 }}
                >
                    <div class="deco-corner tl"></div>
                    <div class="deco-corner br"></div>
                    <p class="story-text">
                        Dankzij jouw snelle reacties bij de Servaasbrug zijn de
                        meeste aliens weggespoeld. De biomechanische dreiging is
                        grotendeels geneutraliseerd.
                    </p>
                    <div class="warning-banner">
                        <span class="pulse-dot"></span>
                        MARGELLIJKE FOUT: MEERDERE ENTITEITEN ONTSNAPT
                    </div>
                </div>

                <!-- Alert Section -->
                <div
                    class="alert-section"
                    in:scale={{ start: 0.9, delay: 600 }}
                >
                    <div class="alert-box danger">
                        <div class="alert-header">
                            <span class="alert-icon">🚨</span>
                            <span class="alert-line"
                                >IDENTIFICATIE GESLAAGD</span
                            >
                        </div>
                        <div class="alert-body">
                            <p>
                                <strong>WAARSCHUWING:</strong> Ontsnapte aliens
                                gelocaliseerd in
                                <span class="location-tag">POTTENBERG</span>. Ze
                                hergroeperen zich voor een wanhoopsaanval op de
                                sector.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Intercepts -->
                <div
                    class="intercept-container glass-panel"
                    in:fly={{ y: 20, delay: 800 }}
                >
                    <div class="panel-header">
                        <span class="terminal-prompt">>></span>
                        <h3>ONDERYSCHEPTE COMMUNICATIE</h3>
                    </div>
                    <div class="chat-bubbles">
                        {#each intercepts as item, i}
                            <div
                                class="bubble-row"
                                style:animation-delay="{i * 0.4}s"
                            >
                                <div class="bubble {item.type}">
                                    <span class="type-label"
                                        >[{item.type.toUpperCase()}]</span
                                    >
                                    {item.text}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Instructions -->
                <div class="mission-instruction" in:fade={{ delay: 1200 }}>
                    <p>
                        Vertrek onmiddellijk naar <strong>Pottenberg</strong>.
                        Neutraliseer de overgebleven eenheden voor ze de
                        stadsmuren bereiken.
                    </p>
                </div>

                <!-- Actions -->
                <div class="actions" in:fly={{ y: 20, delay: 1400 }}>
                    <button class="cyber-btn primary" onclick={handleContinue}>
                        <span class="btn-text"
                            >🎯 INTERCEPTIE IN POTTENBERG</span
                        >
                        <div class="glitch-effect"></div>
                    </button>
                </div>
            </div>
        {/if}
    </GameContainer>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap");

    :global(body) {
        background-color: #020617;
        margin: 0;
        overflow-x: hidden;
    }

    .omicron-theme {
        position: relative;
        min-height: 100vh;
        font-family: "Rajdhani", sans-serif;
        color: #e2e8f0;
    }

    /* Background & Overlays */
    .env-bg {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            #0f172a 0%,
            #020617 100%
        );
        z-index: -1;
    }

    .scanlines {
        position: fixed;
        inset: 0;
        background: linear-gradient(
                rgba(18, 16, 16, 0) 50%,
                rgba(0, 0, 0, 0.2) 50%
            ),
            linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.05),
                rgba(0, 255, 0, 0.01),
                rgba(0, 0, 255, 0.05)
            );
        background-size:
            100% 4px,
            3px 100%;
        pointer-events: none;
        z-index: 100;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 20%,
            rgba(0, 0, 0, 0.8) 100%
        );
        pointer-events: none;
        z-index: 101;
    }

    .victory-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
    }

    /* Header & Badge */
    .victory-header {
        text-align: center;
        margin-bottom: 0.5rem;
    }

    .badge-container {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .badge-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(
            circle,
            rgba(0, 243, 255, 0.4) 0%,
            transparent 70%
        );
        border-radius: 50%;
        animation: pulse-glow 2s infinite ease-in-out;
    }

    .badge-icon {
        font-size: 3rem;
        z-index: 2;
        filter: drop-shadow(0 0 10px #0ef3ff);
    }

    .badge-ring {
        position: absolute;
        inset: -5px;
        border: 2px dashed #0ef3ff;
        border-radius: 50%;
        animation: rotate 10s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes pulse-glow {
        0%,
        100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.1);
        }
    }

    /* Glitch Title */
    .glitch-title {
        font-family: "Orbitron", sans-serif;
        font-size: 2rem;
        color: #0ef3ff;
        text-transform: uppercase;
        position: relative;
        text-shadow: 0 0 10px rgba(14, 243, 255, 0.5);
    }

    .glitch-title::after {
        content: attr(data-text);
        position: absolute;
        left: 2px;
        top: 0;
        color: white;
        background: transparent;
        overflow: hidden;
        clip-path: inset(0 0 0 0);
        animation: glitch-anim 2s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(80% 0 1% 0);
        }
        20% {
            clip-path: inset(30% 0 50% 0);
        }
        40% {
            clip-path: inset(10% 0 10% 0);
        }
        60% {
            clip-path: inset(50% 0 30% 0);
        }
        80% {
            clip-path: inset(1% 0 80% 0);
        }
        100% {
            clip-path: inset(40% 0 40% 0);
        }
    }

    /* Glass Panels */
    .glass-panel {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(14, 243, 255, 0.2);
        backdrop-filter: blur(8px);
        padding: 1.5rem;
        position: relative;
    }

    .deco-corner {
        position: absolute;
        width: 10px;
        height: 10px;
        border: 2px solid #0ef3ff;
    }
    .deco-corner.tl {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
    }
    .deco-corner.br {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
    }

    .story-text {
        font-size: 1.1rem;
        line-height: 1.5;
        margin-bottom: 1rem;
        color: #94a3b8;
    }

    .warning-banner {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 0.5rem;
        font-family: "Share Tech Mono", monospace;
        color: #f87171;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        animation: pulse-dot 1s infinite;
    }

    @keyframes pulse-dot {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.3;
            transform: scale(0.8);
        }
    }

    /* Alert Box */
    .alert-box {
        display: flex;
        flex-direction: column;
        background: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        padding: 1.25rem;
        gap: 0.75rem;
    }

    .alert-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        color: #ef4444;
    }

    .alert-body p {
        margin: 0;
        line-height: 1.5;
        color: #fecaca;
    }

    .location-tag {
        background: #ef4444;
        color: white;
        padding: 0 0.4rem;
        border-radius: 4px;
        font-weight: bold;
    }

    /* Intercepts */
    .intercept-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .panel-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-bottom: 1px solid rgba(14, 243, 255, 0.1);
        padding-bottom: 0.5rem;
    }

    .terminal-prompt {
        color: #0ef3ff;
        font-family: "Share Tech Mono", monospace;
    }

    h3 {
        font-family: "Orbitron", sans-serif;
        font-size: 0.85rem;
        margin: 0;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.6);
    }

    .chat-bubbles {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .bubble-row {
        opacity: 0;
        animation: fade-in-up 0.5s forwards ease-out;
    }

    .bubble {
        padding: 0.6rem 1rem;
        background: rgba(2, 6, 23, 0.6);
        border: 1px solid rgba(14, 243, 255, 0.1);
        font-family: "Share Tech Mono", monospace;
        font-size: 0.9rem;
        display: inline-block;
        border-radius: 0 12px 12px 12px;
    }

    .type-label {
        font-size: 0.7rem;
        opacity: 0.5;
        margin-right: 0.5rem;
    }

    .bubble.threat,
    .bubble.warning {
        color: #f87171;
        border-color: rgba(239, 68, 68, 0.2);
    }
    .bubble.command {
        color: #0ef3ff;
    }
    .bubble.data {
        color: #86efac;
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .mission-instruction {
        text-align: center;
        font-style: italic;
        color: #86efac;
        padding: 0.5rem;
    }

    /* Action Button */
    .actions {
        margin-top: 1rem;
    }

    .cyber-btn {
        width: 100%;
        position: relative;
        padding: 1.25rem;
        background: #0ef3ff;
        border: none;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        color: #020617;
        text-transform: uppercase;
        clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);
        transition: all 0.3s;
        overflow: hidden;
    }

    .cyber-btn:hover {
        background: #fff;
        box-shadow: 0 0 30px rgba(14, 243, 255, 0.4);
        transform: translateY(-2px);
    }

    .glitch-effect {
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

    .cyber-btn:hover .glitch-effect {
        left: 100%;
    }

    .btn-text {
        position: relative;
        z-index: 2;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    // let isMosa = $derived($gameProgress.player?.avatar === "mosa");
    let isMosa = true; // Access restriction lifted by user request

    onMount(() => {
        visible = true;
    });

    async function handleNext() {
        // Go to the defense game
        goto("/game/mosa-bridge-44/defense");
    }
</script>

<svelte:head>
    <title>Mosa Bridge // DEFENSE PROTOCOL</title>
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

<div class="mosa-mission-page">
    <div class="animated-bg"></div>
    <div class="scanline-overlay"></div>
    <div class="vignette"></div>

    <div class="content-panel cyber-panel" in:fade={{ duration: 800 }}>
        <!-- Decoration Bars -->
        <div class="deco-bar top"></div>
        <div class="deco-bar bottom"></div>

        {#if !isMosa}
            <div class="access-denied" in:fly={{ y: 20 }}>
                <h1 class="glitch-text" data-text="TOEGANG GEWEIGERD">
                    TOEGANG GEWEIGERD
                </h1>
                <p>Deze missie is specifiek voor <strong>Lord Mosa</strong>.</p>
                <div class="avatar-hint">🚫</div>
                <button class="return-btn" onclick={() => goto("/game")}>
                    TERUG NAAR DASHBOARD
                </button>
            </div>
        {:else}
            <div class="mission-briefing" in:fly={{ y: 20 }}>
                <div class="header-section">
                    <div class="mission-tag">
                        <span class="blinking-dot"></span>
                        MISSIE: WYCK - SERVAASBRUG
                    </div>
                    <h1 class="glitch-title" data-text="LORD MOSA: ACTIE">
                        LORD MOSA: ACTIE
                    </h1>
                </div>

                <div class="hero-showcase">
                    <div class="hero-frame">
                        <img
                            src="/heroes/lord-mosa-2.png"
                            alt="Lord Mosa"
                            class="hero-img"
                        />
                        <div class="scan-effect"></div>
                    </div>
                </div>

                <div class="story-box glass-panel">
                    <div class="corner-accents">
                        <span class="c-tl"></span><span class="c-tr"
                        ></span><span class="c-bl"></span><span class="c-br"
                        ></span>
                    </div>

                    <p class="briefing-text">
                        De elitaire aliens die aan Stella zijn ontsnapt, zijn
                        gesignaleerd in <strong>Wyck</strong>. De superhelden
                        hebben de achtervolging ingezet!
                    </p>

                    <div class="urgent-update">
                        <div class="alert-icon">🚨</div>
                        <div class="alert-content">
                            <strong>VISUELE BEVESTIGING:</strong><br />
                            Aliens steken de
                            <span class="highlight">Servaasbrug</span> over richting
                            de binnenstad!
                        </div>
                    </div>

                    <p class="briefing-text">
                        Lord Mosa, jij bent de enige die ze bij de Maas kan
                        onderscheppen. Gebruik je waterkrachten om de brug te
                        bewaken.
                    </p>
                </div>

                <div class="objectives">
                    <div class="obj-card">
                        <div class="icon-box">🌉</div>
                        <div class="text">
                            <strong>LOCATIE</strong>
                            <span>Sint Servaasbrug, Maastricht</span>
                        </div>
                    </div>
                    <div class="obj-card">
                        <div class="icon-box">🛡️</div>
                        <div class="text">
                            <strong>OPDRACHT</strong>
                            <span>Blokkeer de vluchtweg</span>
                        </div>
                    </div>
                </div>

                <button class="action-btn" onclick={handleNext}>
                    <div class="btn-content">
                        BEWAAK DE BRUG <span class="icon">🌊</span>
                    </div>
                    <div class="btn-glitch-effect"></div>
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Global Styles */
    :global(body) {
        background-color: #020617;
        color: #e2e8f0;
        font-family: "Rajdhani", sans-serif;
    }

    .mosa-mission-page {
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
                circle at 50% 10%,
                rgba(14, 165, 233, 0.15) 0%,
                /* Cyan tint */ transparent 60%
            ),
            linear-gradient(rgba(15, 23, 42, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.9) 1px, transparent 1px);
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
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
        z-index: -1;
    }

    .content-panel {
        max-width: 700px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(10, 15, 30, 0.95);
        border: 1px solid rgba(14, 165, 233, 0.3);
        box-shadow: 0 0 50px rgba(14, 165, 233, 0.15);
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
        height: 3px;
        background: #0ea5e9;
        width: 100px;
    }
    .deco-bar.top {
        top: 0;
        left: 0;
        box-shadow: 0 0 10px #0ea5e9;
    }
    .deco-bar.bottom {
        bottom: 0;
        right: 0;
        width: 60px;
        background: #0284c7;
    }

    .header-section {
        text-align: center;
        margin-bottom: 2rem;
    }

    .mission-tag {
        font-family: "Share Tech Mono", monospace;
        color: #0ea5e9;
        font-size: 0.9rem;
        letter-spacing: 2px;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .blinking-dot {
        width: 6px;
        height: 6px;
        background: #0ea5e9;
        border-radius: 50%;
        animation: blink 1s infinite;
    }

    .glitch-title {
        font-family: "Audiowide", cursive;
        font-size: 2.8rem;
        color: #fff;
        margin: 0;
        text-transform: uppercase;
        text-shadow: 2px 2px 0px rgba(14, 165, 233, 0.5);
    }

    /* Hero Showcase */
    .hero-showcase {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .hero-frame {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        border: 2px solid #0ea5e9;
        box-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
        background: radial-gradient(
            circle,
            rgba(14, 165, 233, 0.2),
            transparent
        );
    }

    .hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .scan-effect {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(14, 165, 233, 0.4),
            transparent
        );
        height: 30%;
        animation: scan-vertical 2s linear infinite;
    }

    /* Story Box */
    .story-box {
        background: rgba(15, 23, 42, 0.6);
        padding: 1.5rem;
        margin-bottom: 2rem;
        position: relative;
        border: 1px solid rgba(14, 165, 233, 0.2);
    }

    .corner-accents span {
        position: absolute;
        width: 6px;
        height: 6px;
        border: 1px solid #0ea5e9;
        transition: all 0.3s ease;
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

    .briefing-text {
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

    .urgent-update {
        background: rgba(14, 165, 233, 0.1);
        padding: 1rem;
        /* border-radius: 8px; */
        border: 1px dashed rgba(14, 165, 233, 0.5);
        margin: 1.5rem 0;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .alert-icon {
        font-size: 2rem;
    }

    .alert-content {
        font-size: 0.95rem;
        color: #e0f2fe;
    }

    .highlight {
        color: #38bdf8;
        font-weight: bold;
        text-shadow: 0 0 5px #38bdf8;
    }

    /* Objectives */
    .objectives {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .obj-card {
        background: rgba(2, 6, 23, 0.5);
        padding: 1rem;
        border: 1px solid rgba(14, 165, 233, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .icon-box {
        width: 40px;
        height: 40px;
        background: rgba(14, 165, 233, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        border-radius: 4px;
        border: 1px solid rgba(14, 165, 233, 0.3);
    }

    .obj-card .text {
        display: flex;
        flex-direction: column;
    }

    .obj-card strong {
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: #7dd3fc;
        letter-spacing: 1px;
        margin-bottom: 2px;
    }

    .obj-card span {
        color: #e2e8f0;
        font-size: 0.9rem;
    }

    /* Action Button */
    .action-btn {
        width: 100%;
        padding: 1.4rem;
        background: #0ea5e9;
        color: #020617;
        border: none;
        /* border-radius: 16px; */
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.4rem;
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
        transition: all 0.3s ease;
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
            rgba(255, 255, 255, 0.4) 5%,
            transparent 6%
        );
        animation: glitch-anim 3s infinite linear;
        pointer-events: none;
    }

    .action-btn:hover {
        background: #38bdf8;
        transform: translateY(-2px);
        box-shadow: 0 0 40px rgba(14, 165, 233, 0.6);
    }

    /* Access Denied */
    .access-denied {
        padding: 2rem;
        text-align: center;
    }

    .access-denied h1 {
        font-family: "Audiowide", cursive;
        color: #ef4444;
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .avatar-hint {
        font-size: 4rem;
        margin: 2rem 0;
        animation: pulse 2s infinite;
    }

    .return-btn {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #334155;
        padding: 1rem 2rem;
        font-family: "Orbitron", sans-serif;
        cursor: pointer;
        transition: all 0.2s;
    }
    .return-btn:hover {
        border-color: #ef4444;
        color: #ef4444;
    }

    /* Animations */
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
    @keyframes scan-vertical {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(100%);
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
    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    @media (max-width: 600px) {
        .objectives {
            grid-template-columns: 1fr;
        }
        .glitch-title {
            font-size: 2rem;
        }
        .content-panel {
            padding: 1.5rem;
        }
    }
</style>

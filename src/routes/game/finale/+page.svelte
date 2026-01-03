<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

    let visible = $state(false);

    onMount(() => {
        visible = true;
        soundManager.startAmbientMusic();
        setTimeout(() => {
            soundManager.playWin();
        }, 500);
    });
</script>

<div class="omicron-finale">
    <div class="env-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    {#if visible}
        <div class="container" in:fade={{ duration: 1000 }}>
            <div class="status-banner" in:fly={{ y: -20, delay: 200 }}>
                <span class="dot"></span> GLOBAL THREAT NEUTRALIZED
            </div>

            <h1 class="main-title" in:scale={{ duration: 1200, start: 0.8 }}>
                MISSIE VOLTOOID
            </h1>

            <div
                class="news-ticker-box glass-panel"
                in:fly={{ x: -20, duration: 800, delay: 1000 }}
            >
                <div class="badge">BREAKING INTEL</div>
                <div class="ticker-content">
                    <span class="ticker-text">
                        ALIENVLOOT VERLAAT DAMPKRING • RUST WEERGEKEERD IN
                        MAASTRICHT • CARNAVAL GAAT DOOR • SECTOR POTTENBERG
                        VEILIG • SONISCHE PULSEN EFFECTIEF
                    </span>
                </div>
            </div>

            <div
                class="team-photo-wrapper"
                in:scale={{ duration: 800, delay: 2200 }}
            >
                <div class="photo-frame">
                    <img
                        src="/heroes/team-pic.png"
                        alt="Hero Team"
                        class="team-photo"
                    />
                    <div class="photo-scanline"></div>
                </div>
                <div class="photo-caption">
                    <span class="prefix">REGISTRY:</span> MISSION_UNIT_THETA
                </div>
            </div>

            <div
                class="hero-card glass-panel"
                in:fade={{ duration: 1000, delay: 2000 }}
            >
                <div class="deco-corner tl"></div>
                <div class="deco-corner br"></div>

                <div class="medal-wrapper">
                    <div class="medal">🏆</div>
                    <div class="medal-glow"></div>
                </div>

                <h2 class="hero-title">DANK AAN ONZE HELDEN</h2>

                <div class="story-content">
                    <p class="terminal-text">
                        <span class="prefix">>></span> Beste Superhelden,
                    </p>
                    <p class="body-text">
                        Dankzij jullie snelle handelen is de interdimensionale
                        dreiging afgewend. De biomechanische data is
                        veiliggesteld, de Mosa-overgangen zijn bewaakt en de
                        indringers zijn geneutraliseerd.
                    </p>
                    <div class="highlight-box">
                        MAASTRICHT IS JULLIE EEUWIG DANKBAAR.
                    </div>
                </div>
            </div>

            <div class="actions" in:fly={{ y: 20, delay: 3500 }}>
                <button class="cyber-btn" onclick={() => goto("/")}>
                    <span class="btn-text">RETURN TO BRIDGE</span>
                    <div class="glitch-line"></div>
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap");

    :global(body) {
        background-color: #020617;
        margin: 0;
        overflow-y: auto;
    }

    .omicron-finale {
        min-height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-family: "Rajdhani", sans-serif;
        color: #e2e8f0;
        padding: 4rem 0;
    }

    /* Backgrounds */
    .env-bg {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            #1e293b 0%,
            #020617 100%
        );
        z-index: -1;
    }

    .scanlines {
        position: fixed;
        inset: 0;
        background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 100;
        opacity: 0.2;
    }

    .vignette {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 30%,
            rgba(0, 0, 0, 0.9) 100%
        );
        pointer-events: none;
        z-index: 101;
    }

    .container {
        max-width: 700px;
        width: 100%;
        padding: 2rem;
        text-align: center;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }

    /* Status Banner */
    .status-banner {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(34, 197, 94, 0.1);
        color: #4ade80;
        padding: 0.6rem 1.5rem;
        border: 1px solid rgba(34, 197, 94, 0.2);
        font-family: "Share Tech Mono", monospace;
        letter-spacing: 2px;
        font-size: 0.8rem;
        text-transform: uppercase;
    }

    .dot {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }
    }

    /* Title */
    .main-title {
        font-family: "Orbitron", sans-serif;
        font-size: clamp(2.5rem, 8vw, 5.5rem);
        font-weight: 900;
        letter-spacing: 8px;
        margin: 0;
        color: #fff;
        text-shadow: 0 0 30px rgba(14, 243, 255, 0.5);
        text-transform: uppercase;
    }

    /* News Ticker */
    .news-ticker-box {
        width: 100%;
        padding: 0.75rem !important;
        background: rgba(255, 255, 255, 0.03) !important;
        border-color: rgba(239, 68, 68, 0.3);
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    /* Team Photo */
    .team-photo-wrapper {
        width: 100%;
        max-width: 600px;
        margin-bottom: 2rem;
        text-align: center;
    }

    .photo-frame {
        position: relative;
        border: 1px solid rgba(14, 243, 255, 0.3);
        padding: 4px;
        background: rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        overflow: hidden;
    }

    .team-photo {
        width: 100%;
        height: auto;
        display: block;
        filter: brightness(1.1) contrast(1.1) saturate(1.2);
    }

    .photo-scanline {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(14, 243, 255, 0.1),
            transparent
        );
        height: 2px;
        width: 100%;
        animation: photo-scan 4s linear infinite;
        pointer-events: none;
    }

    @keyframes photo-scan {
        from {
            top: -2px;
        }
        to {
            top: 100%;
        }
    }

    .photo-caption {
        font-family: "Share Tech Mono", monospace;
        color: #94a3b8;
        font-size: 0.8rem;
        margin-top: 0.75rem;
        letter-spacing: 2px;
    }

    .photo-caption .prefix {
        color: #0ef3ff;
        opacity: 0.8;
    }

    .badge {
        background: #ef4444;
        color: #fff;
        padding: 0.25rem 0.75rem;
        font-family: "Share Tech Mono", monospace;
        font-weight: 700;
        font-size: 0.75rem;
        white-space: nowrap;
    }

    .ticker-content {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
    }

    .ticker-text {
        display: inline-block;
        font-family: "Share Tech Mono", monospace;
        color: #fca5a5;
        font-size: 0.9rem;
        animation: ticker 25s linear infinite;
    }

    @keyframes ticker {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }

    /* Hero Card */
    .glass-panel {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(14, 243, 255, 0.2);
        backdrop-filter: blur(12px);
        padding: 3rem;
        position: relative;
        width: 100%;
    }

    .deco-corner {
        position: absolute;
        width: 15px;
        height: 15px;
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

    .medal-wrapper {
        position: relative;
        display: inline-block;
        margin-bottom: 2rem;
    }

    .medal {
        font-size: 5rem;
        position: relative;
        z-index: 2;
        animation: float 4s ease-in-out infinite;
    }

    .medal-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120px;
        height: 120px;
        background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.3) 0%,
            transparent 70%
        );
        z-index: 1;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0) rotate(0);
        }
        50% {
            transform: translateY(-15px) rotate(5deg);
        }
    }

    .hero-title {
        font-family: "Orbitron", sans-serif;
        font-size: 1.8rem;
        color: #fff;
        margin-bottom: 2rem;
        letter-spacing: 2px;
    }

    .story-content {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .terminal-text {
        font-family: "Share Tech Mono", monospace;
        color: #0ef3ff;
        font-size: 1.1rem;
    }

    .prefix {
        opacity: 0.5;
    }

    .body-text {
        font-size: 1.15rem;
        line-height: 1.6;
        color: #cbd5e1;
        margin: 0;
    }

    .highlight-box {
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid #38bdf8;
        padding: 1.5rem;
        color: #38bdf8;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.25rem;
        text-align: center;
        letter-spacing: 1px;
    }

    /* Action Button */
    .cyber-btn {
        position: relative;
        background: #0ef3ff;
        color: #020617;
        border: none;
        padding: 1.25rem 4rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: pointer;
        clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
        transition: all 0.3s;
        box-shadow: 0 0 20px rgba(14, 243, 255, 0.4);
    }

    .cyber-btn:hover {
        transform: scale(1.05) translateY(-3px);
        box-shadow: 0 0 40px rgba(14, 243, 255, 0.6);
        filter: brightness(1.1);
    }

    .glitch-line {
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
    .cyber-btn:hover .glitch-line {
        left: 100%;
    }

    @media (max-width: 600px) {
        .main-title {
            font-size: 3rem;
        }
        .hero-card {
            padding: 1.5rem;
        }
        .highlight-box {
            font-size: 1rem;
        }
    }
</style>
